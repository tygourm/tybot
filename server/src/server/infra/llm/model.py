from langchain_core.language_models.chat_models import BaseChatModel
from langchain_ollama import ChatOllama


def create_model(base_url: str) -> BaseChatModel:
    return ChatOllama(
        model="qwen3-vl:8b",
        base_url=base_url,
        temperature=0.6,
        num_ctx=8192,
        top_p=0.95,
        top_k=20,
    )
