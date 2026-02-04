import { useCallback, useState } from "react";

import { logger } from "@/lib/logs";

type UseCopyToClipboardReturn = [(text: string) => Promise<void>, boolean];

const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<void> => {
    if (!navigator?.clipboard) {
      logger.warn("Clipboard not supported");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      logger.error("Copy failed", error);
      setIsCopied(false);
    }
  }, []);

  return [copy, isCopied];
};

export { useCopyToClipboard };
