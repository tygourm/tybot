from langchain_core.language_models import BaseChatModel
from langchain_ollama import ChatOllama

from server.core.settings import settings


def create_client() -> BaseChatModel:
    return ChatOllama(
        base_url=settings.ollama_base_url,
        model="qwen3-vl:8b",
        temperature=0.6,
        num_ctx=8192,
        top_p=0.95,
        top_k=20,
    )
