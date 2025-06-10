from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DEV: bool = False
    TITLE: str = "tybot"
    VERSION: str = "0.0.0"
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # Ollama
    OLLAMA_LLMS: str = "gemma3:4b"
    OLLAMA_EMBEDDINGS: str = "nomic-embed-text:v1.5"
    OLLAMA_API_KEY: str = "empty"
    OLLAMA_BASE_URL: str = "http://localhost:11434/v1"

    model_config = SettingsConfigDict()


settings = Settings()
