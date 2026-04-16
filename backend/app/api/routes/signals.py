from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.schemas.signal import SignalRead
from app.services.signal_service import list_signals

router = APIRouter()


@router.get("/signals", response_model=list[SignalRead])
def get_signals(
    league: Optional[str] = None,
    team: Optional[str] = None,
    player: Optional[str] = None,
    signal_type: Optional[str] = Query(default=None, alias="signal_type"),
    limit: int = 50,
    db: Session = Depends(get_db),
) -> list[SignalRead]:
    return list_signals(
        db=db,
        league=league,
        team=team,
        player=player,
        signal_type=signal_type,
        limit=limit,
    )

