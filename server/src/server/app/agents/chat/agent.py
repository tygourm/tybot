from ag_ui_langgraph import LangGraphAgent
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph.state import CompiledStateGraph, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition

from server.app.agents.chat.nodes import llm_node
from server.app.agents.chat.state import ChatState
from server.app.agents.chat.tools import chat_toolkit


def build_chat_graph(*, debug: bool) -> CompiledStateGraph:
    graph = StateGraph(ChatState)  # ty: ignore[invalid-argument-type]

    graph.add_node("llm", llm_node)
    graph.add_node("tools", ToolNode(chat_toolkit))

    graph.set_entry_point("llm")
    graph.add_edge("tools", "llm")
    graph.add_conditional_edges("llm", tools_condition)

    return graph.compile(InMemorySaver(), debug=debug)


def build_chat_agent(thread_id: str, *, debug: bool) -> LangGraphAgent:
    return LangGraphAgent(
        name="Chat",
        graph=build_chat_graph(debug=debug),
        config={"configurable": {"thread_id": thread_id}},
    )
