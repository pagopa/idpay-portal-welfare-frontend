import { ConfigBeneficiaryRuleArrayDTO } from '../../api/generated/initiative/ConfigBeneficiaryRuleArrayDTO';
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

export const fetchAdmissionCriteria = () =>
  new Promise((resolve) => resolve(mockedAdmissionCriteria));
