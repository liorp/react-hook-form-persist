import { useCallback, useEffect, useRef } from "react";
import { type FieldValues, type Path, useWatch } from "react-hook-form";
import type { FormPersistConfig, UseFormPersistResult } from "./types";

export function useFormPersist<T extends FieldValues = FieldValues>(
  name: string,
  {
    storage,
    control,
    setValue,
    exclude = [],
    onDataRestored,
    validate = false,
    dirty = false,
    touch = false,
    onTimeout,
    timeout,
    debounceDelay = 0,
  }: FormPersistConfig<T>
): UseFormPersistResult {
  const watchedValues = useWatch({
    control,
  });

  const debounceTimeoutRef = useRef<number | null>(null);
  const isRestoringRef = useRef(false);
  const isSavingRef = useRef(false);
  const lastValuesRef = useRef<Record<string, unknown>>({});
  const initializedRef = useRef(false);

  const getStorageKey = useCallback(
    () => `react-hook-form-persist:${name}`,
    [name]
  );

  const getStorage = useCallback(
    () => storage ?? window.localStorage,
    [storage]
  );

  const clearStorage = useCallback(
    () => getStorage().removeItem(getStorageKey()),
    [getStorage, getStorageKey]
  );

  const valuesHaveChanged = useCallback(
    (newValues: Record<string, unknown>) => {
      const lastValues = lastValuesRef.current;

      const newKeys = Object.keys(newValues).sort();
      const lastKeys = Object.keys(lastValues).sort();

      if (
        newKeys.length !== lastKeys.length ||
        !newKeys.every((key, i) => key === lastKeys[i])
      ) {
        return true;
      }

      return newKeys.some(
        (key) =>
          JSON.stringify(newValues[key]) !== JSON.stringify(lastValues[key])
      );
    },
    []
  );

  useEffect(() => {
    if (initializedRef.current || isRestoringRef.current) return;

    isRestoringRef.current = true;

    const storageRawValues = getStorage().getItem(getStorageKey());
    if (storageRawValues) {
      const { _savedAt = null, ...values } = JSON.parse(storageRawValues);
      const currTimestamp = Date.now();

      if (timeout && currTimestamp - _savedAt > timeout) {
        onTimeout?.();
        clearStorage();
      } else {
        lastValuesRef.current = structuredClone(values);

        Object.keys(values).forEach((key) => {
          const shouldSet = !exclude.includes(key);
          if (shouldSet) {
            setValue(key as Path<T>, values[key], {
              shouldValidate: validate,
              shouldDirty: dirty,
              shouldTouch: touch,
            });
          }
        });

        if (onDataRestored) {
          onDataRestored(values as T);
        }
      }
    }

    isRestoringRef.current = false;
    initializedRef.current = true;
  }, [
    getStorage,
    getStorageKey,
    exclude,
    setValue,
    validate,
    dirty,
    touch,
    onTimeout,
    timeout,
    onDataRestored,
    clearStorage,
  ]);

  useEffect(() => {
    const saveToStorage = () => {
      if (isSavingRef.current) return;

      isSavingRef.current = true;

      let values: Record<string, unknown>;
      if (exclude.length > 0) {
        values = {};
        for (const [key, val] of Object.entries(watchedValues)) {
          if (!exclude.includes(key)) {
            values[key] = val;
          }
        }
      } else {
        values = { ...watchedValues };
      }

      if (Object.entries(values).length && valuesHaveChanged(values)) {
        if (timeout != null) {
          values._savedAt = Date.now();
        }
        getStorage().setItem(getStorageKey(), JSON.stringify(values));
        lastValuesRef.current = structuredClone(values);
      }

      isSavingRef.current = false;
    };

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (debounceDelay > 0) {
      debounceTimeoutRef.current = setTimeout(() => {
        const shouldSkipSave =
          isRestoringRef.current ||
          !initializedRef.current ||
          isSavingRef.current;
        if (!shouldSkipSave) {
          saveToStorage();
        }
      }, debounceDelay);
    } else {
      if (
        !(
          isRestoringRef.current ||
          !initializedRef.current ||
          isSavingRef.current
        )
      ) {
        saveToStorage();
      }
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [
    watchedValues,
    timeout,
    exclude,
    getStorageKey,
    getStorage,
    debounceDelay,
    valuesHaveChanged,
  ]);

  return {
    clear: clearStorage,
    isRestoringRef,
    isSavingRef,
  };
}
