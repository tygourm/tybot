from uuid import UUID

from sqlalchemy import Engine
from sqlmodel import Session, select

from server.core.entities import ThreadEntity
from server.infra.db.models import ThreadModel


class ThreadsRepository:
    def __init__(self, engine: Engine) -> None:
        self.engine = engine

    def exists(self, thread_id: str) -> bool:
        statement = select(ThreadModel).where(ThreadModel.id == UUID(thread_id))
        with Session(self.engine) as session:
            return session.exec(statement).first() is not None

    def create(self, tread_id: str) -> ThreadEntity:
        model = ThreadModel(id=UUID(tread_id))
        with Session(self.engine) as session:
            session.add(model)
            session.commit()
            session.refresh(model)
        return model.to_entity()
