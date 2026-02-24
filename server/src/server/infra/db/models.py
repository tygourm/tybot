from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel

from server.core.entities import Collection


class Model(SQLModel):
    id: UUID = Field(default_factory=uuid4, primary_key=True)


class CollectionModel(Model, table=True):
    __tablename__ = "collections"
    name: str = Field(unique=True, nullable=False, index=True)

    def to_entity(self) -> Collection:
        return Collection(id=str(self.id), name=self.name)
