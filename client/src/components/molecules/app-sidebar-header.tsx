import { SidebarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { MainButton } from "@/components/atoms/main-button";
import { ThemeMenu } from "@/components/atoms/theme-menu";
import { WithTooltip } from "@/components/atoms/with-tooltip";
import { Button } from "@/components/ui/button";
import { SidebarHeader, useSidebar } from "@/components/ui/sidebar";

function AppSidebarHeader() {
  const { t } = useTranslation();
  const { open, toggleSidebar } = useSidebar();

  return (
    <SidebarHeader className="flex-row justify-between">
      <MainButton />
      {open && (
        <div className="flex flex-row">
          <ThemeMenu />
          <WithTooltip tooltip={t("app-sidebar-header.close-sidebar")}>
            <Button variant="ghost" size="icon-sm" onClick={toggleSidebar}>
              <SidebarIcon />
            </Button>
          </WithTooltip>
        </div>
      )}
    </SidebarHeader>
  );
}

export { AppSidebarHeader };
