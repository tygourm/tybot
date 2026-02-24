"use client";

import { BotIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ui/ai-elements/conversation";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import { TypingText } from "@/components/ui/shadcn-io/typing-text";
import { useChat } from "@/models/chat";
import {
  AssistantChatMessage,
  UserChatMessage,
} from "@/routes/threads/-components/molecules/chat-message";
import { ChatPromptInput } from "@/routes/threads/-components/molecules/chat-prompt-input";

function Chat() {
  const { t } = useTranslation();
  const { messages } = useChat();

  return (
    <div className="flex size-full flex-col justify-center px-2 pb-2">
      {messages.length === 0 && (
        <Empty className="flex-none gap-2">
          <EmptyHeader>
            <EmptyMedia>
              <BotIcon
                style={{ strokeWidth: 1, width: "4rem", height: "4rem" }}
              />
            </EmptyMedia>
          </EmptyHeader>
          <EmptyContent className="max-w-full">
            <TypingText className="text-2xl" text={t("chat.welcome")} />
          </EmptyContent>
        </Empty>
      )}
      {messages.length > 0 && (
        <Conversation>
          <ConversationContent className="mx-auto w-full max-w-4xl gap-2 p-2">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <UserChatMessage key={m.id} index={i} message={m} />
              ) : m.role === "assistant" ? (
                <AssistantChatMessage key={m.id} index={i} message={m} />
              ) : null,
            )}
            <ConversationScrollButton />
          </ConversationContent>
        </Conversation>
      )}
      <ChatPromptInput className="mx-auto w-full max-w-4xl" />
    </div>
  );
}

export { Chat };
