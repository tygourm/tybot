import { createFileRoute } from "@tanstack/react-router";

import { Chat } from "@/components/organisms/chat";

const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <div className="flex h-full justify-center">
      <div className="flex w-full max-w-4xl">
        <Chat />
      </div>
    </div>
  );
}

export { Route };
