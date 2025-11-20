from typing import TYPE_CHECKING

from ag_ui_langgraph import LangGraphAgent
from langchain.agents import create_agent
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver

from server.app.agents.middlewares.tool_monitoring import ToolMonitoringMiddleware
from server.app.agents.tools.math import add, sub
from server.core.settings import settings

if TYPE_CHECKING:
    from langgraph.graph.state import CompiledStateGraph


def build_agent(run_id: str) -> LangGraphAgent:
    model = ChatOllama(
        model="qwen3:8b",
        base_url=settings.ollama_base_url,
    )
    graph: CompiledStateGraph = create_agent(
        model,
        [add, sub],
        middleware=[ToolMonitoringMiddleware()],
        debug=settings.dev,
        checkpointer=InMemorySaver(),
    )
    return LangGraphAgent(name="ReAct", graph=graph, config={"run_id": run_id})
