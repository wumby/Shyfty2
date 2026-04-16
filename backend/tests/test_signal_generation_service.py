import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest import mock

from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.models.player import Player
from app.models.rolling_metric import RollingMetric
from app.models.signal import Signal
from app.services.seed_service import seed_database
from app.services.signal_generation_service import SignalGenerationError, generate_signals


class SignalGenerationServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = TemporaryDirectory()
        database_path = Path(self.temp_dir.name) / "test.db"
        self.engine = create_engine(
            f"sqlite:///{database_path}",
            future=True,
            connect_args={"check_same_thread": False},
        )
        self.session_factory = sessionmaker(bind=self.engine, autoflush=False, autocommit=False, future=True)
        Base.metadata.create_all(bind=self.engine)
        self.session = self.session_factory()

    def tearDown(self) -> None:
        self.session.close()
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()
        self.temp_dir.cleanup()

    def test_generate_signals_backfills_historical_contexts_and_is_idempotent(self) -> None:
        seed_database(self.session)

        first_result = generate_signals(self.session)
        first_signal_count = self.session.execute(select(func.count()).select_from(Signal)).scalar_one()
        first_rolling_count = self.session.execute(select(func.count()).select_from(RollingMetric)).scalar_one()

        luka = self.session.execute(select(Player).where(Player.name == "Luka Doncic")).scalar_one()
        luka_point_signal_games = self.session.execute(
            select(Signal.game_id)
            .where(Signal.player_id == luka.id, Signal.metric_name == "points")
            .order_by(Signal.game_id)
        ).scalars().all()
        luka_point_rolling_games = self.session.execute(
            select(RollingMetric.game_id)
            .where(RollingMetric.player_id == luka.id, RollingMetric.metric_name == "points")
            .order_by(RollingMetric.game_id)
        ).scalars().all()

        second_result = generate_signals(self.session)
        second_signal_count = self.session.execute(select(func.count()).select_from(Signal)).scalar_one()
        second_rolling_count = self.session.execute(select(func.count()).select_from(RollingMetric)).scalar_one()
        distinct_signal_keys = self.session.execute(
            select(func.count()).select_from(
                select(Signal.player_id, Signal.game_id, Signal.metric_name, Signal.signal_type).distinct().subquery()
            )
        ).scalar_one()
        distinct_rolling_keys = self.session.execute(
            select(func.count()).select_from(
                select(RollingMetric.player_id, RollingMetric.game_id, RollingMetric.metric_name).distinct().subquery()
            )
        ).scalar_one()

        self.assertGreater(first_result.created_signals, 0)
        self.assertGreater(first_result.created_rolling_metrics, 0)
        self.assertEqual(luka_point_signal_games, [3, 4, 5])
        self.assertEqual(luka_point_rolling_games, [3, 4, 5])
        self.assertEqual(first_signal_count, second_signal_count)
        self.assertEqual(first_signal_count, distinct_signal_keys)
        self.assertEqual(first_rolling_count, second_rolling_count)
        self.assertEqual(first_rolling_count, distinct_rolling_keys)
        self.assertEqual(second_result.created_signals, 0)
        self.assertEqual(second_result.created_rolling_metrics, 0)
        self.assertGreater(second_result.updated_signals, 0)
        self.assertGreater(second_result.updated_rolling_metrics, 0)

    def test_generate_signals_rolls_back_on_failure(self) -> None:
        seed_database(self.session)

        with mock.patch("app.services.signal_generation_service._upsert_rolling_metric", side_effect=RuntimeError("forced failure")):
            with self.assertRaises(SignalGenerationError):
                generate_signals(self.session)

        signal_count = self.session.execute(select(func.count()).select_from(Signal)).scalar_one()
        rolling_count = self.session.execute(select(func.count()).select_from(RollingMetric)).scalar_one()

        self.assertEqual(signal_count, 0)
        self.assertEqual(rolling_count, 0)


if __name__ == "__main__":
    unittest.main()
