import { useStore } from "@tanstack/react-store";

import { actions } from "@/states/chat/actions";
import { selectors } from "@/states/chat/selectors";
import { store } from "@/states/chat/store";

const useChat = () => {
  const input = useStore(store, selectors.input);
  const running = useStore(store, selectors.running);
  const threadId = useStore(store, selectors.threadId);
  const messages = useStore(store, selectors.messages);
  const toolMessages = useStore(store, selectors.toolMessages);

  return { ...actions, input, running, threadId, messages, toolMessages };
};

export { useChat };
