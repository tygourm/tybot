import type { Message as IMessage } from "@ag-ui/core";

import { Message, MessageContent } from "@/components/ui/shadcn-io/ai/message";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
} from "@/components/ui/shadcn-io/ai/tool";

function ChatMessage({ message }: { message: IMessage }) {
  return (
    <>
      {message.role === "user" && typeof message.content === "string" && (
        <Message className="p-0 mb-4" from="user">
          <MessageContent>{message.content}</MessageContent>
        </Message>
      )}
      {message.role === "assistant" && (message.content?.length ?? 0) > 0 && (
        <Message className="p-0 mb-4" from="assistant">
          <MessageContent>
            <Response>{message.content}</Response>
          </MessageContent>
        </Message>
      )}
      {message.role === "assistant" &&
        (message.toolCalls?.length ?? 0) > 0 &&
        message.toolCalls?.map((tc) => {
          const input = (() => {
            try {
              return JSON.parse(tc.function.arguments);
            } catch {
              return tc.function.arguments;
            }
          })();

          return (
            <Tool key={tc.id}>
              <ToolHeader
                className="group"
                state={"input-available"}
                type={`tool-${tc.function.name}`}
              />
              <ToolContent>
                <ToolInput input={input} />
              </ToolContent>
            </Tool>
          );
        })}
    </>
  );
}

export { ChatMessage };
