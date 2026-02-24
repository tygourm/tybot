from sqlalchemy import create_engine

from server.app.agents.agent import AgentService
from server.app.collections import CollectionsService
from server.core.settings import settings
from server.infra.db.repositories.collections import CollectionsRepository
from server.infra.llm.model import create_model

engine = create_engine(settings.database_url, echo=settings.dev)


def create_agent_service() -> AgentService:
    model = create_model(settings.ollama_base_url)
    return AgentService(settings.title, model, debug=settings.dev)


def create_collections_service() -> CollectionsService:
    collections_repository = CollectionsRepository(engine)
    return CollectionsService(collections_repository)
