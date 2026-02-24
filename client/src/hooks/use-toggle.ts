"use client";

import { useCallback, useState } from "react";

type UseToggleReturn = [
  boolean,
  () => void,
  React.Dispatch<React.SetStateAction<boolean>>,
];

const useToggle = (defaultValue = false): UseToggleReturn => {
  if (typeof defaultValue !== "boolean") {
    throw new Error("defaultValue must be `true` or `false`");
  }

  const [value, setValue] = useState(defaultValue);

  const toggle = useCallback(() => {
    setValue((x) => !x);
  }, []);

  return [value, toggle, setValue];
};

export { useToggle };
