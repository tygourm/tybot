import { ThemeMenu } from "@/components/atoms/theme-menu";
import { SidebarHeader } from "@/components/ui/sidebar";

function RightSidebarHeader() {
  return (
    <SidebarHeader>
      <ThemeMenu />
    </SidebarHeader>
  );
}

export { RightSidebarHeader };
