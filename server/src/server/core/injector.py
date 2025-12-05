from sqlmodel import create_engine

from server.app.agent import build_agent
from server.app.services.agents import AgentsService
from server.app.services.runs import RunsService
from server.app.services.threads import ThreadsService
from server.core.settings import settings
from server.infra.db.repositories.runs import RunsRepository
from server.infra.db.repositories.threads import ThreadsRepository
from server.infra.llm.client import create_client


class Injector:
    def __init__(self) -> None:
        self.engine = create_engine(settings.database_url, echo=settings.dev)
        self.threads_repository = ThreadsRepository(self.engine)
        self.runs_repository = RunsRepository(self.engine)

    def threads_service(self) -> ThreadsService:
        return ThreadsService(self.threads_repository)

    def runs_service(self) -> RunsService:
        return RunsService(self.runs_repository, self.threads_repository)

    def agents_service(self) -> AgentsService:
        model = create_client()
        return AgentsService(build_agent(model, debug=settings.dev))


injector = Injector()
