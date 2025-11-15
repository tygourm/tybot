import { type Message } from "@ag-ui/core";
import { Store, useStore } from "@tanstack/react-store";

type State = {
  threadId: string | null;
  messages: Message[];
};

const store = new Store<State>({
  threadId: null,
  messages: [],
});

const chatActions = {
  setThreadId: (threadId: string | null) =>
    store.setState((prevState) => ({
      ...prevState,
      threadId,
    })),

  addMessage: (message: Message) =>
    store.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    })),

  addChunk: (messageId: string, delta: string) =>
    store.setState((prevState) => ({
      ...prevState,
      messages: prevState.messages.map((m) => {
        if (m.id === messageId && m.role === "assistant")
          return { ...m, content: m.content + delta };
        return m;
      }),
    })),

  setMessages: (messages: Message[]) =>
    store.setState((prevState) => ({
      ...prevState,
      messages,
    })),
};

const chatSelectors = {
  useThreadId: () => useStore(store, (state) => state.threadId),

  useMessages: () => useStore(store, (state) => state.messages),

  useToolMessage: (toolCallId: string) =>
    useStore(store, (state) =>
      state.messages
        .filter((m) => m.role === "tool")
        .find((m) => m.toolCallId === toolCallId),
    ),
};

export { chatActions, chatSelectors };
