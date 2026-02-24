from fastapi import APIRouter

from server.infra.api.agents.router import router as agents
from server.infra.api.collections.router import router as collections

router = APIRouter()
router.include_router(agents, prefix="/agents", tags=["agents"])
router.include_router(collections, prefix="/rag/collections", tags=["collections"])
