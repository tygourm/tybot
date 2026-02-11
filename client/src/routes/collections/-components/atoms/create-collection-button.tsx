import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreateCollection } from "@/states/rag/queries";

function CreateCollectionButton({
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick">) {
  const { t } = useTranslation();
  const createCollection = useCreateCollection();

  return (
    <Button
      {...props}
      className={cn("w-fit", className)}
      onClick={() => createCollection.mutate(crypto.randomUUID())}
    >
      {t("collections.create")}
    </Button>
  );
}

export { CreateCollectionButton };
