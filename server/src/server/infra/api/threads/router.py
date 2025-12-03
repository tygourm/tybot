from fastapi import APIRouter

from server.core.entities import ThreadEntity
from server.core.injector import injector

router = APIRouter()


@router.get("/")
def get_threads() -> list[str]:
    read_threads = injector.read_threads()
    return [thread.id for thread in read_threads()]


@router.get("/{thread_id}")
def get_thread(thread_id: str) -> ThreadEntity | None:
    read_thread = injector.read_thread()
    return read_thread(thread_id)
