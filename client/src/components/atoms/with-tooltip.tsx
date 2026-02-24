import type { ComponentProps } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function WithTooltip({
  tooltip,
  children,
  ...props
}: {
  tooltip: string;
  children: React.ReactNode;
} & ComponentProps<typeof TooltipContent>) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent {...props}>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { WithTooltip };
