from sqlmodel import create_engine

from server.app.agents.chat.agent import build_chat_agent
from server.app.services.agents import AgentsService
from server.app.services.runs import RunsService
from server.app.services.threads import ThreadsService
from server.core.settings import settings
from server.infra.db.repositories.runs import RunsRepository
from server.infra.db.repositories.threads import ThreadsRepository


class Injector:
    def __init__(self) -> None:
        self.engine = create_engine(settings.database_url, echo=settings.dev)
        self.threads_repository = ThreadsRepository(self.engine)
        self.runs_repository = RunsRepository(self.engine)

    def threads_service(self) -> ThreadsService:
        return ThreadsService(self.threads_repository)

    def runs_service(self) -> RunsService:
        return RunsService(self.runs_repository, self.threads_repository)

    def agents_service(self, thread_id: str) -> AgentsService:
        return AgentsService(build_chat_agent(thread_id, debug=settings.dev))


injector = Injector()
