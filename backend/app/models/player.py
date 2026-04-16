from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Player(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    league_id: Mapped[int] = mapped_column(ForeignKey("leagues.id"), nullable=False)
    team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=False)
    position: Mapped[str] = mapped_column(String(32), nullable=False)

    league = relationship("League", back_populates="players")
    team = relationship("Team", back_populates="players")
    stats = relationship("PlayerGameStat", back_populates="player")
    rolling_metrics = relationship("RollingMetric", back_populates="player")
    signals = relationship("Signal", back_populates="player")

