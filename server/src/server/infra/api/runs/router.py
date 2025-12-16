from fastapi import APIRouter

from server.core.entities import Run
from server.core.injector import injector

router = APIRouter()


@router.get("/")
def get_runs(thread_id: str) -> list[str]:
    runs_service = injector.runs_service()
    return [run.id for run in runs_service.read_all(thread_id)]


@router.get("/{run_id}")
def get_run(run_id: str) -> Run | None:
    runs_service = injector.runs_service()
    return runs_service.read(run_id)
