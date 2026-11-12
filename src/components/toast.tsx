import { CheckIcon } from "@radix-ui/react-icons";
import { FC, useEffect } from "react";

interface ToastProps {
  message: string;
  onDismiss: () => void;
  duration?: number;
}

export const Toast: FC<ToastProps> = ({ message, onDismiss, duration = 2500 }) => {
  useEffect(() => {
    const timeout = setTimeout(onDismiss, duration);

    return () => clearTimeout(timeout);
  }, [message, onDismiss, duration]);

  return (
    <div className="flex absolute inset-x-0 bottom-3 justify-center px-3 pointer-events-none">
      <div className="flex gap-1.5 items-center py-1.5 pr-3 pl-2.5 text-xs font-medium text-white rounded-md shadow-lg bg-ink motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
        <CheckIcon aria-hidden className="text-emerald-300 size-4" />
        {message}
      </div>
    </div>
  );
};
