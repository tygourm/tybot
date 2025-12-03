from server.core.logger import get_logger
from server.infra.db.repositories.threads import ThreadsRepository


class CreateThread:
    def __init__(self, threads_repository: ThreadsRepository) -> None:
        self.logger = get_logger(__name__)
        self.threads_repository = threads_repository

    def __call__(self, thread_id: str) -> None:
        if self.threads_repository.exists(thread_id):
            self.logger.warning("Thread %s already exists", thread_id)
            return
        self.logger.info("Creating thread %s", thread_id)
        self.threads_repository.create(thread_id)
