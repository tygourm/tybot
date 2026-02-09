import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";

import { type CatalogObject, inferCatalogObjects } from "@/lib/data";
import { actions } from "@/models/chat/actions";
import { store } from "@/models/chat/store";

const useChat = () => {
  const mode = useStore(store, (state) => state.mode);
  const input = useStore(store, (state) => state.input);
  const running = useStore(store, (state) => state.running);
  const messages = useStore(store, (state) => state.messages);
  const threadId = useStore(store, (state) => state.threadId);

  const toolCallMessages = useMemo(
    () => messages.filter((m) => m.role === "tool"),
    [messages],
  );

  const toolCallIdToCatalogObjects = useMemo(
    () =>
      toolCallMessages.reduce(
        (acc, m) => {
          const objects = inferCatalogObjects(m.content);
          if (objects) acc[m.toolCallId] = objects;
          return acc;
        },
        {} as Record<string, CatalogObject[]>,
      ),
    [toolCallMessages],
  );

  return {
    mode,
    input,
    running,
    messages,
    threadId,
    toolCallMessages,
    toolCallIdToCatalogObjects,
    ...actions,
  };
};

export { useChat };
