import isEmpty from 'lodash/isEmpty';
import { useDispatch } from 'react-redux';
import { CONFIG } from '@pagopa/selfcare-common-frontend/config/env';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { userActions } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { storageTokenOps, storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { parseJwt } from '../utils/jwt-utils';
import { JWTUser } from '../model/JwtUser';
import { getUserPermission } from '../services/rolePermissionService';

const mockedUser = {
  uid: '0',
  taxCode: 'AAAAAA00A00A000A',
  name: 'loggedName',
  surname: 'loggedSurname',
  email: 'loggedEmail@aa.aa',
  org_party_role: 'ADMIN',
  org_role: 'admin',
};

export const userFromJwtToken: (token: string) => User = function (token: string) {
  const jwtUser: JWTUser = parseJwt(token);
  console.log(jwtUser);
  return {
    uid: jwtUser.uid,
    taxCode: '',
    name: jwtUser.name,
    surname: jwtUser.family_name,
    email: jwtUser.email,
    org_party_role: jwtUser.org_party_role,
    org_role: jwtUser.org_role,
  };
};

/** A custom hook used to obtain a function to check if there is a valid JWT token, loading into redux the logged user object */
export const useLogin = () => {
  const dispatch = useDispatch();
  const setUser = (user: User) => dispatch(userActions.setLoggedUser(user));

  const attemptSilentLogin = async () => {
    if (CONFIG.MOCKS.MOCK_USER) {
      setUser(mockedUser);
      storageTokenOps.write(CONFIG.TEST.JWT);
      storageUserOps.write(mockedUser);
      getUserPermission()
        .then((res) => console.log(res))
        .catch((error) => console.log(error));
      return;
    }

    const token = storageTokenOps.read();

    // If there are no credentials, it is impossible to get the user, so
    if (!token) {
      // Remove any partial data that might have remained, just for safety
      storageUserOps.delete();
      // Go to the login view
      window.location.assign(CONFIG.URL_FE.LOGIN);
      // This return is necessary
      return;
    }

    const sessionStorageUser = storageUserOps.read();

    if (isEmpty(sessionStorageUser)) {
      const user: User = userFromJwtToken(token);
      storageUserOps.write(user);
      setUser(user);
      getUserPermission()
        .then((res) => console.log(res))
        .catch((error) => console.log(error));
    } else {
      // Otherwise, set the user to the one stored in the storage
      setUser(sessionStorageUser);
      getUserPermission()
        .then((res) => console.log(res))
        .catch((error) => console.log(error));
    }
  };

  return { attemptSilentLogin };
};
