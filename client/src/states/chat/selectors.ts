import { type ChatState } from "@/states/chat/store";

const input = (state: ChatState) => state.input;
const running = (state: ChatState) => state.running;
const threadId = (state: ChatState) => state.threadId;
const messages = (state: ChatState) => state.messages;
const toolMessages = (state: ChatState) =>
  messages(state).filter((m) => m.role === "tool");

export const selectors = { input, running, threadId, messages, toolMessages };
