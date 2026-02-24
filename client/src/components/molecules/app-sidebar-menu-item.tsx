import { useLocation, useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { FileRoutesByTo } from "@/routeTree.gen";

function AppSidebarMenuItem({
  label,
  icon: Icon,
  path,
}: {
  label: string;
  icon: LucideIcon;
  path: keyof FileRoutesByTo;
}) {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={label}
        isActive={path === pathname}
        onClick={() => navigate({ to: path })}
      >
        <Icon />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export { AppSidebarMenuItem };
