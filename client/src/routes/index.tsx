import { Navigate, createFileRoute } from "@tanstack/react-router";

const Route = createFileRoute("/")({
  component: () => <Navigate to="/threads" replace />,
});

export { Route };
