import { useLocation, useNavigate } from "@tanstack/react-router";
import { type LucideIcon } from "lucide-react";

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
  const pathName = useLocation().pathname;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={label}
        isActive={pathName === path}
        onClick={() => navigate({ to: path })}
      >
        <div>
          <Icon />
          <span>{label}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export { AppSidebarMenuItem };
