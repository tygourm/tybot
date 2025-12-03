from server.core.entities import ThreadEntity
from server.core.logger import get_logger
from server.infra.db.repositories.threads import ThreadsRepository


class ReadThread:
    def __init__(self, threads_repository: ThreadsRepository) -> None:
        self.logger = get_logger(__name__)
        self.threads_repository = threads_repository

    def __call__(self, thread_id: str) -> ThreadEntity | None:
        self.logger.info("Reading thread %s", thread_id)
        return self.threads_repository.read(thread_id)


class ReadThreads:
    def __init__(self, threads_repository: ThreadsRepository) -> None:
        self.logger = get_logger(__name__)
        self.threads_repository = threads_repository

    def __call__(self) -> list[ThreadEntity]:
        self.logger.info("Reading threads")
        return self.threads_repository.read_all()
