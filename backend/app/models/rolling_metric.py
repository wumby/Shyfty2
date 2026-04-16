from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class RollingMetric(Base):
    __tablename__ = "rolling_metrics"
    __table_args__ = (UniqueConstraint("player_id", "game_id", "metric_name", name="uq_player_game_metric"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("players.id"), nullable=False)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"), nullable=False)
    metric_name: Mapped[str] = mapped_column(String(64), nullable=False)
    rolling_avg: Mapped[float] = mapped_column(Float, nullable=False)
    rolling_stddev: Mapped[float] = mapped_column(Float, nullable=False)
    z_score: Mapped[float] = mapped_column(Float, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    player = relationship("Player", back_populates="rolling_metrics")
    game = relationship("Game", back_populates="rolling_metrics")
