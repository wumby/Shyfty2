from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.schemas.team import TeamRead
from app.services.team_service import list_teams

router = APIRouter()


@router.get("/teams", response_model=list[TeamRead])
def get_teams(db: Session = Depends(get_db)) -> list[TeamRead]:
    return list_teams(db)

