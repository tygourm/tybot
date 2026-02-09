import { createFileRoute } from "@tanstack/react-router";

import { Collections } from "@/routes/collections/-components/organisms/collections";

const Route = createFileRoute("/collections")({
  component: () => <Collections />,
});

export { Route };
