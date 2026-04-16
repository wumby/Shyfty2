from pydantic import BaseModel


class TeamRead(BaseModel):
    id: int
    name: str
    league_name: str
    player_count: int

