from fastapi import APIRouter

from server.infra.api.agents.router import router as agents
from server.infra.api.runs.router import router as runs
from server.infra.api.threads.router import router as threads

router = APIRouter()
router.include_router(agents, prefix="/agents", tags=["agents"])
router.include_router(threads, prefix="/threads", tags=["threads"])
router.include_router(runs, prefix="/runs", tags=["runs"])
