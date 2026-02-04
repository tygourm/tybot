import { createFileRoute } from "@tanstack/react-router";

import { Chat } from "@/routes/threads/-components/organisms/chat";

const Route = createFileRoute("/threads")({ component: () => <Chat /> });

export { Route };
