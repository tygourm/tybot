from server.app.agents.chat import build_agent as build_chat_agent
from server.app.agents.react import build_agent as build_react_agent
from server.app.services.run_agent import RunAgent


class Injector:
    def run_chat_agent(self, run_id: str) -> RunAgent:
        return RunAgent(build_chat_agent(run_id))

    def run_react_agent(self, run_id: str) -> RunAgent:
        return RunAgent(build_react_agent(run_id))


injector = Injector()
