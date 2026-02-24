from importlib.metadata import version
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    dev: bool = False

    title: str = "tybot"
    version: str = version("server")

    host: str = "127.0.0.1"
    port: int = 8000
    workers: int = 1

    logs_dir: str = "logs"
    logs_filename: str = "server.log"
    logs_format: str = "%(asctime)s [%(name)s] %(levelname)s %(message)s"
    logs_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"
    logs_backup_count: int = 10
    logs_max_bytes: int = 10 * 1024 * 1024

    database_name: str = "tybot"
    database_user: str = "postgres"
    database_pass: str = "postgres"  # noqa: S105
    database_host: str = "localhost"

    ollama_base_url: str = "http://localhost:11434"

    model_config = SettingsConfigDict()

    @property
    def database_url(self) -> str:
        return f"postgresql://{self.database_user}:{self.database_pass}@{self.database_host}/{self.database_name}"


settings = Settings()
