from uuid import UUID

from sqlalchemy import Engine
from sqlmodel import Session

from server.core.entities import RunEntity
from server.infra.db.models import RunModel


class RunsRepository:
    def __init__(self, engine: Engine) -> None:
        self.engine = engine

    def create(self, run_id: str, tread_id: str) -> RunEntity:
        model = RunModel(id=UUID(run_id), thread_id=UUID(tread_id))
        with Session(self.engine) as session:
            session.add(model)
            session.commit()
            session.refresh(model)
            return model.to_entity()
