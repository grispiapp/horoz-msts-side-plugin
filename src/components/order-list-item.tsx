import { CheckIcon } from "@radix-ui/react-icons";
import { FC } from "react";

import { Button } from "@/components/ui/button";
import { cn, formatMstsDate } from "@/lib/utils";
import { MstsOrder } from "@/types/msts.type";

interface OrderListItemProps {
  order: MstsOrder;
  currentCode: string | null;
  isWriting: boolean;
  isConfirming: boolean;
  disabled: boolean;
  onWrite: () => void;
  onCancel: () => void;
}

export const OrderListItem: FC<OrderListItemProps> = ({
  order,
  currentCode,
  isWriting,
  isConfirming,
  disabled,
  onWrite,
  onCancel,
}) => {
  const isCurrent = currentCode === order.code;

  return (
    <li className={cn("px-3 py-2.5", isCurrent && "bg-emerald-50/60")}>
      <div className="flex gap-3 justify-between items-center">
        <div className="min-w-0">
          <div className="font-mono text-sm font-medium text-foreground">
            {order.code}
          </div>
          <div className="flex gap-1.5 items-center mt-0.5 text-xs text-muted-foreground">
            <span className="tabular-nums">
              {formatMstsDate(order.orderedAt)}
            </span>
            <span aria-hidden>·</span>
            <span
              title={order.atfStatus ?? undefined}
              className={cn(order.atfCreated && "text-emerald-700")}
            >
              {order.atfCreated ? "ATF var" : "ATF yok"}
            </span>
          </div>
        </div>

        {isCurrent ? (
          <span className="flex gap-1 items-center text-xs font-medium text-emerald-700 shrink-0">
            <CheckIcon className="size-4" />
            Ticket'ta
          </span>
        ) : (
          !isConfirming && (
            <Button
              size="sm"
              variant="outline"
              className="shrink-0"
              disabled={disabled}
              onClick={onWrite}
            >
              {isWriting ? "Yazılıyor…" : "Ticket'a yaz"}
            </Button>
          )
        )}
      </div>

      {isConfirming && (
        <div className="p-2.5 mt-2 text-xs bg-amber-50 rounded-md border border-amber-200 text-amber-900">
          <p>
            Ticket'taki <span className="font-mono">{currentCode}</span> kodu{" "}
            <span className="font-mono">{order.code}</span> ile değiştirilecek.
          </p>
          <div className="flex gap-2 justify-end mt-2">
            <Button size="sm" variant="ghost" onClick={onCancel}>
              Vazgeç
            </Button>
            <Button size="sm" disabled={disabled} onClick={onWrite}>
              {isWriting ? "Yazılıyor…" : "Değiştir"}
            </Button>
          </div>
        </div>
      )}
    </li>
  );
};
