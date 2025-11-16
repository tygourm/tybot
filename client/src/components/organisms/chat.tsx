"use client";

import { HttpAgent, type UserMessage } from "@ag-ui/client";
import { type FormEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { WithTooltip } from "@/components/atoms/with-tooltip";
import { ChatAttachementsDialog } from "@/components/molecules/chat-attachements-dialog";
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
import { logger } from "@/lib/logs";
import { chatActions, chatSelectors } from "@/stores/chat";

const Chat = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const messages = chatSelectors.useMessages();
  const threadId = chatSelectors.useThreadId();
  const abortController = useRef<AbortController>(new AbortController());

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() && !running) return;
    if (running) {
      abortController.current?.abort();
      abortController.current = new AbortController();
      return;
    }
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
      {
        runId: crypto.randomUUID(),
        abortController: abortController.current,
      },
      {
        onRunStartedEvent({ event }) {
          setInput("");
          setRunning(true);
          toast.info(t("chat.run-started"));
          chatActions.addMessage(message);
          chatActions.setThreadId(event.threadId);
        },
        onRunFinishedEvent() {
          setRunning(false);
          toast.success(t("chat.run-finished"));
        },
        onRunErrorEvent({ event }) {
          setRunning(false);
          logger.error(event);
          toast.error(event.message || event.rawEvent.message);
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
    <div className="flex flex-col w-full h-screen justify-center pb-4">
      {messages.length === 0 ? (
        <TypingText
          text={t("chat.welcome")}
          className="text-2xl mx-auto mb-4"
        />
      ) : (
        <Conversation>
          <ConversationContent className="p-0 px-4">
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
          onChange={(e) => setInput(e.target.value)}
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <ChatAttachementsDialog />
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
