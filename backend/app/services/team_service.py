from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.league import League
from app.models.player import Player
from app.models.team import Team
from app.schemas.team import TeamRead


def list_teams(db: Session) -> list[TeamRead]:
    rows = db.execute(
        select(Team.id, Team.name, League.name, func.count(Player.id))
        .join(League, Team.league_id == League.id)
        .outerjoin(Player, Player.team_id == Team.id)
        .group_by(Team.id, Team.name, League.name)
        .order_by(League.name, Team.name)
    ).all()
    return [
        TeamRead(id=team_id, name=name, league_name=league_name, player_count=player_count)
        for team_id, name, league_name, player_count in rows
    ]

