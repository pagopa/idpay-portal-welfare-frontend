import { ENV } from './utils/env';

export const BASE_ROUTE = ENV.PUBLIC_URL;

const ROUTES = {
  HOME: `${BASE_ROUTE}`
};

export default ROUTES as { [key: string]: string };
