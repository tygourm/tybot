from dataclasses import asdict

from fastapi import APIRouter

from server.core.injector import create_collections_service
from server.infra.api.collections.validators import (
    CollectionValidator,
    CreateCollectionValidator,
)

router = APIRouter()


@router.post("/", status_code=201)
def create_collection(body: CreateCollectionValidator) -> CollectionValidator:
    collections_service = create_collections_service()
    collection = collections_service.create_collection(body.name)
    return CollectionValidator(**asdict(collection))


@router.get("/")
def read_collections() -> list[CollectionValidator]:
    collections_service = create_collections_service()
    collections = collections_service.read_collections()
    return [CollectionValidator(**asdict(c)) for c in collections]


@router.delete("/{collection_id}", status_code=204)
def delete_collection(collection_id: str) -> None:
    collections_service = create_collections_service()
    collections_service.delete_collection(collection_id)
