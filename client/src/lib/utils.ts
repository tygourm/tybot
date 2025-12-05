import type { UserMessage } from "@ag-ui/core";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const getUserMessageContent = (message: UserMessage) => {
  if (typeof message.content === "string") return message.content;
  return message.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("\n");
};

export { cn, getUserMessageContent };
