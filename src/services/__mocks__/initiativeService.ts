import { AccumulatedTypeEnum } from '../../api/generated/initiative/AccumulatedAmountDTO';
import { TypeEnum } from '../../api/generated/initiative/ChannelDTO';
import {
  InitiativeAdditionalDTO,
  ServiceScopeEnum,
} from '../../api/generated/initiative/InitiativeAdditionalDTO';
import { InitiativeBeneficiaryRuleDTO } from '../../api/generated/initiative/InitiativeBeneficiaryRuleDTO';
import { InitiativeDTO } from '../../api/generated/initiative/InitiativeDTO';
import { InitiativeGeneralDTO } from '../../api/generated/initiative/InitiativeGeneralDTO';
import { InitiativeSummaryArrayDTO } from '../../api/generated/initiative/InitiativeSummaryArrayDTO';
import { TimeTypeEnum } from '../../api/generated/initiative/TimeParameterDTO';
import { BeneficiaryTypeEnum } from '../../utils/constants';
import { InitiativeRefundRuleDTO } from '../../api/generated/initiative/InitiativeRefundRuleDTO';
import { ConfigBeneficiaryRuleArrayDTO } from '../../api/generated/initiative/ConfigBeneficiaryRuleArrayDTO';
import { InitiativeApi } from '../../api/__mocks__/InitiativeApiClient';

export const verifyGetInitiativeSummaryMockExecution = (
  initiativeSummary: InitiativeSummaryArrayDTO
) => expect(initiativeSummary).toStrictEqual(mockedInitiativeSummary);

export const getInitativeSummary = (): Promise<InitiativeSummaryArrayDTO> =>
  InitiativeApi.getInitativeSummary();

export const verifyGetInitiativeDetailMockExecution = (initiativeDetail: InitiativeDTO) =>
  expect(initiativeDetail).toStrictEqual(mockedInitiativeDetail);

export const getInitiativeDetail = (_id: string): Promise<InitiativeDTO> =>
  InitiativeApi.getInitiativeById(mockedInitiativeId);

export const createInitiativeServiceInfo = (_data: InitiativeAdditionalDTO) =>
  InitiativeApi.saveInitiativeServiceInfo({});

export const updateInitiativeGeneralInfo = (_id: string, _data: InitiativeGeneralDTO) =>
  InitiativeApi.updateInitiativeGeneralInfo(mockedInitiativeId, mockedInitiativeGeneralBody);

export const updateInitiativeGeneralInfoDraft = (_id: string, _data: InitiativeGeneralDTO) =>
  InitiativeApi.updateInitiativeGeneralInfoDraft(mockedInitiativeId, mockedInitiativeGeneralBody);

export const updateInitiativeServiceInfo = (
  _id: string,
  _data: InitiativeAdditionalDTO
): Promise<void> =>
  InitiativeApi.updateInitiativeServiceInfo(mockedInitiativeId, mockedServiceInfoData);

export const putBeneficiaryRuleService = (_id: string, _data: InitiativeBeneficiaryRuleDTO) =>
  InitiativeApi.initiativeBeneficiaryRulePut(
    mockedInitiativeId,
    mockedInitiativeBeneficiaryRuleBody
  );

export const putBeneficiaryRuleDraftService = (_id: string, _data: InitiativeBeneficiaryRuleDTO) =>
  InitiativeApi.initiativeBeneficiaryRulePutDraft(
    mockedInitiativeId,
    mockedInitiativeBeneficiaryRuleBody
  );

export const putRefundRule = (_id: string, _data: InitiativeRefundRuleDTO): Promise<void> =>
  InitiativeApi.updateInitiativeRefundRulePut(mockedInitiativeId, mockedRefundRules);

export const putRefundRuleDraftPut = (_id: string, _data: InitiativeRefundRuleDTO): Promise<void> =>
  InitiativeApi.updateInitiativeRefundRuleDraftPut(mockedInitiativeId, mockedRefundRules);

export const getEligibilityCriteriaForSidebar = (): Promise<ConfigBeneficiaryRuleArrayDTO> =>
  InitiativeApi.getEligibilityCriteriaForSidebar();

export const getGroupOfBeneficiaryStatusAndDetails = (_id: string): Promise<void> =>
  new Promise((resolve) => resolve());

export const getExportsPaged = (
  _id: string,
  _page: number,
  _notificationDateFrom: string | undefined,
  _notificationDateTo: string | undefined,
  _status: string | undefined
): Promise<void> => new Promise((resolve) => resolve());

export const getRewardFileDownload = (_id: string, _filePath: string): Promise<void> =>
  new Promise((resolve) => resolve());

export const getOnboardingStatus = (
  _id: string,
  _page: number,
  _notificationDateFrom: string | undefined,
  _notificationDateTo: string | undefined,
  _status: string | undefined
): Promise<void> => new Promise((resolve) => resolve());

export const putDispFileUpload = (_id: string, _filename: string, _file: File): Promise<void> =>
  new Promise((resolve) => resolve());

