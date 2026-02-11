import { DatabaseIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CreateCollectionButton } from "@/routes/collections/-components/atoms/create-collection-button";

function EmptyCollections() {
  const { t } = useTranslation();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <DatabaseIcon />
        </EmptyMedia>
        <EmptyTitle>{t("collections.empty")}</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <CreateCollectionButton />
      </EmptyContent>
    </Empty>
  );
}

export { EmptyCollections };
