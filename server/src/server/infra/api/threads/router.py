from fastapi import APIRouter

from server.core.entities import Thread
from server.core.injector import injector

router = APIRouter()


@router.get("/")
def get_threads() -> list[str]:
    threads_service = injector.threads_service()
    return [thread.id for thread in threads_service.read_all()]


@router.get("/{thread_id}")
def get_thread(thread_id: str) -> Thread | None:
    threads_service = injector.threads_service()
    return threads_service.read(thread_id)
