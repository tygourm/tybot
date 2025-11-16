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
  setParameters: (p: ChatParameters) => void;
  setInput: (v: string) => void;
  setRunning: (v: boolean) => void;
  setMessages: (m: Message[]) => void;
  addMessage: (m: Message) => void;
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

  actions.setParameters = (p) =>
    store.setState((s) => ({ ...s, parameters: p }));

  actions.setInput = (v) => store.setState((s) => ({ ...s, input: v }));

  actions.setRunning = (v) => store.setState((s) => ({ ...s, running: v }));

  actions.setMessages = (m) => store.setState((s) => ({ ...s, messages: m }));

  actions.addMessage = (m) =>
    store.setState((s) => ({ ...s, messages: [...s.messages, m] }));

  actions.addChunk = (id, delta) =>
    store.setState((s) => ({
      ...s,
      messages: s.messages.map((msg) =>
        msg.id === id && msg.role === "assistant"
          ? { ...msg, content: msg.content + delta }
          : msg,
      ),
    }));

  actions.newChat = () => {
    if (store.state.running) actions.abortRun();
    store.setState((s) => ({
      ...s,
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
    store.setState((s) => ({ ...s, agent }));
    agent.runAgent(
      {
        runId: crypto.randomUUID(),
        abortController: new AbortController(),
      },
      {
        onRunStartedEvent() {
          actions.setInput("");
          actions.setRunning(true);
          actions.addMessage(message);
          toast.info(t("chat.run-started"));
        },
        onRunFinishedEvent() {
          actions.setRunning(false);
          store.setState((s) => ({ ...s, agent: null }));
          toast.success(t("chat.run-finished"));
        },
        onRunErrorEvent({ event }) {
          actions.setRunning(false);
          logger.error(event.type, event);
          store.setState((s) => ({ ...s, agent: null }));
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
    store.setState((s) => ({ ...s, agent: null }));
  };

  const selectors: ChatSelectors = {
    useParameters: () => useStore(store, (s) => s.parameters),
    useInput: () => useStore(store, (s) => s.input),
    useRunning: () => useStore(store, (s) => s.running),
    useThreadId: () => useStore(store, (s) => s.threadId),
    useMessages: () => useStore(store, (s) => s.messages),
    useToolMessage: (id) =>
      useStore(store, (s) =>
        s.messages
          .filter((m) => m.role === "tool")
          .find((m) => m.toolCallId === id),
      ),
  };

  return { chatActions: actions, chatSelectors: selectors };
};

export { ChatParametersSchema, useChat, type ChatParameters };
