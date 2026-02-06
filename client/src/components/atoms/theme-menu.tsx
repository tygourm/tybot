import { MoonIcon, SunIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

import { WithTooltip } from "@/components/atoms/with-tooltip";
import { useTheme } from "@/components/providers/theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ThemeMenu({
  variant = "ghost",
  size = "icon-sm",
  ...props
}: ComponentProps<typeof Button>) {
  const { t } = useTranslation();
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <WithTooltip tooltip={t("theme-menu.tooltip")}>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} {...props}>
            <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>
        </DropdownMenuTrigger>
      </WithTooltip>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t("theme-menu.light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t("theme-menu.dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t("theme-menu.system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ThemeMenu };
