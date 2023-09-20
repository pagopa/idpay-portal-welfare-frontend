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
  INITIATIVE_RANKING: `${BASE_ROUTE}/graduatoria-iniziativa/:id`,
  INITIATIVE_REFUNDS: `${BASE_ROUTE}/rimborsi-iniziativa/:id`,
  INITIATIVE_REFUNDS_OUTCOME: `${BASE_ROUTE}/esiti-rimborsi-iniziativa/:id`,
  INITIATIVE_REFUNDS_DETAIL: `${BASE_ROUTE}/dettaglio-rimborsi-iniziativa/:id/:exportId/:filePath`,
  INITIATIVE_DETAIL: `${BASE_ROUTE}/dettagli-iniziativa/:id`,
  INITIATIVE_MERCHANT: `${BASE_ROUTE}/esercenti-iniziativa/:id`,
  INITIATIVE_MERCHANT_DETAIL: `${BASE_ROUTE}/esercenti-iniziativa/dettagli-esercente/:id/:merchantId`,
  INITIATIVE_MERCHANT_UPLOAD: `${BASE_ROUTE}/gestione-esercenti-iniziativa/:id`,
  ASSISTANCE: `${BASE_ROUTE}/assistenza`,
  INITIATIVE_USER_DETAILS: `${BASE_ROUTE}/dettagli-utente/:id/:cf`,
  TOS: `${BASE_ROUTE}/terms-of-service`,
  PRIVACY_POLICY: `${BASE_ROUTE}/privacy-policy`,
  CHOOSE_ORGANIZATION: `${BASE_ROUTE}/selezione-ente`,
};

export default ROUTES;
