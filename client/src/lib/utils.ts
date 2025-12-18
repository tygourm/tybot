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

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const d = decimals < 0 ? 0 : decimals;
  const s = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(d)) + ` ${s[i]}`;
};

const fileToBase64 = async (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string")
        resolve(reader.result.split(",")[1]);
      else reject(new Error("Failed to convert file to base64"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export { cn, fileToBase64, formatBytes, getUserMessageContent };
