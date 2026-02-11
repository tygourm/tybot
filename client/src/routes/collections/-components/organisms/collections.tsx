import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createHttpClient } from "@/lib/api";

function Collections() {
  const client = createHttpClient();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: () => client.get<{ id: string; name: string }[]>("/collections"),
  });

  const createCollection = useMutation({
    mutationFn: (name: string) => client.post("/collections", { name }),
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: ["collections"] }),
  });

  const deleteCollection = useMutation({
    mutationFn: (id: string) => client.delete(`/collections/${id}`),
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: ["collections"] }),
  });

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  if (isLoading)
    return (
      <div className="flex size-full items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );

  return (
    <div className="flex size-full flex-col gap-4 p-4">
      <Button
        className="size-fit"
        onClick={() => createCollection.mutate(crypto.randomUUID())}
      >
        Create collection
      </Button>
      <div className="grid grid-cols-3 gap-4">
        {data?.data.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.name}</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                size={"sm"}
                className="w-full"
                variant={"outline"}
                onClick={() => deleteCollection.mutate(c.id)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { Collections };
