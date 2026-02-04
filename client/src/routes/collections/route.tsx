import { createFileRoute } from "@tanstack/react-router";

const Route = createFileRoute("/collections")({
  component: () => <div>Hello "/collections"!</div>,
});

export { Route };
