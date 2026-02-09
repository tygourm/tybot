import { createFileRoute } from "@tanstack/react-router";

import { useChat } from "@/models/chat";
import { Chat } from "@/routes/threads/-components/organisms/chat";
import { MapWidget } from "@/routes/threads/-dashboard/widgets/map";

const Route = createFileRoute("/threads")({ component: ThreadsRoute });

function ThreadsRoute() {
  const { mode } = useChat();

  return (
    <div className="flex h-full">
      {mode === "fullscreen" ? (
        <Chat />
      ) : (
        <>
          <MapWidget />
          <div className="bg-sidebar text-sidebar-foreground flex max-w-[16rem] min-w-[16rem]">
            <Chat />
          </div>
        </>
      )}
    </div>
  );
}

export { Route };
