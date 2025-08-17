import type { ReactNode, RefObject } from "react";
import type {
  Control,
  FieldValues,
  UseFormReturn,
  UseFormSetValue,
} from "react-hook-form";

/**
 * Configuration options for the `useFormPersist` hook.
 *
 * @template T - The form data type extending FieldValues
 */
export interface FormPersistConfig<T extends FieldValues> {
  /**
   * Storage implementation to use for persisting form data.
   * @default window.localStorage
   * @example localStorage, sessionStorage, or custom Storage implementation
   */
  storage?: Storage;

  /**
   * React Hook Form control object for managing form state.
   * Required for watching form values and triggering persistence.
   */
  control: Control<T>;

  /**
   * React Hook Form setValue function for updating form values.
   * Required for restoring persisted data back to the form.
   */
  setValue: UseFormSetValue<T>;

  /**
   * Array of field names to exclude from persistence.
   * Useful for sensitive fields like passwords or temporary data.
   * @example ['password', 'confirmPassword', 'captcha']
   */
  exclude?: string[];

  /**
   * Callback function called when persisted data is restored to the form.
   * Useful for showing notifications or updating UI state.
   * @param data - The restored form data
   */
  onDataRestored?: (data: T) => void;

  /**
   * Whether to trigger form validation when restoring persisted data.
   * @default false
   */
  validate?: boolean;

  /**
   * Whether to mark restored fields as dirty (modified).
   * @default false
   */
  dirty?: boolean;

  /**
   * Whether to mark restored fields as touched (focused).
   * @default false
   */
  touch?: boolean;

  /**
   * Callback function called when persisted data expires due to timeout.
   * The expired data is automatically cleared from storage.
   */
  onTimeout?: () => void;

  /**
   * Time in milliseconds after which persisted data expires and is cleared.
   * If not set, data persists indefinitely until manually cleared.
   * @example 24 * 60 * 60 * 1000 // 24 hours
   */
  timeout?: number;

  /**
   * Delay in milliseconds for debouncing form value changes before persisting.
   * Helps reduce storage operations for rapid form updates.
   * @default 300
   */
  debounceDelay?: number;
}

/**
 * Return value from the `useFormPersist` hook.
 * Provides utilities for managing persisted form state.
 */
export interface UseFormPersistResult {
  /**
   * Function to manually clear persisted form data from storage.
   * Useful for logout scenarios or manual data cleanup.
   */
  clear(): void;

  /**
   * Ref indicating whether the hook is currently restoring data from storage.
   */
  isRestoringRef: RefObject<boolean>;

  /**
   * Ref indicating whether the hook is currently saving data to storage.
   */
  isSavingRef: RefObject<boolean>;
}

/**
 * Props for the `FormPersist` component.
 * A wrapper component that automatically handles form persistence.
 *
 * @template T - The form data type extending FieldValues
 */
export interface FormPersistProps<T extends FieldValues>
  extends Omit<FormPersistConfig<T>, "control" | "setValue"> {
  /**
   * React Hook Form instance returned from `useForm()`.
   * Contains all form methods and state needed for persistence.
   * @example const form = useForm(); <FormPersist form={form} ... />
   */
  form: UseFormReturn<T>;

  /**
   * Unique identifier for the form data in storage.
   * Used as the storage key to save/retrieve form data.
   * Should be unique across your application to avoid conflicts.
   * @example "user-profile-form-v1", "checkout-form-v2", "settings-form-v3"
   */
  formKey: string;

  /**
   * Optional child elements to render.
   * The FormPersist component can act as a wrapper and render any children passed to it.
   * @example <FormPersist ...><form>...</form></FormPersist>
   */
  children?: ReactNode;
}
