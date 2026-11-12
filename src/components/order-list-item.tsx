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
    <li className={cn("px-2.5 py-2", isCurrent && "bg-emerald-50/70")}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 items-center">
        <span className="font-mono text-[13px] font-medium truncate text-foreground">
          {order.code}
        </span>

        {isCurrent ? (
          <span className="flex gap-0.5 items-center h-7 text-xs font-medium text-emerald-700">
            <CheckIcon className="size-3.5" />
            Ticket'ta
          </span>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="px-2.5 h-7"
            disabled={disabled || isConfirming}
            onClick={onWrite}
          >
            {isWriting && !isConfirming ? "Yazılıyor…" : "Ticket'a yaz"}
          </Button>
        )}

        <div className="flex col-span-2 gap-1.5 items-center text-xs whitespace-nowrap text-muted-foreground">
          <span className="tabular-nums">{formatMstsDate(order.orderedAt)}</span>
          <span
            title={order.atfStatus ?? undefined}
            className={cn(
              "inline-flex gap-1 items-center",
              order.atfCreated && "text-emerald-700"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-1.5 rounded-full",
                order.atfCreated ? "bg-emerald-500" : "bg-slate-300"
              )}
            />
            {order.atfCreated ? "ATF var" : "ATF yok"}
          </span>
        </div>
      </div>

      {isConfirming && (
        <div className="p-2 mt-2 text-xs bg-amber-50 rounded-md border border-amber-200 text-amber-900">
          <p className="leading-relaxed">
            <span className="font-mono">{currentCode}</span> yerine{" "}
            <span className="font-mono">{order.code}</span> yazılacak.
          </p>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            <Button size="sm" variant="outline" className="h-7" onClick={onCancel}>
              Vazgeç
            </Button>
            <Button size="sm" className="h-7" disabled={disabled} onClick={onWrite}>
              {isWriting ? "Yazılıyor…" : "Değiştir"}
            </Button>
          </div>
        </div>
      )}
    </li>
  );
};
