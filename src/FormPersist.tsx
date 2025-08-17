import type { ReactNode } from "react";
import type { FieldValues } from "react-hook-form";
import type { FormPersistConfig, FormPersistProps } from "./types";
import { useFormPersist } from "./useFormPersist";

/**
 * Convenient wrapper around useFormPersist to automatically handle storage and debouncing.
 * @param props - The props for the FormPersist component.
 */
export function FormPersist<T extends FieldValues = FieldValues>(
  props: FormPersistProps<T>
): ReactNode {
  const { form, formKey, children, ...restProps } = props;

  const config: FormPersistConfig<T> = {
    control: form.control,
    setValue: form.setValue,
    ...restProps,
  };

  useFormPersist(formKey, config);
  return children;
}
