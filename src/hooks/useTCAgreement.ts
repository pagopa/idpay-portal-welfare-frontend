import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { getPortalConsent, savePortalConsent } from '../services/rolePermissionService';

const useTCAgreement = () => {
  const addError = useErrorDispatcher();
  const { t } = useTranslation();
  const [acceptedTOS, setAcceptedTOS] = useState<boolean>(true);
  const [acceptedTOSVersion, setAcceptedTOSVersion] = useState<string | undefined>();
  useEffect(() => {
    getPortalConsent()
      .then((res) => {
        if (res !== null) {
          if (res.versionId) {
            setAcceptedTOS(false);
            setAcceptedTOSVersion(res.versionId);
          }
        } else {
          setAcceptedTOS(false);
          setAcceptedTOSVersion(undefined);
        }
      })
      .catch((error) => {
        addError({
          id: 'GET_TERMS_AND_CONDITION_ACCEPTANCE',
          blocking: false,
          error,
          techDescription: 'An error occurred getting terms and conditions acceptance',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.cantGetTC'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      });
  }, []);

  const acceptTOS = () => {
    savePortalConsent(acceptedTOSVersion)
      .then((_res) => {})
      .catch((error) => {
        addError({
          id: 'SAVE_TERMS_AND_CONDITION_ACCEPTANCE',
          blocking: false,
          error,
          techDescription: 'An error occurred saving terms and conditions acceptance',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.cantSaveTC'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      });
  };

  return { isTOSAccepted: acceptedTOS, acceptTOS, acceptedTOSVersion };
};

export default useTCAgreement;
