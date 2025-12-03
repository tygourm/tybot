from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    dev: bool = False

    title: str = "tybot"
    version: str = "0.0.0"

    host: str = "127.0.0.1"
    port: int = 8000
    workers: int = 1

    logs_dir: str = "logs"
    logs_filename: str = "server.log"
    logs_format: str = "%(asctime)s [%(name)s] %(levelname)s %(message)s"
    logs_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"
    logs_backup_count: int = 10
    logs_max_bytes: int = 10 * 1024 * 1024

    tavily_api_key: str | None = None
    ollama_base_url: str = "http://localhost:11434"
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_name: str = "tybot"
    postgres_user: str = "postgres"
    postgres_pass: str | None = None

    @property
    def database_url(self) -> str:
        return f"postgresql://{self.postgres_user}:{self.postgres_pass}@{self.postgres_host}:{self.postgres_port}/{self.postgres_name}"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
