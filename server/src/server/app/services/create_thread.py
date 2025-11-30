from server.core.logger import get_logger
from server.infra.db.repositories.threads import ThreadsRepository


class CreateThread:
    def __init__(self, repository: ThreadsRepository) -> None:
        self.repository = repository
        self.logger = get_logger(__name__)

    def __call__(self, thread_id: str) -> None:
        if self.repository.exists(thread_id):
            self.logger.info("Thread %s already exists", thread_id)
            return
        self.logger.info("Creating thread %s", thread_id)
        self.repository.create(thread_id)
