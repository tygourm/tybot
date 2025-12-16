from uuid import UUID

from sqlalchemy import Engine
from sqlmodel import Session, select

from server.core.entities import Thread
from server.infra.db.models import ThreadModel


class ThreadsRepository:
    def __init__(self, engine: Engine) -> None:
        self.engine = engine

    def create(self, thread_id: str) -> Thread:
        model = ThreadModel(id=UUID(thread_id), runs=[])
        with Session(self.engine) as session:
            session.add(model)
            session.commit()
            session.refresh(model)
            return model.to_entity()

    def read(self, thread_id: str) -> Thread | None:
        statement = select(ThreadModel).where(ThreadModel.id == UUID(thread_id))
        with Session(self.engine) as session:
            model = session.exec(statement).first()
            return model.to_entity() if model else None

    def read_all(self) -> list[Thread]:
        statement = select(ThreadModel)
        with Session(self.engine) as session:
            models = session.exec(statement).all()
            return [model.to_entity() for model in models]
