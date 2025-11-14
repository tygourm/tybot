import { createFileRoute } from "@tanstack/react-router";

import { Chat } from "@/components/organisms/chat";

const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <div className="flex justify-center">
      <div className="flex w-[60%] h-screen">
        <Chat />
      </div>
    </div>
  );
}

export { Route };
