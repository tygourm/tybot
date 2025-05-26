from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DEV: bool = False
    TITLE: str = "tybot"
    VERSION: str = "0.0.0"

    # App
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    model_config = SettingsConfigDict()


settings = Settings()
