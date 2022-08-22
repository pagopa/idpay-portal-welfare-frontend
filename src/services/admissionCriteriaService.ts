// import { InitiativeApi } from '../api/InitiativeApiClient';

import { InitiativeApi } from '../api/InitiativeApiClient';
import { AdmissionCriteriaModel } from '../model/AdmissionCriteria';
// import { AdmissionCriteriaModel } from '../model/AdmissionCriteria';
import { mockedAdmissionCriteria } from './__mocks__/admissionCriteriaService';

export const fetchAdmissionCriteria = (): Promise<Array<AdmissionCriteriaModel>> => {
  console.log('PROCESS ENV', process.env.REACT_APP_API_MOCK_ADMISSION_CRITERIA);
  if (process.env.REACT_APP_API_MOCK_ADMISSION_CRITERIA === 'true') {
    return new Promise((resolve) => resolve(mockedAdmissionCriteria));
  } else {
    // throw new Error('TODO');
    return InitiativeApi.getEligibilityCriteriaForSidebar().then((res) => res);
  }
};
