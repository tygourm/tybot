from langchain_core.language_models.chat_models import BaseChatModel
from langchain_ollama import ChatOllama


def create_model(base_url: str) -> BaseChatModel:
    return ChatOllama(
        base_url=base_url,
        model="qwen3:8b",
        temperature=0.6,
        num_ctx=8192,
        top_p=0.95,
        top_k=20,
    )
