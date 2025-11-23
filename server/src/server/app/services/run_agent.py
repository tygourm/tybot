from collections.abc import AsyncGenerator

from ag_ui.core import RunAgentInput
from ag_ui_langgraph import LangGraphAgent


class RunAgent:
    def __init__(self, agent: LangGraphAgent) -> None:
        self.agent = agent

    async def __call__(self, body: RunAgentInput) -> AsyncGenerator[str, None]:
        async for event in self.agent.run(body):
            yield event
