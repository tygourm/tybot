import type { Message } from "@ag-ui/core";
import { Store } from "@tanstack/react-store";

import type { PromptInputMessage } from "@/components/ui/ai-elements/prompt-input";

type ChatState = {
  mode: "dashboard" | "fullscreen";
  input: PromptInputMessage;
  messages: Message[];
  running: boolean;
  threadId?: string;
  abortController?: AbortController;
};

const initialState: ChatState = {
  mode: "fullscreen",
  input: { text: "", files: [] },
  messages: [],
  running: false,
};

const store = new Store<ChatState>(initialState);

export { type ChatState, initialState, store };
