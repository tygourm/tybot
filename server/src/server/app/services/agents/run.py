from collections.abc import AsyncGenerator

from ag_ui.core import RunAgentInput
from ag_ui_langgraph import LangGraphAgent

from server.core.logger import get_logger


class RunAgent:
    def __init__(self, agent: LangGraphAgent) -> None:
        self.logger = get_logger(__name__)
        self.agent = agent

    async def __call__(self, body: RunAgentInput) -> AsyncGenerator[str, None]:
        self.logger.info("Running agent with input %s", body)
        async for event in self.agent.run(body):
            yield event
