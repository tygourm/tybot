"use client";

import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { WithTooltip } from "@/components/atoms/with-tooltip";
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
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ui/ai-elements/prompt-input";
import { useChat } from "@/models/chat";

function ChatPromptInput({
  className,
  ...props
}: {
  className?: string;
  props?: ComponentProps<typeof PromptInput>;
}) {
  const { t } = useTranslation();
  const { setInput, addMessage, runAgent, abortRun, input, running } =
    useChat();

  const handleSubmit = (input: PromptInputMessage) => {
    if (!input.text.trim() && !running) return;
    if (running) abortRun();
    else {
      const content =
        input.files.length === 0
          ? input.text
          : [
              { type: "text" as const, text: input.text },
              ...input.files.map((f) => ({
                filename: f.filename,
                mimeType: f.mediaType,
                type: "binary" as const,
                data: f.url.split("base64,")[1],
              })),
            ];
      const message = {
        id: crypto.randomUUID(),
        role: "user" as const,
        content,
      };
      addMessage(message);
      runAgent();
    }
  };
  return (
    <PromptInputProvider>
      <PromptInput
        multiple
        globalDrop
        maxFiles={10}
        className={className}
        onSubmit={handleSubmit}
        maxFileSize={10 * 1024 * 1024}
        onError={(err) => toast.error(err.message)}
        {...props}
      >
        <ChatPromptInputAttachments />
        <PromptInputBody>
          <PromptInputTextarea
            value={input.text}
            placeholder={t("chat-prompt-input.placeholder")}
            onChange={(e) => setInput({ text: e.target.value })}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments label={t("actions.attach")} />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
          </PromptInputTools>
          <WithTooltip
            tooltip={running ? t("actions.abort") : t("actions.send")}
          >
            <PromptInputSubmit
              status={running ? "streaming" : "ready"}
              variant={running ? "destructive" : "default"}
              disabled={!running && input.text.trim().length === 0}
            />
          </WithTooltip>
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  );
}

function ChatPromptInputAttachments() {
  const attachments = usePromptInputAttachments();
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
                <Attachment data={a} onRemove={() => attachments.remove(a.id)}>
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
                        src={a.url}
                        width={320}
                        height={384}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  <div className="space-y-1 px-0.5">
                    <div className="text-sm leading-none font-semibold">
                      {label}
                    </div>
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

export { ChatPromptInput };
