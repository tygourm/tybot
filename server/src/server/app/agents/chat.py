from ag_ui_langgraph import LangGraphAgent
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph.message import MessagesState
from langgraph.graph.state import CompiledStateGraph, StateGraph

from server.core.settings import settings


def llm_node(state: MessagesState) -> MessagesState:
    llm = ChatOllama(
        reasoning=False,
        model="qwen3:8b",
        base_url=settings.ollama_base_url,
    )
    return {"messages": [llm.invoke(state["messages"])]}


def build_graph() -> CompiledStateGraph:
    builder = StateGraph(MessagesState)
    builder.add_node("llm", llm_node)
    builder.set_entry_point("llm")
    return builder.compile(InMemorySaver(), debug=settings.dev)


def build_agent(run_id: str) -> LangGraphAgent:
    return LangGraphAgent(name="Chat", graph=build_graph(), config={"run_id": run_id})
