import { User } from '@pagopa/selfcare-common-frontend/model/User';
import {
  trackAppError,
  trackEvent,
} from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { storageTokenOps, storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { useEffect } from 'react';
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
  useEffect(() => {
    const { hash = '' } = window.location;
    const urlToken = hash.replace('#token=', '');

    if (urlToken !== '' && urlToken !== undefined) {
      trackEvent('AUTH_SUCCESS');

      const url = ENV.URL_FE.PRE_LOGIN;
      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${urlToken}`,
        },
      };

      fetch(url, options)
        .then((response) => response.text())
        .then((innerToken) => {
          storageTokenOps.write(innerToken);
          readUserFromToken(innerToken);
          window.location.assign(ROUTES.HOME);
        })
        .catch((error) => {
          console.error(error);
          window.location.assign(ENV.URL_FE.LOGIN);
        });
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
  }, []);

  return <div />;
};

export default Auth;
