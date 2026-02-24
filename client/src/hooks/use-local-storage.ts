"use client";

import { useCallback, useEffect, useState } from "react";

import { safeParseJSON } from "@/lib/utils";

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
}

const IS_SERVER = typeof window === "undefined";

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {},
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  const { initializeWithValue = true } = options;

  const serializer = useCallback(
    (value: T): string => {
      if (options.serializer) {
        return options.serializer(value);
      }
      return JSON.stringify(value);
    },
    [options],
  );

  const deserializer = useCallback(
    (value: string): T => {
      if (options.deserializer) {
        return options.deserializer(value);
      }
      if (value === "undefined") {
        return undefined as unknown as T;
      }
      return (
        safeParseJSON<T>(value) ??
        (initialValue instanceof Function ? initialValue() : initialValue)
      );
    },
    [options, initialValue],
  );

  const readValue = useCallback((): T => {
    const initialValueToUse =
      initialValue instanceof Function ? initialValue() : initialValue;

    if (IS_SERVER) {
      return initialValueToUse;
    }

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? deserializer(raw) : initialValueToUse;
    } catch {
      return initialValueToUse;
    }
  }, [initialValue, key, deserializer]);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (initializeWithValue) {
      return readValue();
    }
    return initialValue instanceof Function ? initialValue() : initialValue;
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (value) => {
      if (IS_SERVER) {
        return;
      }

      try {
        const newValue = value instanceof Function ? value(readValue()) : value;
        window.localStorage.setItem(key, serializer(newValue));
        setStoredValue(newValue);
        window.dispatchEvent(new StorageEvent("local-storage", { key }));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serializer, readValue],
  );

  const removeValue = useCallback(() => {
    if (IS_SERVER) {
      return;
    }

    const defaultValue =
      initialValue instanceof Function ? initialValue() : initialValue;

    window.localStorage.removeItem(key);
    setStoredValue(defaultValue);
    window.dispatchEvent(new StorageEvent("local-storage", { key }));
  }, [key, initialValue]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStoredValue(readValue());
  }, [key, readValue]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && event.key !== key) {
        return;
      }
      setStoredValue(readValue());
    };

    window.addEventListener("storage", handleStorageChange);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.addEventListener("local-storage" as any, handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener("local-storage" as any, handleStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue, removeValue];
}

export type { UseLocalStorageOptions };
