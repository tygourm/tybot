import "@/index.css";
import "@/lib/i18n";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, Navigate, RouterProvider } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { toast } from "sonner";

import { ThemeProvider } from "@/components/providers/theme";
import { routeTree } from "@/routeTree.gen";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number(import.meta.env.QUERIES_STALE_TIME_MINUTES) * 60 * 1000,
      retry: (failureCount, error) => {
        if (
          failureCount >= Number(import.meta.env.QUERIES_MAX_RETRIES) - 1 ||
          (error instanceof AxiosError && (error.response?.status ?? 0) < 500)
        ) {
          // Don't retry after max retries, network errors or client errors
          toast.error(error.message);
          return false;
        }
        // Else retry with exponential backoff
        return true;
      },
    },
    mutations: {
      retry: (_, error) => {
        // Mutations should not be retried
        toast.error(error.message);
        return false;
      },
    },
  },
});
const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <Navigate to="/" replace />,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
