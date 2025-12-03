from fastapi import APIRouter

from server.core.entities import RunEntity
from server.core.injector import injector

router = APIRouter()


@router.get("/")
def get_runs(thread_id: str) -> list[str]:
    read_runs = injector.read_runs()
    return [run.id for run in read_runs(thread_id)]


@router.get("/{run_id}")
def get_run(run_id: str) -> RunEntity | None:
    read_run = injector.read_run()
    return read_run(run_id)
