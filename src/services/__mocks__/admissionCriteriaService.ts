import { ConfigBeneficiaryRuleArrayDTO } from '../../api/generated/initiative/ConfigBeneficiaryRuleArrayDTO';
import { InitiativeApiMocked } from '../../api/__mocks__/InitiativeApiClient';
import { AdmissionCriteriaModel } from '../../model/AdmissionCriteria';

export const mockedAdmissionCriteria: ConfigBeneficiaryRuleArrayDTO = [
  {
    code: 'BIRTHDATE',
    authority: 'AUTH1',
    field: 'year',
    operator: 'EQ',
    checked: false,
  },
  {
    code: 'RESIDENCE',
    authority: 'AUTH2',
    field: 'city',
    operator: 'EQ',
    checked: false,
  },
  {
    code: 'ISEE',
    authority: 'INPS',
    operator: 'EQ',
    checked: false,
  },
];

export const verifyFetchAdmissionCriteriasMockExecution = (
  admissionCriteria: Array<AdmissionCriteriaModel>
) => {
  expect(admissionCriteria).toStrictEqual(mockedAdmissionCriteria);
};

export const fetchAdmissionCriteria = (): Promise<ConfigBeneficiaryRuleArrayDTO> =>
  new Promise((resolve) => resolve(mockedAdmissionCriteria));

export const getEligibilityCriteriaForSidebar = (): Promise<ConfigBeneficiaryRuleArrayDTO> =>
  InitiativeApiMocked.getEligibilityCriteriaForSidebar();
