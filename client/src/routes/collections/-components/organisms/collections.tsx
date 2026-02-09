import { Spinner } from "@/components/ui/spinner";
import { useCollections } from "@/models/rag/collections";
import { CollectionCard } from "@/routes/collections/-components/atoms/collection-card";
import { EmptyCollections } from "@/routes/collections/-components/atoms/empty-collections";
import { CreateCollectionDialog } from "@/routes/collections/-components/molecules/create-collection-dialog";

function Collections() {
  const { data, isPending } = useCollections();

  if (isPending)
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );

  if (!data || data.length === 0) return <EmptyCollections />;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <CreateCollectionDialog />
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}

export { Collections };
