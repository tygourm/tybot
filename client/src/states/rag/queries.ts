import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createHttpClient } from "@/lib/api";

const client = createHttpClient();

const useCollections = () =>
  useQuery({
    queryKey: ["collections"],
    queryFn: () => client.get<{ id: string; name: string }[]>("/collections"),
  });

const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => client.post("/collections", { name }),
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: ["collections"] }),
  });
};

const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => client.delete(`/collections/${id}`),
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: ["collections"] }),
  });
};

export { useCollections, useCreateCollection, useDeleteCollection };
