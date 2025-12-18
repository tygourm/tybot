from datetime import UTC, datetime

from ag_ui_langgraph import LangGraphAgent
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware, ToolRetryMiddleware
from langchain.tools import tool
from langchain_core.language_models import BaseChatModel
from langchain_tavily import TavilySearch
from langgraph.checkpoint.memory import InMemorySaver

from server.core.settings import settings

search = TavilySearch(tavily_api_key=settings.tavily_api_key)


@tool(parse_docstring=True)
def add(a: float, b: float) -> float:
    """Add two numbers.

    Args:
        a (float): The first number.
        b (float): The second number.

    Returns:
        float: The sum of the two numbers.
    """
    return a + b


@tool(parse_docstring=True)
def sub(a: float, b: float) -> float:
    """Subtract two numbers.

    Args:
        a (float): The first number.
        b (float): The second number.

    Returns:
        float: The difference between the two numbers.
    """
    return a - b


def build_agent(
    model: BaseChatModel,
    *,
    debug: bool,
) -> LangGraphAgent:
    system_prompt = f"""
    You are a helpful assistant named tybot.
    Today's date is {datetime.now(UTC).date()}.
    """
    graph = create_agent(
        model,
        [add, sub, search],
        system_prompt=system_prompt,
        middleware=[ToolRetryMiddleware(), SummarizationMiddleware(model)],
        checkpointer=InMemorySaver(),
        debug=debug,
    )
    return LangGraphAgent(name="Agent", graph=graph)
