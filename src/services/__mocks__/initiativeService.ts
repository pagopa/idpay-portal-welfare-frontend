import { TypeEnum } from '../../api/generated/initiative/ChannelDTO';
import { InitiativeBeneficiaryRuleDTO } from '../../api/generated/initiative/InitiativeBeneficiaryRuleDTO';
import { InitiativeDTO } from '../../api/generated/initiative/InitiativeDTO';
import { InitiativeGeneralDTO } from '../../api/generated/initiative/InitiativeGeneralDTO';
import { InitiativeInfoDTO } from '../../api/generated/initiative/InitiativeInfoDTO';
import { InitiativeSummaryArrayDTO } from '../../api/generated/initiative/InitiativeSummaryArrayDTO';
import { BeneficiaryTypeEnum } from '../../utils/constants';

export const mockedInitiativeSummary = [
  {
    initiativeId: '62e29002aac2e94cfa3763dd',
    initiativeName: 'Servizio Test 1',
    status: 'DRAFT',
    creationDate: new Date('2022-07-28T13:32:50.002'),
    updateDate: new Date('2022-08-09T08:35:36.516'),
  },
  {
    initiativeId: '62e2b88a186e8b0b359dd06e',
    initiativeName: 'Fish',
    status: 'PUBLISHED',
    creationDate: new Date('2022-07-10T16:25:46.363'),
  },
  {
    initiativeId: '62e2bdae186e8b0b359dd06f',
    initiativeName: 'Soap',
    status: 'APPROVED',
    creationDate: new Date('2022-07-28T16:47:42.05'),
    updateDate: new Date('2022-07-28T16:47:43.402'),
  },
  {
    initiativeId: '62e2be2a186e8b0b359dd070',
    initiativeName: 'Pants',
    status: 'TO_CHECK',
    creationDate: new Date('2022-07-10T16:49:46.494'),
    updateDate: new Date('2022-07-28T16:49:46.982'),
  },
];

export const mockedInitiativeDetail = {
  initiativeId: '62e29002aac2e94cfa3763dd',
  organizationId: '2f63a151-da4e-4e1e-acf9-adecc0c4d727',
  status: 'DRAFT',
  creationDate: new Date('2022-07-28T13:32:50.002'),
  updateDate: new Date('2022-08-09T08:35:36.516'),
  general: {
    budget: 8515,
    beneficiaryType: BeneficiaryTypeEnum.PF,
    beneficiaryKnown: false,
    beneficiaryBudget: 801,
    startDate: new Date('2022-10-01'),
    endDate: new Date('2023-01-31'),
    rankingStartDate: new Date('2022-09-01'),
    rankingEndDate: new Date('2022-09-30'),
  },
  additionalInfo: {
    serviceId: '',
    serviceName: 'Servizio Test 1',
    argument: 'Argomento di test',
    description: 'Descrizione di test',
    channels: [
      {
        type: TypeEnum.email,
        contact: 'test@mail.it',
      },
    ],
  },
  beneficiaryRule: {
    selfDeclarationCriteria: [],
    automatedCriteria: [
      {
        authority: 'AUTH1',
        code: 'BIRTHDATE',
        field: 'year',
        operator: 'GT',
        value: '18',
      },
      {
        authority: 'INPS',
        code: 'ISEE',
        field: 'ISEE',
        operator: 'GT',
        value: '40000',
      },
    ],
  },
};

export const mockedInitiativeGeneralBody = {
  general: {
    beneficiaryType: BeneficiaryTypeEnum.PF,
    beneficiaryKnown: false,
    budget: 8515,
    beneficiaryBudget: 801,
    rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
    rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
    startDate: new Date('2022-10-01T00:00:00.000Z'),
    endDate: new Date('2023-01-31T00:00:00.000Z'),
  },
  additionalInfo: {
    serviceId: '',
    serviceName: 'Servizio Test 1',
    argument: 'Argomento di test',
    description: 'Descrizione di test',
    channels: [{ type: TypeEnum.email, contact: 'test@mail.it' }],
  },
};

export const mockedInitiativeBeneficiaryRuleBody = {
  automatedCriteria: [
    {
      authority: 'AUTH1',
      code: 'BIRTHDATE',
      field: 'year',
      operator: 'GT',
      value: '18',
      value2: '',
    },
    {
      authority: 'INPS',
      code: 'ISEE',
      field: 'ISEE',
      operator: 'GT',
      value: '40000',
      value2: '',
    },
  ],
  selfDeclarationCriteria: [],
};

export const mockedInitiativeId = '62e29002aac2e94cfa3763dd';

export const verifyGetInitiativeSummaryMockExecution = (
  initiativeSummary: InitiativeSummaryArrayDTO
) => expect(initiativeSummary).toStrictEqual(mockedInitiativeSummary);

export const getInitativeSummary = () => new Promise((resolve) => resolve(mockedInitiativeSummary));

export const verifyGetInitiativeDetailMockExecution = (initiativeDetail: InitiativeDTO) =>
  expect(initiativeDetail).toStrictEqual(mockedInitiativeDetail);

export const getInitiativeDetail = (_id: string) =>
  new Promise((resolve) => resolve(mockedInitiativeDetail));

export const verifySaveInitiativeGeneralBodyMockExecution = (generalBody: InitiativeInfoDTO) =>
  expect(generalBody).toStrictEqual(mockedInitiativeGeneralBody);

export const saveGeneralInfoService = (_mockedInitiativeGeneralBody: InitiativeInfoDTO) =>
  new Promise((resolve) => resolve('createdInitiativeId'));

export const putGeneralInfo = (_id: string, _data: InitiativeGeneralDTO): Promise<void> =>
  new Promise((resolve) => resolve());

export const putBeneficiaryRuleService = (
  _id: string,
  _data: InitiativeBeneficiaryRuleDTO
): Promise<void> => new Promise((resolve) => resolve());

export const putBeneficiaryRuleDraftService = (
  _id: string,
  _data: InitiativeBeneficiaryRuleDTO
): Promise<void> => new Promise((resolve) => resolve());
