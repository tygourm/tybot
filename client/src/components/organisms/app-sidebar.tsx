import { DatabaseIcon, MessagesSquareIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AppSidebarHeader } from "@/components/molecules/app-sidebar-header";
import { AppSidebarMenuItem } from "@/components/molecules/app-sidebar-menu-item";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
} from "@/components/ui/sidebar";

function AppSidebar() {
  const { t } = useTranslation();

  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <AppSidebarMenuItem
              path="/threads"
              icon={MessagesSquareIcon}
              label={t("app-sidebar.threads")}
            />
            <AppSidebarMenuItem
              path="/collections"
              icon={DatabaseIcon}
              label={t("app-sidebar.collections")}
            />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export { AppSidebar };
