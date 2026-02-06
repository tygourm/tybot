import { BotIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { WithTooltip } from "@/components/atoms/with-tooltip";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ui/ai-elements/conversation";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ui/ai-elements/prompt-input";
import {
  AssistantChatMessage,
  UserChatMessage,
} from "@/routes/threads/-components/molecules/chat-message";
import { PromptInputAttachments } from "@/routes/threads/-components/molecules/prompt-input-attachments";
import { useChat } from "@/states/chat";

function Chat() {
  const { t } = useTranslation();
  const {
    setChatState,
    setInput,
    runAgent,
    abortRun,
    input,
    running,
    messages,
  } = useChat();

  const handleSubmit = ({ text, files }: PromptInputMessage) => {
    if (running) {
      abortRun();
      return;
    }
    const content =
      files.length === 0
        ? text.trim()
        : [
            { type: "text" as const, text: text.trim() },
            ...files.map((f) => ({
              url: f.url,
              file: f.filename,
              mimeType: f.mediaType,
              type: "binary" as const,
            })),
          ];
    setChatState({
      input: { text: "", files: [] },
      messages: [
        ...messages,
        { id: crypto.randomUUID(), role: "user", content },
      ],
    });
    runAgent();
  };

  return (
    <div className="flex size-full flex-col items-center justify-center overflow-hidden px-2 pb-2">
      {messages.length === 0 ? (
        <ConversationEmptyState
          className="size-fit"
          icon={<BotIcon />}
          title="tybot"
          description="Yet another chatbot."
        ></ConversationEmptyState>
      ) : (
        <Conversation className="w-full max-w-3xl">
          <ConversationContent className="gap-2 p-2">
            {messages.map((m) => {
              if (m.role === "user")
                return <UserChatMessage key={m.id} message={m} />;
              if (m.role === "assistant")
                return <AssistantChatMessage key={m.id} message={m} />;
            })}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}
      <PromptInput className="max-w-3xl" onSubmit={handleSubmit}>
        <PromptInputAttachments />
        <PromptInputBody>
          <PromptInputTextarea
            value={input.text}
            placeholder={t("chat.placeholder")}
            onChange={(e) => setInput({ text: e.target.value })}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments label={t("chat.attach")} />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
          </PromptInputTools>
          <WithTooltip tooltip={running ? t("chat.abort") : t("chat.send")}>
            <PromptInputSubmit
              status={running ? "streaming" : "ready"}
              disabled={!running && input.text.trim().length === 0}
            />
          </WithTooltip>
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

export { Chat };
