import { useNavigate } from "@tanstack/react-router";
import { BotIcon, SidebarIcon, SquarePenIcon } from "lucide-react";
import { type ComponentProps, useRef } from "react";
import { useTranslation } from "react-i18next";

import { WithTooltip } from "@/components/atoms/with-tooltip";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useHover } from "@/hooks/use-hover";
import { useChat } from "@/states/chat";

function MainButton({
  variant = "ghost",
  size = "icon-sm",
  ...props
}: ComponentProps<typeof Button>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { open, toggleSidebar } = useSidebar();
  const ref = useRef<HTMLButtonElement>(null);
  const { abortRun, resetChatState } = useChat();
  const isHovered = useHover(ref);

  return (
    <WithTooltip
      tooltip={
        open ? t("main-button.new-thread") : t("main-button.open-sidebar")
      }
    >
      <Button
        ref={ref}
        size={size}
        variant={variant}
        onClick={
          open
            ? () => {
                abortRun();
                resetChatState();
                navigate({ to: "/threads" });
              }
            : toggleSidebar
        }
        {...props}
      >
        {isHovered ? open ? <SquarePenIcon /> : <SidebarIcon /> : <BotIcon />}
      </Button>
    </WithTooltip>
  );
}

export { MainButton };
