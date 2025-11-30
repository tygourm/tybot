import { type AgentSubscriber, HttpAgent } from "@ag-ui/client";
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
  threadId: string | undefined;
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
  threadId: undefined,
  messages: [],
  agent: null,
});

type ChatActions = {
  setChatState: (state: Partial<ChatState>) => void;
  addMessage: (message: Message) => void;
  addChunk: (id: string, delta: string) => void;
  newChat: () => void;
  abortRun: () => void;
  runAgent: () => void;
  deleteMessage: (id: string) => void;
  updateMessage: (id: string, content: string) => void;
  regenerateMessage: (id: string) => void;
};

type ChatSelectors = {
  useParameters: () => ChatParameters;
  useInput: () => string;
  useRunning: () => boolean;
  useThreadId: () => string | undefined;
  useMessages: () => Message[];
  useToolMessage: (id: string) => ToolMessage | undefined;
};

const useChat = (): {
  chatActions: ChatActions;
  chatSelectors: ChatSelectors;
} => {
  const { t } = useTranslation();
  const actions: ChatActions = {} as ChatActions;

  actions.setChatState = (state: Partial<ChatState>) =>
    store.setState((prevState) => ({ ...prevState, ...state }));

  actions.addMessage = (message: Message) =>
    store.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));

  actions.addChunk = (id: string, delta: string) =>
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
    actions.setChatState({
      input: "",
      running: false,
      threadId: undefined,
      messages: [],
      agent: null,
    });
  };

  actions.abortRun = () => {
    store.state.agent?.abortRun();
    actions.setChatState({ running: false, agent: null });
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
    store.setState((prevState) => ({
      ...prevState,
      messages: [...store.state.messages, message],
      agent,
    }));
    agent.runAgent({ abortController: new AbortController() }, subscriber);
  };

  actions.deleteMessage = (id: string) => {
    const index = store.state.messages.findIndex((m) => m.id === id);
    if (index === -1 || store.state.messages[index].role !== "user") return;
    actions.setChatState({ messages: store.state.messages.slice(0, index) });
  };

  actions.updateMessage = (id: string, content: string) => {
    const index = store.state.messages.findIndex((m) => m.id === id);
    if (index === -1 || store.state.messages[index].role !== "user") return;
    actions.setChatState({
      messages: [
        ...store.state.messages.slice(0, index),
        { ...store.state.messages[index], content },
      ],
    });

    const agent = new HttpAgent({
      url: `${import.meta.env.SERVER_URL}/api/agents/run`,
      initialMessages: store.state.messages,
      threadId: store.state.threadId,
      debug: import.meta.env.DEV,
    });
    store.setState((prevState) => ({ ...prevState, agent }));
    agent.runAgent({ abortController: new AbortController() }, subscriber);
  };

  actions.regenerateMessage = (id: string) => {
    const index = store.state.messages.findIndex((m) => m.id === id);
    if (index === -1 || store.state.messages[index].role !== "assistant")
      return;
    let keepUntil = index - 1;
    while (store.state.messages[keepUntil].role !== "user") keepUntil--;
    if (keepUntil === -1) return;
    actions.setChatState({
      messages: store.state.messages.slice(0, keepUntil + 1),
    });

    const agent = new HttpAgent({
      url: `${import.meta.env.SERVER_URL}/api/agents/run`,
      initialMessages: store.state.messages,
      threadId: store.state.threadId,
      debug: import.meta.env.DEV,
    });
    store.setState((prevState) => ({ ...prevState, agent }));
    agent.runAgent({ abortController: new AbortController() }, subscriber);
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

  const subscriber: AgentSubscriber = {
    onRunStartedEvent({ event }) {
      logger.info(event.type, event);
      toast.info(t("chat.run-started"));
      actions.setChatState({
        input: "",
        running: true,
        threadId: event.threadId,
      });
    },
    onRunFinishedEvent({ event }) {
      logger.success(event.type, event);
      toast.success(t("chat.run-finished"));
      actions.setChatState({ running: false, agent: null });
    },
    onRunErrorEvent({ event }) {
      logger.error(event.type, event);
      toast.error(event.message || event.rawEvent.message);
      actions.setChatState({ running: false, agent: null });
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
      logger.info(event.type, event);
      actions.setChatState({ messages: event.messages });
    },
  };

  return { chatActions: actions, chatSelectors: selectors };
};

export { ChatParametersSchema, useChat, type ChatParameters };
