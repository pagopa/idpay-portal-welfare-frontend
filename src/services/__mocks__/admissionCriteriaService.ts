import { AdmissionCriteriaModel } from '../../model/AdmissionCriteria';

export const mockedAdmissionCriteria: Array<AdmissionCriteriaModel> = [
  {
    code: '1',
    field: 'Data di nascita',
    authority: "Ministero dell'interno",
    checked: false,
  },
  {
    code: '2',
    field: 'Residenza',
    authority: "Ministero dell'interno",
    checked: false,
  },
  {
    code: '3',
    field: 'ISEE',
    authority: 'INPS',
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
