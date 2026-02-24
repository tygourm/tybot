import { FileIcon, MapPinIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import type { CatalogObject } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useChat } from "@/models/chat";

const getThumbnailIcon = (object: CatalogObject) => {
  switch (object.type) {
    case "FileInfo":
      return <FileIcon />;
    case "GeoPoint":
      return <MapPinIcon />;
  }
};

const getThumbnailLabel = (object: CatalogObject) => {
  switch (object.type) {
    case "FileInfo":
      return object.objectName;
    case "GeoPoint":
      return object.label ?? "GeoPoint";
  }
};

function Thumbnail({
  className,
  object,
  ...props
}: {
  object: CatalogObject;
} & ComponentProps<"button">) {
  const { mode, setChatState } = useChat();

  return (
    <Button
      {...props}
      className={cn("w-fit", className)}
      onClick={() =>
        setChatState({
          mode: mode === "fullscreen" ? "dashboard" : "fullscreen",
        })
      }
    >
      {getThumbnailIcon(object)}
      {getThumbnailLabel(object)}
    </Button>
  );
}

export { Thumbnail };
