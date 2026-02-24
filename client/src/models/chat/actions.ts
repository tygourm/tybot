import { toast } from "sonner";

import { createAgent } from "@/lib/api";
import { logger } from "@/lib/logs";
import { type ChatState, initialState, store } from "@/models/chat/store";

const setChatState = (state: Partial<ChatState>) =>
  store.setState((prevState) => ({ ...prevState, ...state }));

const resetChatState = () => setChatState(initialState);

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

const streamAssistantMessage = (messageId: string, textMessageBuffer: string) =>
  store.setState((prevState) => {
    const messages = prevState.messages.map((m) =>
      m.id === messageId && m.role === "assistant"
        ? { ...m, content: textMessageBuffer }
        : m,
    );
    return { ...prevState, messages };
  });

const addToolCall = (
  toolCallId: string,
  toolCallName: string,
  parentMessageId?: string,
) => {
  if (!parentMessageId) return;
  store.setState((prevState) => {
    if (prevState.messages.some((m) => m.id === parentMessageId)) {
      return {
        ...prevState,
        messages: prevState.messages.map((m) =>
          m.id === parentMessageId && m.role === "assistant"
            ? {
                ...m,
                toolCalls: [
                  ...(m.toolCalls || []),
                  {
                    id: toolCallId,
                    type: "function" as const,
                    function: {
                      name: toolCallName,
                      arguments: "",
                    },
                  },
                ],
              }
            : m,
        ),
      };
    }
    return {
      ...prevState,
      messages: [
        ...prevState.messages,
        {
          id: parentMessageId,
          role: "assistant" as const,
          content: "",
          toolCalls: [
            {
              id: toolCallId,
              type: "function" as const,
              function: {
                name: toolCallName,
                arguments: "",
              },
            },
          ],
        },
      ],
    };
  });
};

const addToolCallArgs = (
  toolCallId: string,
  toolCallName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolCallArgs: Record<string, any>,
) => {
  store.setState((prevState) => ({
    ...prevState,
    messages: prevState.messages.map((m) =>
      m.role === "assistant"
        ? {
            ...m,
            toolCalls: m.toolCalls?.map((tc) =>
              tc.id === toolCallId
                ? {
                    ...tc,
                    function: {
                      name: toolCallName,
                      arguments: JSON.stringify(toolCallArgs),
                    },
                  }
                : tc,
            ),
          }
        : m,
    ),
  }));
};

const abortRun = () => store.state.abortController?.abort();

const runAgent = () => {
  const agent = createAgent({
    threadId: store.state.threadId,
    initialMessages: store.state.messages,
  });
  const abortController = new AbortController();
  setChatState({ abortController });
  agent.runAgent(
    { abortController },
    {
      onRunInitialized: () =>
        setChatState({
          input: { text: "", files: [] },
          running: true,
          abortController,
        }),
      onRunFailed: ({ error }) => {
        toast.error(error.message);
        logger.error("Run failed", error);
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
      onTextMessageContentEvent: ({ event, textMessageBuffer }) =>
        streamAssistantMessage(event.messageId, textMessageBuffer),
      onToolCallStartEvent: ({ event }) =>
        addToolCall(
          event.toolCallId,
          event.toolCallName,
          event.parentMessageId,
        ),
      onToolCallEndEvent: ({ event, toolCallName, toolCallArgs }) =>
        addToolCallArgs(event.toolCallId, toolCallName, toolCallArgs),
      onToolCallResultEvent: ({ event }) =>
        addMessage({
          role: "tool",
          id: event.messageId,
          content: event.content,
          toolCallId: event.toolCallId,
        }),
      onMessagesSnapshotEvent: ({ event }) =>
        setChatState({ messages: event.messages }),
    },
  );
};

const updateMessage = (messageId: string, content: string) => {
  store.setState((prevState) => {
    const index = prevState.messages.findIndex((m) => m.id === messageId);
    if (index === -1 || prevState.messages[index].role !== "user")
      return prevState;
    return {
      ...prevState,
      messages: [
        ...prevState.messages.slice(0, index),
        { ...prevState.messages[index], content },
      ],
    };
  });
  runAgent();
};

const deleteMessage = (messageId: string) => {
  store.setState((prevState) => {
    const index = prevState.messages.findIndex((m) => m.id === messageId);
    if (index === -1 || prevState.messages[index].role !== "user")
      return prevState;
    return { ...prevState, messages: prevState.messages.slice(0, index) };
  });
};

const regenerateMessage = (messageId: string) => {
  store.setState((prevState) => {
    const index = prevState.messages.findIndex((m) => m.id === messageId);
    if (index === -1 || prevState.messages[index].role !== "assistant")
      return prevState;
    let keepUntil = index - 1;
    while (prevState.messages[keepUntil]?.role !== "user") keepUntil--;
    return {
      ...prevState,
      messages: prevState.messages.slice(0, keepUntil + 1),
    };
  });
  runAgent();
};

export const actions = {
  setChatState,
  resetChatState,
  setInput,
  addMessage,
  streamAssistantMessage,
  addToolCall,
  addToolCallArgs,
  abortRun,
  runAgent,
  updateMessage,
  deleteMessage,
  regenerateMessage,
};
