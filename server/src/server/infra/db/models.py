from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

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
    thread: ThreadModel = Relationship(back_populates="runs")
    thread_id: UUID = Field(foreign_key="threads.id", ondelete="CASCADE")

    def to_entity(self) -> RunEntity:
        return RunEntity(id=str(self.id))
