from collections.abc import AsyncGenerator
from datetime import UTC, datetime

from ag_ui.core import RunAgentInput
from ag_ui_langgraph import LangGraphAgent
from langchain.agents import create_agent
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.tools import tool
from langgraph.checkpoint.memory import InMemorySaver


@tool(parse_docstring=True)
def add(a: int, b: int) -> int:
    """Add two numbers.

    Args:
        a: The first number.
        b: The second number.

    Returns:
        The sum of the two numbers.

    """
    return a + b


@tool(parse_docstring=True)
def sub(a: int, b: int) -> int:
    """Subtract two numbers.

    Args:
        a: The first number.
        b: The second number.

    Returns:
        The difference of the two numbers.

    """
    return a - b


class AgentService:
    def __init__(self, name: str, model: BaseChatModel, *, debug: bool) -> None:
        system_prompt = f"""
        You are tybot, a helpful assistant.
        Current time is {datetime.now(tz=UTC)}.
        """
        graph = create_agent(
            model,
            [add, sub],
            system_prompt=system_prompt,
            checkpointer=InMemorySaver(),
            debug=debug,
        )
        self.agent = LangGraphAgent(name=name, graph=graph)

    async def run(self, input_data: RunAgentInput) -> AsyncGenerator[str]:
        async for e in self.agent.run(input_data):
            yield e
