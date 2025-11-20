import { HttpAgent } from "@ag-ui/client";
import type { Message, ToolMessage, UserMessage } from "@ag-ui/core";
import { Store, useStore } from "@tanstack/react-store";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { logger } from "@/lib/logs";

const ChatParametersSchema = z.object({
  temperature: z.number().min(0).max(2),
  topP: z.number().min(0).max(1),
  presencePenalty: z.number().min(-2).max(2),
  frequencyPenalty: z.number().min(-2).max(2),
});

type ChatParameters = z.infer<typeof ChatParametersSchema>;

type ChatState = {
  parameters: ChatParameters;
  input: string;
  running: boolean;
  threadId: string;
  messages: Message[];
  agent: HttpAgent | null;
};

const store = new Store<ChatState>({
  parameters: {
    temperature: 1,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
  },
  input: "",
  running: false,
  threadId: crypto.randomUUID(),
  messages: [],
  agent: null,
});

type ChatActions = {
  setParameters: (parameters: ChatParameters) => void;
  setInput: (input: string) => void;
  setRunning: (running: boolean) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  addChunk: (id: string, delta: string) => void;
  newChat: () => void;
  runAgent: () => void;
  abortRun: () => void;
};

type ChatSelectors = {
  useParameters: () => ChatParameters;
  useInput: () => string;
  useRunning: () => boolean;
  useThreadId: () => string;
  useMessages: () => Message[];
  useToolMessage: (id: string) => ToolMessage | undefined;
};

const useChat = (): {
  chatActions: ChatActions;
  chatSelectors: ChatSelectors;
} => {
  const { t } = useTranslation();
  const actions: ChatActions = {} as ChatActions;

  actions.setParameters = (parameters: ChatParameters) =>
    store.setState((prevState) => ({ ...prevState, parameters }));

  actions.setInput = (input: string) =>
    store.setState((prevState) => ({ ...prevState, input }));

  actions.setRunning = (running: boolean) =>
    store.setState((prevState) => ({ ...prevState, running }));

  actions.setMessages = (messages: Message[]) =>
    store.setState((prevState) => ({ ...prevState, messages }));

  actions.addMessage = (message: Message) =>
    store.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));

  actions.addChunk = (id, delta) =>
    store.setState((prevState) => ({
      ...prevState,
      messages: prevState.messages.map((m) =>
        m.id === id && m.role === "assistant"
          ? { ...m, content: m.content + delta }
          : m,
      ),
    }));

  actions.newChat = () => {
    if (store.state.running) actions.abortRun();
    store.setState((prevState) => ({
      ...prevState,
      input: "",
      running: false,
      threadId: crypto.randomUUID(),
      messages: [],
      agent: null,
    }));
  };

  actions.runAgent = () => {
    const message: UserMessage = {
      content: store.state.input,
      id: crypto.randomUUID(),
      role: "user",
    };
    const agent = new HttpAgent({
      url: `${import.meta.env.SERVER_URL}/api/agents/run`,
      initialMessages: [...store.state.messages, message],
      threadId: store.state.threadId,
      debug: import.meta.env.DEV,
    });
    store.setState((prevState) => ({ ...prevState, agent }));
    agent.runAgent(
      {
        runId: crypto.randomUUID(),
        abortController: new AbortController(),
      },
      {
        onRunStartedEvent() {
          store.setState((prevState) => ({
            ...prevState,
            input: "",
            running: true,
            messages: [...prevState.messages, message],
          }));
          toast.info(t("chat.run-started"));
        },
        onRunFinishedEvent() {
          store.setState((prevState) => ({
            ...prevState,
            running: false,
            agent: null,
          }));
          toast.success(t("chat.run-finished"));
        },
        onRunErrorEvent({ event }) {
          store.setState((prevState) => ({
            ...prevState,
            running: false,
            agent: null,
          }));
          logger.error(event.type, event);
          toast.error(event.message || event.rawEvent.message);
        },
        onTextMessageStartEvent({ event }) {
          actions.addMessage({
            id: event.messageId,
            role: event.role,
            content: "",
          });
        },
        onTextMessageContentEvent({ event }) {
          actions.addChunk(event.messageId, event.delta);
        },
        onMessagesSnapshotEvent({ event }) {
          actions.setMessages(event.messages);
        },
      },
    );
  };

  actions.abortRun = () => {
    store.state.agent?.abortRun();
    store.setState((prevState) => ({ ...prevState, agent: null }));
  };

  const selectors: ChatSelectors = {
    useParameters: () => useStore(store, (state) => state.parameters),

    useInput: () => useStore(store, (state) => state.input),

    useRunning: () => useStore(store, (state) => state.running),

    useThreadId: () => useStore(store, (state) => state.threadId),

    useMessages: () => useStore(store, (state) => state.messages),

    useToolMessage: (id) =>
      useStore(store, (state) =>
        state.messages
          .filter((m) => m.role === "tool")
          .find((m) => m.toolCallId === id),
      ),
  };

  return { chatActions: actions, chatSelectors: selectors };
};

export { ChatParametersSchema, useChat, type ChatParameters };
