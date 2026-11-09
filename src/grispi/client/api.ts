import { Authentication } from "./authentication";
import { HttpHandler } from "./http-handler";
import { Tickets } from "./tickets";

export class GrispiAPI {
  readonly http: HttpHandler;
  readonly authentication: Authentication;
  readonly tickets: Tickets;

  constructor() {
    this.http = new HttpHandler();
    this.authentication = new Authentication(this.http);
    this.tickets = new Tickets(this.http, this.authentication);
  }
}

export const grispiAPI = new GrispiAPI();
