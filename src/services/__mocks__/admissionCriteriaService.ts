import { ConfigBeneficiaryRuleArrayDTO } from '../../api/generated/initiative/ConfigBeneficiaryRuleArrayDTO';
import { InitiativeApiMocked } from '../../api/__mocks__/InitiativeApiClient';
import { AdmissionCriteriaModel } from '../../model/AdmissionCriteria';

export const mockedAdmissionCriteria: ConfigBeneficiaryRuleArrayDTO = [
  {
    code: 'ISEE',
    authority: 'INPS',
    operator: 'EQ',
    checked: false,
  },
  {
    code: 'BIRTHDATE',
    authority: 'AUTH1',
    field: 'Year',
    operator: 'EQ',
    checked: false,
  },
  {
    code: 'RESIDENCE',
    authority: 'AUTH2',
    field: 'City',
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
