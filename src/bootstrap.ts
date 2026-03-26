import { CONFIG } from '@pagopa/selfcare-common-frontend/lib/config/env';
import ROUTES from './routes';
import { MOCK_USER, testToken } from './utils/constants';
import { ENV } from './utils/env';
import { initializeOneTrustLinkFix } from './utils/onetrust-utils';

// eslint-disable-next-line functional/immutable-data
CONFIG.MOCKS.MOCK_USER = MOCK_USER;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.LOGIN = ENV.URL_FE.LOGIN;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.LOGOUT = ENV.URL_FE.LOGOUT;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.ASSISTANCE = ENV.URL_FE.ASSISTANCE_PORTAL;
// eslint-disable-next-line functional/immutable-data
CONFIG.TEST.JWT = testToken;
// eslint-disable-next-line functional/immutable-data
CONFIG.HEADER.LINK.PRODUCTURL = ROUTES.HOME;

initializeOneTrustLinkFix('/portale-enti');