import { createFileRoute, Navigate } from "@tanstack/react-router";

const Route = createFileRoute("/")({ component: IndexRoute });

function IndexRoute() {
  return <Navigate to="/threads" />;
}

export { Route };