export const fetchInitiativeRefunds = (page: number) => {
  if (page === 0) {
    return new Promise<InitiativeRefundsResponse>((resolve) =>
      resolve(mockedInitiativeRefundsPage1)
    );
  } else {
    return new Promise<InitiativeRefundsResponse>((resolve) =>
      resolve(mockedInitiativeRefundsPage2)
    );
  }
};

// export const verifySaveInitiativeGeneralBodyMockExecution = (generalBody: InitiativeInfoDTO) =>
//   expect(generalBody).toStrictEqual(mockedInitiativeGeneralBody);

// export const saveGeneralInfoService = (_mockedInitiativeGeneralBody: InitiativeInfoDTO) =>
//   new Promise((resolve) => resolve('createdInitiativeId'));

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
  initiativeName: 'prova313',
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
    serviceIO: true,
    serviceId: 'provaaaaa316',
    serviceName: 'prova313',
    serviceScope: ServiceScopeEnum.LOCAL,
    description: 'culpa non sint',
    privacyLink: 'https://www.google.it',
    tcLink: 'https://www.google.it',
    channels: [
      {
        type: TypeEnum.mobile,
        contact: '336754625',
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
  beneficiaryType: BeneficiaryTypeEnum.PF,
  beneficiaryKnown: false,
  budget: 8515,
  beneficiaryBudget: 801,
  rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
  rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
  startDate: new Date('2022-10-01T00:00:00.000Z'),
  endDate: new Date('2023-01-31T00:00:00.000Z'),
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

export const mockedServiceInfoData = {
  serviceIO: true,
  serviceName: 'newStepOneTest',
  serviceScope: ServiceScopeEnum.NATIONAL,
  description: 'newStepOneTest',
  privacyLink: 'http://test.it',
  tcLink: 'http://test.it',
  channels: [{ type: TypeEnum.web, contact: 'http://test.it' }],
};

export const mockedRefundRules = {
  accumulatedAmount: {
    accumulatedType: AccumulatedTypeEnum.BUDGET_EXHAUSTED,
    refundThreshold: 10000,
  },
  additionalInfo: { identificationCode: 'test', timeParameter: TimeTypeEnum.CLOSED },
};

export interface InitiativeRefund {
  id: string;
  notificationDate: Date;
  typology: string;
  rewardsExported: number;
  rewardsResults: number;
  successPercentage: number;
  status: string;
}

export interface InitiativeRefundToDisplay {
  id: string | undefined;
  notificationDate: string | undefined;
  typology: string | undefined;
  rewardsExported: string | undefined;
  rewardsResults: string | undefined;
  successPercentage: string | undefined;
  status: { status: string | undefined; percentageResulted: string | undefined };
  filePath: { initiativeId: string | undefined; filePath: string | undefined };
}

export interface InitiativeRefundsResponse {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  list: Array<InitiativeRefund>;
}

export const mockedTrxAndRewardRules = {
  rewardRule: { _type: 'rewardValue', rewardValue: 1 },
};

export const mockedInitiativeId = '62e29002aac2e94cfa3763dd';

export const mockedExportsPaged = {
  id: '62e29002aac2e94cfa3763dd',
  page: 10,
  status: 'EXPORTED',
  notificationDateFrom: '11/11/2022',
  notificationDateTo: '11/11/2022',
  beneficiary: 'MCCGRL01C25M052R',
};

export const mockedFilePath = 'download';

export const mockedFileName = 'name';

export const mockedInitiativeRefundsPage1 = {
  pageNo: 1,
  pageSize: 10,
  totalElements: 20,
  totalPages: 2,
  list: [
    {
      id: '00000',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'READ',
    },
    {
      id: '00001',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'COMPLETE',
    },
    {
      id: '00010',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'COMPLETE',
    },
    {
      id: '00011',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'COMPLETE',
    },
    {
      id: '00100',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'EXPORTED ',
    },
    {
      id: '00101',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'EXPORTED ',
    },
    {
      id: '00110',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'EXPORTED ',
    },
    {
      id: '00111',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'READ',
    },
    {
      id: '01000',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'EXPORTED ',
    },
    {
      id: '01001',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'READ',
    },
  ],
};

export const mockedInitiativeRefundsPage2 = {
  pageNo: 2,
  pageSize: 10,
  totalElements: 20,
  totalPages: 2,
  list: [
    {
      id: '01010',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'READ',
    },
    {
      id: '01011',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'COMPLETE',
    },
    {
      id: '01100',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'COMPLETE',
    },
    {
      id: '01101',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'COMPLETE',
    },
    {
      id: '01110',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'EXPORTED ',
    },
    {
      id: '01111',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'EXPORTED ',
    },
    {
      id: '10000',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'EXPORTED ',
    },
    {
      id: '10001',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'READ',
    },
    {
      id: '10010',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'EXPORTED ',
    },
    {
      id: '10011',
      notificationDate: new Date(),
      typology: 'Ordinario',
      rewardsExported: 1000,
      rewardsResults: 30,
      successPercentage: 99,
      status: 'EXPORTED',
    },
  ],
};
