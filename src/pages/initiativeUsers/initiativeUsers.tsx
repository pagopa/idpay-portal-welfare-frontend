import { useEffect } from 'react';
import { matchPath } from 'react-router';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { useTranslation } from 'react-i18next';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES from '../../routes';
import { getGroupOfBeneficiaryStatusAndDetail } from '../../services/groupsService';

interface MatchParams {
  id: string;
}

const InitiativeUsers = () => {
  const { t } = useTranslation();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const addError = useErrorDispatcher();

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_USERS],
    exact: true,
    strict: false,
  });

  useEffect(() => {
    // eslint-disable-next-line no-prototype-builtins
    if (match !== null && match.params.hasOwnProperty('id')) {
      const { id } = match.params as MatchParams;
      if (
        initiativeSel.generalInfo.beneficiaryKnown === 'true' &&
        initiativeSel.initiativeId === id &&
        initiativeSel.status !== 'DRAFT'
      ) {
        getGroupOfBeneficiaryStatusAndDetail(initiativeSel.initiativeId)
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            addError({
              id: 'GET_UPLOADED_FILE_DATA_ERROR',
              blocking: false,
              error,
              techDescription: 'An error occurred getting groups file info',
              displayableTitle: t('errors.title'),
              displayableDescription: t('errors.getFileDataDescription'),
              toNotify: true,
              component: 'Toast',
              showCloseIcon: true,
            });
          });
      }
    }
  }, [
    JSON.stringify(match),
    initiativeSel.initiativeId,
    JSON.stringify(initiativeSel.generalInfo),
  ]);

  return <div>utenti</div>;
};

export default InitiativeUsers;
