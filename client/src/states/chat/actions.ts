import type { UserMessage } from "@ag-ui/core";
import { toast } from "sonner";

import { createHttpAgent } from "@/api/client";
import { logger } from "@/lib/logs";
import { type ChatState, initialState, store } from "@/states/chat/store";

const setChatState = (state: Partial<ChatState>) =>
  store.setState((prevState) => ({ ...prevState, ...state }));

const resetChatState = () => store.setState(initialState);

const setInput = (input: Partial<ChatState["input"]>) =>
  store.setState((prevState) => ({
    ...prevState,
    input: { ...prevState.input, ...input },
  }));

const addMessage = (message: ChatState["messages"][number]) =>
  store.setState((prevState) => ({
    ...prevState,
    messages: [...prevState.messages, message],
  }));

const streamContent = (messageId: string, textMessageBuffer: string) => {
  store.setState((prevState) => ({
    ...prevState,
    messages: prevState.messages.map((message) => {
      if (message.id === messageId && message.role === "assistant")
        return { ...message, content: textMessageBuffer };
      return message;
    }),
  }));
};

const runAgent = () => {
  const { messages, threadId } = store.state;
  const abortController = new AbortController();
  setChatState({ abortController });
  createHttpAgent(threadId, messages).runAgent(
    { abortController },
    {
      onRunInitialized: () => setChatState({ running: true }),
      onRunFailed: ({ error }) => {
        toast.error(error.message);
        logger.error(error.name, error);
      },
      onRunFinalized: () =>
        setChatState({ running: false, abortController: undefined }),
      onRunStartedEvent: ({ event }) =>
        setChatState({ threadId: event.threadId }),
      onRunErrorEvent: ({ event }) => {
        toast.error(event.message);
        logger.error(event.type, event);
      },
      onTextMessageStartEvent: ({ event }) =>
        addMessage({ id: event.messageId, role: event.role, content: "" }),
      onToolCallStartEvent: ({ event }) => logger.info(event.type, event),
      onToolCallArgsEvent: ({ event }) => logger.info(event.type, event),
      onToolCallEndEvent: ({ event }) => logger.info(event.type, event),
      onToolCallResultEvent: ({ event }) => logger.info(event.type, event),
      onTextMessageContentEvent: ({ event, textMessageBuffer }) =>
        streamContent(event.messageId, textMessageBuffer),
      onMessagesSnapshotEvent: ({ event }) =>
        setChatState({ messages: event.messages }),
    },
  );
};

const abortRun = () => {
  const { abortController } = store.state;
  abortController?.abort();
};

const updateMessage = (messageId: string, content: string) => {
  const { messages } = store.state;

  const index = messages.findIndex(
    (m) => m.id === messageId && m.role === "user",
  );
  if (index === -1) return;
  store.setState((prevState) => ({
    ...prevState,
    messages: [
      ...prevState.messages.slice(0, index),
      { ...(prevState.messages[index] as UserMessage), content },
    ],
  }));

  runAgent();
};

const deleteMessage = (messageId: string) => {
  const { messages } = store.state;
  const index = messages.findIndex(
    (m) => m.id === messageId && m.role === "user",
  );
  if (index === -1) return;
  store.setState((prevState) => ({
    ...prevState,
    messages: [...prevState.messages.slice(0, index)],
  }));
};

const regenerateMessage = (messageId: string) => {
  const { messages } = store.state;
  const index = messages.findIndex(
    (m) => m.id === messageId && m.role === "assistant",
  );
  if (index === -1) return;

  const keepUntil = messages
    .slice(0, index)
    .toReversed()
    .find((m) => m.role === "user");
  if (!keepUntil) return;

  store.setState((prevState) => ({
    ...prevState,
    messages: [...messages.slice(0, messages.indexOf(keepUntil) + 1)],
  }));
  runAgent();
};

export const actions = {
  setChatState,
  resetChatState,
  setInput,
  addMessage,
  streamContent,
  runAgent,
  abortRun,
  updateMessage,
  deleteMessage,
  regenerateMessage,
};
