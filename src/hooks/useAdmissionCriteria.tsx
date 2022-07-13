import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { AdmissionCriteria } from '../model/AdmissionCriteria';
import {
  admissionCriteriaActions,
  admissionCriteriaSelectors,
} from '../redux/slices/admissionCriteriaSlice';
import { fetchAdmissionCriteria } from '../services/admissionCriteriaService';

export const useAdmissionCriteria = (): (() => Promise<Array<AdmissionCriteria>>) =>
  useReduxCachedValue(
    'ADMISSION_CRITERIA',
    fetchAdmissionCriteria,
    admissionCriteriaSelectors.selectAdmissionCriteriaList,
    admissionCriteriaActions.setAdmissionCriteriaList
  );
