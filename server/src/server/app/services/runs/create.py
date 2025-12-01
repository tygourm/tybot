from server.core.logger import get_logger
from server.infra.db.repositories.runs import RunsRepository
from server.infra.db.repositories.threads import ThreadsRepository


class CreateRun:
    def __init__(
        self,
        runs_repository: RunsRepository,
        threads_repository: ThreadsRepository,
    ) -> None:
        self.logger = get_logger(__name__)
        self.runs_repository = runs_repository
        self.threads_repository = threads_repository

    def __call__(self, thread_id: str, run_id: str) -> None:
        if not self.threads_repository.exists(thread_id):
            self.logger.info("Thread %s does not exist", thread_id)
            return
        self.logger.info("Creating run %s", run_id)
        self.runs_repository.create(run_id, thread_id)
