"use client";

import type { ToolUIPart } from "ai";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  WrenchIcon,
  XCircleIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CodeBlock,
  CodeBlockCopyButton,
} from "@/components/ui/shadcn-io/ai/code-block";
import { cn } from "@/lib/utils";

export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    // className={cn("not-prose mb-4 w-full rounded-md border", className)}
    className={cn("not-prose mb-4 w-full", className)}
    {...props}
  />
);

export type ToolHeaderProps = {
  type: ToolUIPart["type"];
  state: ToolUIPart["state"];
  className?: string;
};

const getStatusBadge = (
  status: ToolUIPart["state"],
  labels: Record<ToolUIPart["state"], ReactNode>,
) => {
  const icons = {
    "input-streaming": <CircleIcon className="size-4" />,
    "input-available": <ClockIcon className="size-4 animate-pulse" />,
    "output-available": <CheckCircleIcon className="size-4 text-green-600" />,
    "output-error": <XCircleIcon className="size-4 text-red-600" />,
  } as const;

  return (
    <Badge className="rounded-full text-xs" variant="secondary">
      {icons[status]}
      {labels[status]}
    </Badge>
  );
};

export const ToolHeader = ({
  className,
  type,
  state,
  ...props
}: ToolHeaderProps) => {
  const { t } = useTranslation();
  const labels = {
    "input-streaming": t("tool.input-streaming"),
    "input-available": t("tool.input-available"),
    "output-available": t("tool.output-available"),
    "output-error": t("tool.output-error"),
  } as const;

  return (
    <CollapsibleTrigger
      className={cn(
        // "flex w-full items-center justify-between gap-4 p-3",
        "flex w-full items-center justify-between gap-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <WrenchIcon className="size-4 text-muted-foreground" />
        <span className="font-medium text-sm">{type}</span>
        {getStatusBadge(state, labels)}
      </div>
      <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
  );
};

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...props}
  />
);

export type ToolInputProps = ComponentProps<"div"> & {
  input: ToolUIPart["input"];
};

export const ToolInput = ({ className, input, ...props }: ToolInputProps) => {
  const { t } = useTranslation();

  return (
    // <div className={cn("space-y-2 overflow-hidden p-4", className)} {...props}>
    <div className={cn("space-y-2 overflow-hidden py-2", className)} {...props}>
      <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {t("tool.input")}
      </h4>
      <div className="rounded-md bg-muted/50">
        {/* <CodeBlock code={JSON.stringify(input, null, 2)} language="json" /> */}
        <CodeBlock
          code={JSON.stringify(input, null, 2)}
          language="json"
          className="border-none bg-secondary"
        >
          <CodeBlockCopyButton />
        </CodeBlock>
      </div>
    </div>
  );
};

export type ToolOutputProps = ComponentProps<"div"> & {
  output: ReactNode;
  errorText: ToolUIPart["errorText"];
};

export const ToolOutput = ({
  className,
  output,
  errorText,
  ...props
}: ToolOutputProps) => {
  const { t } = useTranslation();

  if (!(output || errorText)) {
    return null;
  }

  return (
    // <div className={cn("space-y-2 p-4", className)} {...props}>
    <div className={cn("space-y-2", className)} {...props}>
      <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {errorText ? t("tool.error") : t("tool.result")}
      </h4>
      <div
        className={cn(
          // "overflow-x-auto rounded-md text-xs [&_table]:w-full",
          "overflow-x-auto rounded-md text-xs [&_table]:w-full p-4",
          errorText
            ? "bg-destructive/10 text-destructive"
            : // : "bg-muted/50 text-foreground",
              "bg-secondary text-foreground",
        )}
      >
        {errorText && <div>{errorText}</div>}
        {output && <div>{output}</div>}
      </div>
    </div>
  );
};
