from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import debug, health, players, signals, teams


def create_app() -> FastAPI:
    app = FastAPI(title="Shyfty API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router, prefix="/api", tags=["health"])
    app.include_router(signals.router, prefix="/api", tags=["signals"])
    app.include_router(players.router, prefix="/api", tags=["players"])
    app.include_router(teams.router, prefix="/api", tags=["teams"])
    app.include_router(debug.router, prefix="/api", tags=["debug"])

    return app


app = create_app()
