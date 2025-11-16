import { Bot, SquarePen } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { WithTooltip } from "@/components/atoms/with-tooltip";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";

function MainButton() {
  const { t } = useTranslation();
  const { chatActions } = useChat();
  const [hovered, setHovered] = useState(false);

  return (
    <WithTooltip content={t("main-button.tooltip")}>
      <Button
        size={"icon"}
        variant={"ghost"}
        onClick={chatActions.newChat}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered ? <SquarePen /> : <Bot />}
      </Button>
    </WithTooltip>
  );
}

export { MainButton };
