import unittest

from app.domain.signals import build_metric_snapshots, classify_signal
from app.models.player_game_stat import PlayerGameStat


class SignalDomainTests(unittest.TestCase):
    def test_build_metric_snapshots_backfills_history(self) -> None:
        stats = [
            PlayerGameStat(game_id=1, points=29),
            PlayerGameStat(game_id=2, points=31),
            PlayerGameStat(game_id=3, points=28),
            PlayerGameStat(game_id=4, points=33),
            PlayerGameStat(game_id=5, points=44),
        ]

        snapshots = build_metric_snapshots("points", stats)

        self.assertEqual(len(snapshots), 3)
        self.assertEqual([snapshot.game_id for snapshot in snapshots], [3, 4, 5])
        self.assertEqual(round(snapshots[0].baseline_value, 2), 30.0)
        self.assertEqual(round(snapshots[0].z_score, 2), -2.0)
        self.assertEqual(round(snapshots[-1].baseline_value, 2), 30.25)
        self.assertEqual(round(snapshots[-1].z_score, 2), 7.16)

    def test_classify_signal_preserves_current_rules(self) -> None:
        self.assertEqual(classify_signal(2.6, 0.5, "points"), "OUTLIER")
        self.assertEqual(classify_signal(1.7, 1.2, "points"), "SPIKE")
        self.assertEqual(classify_signal(-1.7, 1.2, "points"), "DROP")
        self.assertEqual(classify_signal(1.1, 1.2, "usage_rate"), "SHIFT")
        self.assertEqual(classify_signal(0.2, 0.5, "rebounds"), "CONSISTENCY")


if __name__ == "__main__":
    unittest.main()
