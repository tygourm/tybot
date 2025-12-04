from server.core.entities import ThreadEntity
from server.core.logger import get_logger
from server.infra.db.repositories.threads import ThreadsRepository


class ThreadsService:
    def __init__(self, threads_repository: ThreadsRepository) -> None:
        self.logger = get_logger(__name__)
        self.threads_repository = threads_repository

    def create(self, thread_id: str) -> None:
        if self.threads_repository.read(thread_id):
            self.logger.warning("Thread %s already exists", thread_id)
            return
        self.logger.info("Creating thread %s", thread_id)
        self.threads_repository.create(thread_id)

    def read(self, thread_id: str) -> ThreadEntity | None:
        self.logger.info("Reading thread %s", thread_id)
        return self.threads_repository.read(thread_id)

    def read_all(self) -> list[ThreadEntity]:
        self.logger.info("Reading threads")
        return self.threads_repository.read_all()
