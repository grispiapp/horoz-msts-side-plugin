import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { grispiAPI } from "@/grispi/client/api";
import { parseJwt } from "@/lib/utils";
import { GrispiBundle, Ticket } from "@/types/grispi.type";

type GrispiContextType = {
  ticket: Ticket | null;
  bundle: GrispiBundle | null;
  loading: boolean;
  refreshTicket: () => Promise<void>;
};

const GrispiContext = createContext<GrispiContextType | null>(null);

const plugin = window.GrispiClient.instance();

const fetchTicket = async (ticketKey: string) => {
  try {
    return await grispiAPI.tickets.getTicket(ticketKey);
  } catch (err) {
    console.error("grispi-context", "Error when fetching ticket", ticketKey);
    return null;
  }
};

export const GrispiProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [bundle, setBundle] = useState<GrispiBundle | null>(null);

  useEffect(() => {
    plugin._init().then(async (bundle) => {
      setLoading(true);

      if (parseJwt(bundle.context.token)?.dev === true) {
        grispiAPI.http.setBaseUrl("https://api.grispi.net");
      }

      grispiAPI.authentication.setTenantId(bundle.context.tenantId);
      grispiAPI.authentication.setToken(bundle.context.token);

      setTicket(await fetchTicket(bundle.context.ticketKey));
      setBundle(bundle);
      setLoading(false);
    });

    plugin.currentTicketUpdated = async (ticket) => {
      const response = await fetchTicket(ticket.key);

      if (response) {
        setTicket(response);
      }
    };
  }, []);

  const refreshTicket = useCallback(async () => {
    if (!bundle?.context.ticketKey) return;

    const response = await fetchTicket(bundle.context.ticketKey);

    if (response) {
      setTicket(response);
    }
  }, [bundle?.context.ticketKey]);

  return (
    <GrispiContext.Provider
      value={{
        ticket,
        bundle,
        loading,
        refreshTicket,
      }}
    >
      {children}
    </GrispiContext.Provider>
  );
};

export const useGrispi = () => {
  const grispi = useContext(GrispiContext);

  if (!grispi) {
    throw new Error("useGrispi must be used within a GrispiProvider.");
  }

  return grispi;
};
