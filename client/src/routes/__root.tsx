import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { AppSidebar } from "@/components/organisms/app-sidebar";
import { useResolvedTheme } from "@/components/providers/theme";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

const Route = createRootRoute({ component: RootRoute });

function RootRoute() {
  const theme = useResolvedTheme();

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="h-screen flex-1">
          <Outlet />
        </main>
      </SidebarProvider>
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
      <Toaster theme={theme} richColors />
    </>
  );
}

export { Route };
