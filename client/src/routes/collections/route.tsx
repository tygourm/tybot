import { createFileRoute } from "@tanstack/react-router";

import { Collections } from "@/routes/collections/-components/organisms/collections";

const Route = createFileRoute("/collections")({ component: CollectionsRoute });

function CollectionsRoute() {
  return (
    <div className="flex h-full p-4">
      <Collections />
    </div>
  );
}

export { Route };
