from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from server.core import engine
from server.core.logger import get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("%s Server startup...", app.title)

    yield

    logger.info("%s Server shutdown...", app.title)
    engine.dispose()
