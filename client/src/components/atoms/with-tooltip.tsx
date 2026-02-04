import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function WithTooltip({
  tooltip,
  children,
}: {
  tooltip: string;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipContent>{tooltip}</TooltipContent>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
}

export { WithTooltip };
