import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createHttpClient } from "@/api/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Collections() {
  const client = createHttpClient();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: () => client.get<{ id: string; name: string }[]>("/collections"),
  });

  const createCollection = useMutation({
    mutationFn: ({ name }: { name: string }) =>
      client.post("/collections", { name }),
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: ["collections"] }),
  });

  const deleteCollection = useMutation({
    mutationFn: ({ id }: { id: string }) => client.delete(`/collections/${id}`),
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: ["collections"] }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex size-full flex-col gap-2 p-2">
      <Button
        className="size-fit"
        onClick={() => createCollection.mutate({ name: crypto.randomUUID() })}
      >
        Create collection
      </Button>
      <div className="grid grid-cols-3 gap-2">
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
                onClick={() => deleteCollection.mutate({ id: c.id })}
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
