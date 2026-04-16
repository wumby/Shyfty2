import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.services.player_service import get_player_signals
from app.services.seed_service import seed_database
from app.services.signal_generation_service import generate_signals
from app.services.signal_service import list_signals


class SignalAPIContractTests(unittest.TestCase):
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
        seed_database(self.session)
        generate_signals(self.session)

    def tearDown(self) -> None:
        self.session.close()
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()
        self.temp_dir.cleanup()

    def test_signal_feed_includes_presentation_fields(self) -> None:
        signals = list_signals(
            db=self.session,
            league=None,
            team=None,
            player=None,
            signal_type=None,
            limit=5,
        )

        self.assertTrue(signals)
        signal = signals[0]
        self.assertIsInstance(signal.importance, float)
        self.assertEqual(signal.baseline_window, "last 5 games")
        self.assertTrue(signal.metric_label)
        self.assertIn(signal.trend_direction, {"up", "down", "flat"})
        self.assertEqual(signal.summary_template, "metric_vs_recent_baseline")
        self.assertEqual(signal.summary_template_inputs.baseline_window, signal.baseline_window)
        self.assertEqual(signal.summary_template_inputs.trend_direction, signal.trend_direction)
        self.assertEqual(signal.summary_template_inputs.current_value, signal.current_value)
        self.assertEqual(signal.summary_template_inputs.baseline_value, signal.baseline_value)
        self.assertIsNotNone(signal.event_date)

    def test_player_signals_return_same_enriched_shape(self) -> None:
        signals = get_player_signals(self.session, player_id=1)

        self.assertTrue(signals)
        signal = signals[0]
        self.assertGreaterEqual(signal.importance, 0.0)
        self.assertLessEqual(signal.importance, 100.0)
        self.assertIn(signal.trend_direction, {"up", "down", "flat"})
        self.assertEqual(signal.summary_template_inputs.movement_pct, signal.movement_pct)


if __name__ == "__main__":
    unittest.main()
