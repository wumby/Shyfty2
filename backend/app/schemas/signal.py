from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class SignalSummaryTemplateInputs(BaseModel):
    current_value: float
    baseline_value: float
    movement_pct: Optional[float]
    baseline_window: str
    trend_direction: str


class SignalRead(BaseModel):
    id: int
    player_id: int
    player_name: str
    team_name: str
    league_name: str
    signal_type: str
    metric_name: str
    current_value: float
    baseline_value: float
    z_score: float
    explanation: str
    importance: float
    baseline_window: str
    event_date: date
    movement_pct: Optional[float]
    metric_label: str
    trend_direction: str
    summary_template: str
    summary_template_inputs: SignalSummaryTemplateInputs
    created_at: datetime
