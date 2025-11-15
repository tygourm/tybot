from ag_ui_langgraph import LangGraphAgent
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph.message import MessagesState
from langgraph.graph.state import CompiledStateGraph, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition

from server.core.settings import settings


@tool
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b


@tool
def sub(a: int, b: int) -> int:
    """Subtract two numbers."""
    return a - b


def llm_node(state: MessagesState) -> MessagesState:
    llm = ChatOllama(
        reasoning=False,
        model="qwen3:8b",
        base_url=settings.ollama_base_url,
    ).bind_tools([add, sub])
    return {"messages": [llm.invoke(state["messages"])]}


def build_graph() -> CompiledStateGraph:
    builder = StateGraph(MessagesState)
    builder.add_node("llm", llm_node)
    builder.add_node("tools", ToolNode([add, sub]))
    builder.set_entry_point("llm")
    builder.add_edge("tools", "llm")
    builder.add_conditional_edges("llm", tools_condition)
    return builder.compile(InMemorySaver(), debug=settings.dev)


def build_agent(run_id: str) -> LangGraphAgent:
    return LangGraphAgent(name="Chat", graph=build_graph(), config={"run_id": run_id})
