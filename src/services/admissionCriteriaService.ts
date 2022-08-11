// import { InitiativeApi } from '../api/InitiativeApiClient';
import { AdmissionCriteriaModel } from '../model/AdmissionCriteria';
import { mockedAdmissionCriteria } from './__mocks__/admissionCriteriaService';

export const fetchAdmissionCriteria = (): Promise<Array<AdmissionCriteriaModel>> => {
  if (process.env.REACT_APP_API_MOCK_ADMISSION_CRITERIA) {
    return new Promise((resolve) => resolve(mockedAdmissionCriteria));
  } else {
    throw new Error('TODO');
    //   return InitiativeApi.getEligibilityCriteriaForSidebar(id).then((res) => res);
  }
};
