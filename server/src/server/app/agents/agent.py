from collections.abc import AsyncGenerator
from datetime import UTC, datetime

from ag_ui.core import RunAgentInput
from ag_ui_langgraph import LangGraphAgent
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware, ToolRetryMiddleware
from langchain_core.language_models.chat_models import BaseChatModel
from langgraph.checkpoint.memory import InMemorySaver

from server.app.agents.tools import geo_toolkit, math_toolkit
from server.core.logger import get_logger

logger = get_logger(__name__)


class AgentService:
    def __init__(
        self,
        name: str,
        model: BaseChatModel,
        *,
        debug: bool,
    ) -> None:
        system_prompt = f"""
        You are tybot, a helpful assistant.
        Current time is {datetime.now(tz=UTC)}.
        """
        graph = create_agent(
            model,
            [*geo_toolkit, *math_toolkit],
            system_prompt=system_prompt,
            middleware=[
                ToolRetryMiddleware(),
                SummarizationMiddleware(model),
            ],
            checkpointer=InMemorySaver(),
            debug=debug,
        )
        self.agent = LangGraphAgent(name=name, graph=graph)

    async def run(self, input_data: RunAgentInput) -> AsyncGenerator[str]:
        logger.info("Running agent %s", input_data)
        async for e in self.agent.run(input_data):
            yield e
