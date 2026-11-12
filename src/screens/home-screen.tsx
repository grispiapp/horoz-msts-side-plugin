import { observer } from "mobx-react-lite";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { searchOrders } from "@/api/msts.api";
import { LoadingWrapper } from "@/components/loading-wrapper";
import { OrderListItem } from "@/components/order-list-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Screen, ScreenContent } from "@/components/ui/screen";
import { useGrispi } from "@/contexts/grispi-context";
import { grispiAPI } from "@/grispi/client/api";
import { isApiError } from "@/types/api.type";
import { MstsOrder } from "@/types/msts.type";

import { LoadingScreen } from "./loading-screen";

const ORDER_CODE_FIELD = "tu.siparis_kodu";

export const HomeScreen = observer(() => {
  const { bundle, ticket, loading, refreshTicket } = useGrispi();
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<MstsOrder[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [writingCode, setWritingCode] = useState<string | null>(null);
  const [confirmingCode, setConfirmingCode] = useState<string | null>(null);
  const [writtenCode, setWrittenCode] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fieldValue = ticket?.fieldMap?.[ORDER_CODE_FIELD]?.value;
  const currentCode = writtenCode ?? (fieldValue ? String(fieldValue) : null);

  useEffect(() => {
    setWrittenCode(null);
  }, [ticket]);

  const search = useCallback(async (query: string) => {
    abortControllerRef.current?.abort();

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsSearching(true);
    setError(null);
    setConfirmingCode(null);

    try {
      const response = await searchOrders(query, abortController.signal);

      if (isApiError(response)) {
        setError(response.data.error.description);
        setOrders(null);
      } else {
        setOrders(response.data);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;

      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setOrders(null);
    }

    setIsSearching(false);
  }, []);

  const requesterPhone = bundle?.context.requester?.phone;

  useEffect(() => {
    if (!requesterPhone) return;

    setPhone(requesterPhone);
    search(requesterPhone);
  }, [requesterPhone, search]);

  const writeOrderCode = async (code: string) => {
    if (!ticket) return;

    if (currentCode && currentCode !== code && confirmingCode !== code) {
      setConfirmingCode(code);
      return;
    }

    setWritingCode(code);
    setError(null);

    try {
      await grispiAPI.tickets.updateTicket(ticket.key, {
        fields: [{ key: ORDER_CODE_FIELD, value: code }],
      });

      setConfirmingCode(null);
      await refreshTicket();
      setWrittenCode(code);
    } catch (err) {
      setError("Sipariş kodu ticket'a yazılamadı. Lütfen tekrar deneyin.");
    }

    setWritingCode(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (phone.trim()) {
      search(phone.trim());
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Screen>
      <ScreenContent>
        <div className="flex flex-col gap-2.5 p-2.5">
          <div className="flex gap-2 justify-between items-center px-2.5 py-2 bg-white rounded-lg border">
            <span className="text-xs whitespace-nowrap text-muted-foreground">
              Ticket'taki kod
            </span>
            {currentCode ? (
              <span className="font-mono text-[13px] font-medium truncate">
                {currentCode}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">Boş</span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-1.5">
            <Input
              type="tel"
              inputMode="tel"
              autoComplete="off"
              aria-label="Telefon numarası"
              placeholder="5XX XXX XX XX"
              value={phone}
              className="min-w-0 bg-white"
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button
              type="submit"
              className="px-3"
              disabled={isSearching || !phone.trim()}
            >
              Ara
            </Button>
          </form>

          {!requesterPhone && !orders && !isSearching && (
            <p className="px-1 text-xs text-muted-foreground">
              Ticket'ta telefon numarası yok. Numarayı yazıp arayabilirsiniz.
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200"
            >
              {error}
            </div>
          )}

          {isSearching && <LoadingWrapper />}

          {!isSearching && orders && orders.length === 0 && (
            <p className="py-8 text-sm text-center text-muted-foreground">
              Bu numaraya ait sipariş bulunamadı.
            </p>
          )}

          {!isSearching && orders && orders.length > 0 && (
            <div>
              <div className="px-0.5 mb-1 text-xs text-muted-foreground">
                {orders.length} sipariş, en yeni üstte
              </div>
              <ul className="overflow-hidden bg-white rounded-lg border divide-y">
                {orders.map((order) => (
                  <OrderListItem
                    key={order.code}
                    order={order}
                    currentCode={currentCode}
                    isWriting={writingCode === order.code}
                    isConfirming={confirmingCode === order.code}
                    disabled={writingCode !== null || !ticket}
                    onWrite={() => writeOrderCode(order.code)}
                    onCancel={() => setConfirmingCode(null)}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScreenContent>
    </Screen>
  );
});
