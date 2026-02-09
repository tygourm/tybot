from sqlalchemy import Engine
from sqlmodel import Session, select

from server.core.entities import Collection
from server.infra.db.models import CollectionModel


class CollectionsRepository:
    def __init__(self, engine: Engine) -> None:
        self.engine = engine

    def exists_by_name(self, name: str) -> bool:
        statement = select(CollectionModel).where(CollectionModel.name == name)
        with Session(self.engine) as session:
            return session.exec(statement).first() is not None

    def create_collection(self, name: str) -> Collection:
        model = CollectionModel(name=name)
        with Session(self.engine) as session:
            session.add(model)
            session.commit()
            session.refresh(model)
            return model.to_entity()

    def read_collections(self) -> list[Collection]:
        statement = select(CollectionModel)
        with Session(self.engine) as session:
            return [m.to_entity() for m in session.exec(statement)]

    def delete_collection(self, collection_id: str) -> None:
        statement = select(CollectionModel).where(CollectionModel.id == collection_id)
        with Session(self.engine) as session:
            model = session.exec(statement).one()
            session.delete(model)
            session.commit()
