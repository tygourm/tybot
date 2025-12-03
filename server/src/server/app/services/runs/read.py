from server.core.entities import RunEntity
from server.core.logger import get_logger
from server.infra.db.repositories.runs import RunsRepository


class ReadRun:
    def __init__(self, runs_repository: RunsRepository) -> None:
        self.logger = get_logger(__name__)
        self.runs_repository = runs_repository

    def __call__(self, run_id: str) -> RunEntity | None:
        self.logger.info("Reading run %s", run_id)
        return self.runs_repository.read(run_id)


class ReadRuns:
    def __init__(self, runs_repository: RunsRepository) -> None:
        self.logger = get_logger(__name__)
        self.runs_repository = runs_repository

    def __call__(self, thread_id: str) -> list[RunEntity]:
        self.logger.info("Reading runs for thread %s", thread_id)
        return self.runs_repository.read_all(thread_id)
