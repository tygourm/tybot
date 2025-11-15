import { Bot, SquarePen } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { WithTooltip } from "@/components/atoms/with-tooltip";
import { Button } from "@/components/ui/button";

function MainButton() {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);

  return (
    <WithTooltip content={t("main-button.tooltip")}>
      <Button
        size={"icon"}
        variant={"ghost"}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => toast.warning("Not implemented yet")}
      >
        {hovered ? <SquarePen /> : <Bot />}
      </Button>
    </WithTooltip>
  );
}

export { MainButton };
