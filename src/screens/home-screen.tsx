import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { searchOrders } from "@/api/msts.api";
import { OrderList, OrderListSkeleton } from "@/components/order-list";
import { Screen, ScreenContent } from "@/components/ui/screen";
import { WriteBar } from "@/components/write-bar";
import { useGrispi } from "@/contexts/grispi-context";
import { grispiAPI } from "@/grispi/client/api";
import { isApiError } from "@/types/api.type";
import { MstsOrder } from "@/types/msts.type";

import { LoadingScreen } from "./loading-screen";

const ORDER_CODE_FIELD = "tu.siparis_kodu";

type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; phone: string; orders: MstsOrder[] };

export const HomeScreen = observer(() => {
  const { bundle, ticket, loading, refreshTicket } = useGrispi();
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState<SearchState>({ status: "idle" });
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [writeError, setWriteError] = useState<string | null>(null);
  const [writtenCode, setWrittenCode] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const fieldValue = ticket?.fieldMap?.[ORDER_CODE_FIELD]?.value;
  const currentCode = writtenCode ?? (fieldValue ? String(fieldValue) : null);

  useEffect(() => {
    setWrittenCode(null);
  }, [ticket]);

  const runSearch = useCallback(async (query: string) => {
    abortControllerRef.current?.abort();

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setSearch({ status: "loading" });
    setSelectedCode(null);
    setWriteError(null);

    try {
      const response = await searchOrders(query, abortController.signal);

      if (isApiError(response)) {
        setSearch({ status: "error", message: response.data.error.description });
      } else {
        setSearch({ status: "done", phone: query, orders: response.data });
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;

      setSearch({ status: "error", message: "Arama yapılamadı." });
    }
  }, []);

  const requesterPhone = bundle?.context.requester?.phone;

  useEffect(() => {
    if (!requesterPhone) return;

    setPhone(requesterPhone);
    runSearch(requesterPhone);
  }, [requesterPhone, runSearch]);

  const writeOrderCode = async () => {
    if (!ticket || !selectedCode) return;

    setIsWriting(true);
    setWriteError(null);

    try {
      await grispiAPI.tickets.updateTicket(ticket.key, {
        fields: [{ key: ORDER_CODE_FIELD, value: selectedCode }],
      });

      await refreshTicket();
      setWrittenCode(selectedCode);
      setAnnouncement(`${selectedCode} ticket'a yazıldı.`);
      setSelectedCode(null);
    } catch {
      setWriteError("Ticket güncellenemedi. Tekrar deneyin.");
    }

    setIsWriting(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (phone.trim()) {
      runSearch(phone.trim());
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Screen>
      <div className="px-3 pt-3 pb-2.5 border-b border-line">
        <form role="search" onSubmit={handleSubmit} className="relative">
          <MagnifyingGlassIcon
            aria-hidden
            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-subtle"
          />
          <input
            type="tel"
            inputMode="tel"
            autoComplete="off"
            aria-label="Telefon numarası ile sipariş ara"
            placeholder="Telefon numarası"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pr-2.5 pl-8 w-full h-9 text-[13px] tabular-nums bg-white rounded-md border transition-colors outline-none border-line placeholder:text-subtle hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <button type="submit" className="sr-only">
            Ara
          </button>
        </form>

        <p className="mt-2 text-xs leading-5 text-subtle">
          {currentCode ? (
            <>
              Ticket'taki sipariş:{" "}
              <span className="font-medium tabular-nums text-ink">{currentCode}</span>
            </>
          ) : (
            "Ticket'a henüz sipariş yazılmadı."
          )}
        </p>
      </div>

      <ScreenContent aria-busy={search.status === "loading"}>
        {search.status === "idle" && (
          <p className="px-3 py-4 text-xs leading-5 text-subtle">
            {requesterPhone
              ? "Aranıyor…"
              : "Ticket'ta telefon numarası yok. Numarayı yazıp Enter'a basın."}
          </p>
        )}

        {search.status === "loading" && <OrderListSkeleton />}

        {search.status === "error" && (
          <div role="alert" className="px-3 py-4 text-xs leading-5">
            <p className="text-red-700">{search.message}</p>
            <button
              type="button"
              onClick={() => runSearch(phone.trim())}
              className="mt-1 font-medium rounded-sm text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              Tekrar dene
            </button>
          </div>
        )}

        {search.status === "done" && search.orders.length === 0 && (
          <p className="px-3 py-4 text-xs leading-5 text-subtle">
            <span className="tabular-nums text-ink">{search.phone}</span> numarasına
            kayıtlı sipariş yok. Numarayı kontrol edip tekrar arayın.
          </p>
        )}

        {search.status === "done" && search.orders.length > 0 && (
          <>
            <p className="px-3 pt-2.5 pb-1 text-xs text-subtle">
              {search.orders.length} sipariş, en yenisi üstte
            </p>
            <OrderList
              orders={search.orders}
              currentCode={currentCode}
              selectedCode={selectedCode}
              disabled={isWriting || !ticket}
              onSelect={(code) => {
                setSelectedCode(code);
                setWriteError(null);
              }}
            />
          </>
        )}
      </ScreenContent>

      {selectedCode && (
        <WriteBar
          selectedCode={selectedCode}
          currentCode={currentCode}
          isWriting={isWriting}
          error={writeError}
          onWrite={writeOrderCode}
          onCancel={() => {
            setSelectedCode(null);
            setWriteError(null);
          }}
        />
      )}

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </Screen>
  );
});
