from typing import TYPE_CHECKING
from uuid import UUID

from ag_ui_langgraph import LangGraphAgent
from langchain.agents import create_agent
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph.state import CompiledStateGraph

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
        debug=settings.dev,
        checkpointer=InMemorySaver(),
    )
    return LangGraphAgent(name="Chat", graph=graph, config={"run_id": UUID(run_id)})
