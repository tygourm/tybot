import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { LeftSidebar } from "@/components/organisms/left-sidebar";
import { RightSidebar } from "@/components/organisms/right-sidebar";
import { useTheme } from "@/components/providers/theme";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

const Route = createRootRoute({ component: Root });

function Root() {
  const { theme } = useTheme();

  return (
    <>
      <SidebarProvider>
        <div className="flex w-full h-screen">
          <LeftSidebar />
          <main className="flex-1 h-full overflow-auto">
            <Outlet />
          </main>
          <RightSidebar />
        </div>
      </SidebarProvider>
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
      <Toaster theme={theme} richColors />
    </>
  );
}

export { Route };
