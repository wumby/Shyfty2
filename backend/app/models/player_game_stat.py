from typing import Optional

from sqlalchemy import Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class PlayerGameStat(Base):
    __tablename__ = "player_game_stats"

    id: Mapped[int] = mapped_column(primary_key=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("players.id"), nullable=False)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"), nullable=False)
    points: Mapped[Optional[int]] = mapped_column(Integer)
    rebounds: Mapped[Optional[int]] = mapped_column(Integer)
    assists: Mapped[Optional[int]] = mapped_column(Integer)
    passing_yards: Mapped[Optional[int]] = mapped_column(Integer)
    rushing_yards: Mapped[Optional[int]] = mapped_column(Integer)
    receiving_yards: Mapped[Optional[int]] = mapped_column(Integer)
    touchdowns: Mapped[Optional[int]] = mapped_column(Integer)
    usage_rate: Mapped[Optional[float]] = mapped_column(Float)

    player = relationship("Player", back_populates="stats")
    game = relationship("Game", back_populates="stats")
