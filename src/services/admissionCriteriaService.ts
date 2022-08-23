// import { InitiativeApi } from '../api/InitiativeApiClient';

import { ConfigBeneficiaryRuleArrayDTO } from '../api/generated/initiative/ConfigBeneficiaryRuleArrayDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';
import { mockedAdmissionCriteria } from './__mocks__/admissionCriteriaService';

export const fetchAdmissionCriteria = (): Promise<Array<ConfigBeneficiaryRuleArrayDTO>> => {
  console.log('PROCESS ENV', process.env.REACT_APP_API_MOCK_ADMISSION_CRITERIA);
  if (process.env.REACT_APP_API_MOCK_ADMISSION_CRITERIA === 'true') {
    return new Promise((resolve) => resolve(mockedAdmissionCriteria));
  } else {
    // throw new Error('TODO');
    return InitiativeApi.getEligibilityCriteriaForSidebar().then((res) => res);
  }
};
