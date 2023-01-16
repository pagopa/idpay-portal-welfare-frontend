import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { useState } from 'react';
import { userFromJwtToken } from './useLogin';

const useTOSAgreementLocalStorage = (localStorageKey = 'acceptTOS') => {
  const jwt = storageTokenOps.read();
  const user: User = userFromJwtToken(jwt);

  const getLocalStorageTOS = () => localStorage.getItem(localStorageKey);

  const acceptTOS = () => {
    const id = JSON.stringify({ id: user?.uid });
    localStorage.setItem(localStorageKey, id);
    setAcceptedTOS(localStorage.getItem(localStorageKey));
  };

  const [acceptedTOS, setAcceptedTOS] = useState<string | null>(getLocalStorageTOS());

  return { isTOSAccepted: !!acceptedTOS, acceptTOS, acceptedTOS };
};

export default useTOSAgreementLocalStorage;
