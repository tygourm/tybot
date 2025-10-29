import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Button onClick={() => toast.info("Hello, World!")}>Index</Button>
    </div>
  );
}

export { Route };
