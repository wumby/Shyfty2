from dataclasses import dataclass
from datetime import date
import math
from statistics import mean, pstdev
from typing import Optional

from app.models.player_game_stat import PlayerGameStat

METRICS_BY_LEAGUE = {
    "NBA": ["points", "rebounds", "assists", "usage_rate"],
    "NFL": ["passing_yards", "rushing_yards", "receiving_yards", "touchdowns", "usage_rate"],
}

BASELINE_WINDOW_SIZE = 4


@dataclass(frozen=True)
class MetricSnapshot:
    game_id: int
    current_value: float
    baseline_value: float
    rolling_stddev: float
    z_score: float


def classify_signal(z_score: float, variance: float, metric_name: str) -> Optional[str]:
    if abs(z_score) >= 2.5:
        return "OUTLIER"
    if z_score >= 1.5:
        return "SPIKE"
    if z_score <= -1.5:
        return "DROP"
    if metric_name == "usage_rate" and abs(z_score) >= 1.0:
        return "SHIFT"
    if variance <= 0.75:
        return "CONSISTENCY"
    return None


def _metric_phrase(metric_name: str) -> str:
    phrases = {
        "points": "Scoring",
        "rebounds": "Rebounding",
        "assists": "Playmaking",
        "usage_rate": "Usage",
        "passing_yards": "Passing production",
        "rushing_yards": "Rushing production",
        "receiving_yards": "Receiving production",
        "touchdowns": "Touchdown output",
    }
    return phrases.get(metric_name, metric_name.replace("_", " ").title())


def metric_label(metric_name: str) -> str:
    labels = {
        "points": "Scoring",
        "rebounds": "Rebounding",
        "assists": "Playmaking",
        "usage_rate": "Usage",
        "passing_yards": "Passing Yards",
        "rushing_yards": "Rushing Yards",
        "receiving_yards": "Receiving Yards",
        "touchdowns": "Touchdowns",
    }
    return labels.get(metric_name, metric_name.replace("_", " ").title())


def baseline_window_label() -> str:
    return f"last {BASELINE_WINDOW_SIZE + 1} games"


def movement_pct(current: float, baseline: float) -> Optional[float]:
    if math.isclose(baseline, 0.0, abs_tol=0.05):
        return None
    return ((current - baseline) / baseline) * 100


def trend_direction(current: float, baseline: float) -> str:
    if math.isclose(current, baseline, abs_tol=0.05):
        return "flat"
    return "up" if current > baseline else "down"


def importance_score(signal_type: str, z_score: float) -> float:
    type_floor = {
        "OUTLIER": 85.0,
        "SPIKE": 72.0,
        "DROP": 72.0,
        "SHIFT": 60.0,
        "CONSISTENCY": 52.0,
    }.get(signal_type, 50.0)
    strength_bonus = min(abs(z_score) * 8.0, 15.0)
    return round(min(type_floor + strength_bonus, 100.0), 1)


def build_explanation(player_name: str, metric_name: str, current: float, baseline: float, z_score: float) -> str:
    metric_phrase = _metric_phrase(metric_name)
    baseline_window = BASELINE_WINDOW_SIZE + 1
    if math.isclose(baseline, 0.0, abs_tol=0.05):
        direction_text = "above" if current >= baseline else "below"
        return f"{metric_phrase} is {direction_text} his recent baseline over the last {baseline_window} games"

    percent_change = abs(((current - baseline) / baseline) * 100)
    rounded_change = max(1, int(round(percent_change)))
    direction_text = "above" if current >= baseline else "below"

    if abs(z_score) >= 2.5:
        qualifier = "well "
    elif abs(z_score) >= 1.5:
        qualifier = ""
    else:
        qualifier = "slightly "

    return (
        f"{metric_phrase} is {rounded_change}% {qualifier}{direction_text} "
        f"his recent baseline over the last {baseline_window} games"
    )


def build_metric_snapshot(metric_name: str, stats: list[PlayerGameStat]) -> Optional[MetricSnapshot]:
    snapshots = build_metric_snapshots(metric_name, stats)
    return snapshots[-1] if snapshots else None


def build_metric_snapshots(metric_name: str, stats: list[PlayerGameStat]) -> list[MetricSnapshot]:
    observations = [
        (stat.game_id, float(value))
        for stat in stats
        if (value := getattr(stat, metric_name)) is not None
    ]

    snapshots: list[MetricSnapshot] = []
    for index in range(2, len(observations)):
        current_game_id, current_value = observations[index]
        prior_values = [value for _, value in observations[:index]]
        baseline_values = prior_values[-BASELINE_WINDOW_SIZE:] or prior_values
        baseline_value = mean(baseline_values)
        rolling_stddev = pstdev(baseline_values) if len(baseline_values) > 1 else 0.0
        denominator = rolling_stddev if rolling_stddev > 0 else 1.0
        z_score = (current_value - baseline_value) / denominator

        snapshots.append(
            MetricSnapshot(
                game_id=current_game_id,
                current_value=current_value,
                baseline_value=baseline_value,
                rolling_stddev=rolling_stddev,
                z_score=z_score,
            )
        )

    return snapshots
