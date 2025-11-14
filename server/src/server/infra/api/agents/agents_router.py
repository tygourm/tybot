from collections.abc import AsyncGenerator

from ag_ui.core import RunAgentInput
from ag_ui.encoder import EventEncoder
from ag_ui_langgraph import LangGraphAgent
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph.message import MessagesState
from langgraph.graph.state import CompiledStateGraph, StateGraph

from server.core.settings import settings

router = APIRouter()


def chat_node(state: MessagesState) -> MessagesState:
    # gemma3n:e2b    5.6 GB
    # deepseek-r1:8b 5.2 GB
    # qwen3:8b       5.2 GB
    # mistral:7b     4.4 GB
    llm = ChatOllama(model="gemma3n:e2b", base_url=settings.ollama_base_url)
    return {"messages": [llm.invoke(state["messages"])]}


def build_graph() -> CompiledStateGraph:
    builder = StateGraph(MessagesState)
    builder.add_node("chat", chat_node)
    builder.set_entry_point("chat")
    return builder.compile(InMemorySaver(), debug=settings.dev)


@router.post("/run")
async def run_agent(body: RunAgentInput) -> StreamingResponse:
    encoder = EventEncoder()
    agent = LangGraphAgent(name="Chat", graph=build_graph())

    async def run() -> AsyncGenerator[str, None]:
        async for event in agent.run(body):
            yield encoder.encode(event)

    return StreamingResponse(run(), media_type=encoder.get_content_type())
