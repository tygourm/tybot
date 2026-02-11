import { Loader2Icon, TrashIcon } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { WithTooltip } from "@/components/atoms/with-tooltip";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateCollectionButton } from "@/routes/collections/-components/atoms/create-collection-button";
import { EmptyCollections } from "@/routes/collections/-components/molecules/empty-collections";
import { useCollections, useDeleteCollection } from "@/states/rag/queries";

function Collections() {
  const { t } = useTranslation();
  const deleteCollection = useDeleteCollection();
  const { data, error, isLoading } = useCollections();

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  if (isLoading)
    return (
      <div className="flex size-full items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );

  if (!data || data.data.length === 0) return <EmptyCollections />;

  return (
    <div className="flex size-full flex-col gap-4 p-4">
      <CreateCollectionButton />
      <div className="grid grid-cols-3 gap-4">
        {data?.data.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.name}</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-end">
              <WithTooltip tooltip={t("actions.delete")}>
                <Button
                  variant={"ghost"}
                  className="hover:text-destructive"
                  onClick={() => deleteCollection.mutate(c.id)}
                >
                  <TrashIcon />
                </Button>
              </WithTooltip>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { Collections };
