from server.app.agent import AgentService
from server.core.settings import Settings
from server.infra.llm.model import create_model

settings = Settings()


def create_agent_service() -> AgentService:
    model = create_model(settings.ollama_base_url)
    return AgentService(settings.title, model, debug=settings.dev)
