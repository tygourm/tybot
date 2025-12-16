from server.core.entities import Run
from server.core.logger import get_logger
from server.infra.db.repositories.runs import RunsRepository
from server.infra.db.repositories.threads import ThreadsRepository


class RunsService:
    def __init__(
        self,
        runs_repository: RunsRepository,
        threads_repository: ThreadsRepository,
    ) -> None:
        self.logger = get_logger(__name__)
        self.runs_repository = runs_repository
        self.threads_repository = threads_repository

    def create(self, thread_id: str, run_id: str) -> None:
        if not self.threads_repository.read(thread_id):
            self.logger.warning("Thread %s does not exist", thread_id)
            return
        if self.runs_repository.read(run_id):
            self.logger.warning("Run %s already exists", run_id)
            return
        self.logger.info("Creating run %s", run_id)
        self.runs_repository.create(run_id, thread_id)

    def read(self, run_id: str) -> Run | None:
        self.logger.info("Reading run %s", run_id)
        return self.runs_repository.read(run_id)

    def read_all(self, thread_id: str) -> list[Run]:
        self.logger.info("Reading runs for thread %s", thread_id)
        return self.runs_repository.read_all(thread_id)
