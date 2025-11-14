from fastapi import APIRouter

from server.infra.api.agents.agents_router import router as agents

router = APIRouter()
router.include_router(agents, prefix="/agents", tags=["agents"])
