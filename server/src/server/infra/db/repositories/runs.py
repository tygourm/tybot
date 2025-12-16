from uuid import UUID

from sqlalchemy import Engine
from sqlmodel import Session, select

from server.core.entities import Run
from server.infra.db.models import RunModel


class RunsRepository:
    def __init__(self, engine: Engine) -> None:
        self.engine = engine

    def create(self, run_id: str, tread_id: str) -> Run:
        model = RunModel(id=UUID(run_id), thread_id=UUID(tread_id))
        with Session(self.engine) as session:
            session.add(model)
            session.commit()
            session.refresh(model)
            return model.to_entity()

    def read(self, run_id: str) -> Run | None:
        statement = select(RunModel).where(RunModel.id == UUID(run_id))
        with Session(self.engine) as session:
            model = session.exec(statement).first()
            return model.to_entity() if model else None

    def read_all(self, thread_id: str) -> list[Run]:
        statement = select(RunModel).where(RunModel.thread_id == UUID(thread_id))
        with Session(self.engine) as session:
            models = session.exec(statement).all()
            return [model.to_entity() for model in models]
