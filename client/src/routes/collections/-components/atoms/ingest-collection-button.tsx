import { FolderPen } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { WithTooltip } from "@/components/atoms/with-tooltip";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useIngestDocuments } from "@/models/rag/collections";

function IngestCollectionButton({ collectionId }: { collectionId: string }) {
  const { t } = useTranslation();
  const ingestCollection = useIngestDocuments();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    ingestCollection.mutate(
      { files, collectionId },
      {
        onSuccess: () =>
          toast.success(t("collections.ingest-collection-success")),
      },
    );

    e.target.value = "";
  };

  return (
    <>
      <input
        type="file"
        multiple
        accept=".pdf"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <WithTooltip tooltip={t("collections.add-files")}>
        <Button
          variant="ghost"
          onClick={() => inputRef.current?.click()}
          disabled={ingestCollection.isPending}
        >
          {ingestCollection.isPending ? <Spinner /> : <FolderPen />}
        </Button>
      </WithTooltip>
    </>
  );
}

export { IngestCollectionButton };
