"use client";

import { HttpAgent, type UserMessage } from "@ag-ui/client";
import type { UIMessage } from "ai";
import { PaperclipIcon } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ui/shadcn-io/ai/conversation";
import { Message, MessageContent } from "@/components/ui/shadcn-io/ai/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import { logger } from "@/lib/logs";
import { chatActions, chatSelectors } from "@/stores/chat";

const Chat = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const messages = chatSelectors.useMessages();
  const threadId = chatSelectors.useThreadId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message: UserMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };
    const agent = new HttpAgent({
      url: `${import.meta.env.SERVER_URL}/api/agents/run`,
      threadId: threadId || crypto.randomUUID(),
      initialMessages: [...messages, message],
      debug: import.meta.env.DEV,
    });
    agent.runAgent(
      { runId: crypto.randomUUID() },
      {
        onRunStartedEvent({ event }) {
          setInput("");
          toast.info("Run started");
          chatActions.addMessage(message);
          chatActions.setThreadId(event.threadId);
        },
        onRunFinishedEvent() {
          toast.success("Run finished");
        },
        onRunErrorEvent({ event }) {
          logger.error(event);
          toast.error(event.message);
        },
        onTextMessageStartEvent({ event }) {
          chatActions.addMessage({
            id: event.messageId,
            role: event.role,
            content: "",
          });
        },
        onTextMessageContentEvent({ event }) {
          chatActions.addChunk(event.messageId, event.delta);
        },
        onMessagesSnapshotEvent({ event }) {
          chatActions.setMessages(event.messages);
        },
      },
    );
  };

  return (
    <div className="flex flex-col w-full h-screen justify-center">
      {messages.length === 0 && (
        <Label className="text-2xl mx-auto mb-4">{t("chat.welcome")}</Label>
      )}
      {messages.length > 0 && (
        <Conversation>
          <ConversationContent className="px-2 space-y-4">
            {messages.map((m) => {
              logger.info(messages);
              return (
                <Message from={m.role as UIMessage["role"]}>
                  {m.role === "user" && typeof m.content === "string" && (
                    <MessageContent>{m.content}</MessageContent>
                  )}
                  {m.role === "assistant" && (
                    <MessageContent>
                      <Response parseIncompleteMarkdown={false}>
                        {m.content}
                      </Response>
                    </MessageContent>
                  )}
                </Message>
              );
            })}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputTextarea
          value={input}
          placeholder={t("chat.placeholder")}
          onChange={(e) => setInput(e.target.value)}
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputButton>
              <PaperclipIcon size={16} />
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputSubmit status={"ready"} disabled={!input.trim()} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

export { Chat };
