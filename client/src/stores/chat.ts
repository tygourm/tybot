import { type Message } from "@ag-ui/core";
import { Store, useStore } from "@tanstack/react-store";

type State = {
  messages: Message[];
  threadId: string | null;
};

const store = new Store<State>({
  messages: [],
  threadId: null,
});

const chatActions = {
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

  setThreadId: (threadId: string | null) =>
    store.setState((prevState) => ({
      ...prevState,
      threadId,
    })),
};

const chatSelectors = {
  useMessages: () => useStore(store, (state) => state.messages),
  useThreadId: () => useStore(store, (state) => state.threadId),
};

export { chatActions, chatSelectors };
