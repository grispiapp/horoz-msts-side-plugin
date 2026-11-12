import { OrderListSkeleton } from "@/components/order-list";
import { Screen } from "@/components/ui/screen";

export const LoadingScreen = () => {
  return (
    <Screen aria-busy="true">
      <div className="px-3 pt-3 pb-2.5 border-b border-line">
        <div className="h-9 rounded-md motion-safe:animate-pulse bg-slate-100" />
      </div>
      <OrderListSkeleton />
    </Screen>
  );
};
