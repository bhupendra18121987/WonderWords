import { useCallback, useEffect, useState } from 'react';

type SetValue<T> = T | ((prev: T) => T);

/**
 * Web adapter that persists a value in localStorage.
 * The React Native app will provide the same-shaped hook backed by
 * @react-native-async-storage/async-storage.
 */
export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  const [value, setValueState] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const raw = window.localStorage.getItem(key);
      if (raw == null) return initialValue;
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [key, value]);

  const setValue = useCallback((next: SetValue<T>) => {
    setValueState((prev) =>
      typeof next === 'function' ? (next as (p: T) => T)(prev) : next
    );
  }, []);

  const reset = useCallback(() => setValueState(initialValue), [initialValue]);

  return [value, setValue, reset];
}
