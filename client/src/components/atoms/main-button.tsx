import { useNavigate } from "@tanstack/react-router";
import { BotIcon, PenSquareIcon, SidebarIcon } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { WithTooltip } from "@/components/atoms/with-tooltip";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { useHover } from "@/hooks/use-hover";
import { useChat } from "@/models/chat";

function MainButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { open, toggleSidebar } = useSidebar();
  const { resetChatState, abortRun } = useChat();

  const ref = useRef<HTMLButtonElement>(null);
  const isHovered = useHover(ref);

  return (
    <WithTooltip
      side={open ? "top" : "right"}
      tooltip={open ? t("sidebar.new-thread") : t("sidebar.open-sidebar")}
    >
      {open ? (
        <SidebarMenuButton
          ref={ref}
          className="w-fit"
          onClick={() => {
            abortRun();
            resetChatState();
            navigate({ to: "/threads" });
          }}
        >
          {isHovered ? <PenSquareIcon /> : <BotIcon />}
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton ref={ref} className="w-fit" onClick={toggleSidebar}>
          {isHovered ? <SidebarIcon /> : <BotIcon />}
        </SidebarMenuButton>
      )}
    </WithTooltip>
  );
}

export { MainButton };
