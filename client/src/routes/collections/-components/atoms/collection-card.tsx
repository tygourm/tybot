import { BrainIcon, FolderIcon, ScissorsIcon, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { WithTooltip } from "@/components/atoms/with-tooltip";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Collection, useDeleteCollection } from "@/models/rag/collections";
import { IngestCollectionButton } from "@/routes/collections/-components/atoms/ingest-collection-button";

function CollectionCard({ collection }: { collection: Collection }) {
  const { t } = useTranslation();
  const deleteCollection = useDeleteCollection();

  return (
    <Card className="hover:bg-accent">
      <CardHeader className="flex flex-row items-center gap-2">
        <FolderIcon size={16} />
        <CardTitle>{collection.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <BrainIcon size={16} />
          <span>{collection.modelName}</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <ScissorsIcon size={16} />
          <span>{collection.chunkingStrategy}</span>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <IngestCollectionButton collectionId={collection.id} />
        <WithTooltip tooltip={t("collections.delete-collection")}>
          <Button
            variant="ghost"
            className="hover:text-destructive"
            onClick={() => deleteCollection.mutate(collection.id)}
          >
            <Trash2Icon />
            <span className="sr-only">
              {t("collections.delete-collection")}
            </span>
          </Button>
        </WithTooltip>
      </CardFooter>
    </Card>
  );
}

export { CollectionCard };
