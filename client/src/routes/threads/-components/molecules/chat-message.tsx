import type { AssistantMessage, UserMessage } from "@ag-ui/core";
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
import { safeParseJSON } from "@/lib/utils";
import { useChat } from "@/states/chat";

const useFeedback = () => {
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const updateFeedback = (value: boolean) =>
    setFeedback(value === feedback ? null : value);
  return { feedback, updateFeedback };
};

function UserChatMessage({ message }: { message: UserMessage }) {
  const content =
    typeof message.content === "string"
      ? message.content
      : message.content.find((c) => c.type === "text")?.text || "";
  const { t } = useTranslation();
  const [copy, isCopied] = useCopyToClipboard();
  const [edit, toggleEdit, setEdit] = useToggle();
  const [editContent, setEditContent] = useState(content);
  const { running, updateMessage, deleteMessage } = useChat();

  return (
    <>
      {edit ? (
        <>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="flex flex-row justify-end gap-2">
            <Button
              variant={"secondary"}
              onClick={() => {
                setEdit(false);
                setEditContent(content);
              }}
            >
              {t("chat-message.cancel")}
            </Button>
            <Button
              disabled={
                editContent.trim().length === 0 ||
                editContent.trim() === content
              }
              onClick={() => {
                setEdit(false);
                updateMessage(message.id, editContent.trim());
              }}
            >
              {t("chat-message.confirm")}
            </Button>
          </div>
        </>
      ) : (
        <Message className="max-w-full" from="user">
          <MessageContent>
            <MessageResponse>{content}</MessageResponse>
          </MessageContent>
        </Message>
      )}
      <MessageActions className="justify-end">
        <MessageAction
          disabled={running}
          tooltip={t("chat-message.edit")}
          onClick={() => {
            toggleEdit();
            setEditContent(content);
          }}
        >
          <PencilIcon />
        </MessageAction>
        <MessageAction
          disabled={running}
          tooltip={t("chat-message.delete")}
          onClick={() => deleteMessage(message.id)}
        >
          <TrashIcon />
        </MessageAction>
        <MessageAction
          onClick={() => copy(content)}
          tooltip={t("chat-message.copy")}
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
        </MessageAction>
      </MessageActions>
    </>
  );
}

function AssistantChatMessage({ message }: { message: AssistantMessage }) {
  if (message.content && message.content.trim().length > 0)
    return <TextAssistantChatMessage message={message} />;
  if (message.toolCalls && message.toolCalls.length > 0)
    return <ToolAssistantChatMessage message={message} />;
  return null;
}

function TextAssistantChatMessage({ message }: { message: AssistantMessage }) {
  const { t } = useTranslation();
  const [copy, isCopied] = useCopyToClipboard();
  const { feedback, updateFeedback } = useFeedback();
  const { running, regenerateMessage } = useChat();

  return (
    <>
      <Message className="max-w-full" from="assistant">
        <MessageContent>
          <MessageResponse>{message.content}</MessageResponse>
        </MessageContent>
      </Message>
      <MessageActions>
        <MessageAction
          disabled={running}
          tooltip={t("chat-message.positive")}
          onClick={() => updateFeedback(true)}
        >
          <ThumbsUpIcon fill={feedback === true ? "currentColor" : "none"} />
        </MessageAction>
        <MessageAction
          disabled={running}
          tooltip={t("chat-message.negative")}
          onClick={() => updateFeedback(false)}
        >
          <ThumbsDownIcon fill={feedback === false ? "currentColor" : "none"} />
        </MessageAction>
        <MessageAction
          disabled={running}
          tooltip={t("chat-message.regenerate")}
          onClick={() => regenerateMessage(message.id)}
        >
          <RefreshCcwIcon />
        </MessageAction>
        <MessageAction
          tooltip={t("chat-message.copy")}
          onClick={() => copy(message.content || "")}
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
        </MessageAction>
      </MessageActions>
    </>
  );
}

function ToolAssistantChatMessage({ message }: { message: AssistantMessage }) {
  const { toolMessages } = useChat();

  return (
    message.toolCalls &&
    message.toolCalls.map((tc) => {
      const tcr = toolMessages.find((tm) => tm.toolCallId === tc.id);
      return (
        <Tool key={tc.id} className="mb-0">
          <ToolHeader
            type={`tool-${tc.function.name}`}
            state={
              tcr
                ? tcr.content
                  ? "output-available"
                  : "output-error"
                : tc.function.arguments
                  ? "input-available"
                  : "input-streaming"
            }
          />
          <ToolContent>
            {tc.function.arguments && (
              <ToolInput
                input={safeParseJSON(
                  tc.function.arguments,
                  tc.function.arguments,
                )}
              />
            )}
            {tcr && (tcr.content || tcr.error) && (
              <ToolOutput
                errorText={tcr.error}
                output={safeParseJSON(tcr.content, tcr.content)}
              />
            )}
          </ToolContent>
        </Tool>
      );
    })
  );
}

export { AssistantChatMessage, UserChatMessage };
