import { useLocation } from 'react-router-dom';
import { matchPath } from 'react-router';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { useTranslation } from 'react-i18next';
import ROUTES from '../routes';
import { getInitiativeDetail } from '../services/intitativeService';
import { useAppDispatch } from '../redux/hooks';
import {
  resetInitiative,
  saveAutomatedCriteria,
  saveManualCriteria,
  setAdditionalInfo,
  setGeneralInfo,
  setInitiativeId,
  setOrganizationId,
  setStatus,
} from '../redux/slices/initiativeSlice';
import { AutomatedCriteriaItem, ManualCriteriaItem } from '../model/Initiative';
import { parseGeneralInfo, parseAdditionalInfo } from '../pages/initiativeList/helpers';

interface MatchParams {
  id: string;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useInitiative = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();
  const { t } = useTranslation();

  const match = matchPath(location.pathname, {
    path: ROUTES.INITIATIVE,
    exact: true,
    strict: false,
  });

  // eslint-disable-next-line no-prototype-builtins
  if (match !== null && match.params.hasOwnProperty('id')) {
    const { id } = match.params as MatchParams;
    console.log(id);

    getInitiativeDetail(id)
      .then((response) => {
        dispatch(resetInitiative());
        dispatch(setInitiativeId(response.initiativeId));
        dispatch(setOrganizationId(response.organizationId));
        dispatch(setStatus(response.status));
        const generalInfo = parseGeneralInfo(response.general);
        dispatch(setGeneralInfo(generalInfo));
        const additionalInfo = parseAdditionalInfo(response.additionalInfo);
        dispatch(setAdditionalInfo(additionalInfo));
        // eslint-disable-next-line functional/no-let
        let automatedCriteria: Array<AutomatedCriteriaItem> = [];
        const selfDeclarationCriteria: Array<ManualCriteriaItem> = [];
        if (
          response.beneficiaryRule &&
          response.beneficiaryRule.automatedCriteria &&
          Object.keys(response.beneficiaryRule.automatedCriteria).length !== 0
        ) {
          automatedCriteria = [...response.beneficiaryRule.automatedCriteria];
        }

        if (
          response.beneficiaryRule &&
          response.beneficiaryRule.selfDeclarationCriteria &&
          Object.keys(response.beneficiaryRule.selfDeclarationCriteria).length !== 0
        ) {
          const manualCriteriaFetched: Array<{
            _type?: string;
            description?: string;
            value?: boolean | Array<string>;
            code?: string;
          }> = [...response.beneficiaryRule.selfDeclarationCriteria];

          manualCriteriaFetched.forEach((m) => {
            if (typeof m.value === 'boolean') {
              // eslint-disable-next-line functional/immutable-data
              selfDeclarationCriteria.push({
                // eslint-disable-next-line no-underscore-dangle
                _type: m._type,
                boolValue: m.value,
                multiValue: [],
                description: m.description || '',
                code: m.code || '',
              });
            } else if (Array.isArray(m.value)) {
              // eslint-disable-next-line functional/immutable-data
              selfDeclarationCriteria.push({
                // eslint-disable-next-line no-underscore-dangle
                _type: m._type,
                boolValue: true,
                multiValue: [...m.value],
                description: m.description || '',
                code: m.code || '',
              });
            }
          });
        }
        dispatch(saveAutomatedCriteria(automatedCriteria));
        dispatch(saveManualCriteria(selfDeclarationCriteria));
      })
      .catch((error) => {
        addError({
          id: 'GET_INITIATIVE_DETAIL_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting initiative data',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      });
  }
};
