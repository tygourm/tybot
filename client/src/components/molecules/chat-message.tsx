import type {
  AssistantMessage as TAssistantMessage,
  Message as TMessage,
  ToolCall as TToolCall,
  UserMessage as TUserMessage,
} from "@ag-ui/core";
import {
  Check,
  Copy,
  Pencil,
  RefreshCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Action, Actions } from "@/components/ui/shadcn-io/ai/actions";
import { Message, MessageContent } from "@/components/ui/shadcn-io/ai/message";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ui/shadcn-io/ai/tool";
import { useChat } from "@/hooks/use-chat";

const useCopy = (content: string, timeout: number = 2000) => {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    if (copied) return;
    setCopied(true);
    await navigator.clipboard.writeText(content);
    const id = setTimeout(() => setCopied(false), timeout);
    return () => clearTimeout(id);
  };
  return { copied, onCopy };
};

const useFeedback = () => {
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const onFeedback = (value: boolean) => {
    setFeedback((prev) => (prev === value ? null : value));
  };
  return { feedback, onFeedback };
};

function ChatMessage({ message }: { message: TMessage }) {
  return (
    <>
      {message.role === "user" && <UserMessage message={message} />}
      {message.role === "assistant" && (
        <>
          <AssistantMessage message={message} />
          {(message.toolCalls?.length ?? 0) > 0 &&
            message.toolCalls?.map((tc) => (
              <ToolCallMessage key={tc.id} toolCall={tc} />
            ))}
        </>
      )}
    </>
  );
}

function UserMessage({ message }: { message: TUserMessage }) {
  const { t } = useTranslation();
  const { copied, onCopy } = useCopy(
    typeof message.content === "string" ? message.content : "",
  );

  if (typeof message.content !== "string") return null;

  return (
    <Message className="flex-col p-0" from="user">
      <MessageContent className="">{message.content}</MessageContent>
      <Actions>
        <Action tooltip={t("chat-message.edit")}>
          <Pencil />
        </Action>
        <Action tooltip={t("chat-message.copy")} onClick={onCopy}>
          {copied ? <Check /> : <Copy />}
        </Action>
      </Actions>
    </Message>
  );
}

function AssistantMessage({ message }: { message: TAssistantMessage }) {
  const { t } = useTranslation();
  const { copied, onCopy } = useCopy(
    typeof message.content === "string" ? message.content : "",
  );
  const { feedback, onFeedback } = useFeedback();

  if (typeof message.content !== "string" || message.content.length === 0)
    return null;

  return (
    <Message className="flex-col items-start p-0" from="assistant">
      <MessageContent>
        <Response>{message.content}</Response>
      </MessageContent>
      <Actions>
        <Action
          onClick={() => onFeedback(true)}
          tooltip={t("chat-message.positive")}
        >
          <ThumbsUp fill={feedback === true ? "currentColor" : "none"} />
        </Action>
        <Action
          onClick={() => onFeedback(false)}
          tooltip={t("chat-message.negative")}
        >
          <ThumbsDown fill={feedback === false ? "currentColor" : "none"} />
        </Action>
        <Action tooltip={t("chat-message.regenerate")}>
          <RefreshCcw />
        </Action>
        <Action tooltip={t("chat-message.copy")} onClick={onCopy}>
          {copied ? <Check /> : <Copy />}
        </Action>
      </Actions>
    </Message>
  );
}

function ToolCallMessage({ toolCall }: { toolCall: TToolCall }) {
  const { chatSelectors } = useChat();
  const input = (() => {
    try {
      return JSON.parse(toolCall.function.arguments);
    } catch {
      return toolCall.function.arguments;
    }
  })();
  const output = chatSelectors.useToolMessage(toolCall.id);

  return (
    <Tool key={toolCall.id} defaultOpen={true}>
      <ToolHeader
        className="group"
        type={`tool-${toolCall.function.name}`}
        state={
          output
            ? output.error
              ? "output-error"
              : "output-available"
            : "input-available"
        }
      />
      <ToolContent>
        <ToolInput input={input} />
        {output && (
          <ToolOutput output={output.content} errorText={output.error} />
        )}
      </ToolContent>
    </Tool>
  );
}

export { ChatMessage };
