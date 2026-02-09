import type { AssistantMessage, ToolCall, UserMessage } from "@ag-ui/core";
import {
  CheckIcon,
  CopyIcon,
  PencilIcon,
  RefreshCcwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ui/ai-elements/message";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ui/ai-elements/tool";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useToggle } from "@/hooks/use-toggle";
import { extractUserMessageContent, safeParseJSON } from "@/lib/utils";
import { useChat } from "@/models/chat";
import { Thumbnail } from "@/routes/threads/-components/atoms/thumbnail";

const useFeedback = () => {
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const onFeedback = (value: boolean) => {
    setFeedback(feedback === value ? null : value);
  };
  return { feedback, onFeedback };
};

function UserChatMessage({
  index,
  message,
}: {
  index: number;
  message: UserMessage;
}) {
  const { t } = useTranslation();
  const [editing, toggleEditing] = useToggle();
  const [content, setContent] = useState(extractUserMessageContent(message));
  const [copy, isCopied] = useCopyToClipboard();
  const { running, updateMessage, deleteMessage } = useChat();

  return (
    <Message from="user" className="max-w-full">
      {editing ? (
        <>
          <div className="flex w-full flex-col gap-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  toggleEditing();
                  setContent(extractUserMessageContent(message));
                }}
              >
                {t("actions.cancel")}
              </Button>
              <Button
                disabled={running || !content.trim()}
                onClick={() => {
                  toggleEditing();
                  updateMessage(message.id, content);
                }}
              >
                {t("actions.confirm")}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <MessageContent className="group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground">
          {content}
        </MessageContent>
      )}
      <MessageActions className="justify-end">
        <MessageAction
          disabled={running}
          tooltip={t("actions.update")}
          onClick={() => toggleEditing()}
        >
          <PencilIcon />
        </MessageAction>
        {index !== 0 && (
          <MessageAction
            disabled={running}
            tooltip={t("actions.delete")}
            onClick={() => deleteMessage(message.id)}
          >
            <TrashIcon />
          </MessageAction>
        )}
        <MessageAction
          tooltip={t("actions.copy")}
          onClick={() => copy(content)}
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
        </MessageAction>
      </MessageActions>
    </Message>
  );
}

function AssistantChatMessage({
  index,
  message,
}: {
  index: number;
  message: AssistantMessage;
}) {
  const { t } = useTranslation();
  const content = message.content || "";
  const [copy, isCopied] = useCopyToClipboard();
  const { feedback, onFeedback } = useFeedback();
  const { messages, running, regenerateMessage } = useChat();

  const showActions =
    (index === messages.length - 1 && !running) ||
    messages[index + 1]?.role === "user";

  return (
    <Message from="assistant" className="max-w-full">
      {message.toolCalls &&
        message.toolCalls.length > 0 &&
        message.toolCalls.map((tc) => (
          <ToolCallMessage key={tc.id} toolCall={tc} />
        ))}
      {content.trim().length > 0 && (
        <>
          <MessageContent>
            <MessageResponse
              controls={{
                mermaid: {
                  copy: true,
                  download: true,
                  fullscreen: true,
                },
              }}
            >
              {content}
            </MessageResponse>
          </MessageContent>
          {showActions && (
            <MessageActions>
              <MessageAction
                disabled={running}
                onClick={() => onFeedback(true)}
                tooltip={t("chat-message.positive")}
              >
                <ThumbsUpIcon
                  fill={feedback === true ? "currentColor" : "none"}
                />
              </MessageAction>
              <MessageAction
                disabled={running}
                onClick={() => onFeedback(false)}
                tooltip={t("chat-message.negative")}
              >
                <ThumbsDownIcon
                  fill={feedback === false ? "currentColor" : "none"}
                />
              </MessageAction>
              <MessageAction
                disabled={running}
                tooltip={t("actions.regenerate")}
                onClick={() => regenerateMessage(message.id)}
              >
                <RefreshCcwIcon />
              </MessageAction>
              <MessageAction
                tooltip={t("actions.copy")}
                onClick={() => copy(content)}
              >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
              </MessageAction>
            </MessageActions>
          )}
        </>
      )}
    </Message>
  );
}

function ToolCallMessage({ toolCall }: { toolCall: ToolCall }) {
  const { toolCallMessages, toolCallIdToCatalogObjects } = useChat();
  const data = toolCallIdToCatalogObjects[toolCall.id];
  const result = toolCallMessages.find((m) => m.toolCallId === toolCall.id);

  return (
    <>
      <Tool className="mb-0">
        <ToolHeader
          className="overflow-x-hidden"
          type={`tool-${toolCall.function.name}`}
          state={
            result
              ? result.content
                ? "output-available"
                : "output-error"
              : toolCall.function.arguments
                ? "input-available"
                : "input-streaming"
          }
        />
        <ToolContent>
          <ToolInput
            input={safeParseJSON(
              toolCall.function.arguments,
              toolCall.function.arguments,
            )}
          />
          {result && (
            <ToolOutput
              errorText={result.error}
              output={safeParseJSON(result.content, result.content)}
            />
          )}
        </ToolContent>
      </Tool>
      {data && data.length > 0 && (
        <div className="flex flex-row gap-2 overflow-auto pb-3">
          {data.map((o) => (
            <Thumbnail key={o.id} object={o} />
          ))}
        </div>
      )}
    </>
  );
}

export { AssistantChatMessage, UserChatMessage };
