from uuid import UUID, uuid4

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship, SQLModel

from server.core.entities import RunEntity, ThreadEntity


class Model(SQLModel):
    id: UUID = Field(default_factory=uuid4, primary_key=True)


class ThreadModel(Model, table=True):
    __tablename__ = "threads"
    runs: list["RunModel"] = Relationship(back_populates="thread", cascade_delete=True)

    def to_entity(self) -> ThreadEntity:
        return ThreadEntity(id=str(self.id), runs=[str(run.id) for run in self.runs])


class RunModel(Model, table=True):
    __tablename__ = "runs"
    thread_id: UUID = Field(foreign_key="threads.id", ondelete="CASCADE")

    thread: ThreadModel = Relationship(back_populates="runs")
    messages: list["MessageModel"] = Relationship(back_populates="run")

    def to_entity(self) -> RunEntity:
        return RunEntity(id=str(self.id))


class MessageModel(Model, table=True):
    __tablename__ = "messages"
    role: str
    run_id: UUID = Field(foreign_key="runs.id", ondelete="CASCADE")
    data: dict = Field(sa_column=Column(JSONB))
    meta: dict = Field(sa_column=Column(JSONB))

    run: RunModel = Relationship(back_populates="messages")
