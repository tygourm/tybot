import type { UserMessage } from "@ag-ui/core";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const extractUserMessageContent = (message: UserMessage) => {
  if (typeof message.content === "string") return message.content;
  return message.content.find((m) => m.type === "text")?.text ?? "";
};

const safeParseJSON = <T = unknown>(value: string, defaultValue?: T) => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = (error) => reject(error);
    reader.onload = () => resolve(reader.result as string);
  });
};

export { cn, extractUserMessageContent, fileToBase64, safeParseJSON };
