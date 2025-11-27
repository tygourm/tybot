from langchain_core.messages import SystemMessage
from langchain_ollama import ChatOllama

from server.app.agents.chat.state import ChatState
from server.app.agents.chat.tools import chat_toolkit
from server.core.settings import settings


def llm_node(state: ChatState) -> ChatState:
    system = "You are a helpful assistant named tybot."
    llm = ChatOllama(
        base_url=settings.ollama_base_url,
        model="qwen3:8b",
        temperature=0.6,
        top_p=0.95,
        top_k=20,
    ).bind_tools(chat_toolkit)
    messages = [SystemMessage(content=system), *state["messages"]]
    return {"messages": [llm.invoke(messages)]}
