from uuid import UUID

from pydantic import BaseModel


class CreateCollectionValidator(BaseModel):
    name: str


class CollectionValidator(BaseModel):
    id: UUID
    name: str
