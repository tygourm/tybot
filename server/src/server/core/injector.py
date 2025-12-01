from sqlmodel import create_engine

from server.app.agents.chat.agent import build_chat_agent
from server.app.services.agents.run import RunAgent
from server.app.services.runs.create import CreateRun
from server.app.services.threads.create import CreateThread
from server.core.settings import settings
from server.infra.db.repositories.runs import RunsRepository
from server.infra.db.repositories.threads import ThreadsRepository


class Injector:
    def __init__(self) -> None:
        self.engine = create_engine(settings.database_url, echo=settings.dev)
        self.threads_repository = ThreadsRepository(self.engine)
        self.runs_repository = RunsRepository(self.engine)

    def create_thread(self) -> CreateThread:
        return CreateThread(self.threads_repository)

    def create_run(self) -> CreateRun:
        return CreateRun(self.runs_repository, self.threads_repository)

    def run_chat_agent(self, run_id: str) -> RunAgent:
        return RunAgent(build_chat_agent(run_id, debug=settings.dev))


injector = Injector()
