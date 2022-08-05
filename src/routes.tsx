import { ENV } from './utils/env';

export const BASE_ROUTE = ENV.PUBLIC_URL;

const ROUTES = {
  AUTH: `${BASE_ROUTE}/auth`,
  HOME: `${BASE_ROUTE}`,
  NEW_INITIATIVE: `${BASE_ROUTE}/nuova-iniziativa`,
  INITIATIVE_LIST: `${BASE_ROUTE}/iniziative`,
  INITIATIVE: `${BASE_ROUTE}/iniziativa/:id`
};

export default ROUTES;
