import { DatabaseIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CreateCollectionDialog } from "@/routes/collections/-components/molecules/create-collection-dialog";

function EmptyCollections() {
  const { t } = useTranslation();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <DatabaseIcon />
        </EmptyMedia>
        <EmptyTitle>{t("collections.no-collection")}</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <CreateCollectionDialog />
      </EmptyContent>
    </Empty>
  );
}

export { EmptyCollections };
