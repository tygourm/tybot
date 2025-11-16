import { Paperclip } from "lucide-react";
import { useTranslation } from "react-i18next";

import { WithTooltip } from "@/components/atoms/with-tooltip";
import { FileUpload } from "@/components/ui/coss-origin/file-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PromptInputButton } from "@/components/ui/shadcn-io/ai/prompt-input";

function ChatAttachementsDialog() {
  const { t } = useTranslation();

  return (
    <Dialog>
      <WithTooltip content={t("chat.attach")}>
        <DialogTrigger asChild>
          <PromptInputButton>
            <Paperclip />
          </PromptInputButton>
        </DialogTrigger>
      </WithTooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("chat.attach")}</DialogTitle>
          <DialogDescription>
            {t("chat-attachements.description")}
          </DialogDescription>
        </DialogHeader>
        <FileUpload />
      </DialogContent>
    </Dialog>
  );
}

export { ChatAttachementsDialog };
