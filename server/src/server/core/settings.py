from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    debug: bool = False
    title: str = "tybot"
    version: str = "0.0.0"

    host: str = "127.0.0.1"
    port: int = 8000
    reload: bool = False
    workers: int = 1

    model_config = SettingsConfigDict()


settings = Settings()
