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
    <SidebarHeader className="flex-row">
      <MainButton />
      {open && (
        <div className="flex flex-1 justify-end">
          <ThemeMenu />
          <WithTooltip tooltip={t("sidebar.close-sidebar")}>
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
