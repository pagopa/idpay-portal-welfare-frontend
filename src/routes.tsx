import { ENV } from './utils/env';

export const BASE_ROUTE = ENV.PUBLIC_URL;

const ROUTES = {
  AUTH: `${BASE_ROUTE}/auth`,
  HOME: `${BASE_ROUTE}`,
  NEW_INITIATIVE: `${BASE_ROUTE}/nuova-iniziativa`,
  INITIATIVE_LIST: `${BASE_ROUTE}/iniziative`,
  INITIATIVE: `${BASE_ROUTE}/iniziativa/:id`,
  INITIATIVE_OVERVIEW: `${BASE_ROUTE}/panoramica-iniziativa/:id`,
  INITIATIVE_USERS: `${BASE_ROUTE}/utenti-iniziativa/:id`,
  INITIATIVE_REFUNDS: `${BASE_ROUTE}/rimborsi-iniziativa/:id`,
  INITIATIVE_REFUNDS_OUTCOME: `${BASE_ROUTE}/esiti-rimborsi-iniziativa/:id`,
  INITIATIVE_DETAIL: `${BASE_ROUTE}/dettagli-iniziativa/:id`,
  ASSISTANCE: `${BASE_ROUTE}/assistenza`,
};

export default ROUTES;
