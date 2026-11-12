import { CheckIcon } from "@radix-ui/react-icons";
import { FC } from "react";

import { cn, formatMstsDate } from "@/lib/utils";
import { MstsOrder } from "@/types/msts.type";

interface OrderListProps {
  orders: MstsOrder[];
  currentCode: string | null;
  selectedCode: string | null;
  disabled: boolean;
  onSelect: (code: string) => void;
}

export const OrderList: FC<OrderListProps> = ({
  orders,
  currentCode,
  selectedCode,
  disabled,
  onSelect,
}) => {
  return (
    <div role="radiogroup" aria-label="Siparişler" className="divide-y divide-line">
      {orders.map((order) => {
        const isCurrent = order.code === currentCode;
        const isSelected = order.code === selectedCode;

        return (
          <label
            key={order.code}
            className={cn(
              "relative flex gap-2.5 items-start px-3 py-2 select-none",
              "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-primary",
              isCurrent ? "cursor-default" : "cursor-pointer hover:bg-slate-50",
              isSelected && "bg-select hover:bg-select"
            )}
          >
            <input
              type="radio"
              name="order"
              value={order.code}
              checked={isSelected}
              disabled={disabled || isCurrent}
              onChange={() => onSelect(order.code)}
              className="sr-only peer"
            />

            <span aria-hidden className="flex justify-center items-center mt-[3px] size-3.5 shrink-0">
              {isCurrent ? (
                <CheckIcon className="text-emerald-700 size-4" />
              ) : (
                <span
                  className={cn(
                    "rounded-full border size-3.5 transition-colors",
                    isSelected
                      ? "border-primary border-[4.5px]"
                      : "border-slate-300 bg-white"
                  )}
                />
              )}
            </span>

            <span className="grid flex-1 min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-x-2">
              <span
                className={cn(
                  "text-[13px] tabular-nums truncate",
                  isSelected || isCurrent ? "font-semibold text-ink" : "font-medium text-ink"
                )}
              >
                {order.code}
              </span>
              <span className="text-xs tabular-nums whitespace-nowrap text-subtle leading-5">
                {formatMstsDate(order.orderedAt)}
              </span>
              <span className="col-span-2 text-xs text-subtle" title={order.atfStatus ?? undefined}>
                {isCurrent
                  ? "Ticket'taki sipariş"
                  : order.atfCreated
                    ? "ATF kaydı var"
                    : "ATF kaydı yok"}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
};

export const OrderListSkeleton: FC = () => {
  return (
    <div aria-hidden className="divide-y divide-line">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-2.5 items-start px-3 py-2.5">
          <span className="mt-0.5 rounded-full size-3.5 bg-slate-100" />
          <span className="flex-1 space-y-2">
            <span className="flex justify-between">
              <span className="w-24 h-3 rounded motion-safe:animate-pulse bg-slate-100" />
              <span className="w-16 h-3 rounded motion-safe:animate-pulse bg-slate-100" />
            </span>
            <span className="block w-20 h-2.5 rounded motion-safe:animate-pulse bg-slate-100" />
          </span>
        </div>
      ))}
    </div>
  );
};
