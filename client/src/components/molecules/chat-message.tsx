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
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/hooks/use-chat";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { getUserMessageContent } from "@/lib/utils";

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
  const [content, setContent] = useState(getUserMessageContent(message));
  const [editing, setEditing] = useState(false);
  const [copy, isCopied] = useCopyToClipboard();
  const { chatActions, chatSelectors } = useChat();
  const running = chatSelectors.useRunning();

  if (typeof message.content !== "string") return null;

  return (
    <Message className="flex-col p-0" from="user">
      {editing ? (
        <div className="flex flex-col gap-2 w-full">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant={"outline"}
              onClick={() => {
                setEditing(false);
                setContent(getUserMessageContent(message));
              }}
            >
              {t("chat-message.cancel")}
            </Button>
            <Button
              disabled={running || content.trim() === ""}
              onClick={() => {
                setEditing(false);
                chatActions.updateMessage(message.id, content);
              }}
            >
              {t("chat-message.confirm")}
            </Button>
          </div>
        </div>
      ) : (
        <MessageContent className="">{message.content}</MessageContent>
      )}
      <Actions>
        <Action
          disabled={running}
          tooltip={t("chat-message.update")}
          onClick={() => setEditing(!editing)}
        >
          <Pencil />
        </Action>
        <Action
          disabled={running}
          tooltip={t("chat-message.delete")}
          onClick={() => chatActions.deleteMessage(message.id)}
        >
          <Trash />
        </Action>
        <Action
          tooltip={t("chat-message.copy")}
          onClick={() => copy(getUserMessageContent(message))}
        >
          {isCopied ? <Check /> : <Copy />}
        </Action>
      </Actions>
    </Message>
  );
}

function AssistantMessage({ message }: { message: TAssistantMessage }) {
  const { t } = useTranslation();
  const [copy, isCopied] = useCopyToClipboard();
  const { feedback, onFeedback } = useFeedback();
  const { chatActions, chatSelectors } = useChat();
  const running = chatSelectors.useRunning();

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
        <Action
          disabled={running}
          tooltip={t("chat-message.regenerate")}
          onClick={() => chatActions.regenerateMessage(message.id)}
        >
          <RefreshCcw />
        </Action>
        <Action
          tooltip={t("chat-message.copy")}
          onClick={() => message.content && copy(message.content)}
        >
          {isCopied ? <Check /> : <Copy />}
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
    <Tool key={toolCall.id}>
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
