import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const useUrlState = (key, defaultValue) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const parse = useCallback(
    (raw) => {
      if (raw == null) return defaultValue;
      if (typeof defaultValue === "number") {
        const n = Number(raw);
        return Number.isFinite(n) ? n : defaultValue;
      }
      if (typeof defaultValue === "boolean") return raw === "true";
      return raw;
    },
    [defaultValue]
  );

  // value
  const value = useMemo(() => {
    return parse(searchParams.get(key));
  }, [key, parse, searchParams]);

  // set value function (supports functional updates)
  const setValue = useCallback(
    (updater) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        // get previous typed value
        const prevTyped = parse(prev.get(key));

        // resolve next value (supports function or raw)
        const nextValue =
          typeof updater === "function" ? updater(prevTyped) : updater;

        const shouldRemove = nextValue == null || nextValue === "";

        if (shouldRemove) params.delete(key);
        else params.set(key, String(nextValue));

        return params;
        // return new URLSearchParams(params);
      });
    },
    [key, parse, setSearchParams]
  );

  return [value, setValue];
};