import reactLogo from "/react.svg";
import viteLogo from "/vite.svg";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { greetingsApi } from "@/api/greetings";
import { ThemeMenu } from "@/components/atoms/theme-menu";
import { greetingsActions, useGreetings } from "@/stores/greetings";

const Route = createFileRoute("/")({ component: Index });

function Index() {
  const greetings = useGreetings();
  const { data, isPending, error } = useQuery({
    queryKey: ["greetings"],
    queryFn: greetingsApi.getGreetings,
  });

  useEffect(() => {
    if (data) greetingsActions.setGreetingsState({ greetings: data });
  }, [data]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="flex gap-4">
        <img src={viteLogo} className="size-8" />
        <ThemeMenu />
        <img src={reactLogo} className="size-8" />
      </div>
      {isPending && <p>Loading...</p>}
      {greetings && <p>{greetings}</p>}
      {error && <p>{error.message}</p>}
    </div>
  );
}

export { Route };
