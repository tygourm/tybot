from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from server.core import settings
from server.core.logger import get_logger, init_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    init_logger(settings)
    logger.info("%s Server startup...", app.title)
    yield
    logger.info("%s Server shutdown...", app.title)
