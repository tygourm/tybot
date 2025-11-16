import type { Message as TMessage } from "@ag-ui/core";

import { Message, MessageContent } from "@/components/ui/shadcn-io/ai/message";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ui/shadcn-io/ai/tool";
import { chatSelectors } from "@/stores/chat";

type TAssistantMessage = Extract<TMessage, { role: "assistant" }>;
type TToolCall = TToolCalls extends Array<infer U> ? U : never;
type TToolCalls = NonNullable<TAssistantMessage["toolCalls"]>;
type TUserMessage = Extract<TMessage, { role: "user" }>;

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
  if (typeof message.content !== "string") return null;

  return (
    <Message className="p-0 my-4" from="user">
      <MessageContent>{message.content}</MessageContent>
    </Message>
  );
}

function AssistantMessage({ message }: { message: TAssistantMessage }) {
  if (typeof message.content !== "string" || message.content.length === 0)
    return null;

  return (
    <>
      <Message className="p-0 my-4" from="assistant">
        <MessageContent>
          <Response>{message.content}</Response>
        </MessageContent>
      </Message>
    </>
  );
}

function ToolCallMessage({ toolCall }: { toolCall: TToolCall }) {
  const input = (() => {
    try {
      return JSON.parse(toolCall.function.arguments);
    } catch {
      return toolCall.function.arguments;
    }
  })();
  const output = chatSelectors.useToolMessage(toolCall.id);

  return (
    <Tool key={toolCall.id} className="my-4" defaultOpen={true}>
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
