from server.app.agents.chat.agent import build_chat_agent
from server.app.services.run_agent import RunAgent
from server.core.settings import settings


class Injector:
    def run_chat_agent(self, run_id: str) -> RunAgent:
        return RunAgent(build_chat_agent(run_id, debug=settings.dev))


injector = Injector()
