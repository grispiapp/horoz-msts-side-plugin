import { CheckIcon } from "@radix-ui/react-icons";
import { FC, useEffect } from "react";

export interface ToastContent {
  title: string;
  description?: string;
}

interface ToastProps {
  toast: ToastContent;
  onDismiss: () => void;
  duration?: number;
}

export const Toast: FC<ToastProps> = ({ toast, onDismiss, duration = 4000 }) => {
  useEffect(() => {
    const timeout = setTimeout(onDismiss, duration);

    return () => clearTimeout(timeout);
  }, [toast, onDismiss, duration]);

  return (
    <div className="flex absolute inset-x-0 bottom-3 justify-center px-3 pointer-events-none">
      <div className="flex gap-2 items-start py-2 pr-3.5 pl-2.5 max-w-full text-xs text-white rounded-md shadow-lg bg-ink motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
        <CheckIcon aria-hidden className="mt-px text-emerald-300 size-4 shrink-0" />
        <div className="leading-4">
          <p className="font-medium">{toast.title}</p>
          {toast.description && <p className="mt-0.5 text-white/70">{toast.description}</p>}
        </div>
      </div>
    </div>
  );
};
