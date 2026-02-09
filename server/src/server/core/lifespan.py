from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from server.core.injector import engine, settings
from server.core.logger import get_logger, init_logger

init_logger(settings)
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None]:  # noqa: ARG001
    logger.info("Warming up...")

    yield

    logger.info("Cooling down...")
    engine.dispose()
