"use client";

import { type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { WithTooltip } from "@/components/atoms/with-tooltip";
import { ChatAttachmentsDialog } from "@/components/molecules/chat-attachments-dialog";
import { ChatMessage } from "@/components/molecules/chat-message";
import { ChatParametersDialog } from "@/components/molecules/chat-parameters-dialog";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ui/shadcn-io/ai/conversation";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import TypingText from "@/components/ui/shadcn-io/typing-text";
import { useChat } from "@/hooks/use-chat";

const Chat = () => {
  const { t } = useTranslation();
  const { chatActions, chatSelectors } = useChat();
  const input = chatSelectors.useInput();
  const running = chatSelectors.useRunning();
  const messages = chatSelectors.useMessages();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() && !running) return;
    if (running) chatActions.abortRun();
    else chatActions.runAgent();
  };

  return (
    <div className="flex flex-col w-full h-full justify-center p-4 pt-0">
      {messages.length === 0 ? (
        <TypingText
          showCursor={false}
          text={t("chat.welcome")}
          className="text-2xl mx-auto mb-4"
        />
      ) : (
        <Conversation>
          <ConversationContent className="p-4 space-y-4">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}
      <PromptInput className="bg-sidebar" onSubmit={handleSubmit}>
        <PromptInputTextarea
          value={input}
          placeholder={t("chat.placeholder")}
          onChange={(e) => chatActions.setChatState({ input: e.target.value })}
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <ChatAttachmentsDialog />
            <ChatParametersDialog />
          </PromptInputTools>
          <WithTooltip content={t(running ? "chat.abort" : "chat.send")}>
            <PromptInputSubmit
              disabled={!input.trim() && !running}
              status={running ? "streaming" : "ready"}
            />
          </WithTooltip>
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

export { Chat };
