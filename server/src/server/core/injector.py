from sqlmodel import create_engine

from server.app.agents.chat.agent import build_chat_agent
from server.app.services.create_thread import CreateThread
from server.app.services.run_agent import RunAgent
from server.core.settings import settings
from server.infra.db.repositories.threads import ThreadsRepository


class Injector:
    def __init__(self) -> None:
        self.engine = create_engine(settings.database_url, echo=settings.dev)
        self.threads_repository = ThreadsRepository(self.engine)

    def create_thread(self) -> CreateThread:
        return CreateThread(self.threads_repository)

    def run_chat_agent(self) -> RunAgent:
        return RunAgent(build_chat_agent(debug=settings.dev))


injector = Injector()
