import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createClient } from "@/lib/api";
import { fileToBase64 } from "@/lib/utils";

const rag = createClient("/rag");

type Collection = {
  id: string;
  name: string;
  modelName: string;
  chunkingStrategy: string;
  chunkSize: number;
  overlap: number;
};

const getCollections = async () => {
  const response = await rag.get<Collection[]>("/collections");
  return response.data;
};

const createCollection = async (name: Collection["name"]) => {
  const response = await rag.post<boolean>("/collections", { name });
  return response.data;
};
const deleteCollection = async (id: Collection["id"]) => {
  const response = await rag.delete(`/collections/${id}`);
  return response.data;
};

const ingestDocuments = async (payload: {
  files: File[];
  collectionId: Collection["id"];
}) => {
  const content = await Promise.all(
    payload.files.map(async (file) => ({
      filename: file.name,
      base64: (await fileToBase64(file)).split("base64,")[1] ?? "",
    })),
  );
  const response = await rag.post<boolean>(
    `/collections/${payload.collectionId}/documents`,
    content,
  );
  return response.data;
};

const collectionsKeys = {
  all: ["collections"] as const,
  lists: () => [...collectionsKeys.all, "list"] as const,
  detail: (id: Collection["id"]) => [...collectionsKeys.all, id] as const,
};

function useCollections() {
  return useQuery({
    queryKey: collectionsKeys.lists(),
    queryFn: getCollections,
  });
}

function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCollection,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: collectionsKeys.lists() }),
  });
}

function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: collectionsKeys.lists() }),
  });
}

function useIngestDocuments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ingestDocuments,
    onSuccess: (_, { collectionId }) =>
      qc.invalidateQueries({ queryKey: collectionsKeys.detail(collectionId) }),
  });
}

export {
  type Collection,
  useCollections,
  useCreateCollection,
  useDeleteCollection,
  useIngestDocuments,
};
