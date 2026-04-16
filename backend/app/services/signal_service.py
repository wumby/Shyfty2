from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.domain.signals import baseline_window_label, importance_score, metric_label, movement_pct, trend_direction
from app.models.game import Game
from app.models.league import League
from app.models.player import Player
from app.models.signal import Signal
from app.models.team import Team
from app.schemas.signal import SignalRead, SignalSummaryTemplateInputs


def build_signal_read(signal: Signal, player_name: str, team_name: str, league_name: str, event_date) -> SignalRead:
    baseline_window = baseline_window_label()
    movement = movement_pct(signal.current_value, signal.baseline_value)
    direction = trend_direction(signal.current_value, signal.baseline_value)
    readable_metric_label = metric_label(signal.metric_name)
    return SignalRead(
        id=signal.id,
        player_id=signal.player_id,
        player_name=player_name,
        team_name=team_name,
        league_name=league_name,
        signal_type=signal.signal_type,
        metric_name=signal.metric_name,
        current_value=signal.current_value,
        baseline_value=signal.baseline_value,
        z_score=signal.z_score,
        explanation=signal.explanation,
        importance=importance_score(signal.signal_type, signal.z_score),
        baseline_window=baseline_window,
        event_date=event_date,
        movement_pct=movement,
        metric_label=readable_metric_label,
        trend_direction=direction,
        summary_template="metric_vs_recent_baseline",
        summary_template_inputs=SignalSummaryTemplateInputs(
            current_value=signal.current_value,
            baseline_value=signal.baseline_value,
            movement_pct=movement,
            baseline_window=baseline_window,
            trend_direction=direction,
        ),
        created_at=signal.created_at,
    )


def list_signals(
    db: Session,
    league: Optional[str],
    team: Optional[str],
    player: Optional[str],
    signal_type: Optional[str],
    limit: int,
) -> list[SignalRead]:
    query = (
        select(Signal, Player.name, Team.name, League.name, Game.game_date)
        .join(Player, Signal.player_id == Player.id)
        .join(Team, Signal.team_id == Team.id)
        .join(League, Signal.league_id == League.id)
        .join(Game, Signal.game_id == Game.id)
        .order_by(Signal.created_at.desc())
        .limit(limit)
    )

    if league:
        query = query.where(League.name.ilike(league))
    if team:
        query = query.where(Team.name.ilike(f"%{team}%"))
    if player:
        query = query.where(Player.name.ilike(f"%{player}%"))
    if signal_type:
        query = query.where(Signal.signal_type.ilike(signal_type))

    rows = db.execute(query).all()
    return [
        build_signal_read(signal, player_name, team_name, league_name, event_date)
        for signal, player_name, team_name, league_name, event_date in rows
    ]
