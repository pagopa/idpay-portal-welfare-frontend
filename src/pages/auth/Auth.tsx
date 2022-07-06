import { User } from '@pagopa/selfcare-common-frontend/model/User';
import {
  trackAppError,
  trackEvent,
} from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { storageTokenOps, storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { userFromJwtToken } from '../../hooks/useLogin';
import ROUTES from '../../routes';
import { ENV } from '../../utils/env';

export const readUserFromToken = (token: string) => {
  const user: User = userFromJwtToken(token);
  if (user) {
    storageUserOps.write(user);
  }
};

/** success login operations */
const Auth = () => {
  const { hash = '' } = window.location;
  const urlToken = hash.replace('#token=', '');

  if (urlToken !== '' && urlToken !== undefined) {
    trackEvent('AUTH_SUCCESS');
    storageTokenOps.write(urlToken);
    readUserFromToken(urlToken);
    window.location.assign(ROUTES.HOME);
  } else {
    trackAppError({
      id: 'INVALIDAUTHREQUEST',
      blocking: false,
      toNotify: true,
      techDescription: 'something gone wrong while authenticating there is no token',
      error: new Error('INVALIDAUTHREQUEST'),
    });
    window.location.assign(ENV.URL_FE.LOGIN);
  }
  return <div />;
};

export default Auth;
