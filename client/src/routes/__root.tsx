import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { AppSidebar } from "@/components/organisms/app-sidebar";
import { useTheme } from "@/components/providers/theme";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

const Route = createRootRoute({ component: Root });

function Root() {
  const { theme } = useTheme();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
      <Toaster theme={theme} richColors />
    </SidebarProvider>
  );
}

export { Route };
