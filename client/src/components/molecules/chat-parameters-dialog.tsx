import { zodResolver } from "@hookform/resolvers/zod";
import { Settings } from "lucide-react";
import { type Control, Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { WithTooltip } from "@/components/atoms/with-tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PromptInputButton } from "@/components/ui/shadcn-io/ai/prompt-input";
import { Slider } from "@/components/ui/slider";
import {
  type ChatParameters,
  ChatParametersSchema,
  useChat,
} from "@/hooks/use-chat";

interface SliderFieldProps {
  name: "temperature" | "topP" | "presencePenalty" | "frequencyPenalty";
  control: Control<{
    temperature: number;
    topP: number;
    presencePenalty: number;
    frequencyPenalty: number;
  }>;
  label: string;
  description?: string;
  min: number;
  max: number;
  step?: number;
}

export function SliderField({
  name,
  control,
  label,
  description,
  min,
  max,
  step = 0.1,
}: SliderFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field className="gap-1">
          <div className="flex gap-2">
            <FieldLabel>{label}</FieldLabel>
            <FieldLabel>{field.value}</FieldLabel>
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          <div className="flex flex-row gap-2 items-center">
            {min}
            <Slider
              value={[field.value || 0]}
              onValueChange={(value) => field.onChange(value[0])}
              min={min}
              max={max}
              step={step}
            />
            {max}
          </div>
        </Field>
      )}
    />
  );
}

function ChatParametersDialog() {
  const { t } = useTranslation();
  const { chatSelectors, chatActions } = useChat();

  const form = useForm<ChatParameters>({
    resolver: zodResolver(ChatParametersSchema),
    defaultValues: chatSelectors.useParameters(),
  });

  const onSubmit = (data: ChatParameters) => {
    toast.info(t("chat-parameters.updated"));
    chatActions.setChatState({ parameters: data });
  };

  return (
    <Dialog>
      <WithTooltip content={t("chat.parameters")}>
        <DialogTrigger asChild>
          <PromptInputButton>
            <Settings />
          </PromptInputButton>
        </DialogTrigger>
      </WithTooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("chat.parameters")}</DialogTitle>
          <DialogDescription>
            {t("chat-parameters.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <SliderField
              name="temperature"
              control={form.control}
              label={t("chat-parameters.temperature")}
              description={t("chat-parameters.temperature-description")}
              min={0}
              max={2}
            />
            <SliderField
              name="topP"
              control={form.control}
              label={t("chat-parameters.top-p")}
              description={t("chat-parameters.top-p-description")}
              min={0}
              max={1}
            />
            <SliderField
              name="presencePenalty"
              control={form.control}
              label={t("chat-parameters.presence-penalty")}
              description={t("chat-parameters.presence-penalty-description")}
              min={-2}
              max={2}
            />
            <SliderField
              name="frequencyPenalty"
              control={form.control}
              label={t("chat-parameters.frequency-penalty")}
              description={t("chat-parameters.frequency-penalty-description")}
              min={-2}
              max={2}
            />
          </FieldGroup>
          <DialogFooter>
            <Button variant={"outline"} onClick={() => form.reset()}>
              {t("chat-parameters.reset")}
            </Button>
            <Button type="submit">{t("chat-parameters.submit")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { ChatParametersDialog };
