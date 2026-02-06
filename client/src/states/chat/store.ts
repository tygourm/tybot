import { type Message } from "@ag-ui/core";
import { Store } from "@tanstack/react-store";

import type { PromptInputMessage } from "@/components/ui/ai-elements/prompt-input";

type ChatState = {
  input: PromptInputMessage;
  messages: Message[];
  running: boolean;
  threadId?: string;
  abortController?: AbortController;
};

const initialState: ChatState = {
  input: { text: "", files: [] },
  running: false,
  messages: [],
};

const store = new Store<ChatState>(initialState);

export { initialState, store, type ChatState };
