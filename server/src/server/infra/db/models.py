from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel

from server.core.entities import ThreadEntity


class Model(SQLModel):
    id: UUID = Field(default_factory=uuid4, primary_key=True)


class ThreadModel(Model, table=True):
    __tablename__ = "threads"

    def to_entity(self) -> ThreadEntity:
        return ThreadEntity(id=str(self.id))
