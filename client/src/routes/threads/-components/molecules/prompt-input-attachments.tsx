import { useCallback } from "react";

import {
  Attachment,
  AttachmentHoverCard,
  AttachmentHoverCardContent,
  AttachmentHoverCardTrigger,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  getAttachmentLabel,
  getMediaCategory,
} from "@/components/ui/ai-elements/attachments";
import {
  PromptInputHeader,
  usePromptInputAttachments,
} from "@/components/ui/ai-elements/prompt-input";

function PromptInputAttachments() {
  const attachments = usePromptInputAttachments();
  const handleRemove = useCallback(
    (id: string) => attachments.remove(id),
    [attachments],
  );

  if (attachments.files.length === 0) return null;

  return (
    <PromptInputHeader>
      <Attachments variant="inline">
        {attachments.files.map((a) => {
          const label = getAttachmentLabel(a);
          const mediaCategory = getMediaCategory(a);
          return (
            <AttachmentHoverCard key={a.id}>
              <AttachmentHoverCardTrigger asChild>
                <Attachment data={a} onRemove={() => handleRemove(a.id)}>
                  <div className="relative size-5 shrink-0">
                    <div className="absolute inset-0 transition-opacity group-hover:opacity-0">
                      <AttachmentPreview />
                    </div>
                    <AttachmentRemove className="absolute inset-0" />
                  </div>
                  <AttachmentInfo />
                </Attachment>
              </AttachmentHoverCardTrigger>
              <AttachmentHoverCardContent>
                <div className="space-y-3">
                  {mediaCategory === "image" && a.type === "file" && a.url && (
                    <div className="flex max-h-96 w-80 items-center justify-center overflow-hidden rounded-md border">
                      <img
                        className="max-h-full max-w-full object-contain"
                        alt={label}
                        src={a.url}
                        width={320}
                        height={384}
                      />
                    </div>
                  )}
                  <div className="space-y-1 px-0.5">
                    <h4 className="text-sm leading-none font-semibold">
                      {label}
                    </h4>
                    {a.mediaType && (
                      <p className="text-muted-foreground font-mono text-xs">
                        {a.mediaType}
                      </p>
                    )}
                  </div>
                </div>
              </AttachmentHoverCardContent>
            </AttachmentHoverCard>
          );
        })}
      </Attachments>
    </PromptInputHeader>
  );
}

export { PromptInputAttachments };
