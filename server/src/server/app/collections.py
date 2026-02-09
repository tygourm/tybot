from server.core.entities import Collection
from server.core.logger import get_logger
from server.infra.db.repositories.collections import CollectionsRepository

logger = get_logger(__name__)


class CollectionsService:
    def __init__(self, collections_repository: CollectionsRepository) -> None:
        self.collections_repository = collections_repository

    def create_collection(self, name: str) -> Collection:
        if self.collections_repository.exists_by_name(name):
            message = f"Collection with name {name} already exists"
            raise ValueError(message)
        logger.info("Creating collection %s", name)
        return self.collections_repository.create_collection(name)

    def read_collections(self) -> list[Collection]:
        logger.info("Reading collections")
        return self.collections_repository.read_collections()

    def delete_collection(self, collection_id: str) -> None:
        logger.info("Deleting collection %s", collection_id)
        self.collections_repository.delete_collection(collection_id)
