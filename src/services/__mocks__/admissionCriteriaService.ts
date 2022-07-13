import { AdmissionCriteria } from '../../model/AdmissionCriteria';

export const mockedAdmissionCriteria: Array<AdmissionCriteria> = [
  {
    id: '1',
    title: 'Data di nascita',
    subtitle: "Ministero dell'interno",
    checked: false,
  },
  {
    id: '2',
    title: 'Residenza',
    subtitle: "Ministero dell'interno",
    checked: false,
  },
  {
    id: '3',
    title: 'ISEE',
    subtitle: 'INPS',
    checked: false,
  },
];

export const verifyFetchAdmissionCriteriasMockExecution = (
  admissionCriteria: Array<AdmissionCriteria>
) => {
  expect(admissionCriteria).toStrictEqual(mockedAdmissionCriteria);
};

export const fetchAdmissionCriteria = () =>
  new Promise((resolve) => resolve(mockedAdmissionCriteria));
