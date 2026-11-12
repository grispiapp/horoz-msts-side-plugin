import { FC } from "react";

import { Button } from "@/components/ui/button";

interface WriteBarProps {
  selectedCode: string;
  currentCode: string | null;
  isWriting: boolean;
  error: string | null;
  onWrite: () => void;
  onCancel: () => void;
}

export const WriteBar: FC<WriteBarProps> = ({
  selectedCode,
  currentCode,
  isWriting,
  error,
  onWrite,
  onCancel,
}) => {
  const replaces = currentCode !== null && currentCode !== selectedCode;

  return (
    <div className="px-3 pt-2.5 pb-3 bg-white border-t border-line">
      <p className="text-xs leading-5 text-subtle">
        {replaces ? (
          <>
            Ticket'taki <span className="font-medium tabular-nums text-ink">{currentCode}</span>{" "}
            yerine <span className="font-medium tabular-nums text-ink">{selectedCode}</span>{" "}
            yazılacak.
          </>
        ) : (
          <>
            <span className="font-medium tabular-nums text-ink">{selectedCode}</span> ticket'a
            yazılacak.
          </>
        )}
      </p>

      {error && (
        <p role="alert" className="mt-1 text-xs leading-5 text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-2 mt-2">
        <Button variant="ghost" size="sm" className="px-2.5 text-subtle" onClick={onCancel}>
          Vazgeç
        </Button>
        <Button size="sm" className="flex-1" disabled={isWriting} onClick={onWrite}>
          {isWriting ? "Yazılıyor…" : replaces ? "Değiştir" : "Ticket'a yaz"}
        </Button>
      </div>
    </div>
  );
};
