import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToggle } from "@/hooks/use-toggle";
import { useCreateCollection } from "@/models/rag/collections";

function CreateCollectionDialog() {
  const { t } = useTranslation();
  const createCollection = useCreateCollection();
  const [isOpen, toggle] = useToggle();

  const formSchema = z.object({
    name: z.string().trim().min(1, t("create-collection-dialog.invalid-name")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) =>
    createCollection.mutate(data.name, {
      onSuccess: () => {
        toggle();
        form.reset();
      },
    });

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogTrigger asChild>
        <Button>{t("collections.create-collection")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("collections.create-collection")}</DialogTitle>
        </DialogHeader>
        <form
          id="create-collection-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">
                    {t("create-collection-dialog.collection-name")}
                  </FieldLabel>
                  <Input
                    id="name"
                    {...field}
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            {t("actions.reset")}
          </Button>
          <Button
            type="submit"
            form="create-collection-form"
            disabled={createCollection.isPending}
          >
            {t("actions.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { CreateCollectionDialog };
