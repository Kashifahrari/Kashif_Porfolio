import { useState, useCallback } from "react";
import { useModal } from "../context/ModalContext";

export const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const { showToast } = useModal();

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      showToast(`Copied ${text} to clipboard! ✨`);
      setTimeout(() => setIsCopied(false), 2200);
    } catch {
      showToast(`Could not copy automatically. Text: ${text}`);
    }
  }, [showToast]);

  return { copyToClipboard, isCopied };
};
