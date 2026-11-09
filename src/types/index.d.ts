import type { GrispiBundle, Ticket } from "./grispi.type";

declare global {
  interface Window {
    GrispiClient: {
      instance: () => GrispiClient;
    };
  }

  interface GrispiClient {
    _init: () => Promise<GrispiBundle>;
    currentTicketUpdated: (ticket: Ticket) => Promise<void>;
  }
}

export {};
