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
import { InitiativeApiMocked } from '../../api/__mocks__/InitiativeApiClient';
import { InitiativeStatisticsDTO } from '../../api/generated/initiative/InitiativeStatisticsDTO';
import { InitiativeRewardAndTrxRulesDTO } from '../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { PageRewardExportsDTO } from '../../api/generated/initiative/PageRewardExportsDTO';
import { SasToken } from '../../api/generated/initiative/SasToken';
import { OnboardingDTO } from '../../api/generated/initiative/OnboardingDTO';
import { InitiativeRefundsResponse } from '../../model/InitiativeRefunds';
import { InitiativeUsersResponse } from '../../model/InitiativeUsers';
import { PageRewardImportsDTO } from '../../api/generated/initiative/PageRewardImportsDTO';
import { LogoDTO } from '../../api/generated/initiative/LogoDTO';
import { CsvDTO } from '../../api/generated/initiative/CsvDTO';
import { PageOnboardingRankingsDTO } from '../../api/generated/initiative/PageOnboardingRankingsDTO';
import { mockedFile } from './groupService';

export const verifyGetInitiativeSummaryMockExecution = (
  initiativeSummary: InitiativeSummaryArrayDTO
) => expect(initiativeSummary).toStrictEqual(mockedInitiativeSummary);

export const getInitativeSummary = (): Promise<InitiativeSummaryArrayDTO> =>
  InitiativeApiMocked.getInitativeSummary();

export const verifyGetInitiativeDetailMockExecution = (initiativeDetail: InitiativeDTO) =>
  expect(initiativeDetail).toStrictEqual(mockedInitiativeDetail);

export const getInitiativeDetail = (_id: string): Promise<InitiativeDTO> =>
  InitiativeApiMocked.getInitiativeById(mockedInitiativeId);

export const createInitiativeServiceInfo = (_data: InitiativeAdditionalDTO) =>
  InitiativeApiMocked.saveInitiativeServiceInfo({});

export const updateInitiativeGeneralInfo = (_id: string, _data: InitiativeGeneralDTO) =>
  InitiativeApiMocked.updateInitiativeGeneralInfo(mockedInitiativeId, mockedInitiativeGeneralBody);

export const updateInitiativeGeneralInfoDraft = (_id: string, _data: InitiativeGeneralDTO) =>
  InitiativeApiMocked.updateInitiativeGeneralInfoDraft(
    mockedInitiativeId,
    mockedInitiativeGeneralBody
  );

export const updateInitiativeServiceInfo = (
  _id: string,
  _data: InitiativeAdditionalDTO
): Promise<void> =>
  InitiativeApiMocked.updateInitiativeServiceInfo(mockedInitiativeId, mockedServiceInfoData);

export const putBeneficiaryRuleService = (_id: string, _data: InitiativeBeneficiaryRuleDTO) =>
  InitiativeApiMocked.initiativeBeneficiaryRulePut(
    mockedInitiativeId,
    mockedInitiativeBeneficiaryRuleBody
  );

export const putBeneficiaryRuleDraftService = (_id: string, _data: InitiativeBeneficiaryRuleDTO) =>
  InitiativeApiMocked.initiativeBeneficiaryRulePutDraft(
    mockedInitiativeId,
    mockedInitiativeBeneficiaryRuleBody
  );

export const putRefundRule = (_id: string, _data: InitiativeRefundRuleDTO): Promise<void> =>
  InitiativeApiMocked.updateInitiativeRefundRulePut(mockedInitiativeId, mockedRefundRules);

export const putRefundRuleDraftPut = (_id: string, _data: InitiativeRefundRuleDTO): Promise<void> =>
  InitiativeApiMocked.updateInitiativeRefundRuleDraftPut(mockedInitiativeId, mockedRefundRules);

export const putTrxAndRewardRules = (_id: string, _data: InitiativeRewardAndTrxRulesDTO) =>
  InitiativeApiMocked.initiativeTrxAndRewardRulesPut(mockedInitiativeId, mockedTrxAndRewardRules);

export const putTrxAndRewardRulesDraft = (_id: string, _data: InitiativeRewardAndTrxRulesDTO) =>
  InitiativeApiMocked.initiativeTrxAndRewardRulesPutDraft(
    mockedInitiativeId,
    mockedTrxAndRewardRules
  );

export const updateInitiativeApprovedStatus = (_id: string) =>
  InitiativeApiMocked.updateInitiativeApprovedStatus(mockedInitiativeId);

export const updateInitiativeToCheckStatus = (_id: string) =>
  InitiativeApiMocked.updateInitiativeToCheckStatus(mockedInitiativeId);

export const updateInitiativePublishedStatus = (_id: string) =>
  InitiativeApiMocked.updateInitiativePublishedStatus(mockedInitiativeId);

export const logicallyDeleteInitiative = (_id: string) =>
  InitiativeApiMocked.logicallyDeleteInitiative(mockedInitiativeId);

export const initiativeStatistics = (): Promise<InitiativeStatisticsDTO> =>
  InitiativeApiMocked.initiativeStatistics(mockedInitiativeId);

export const getExportsPaged = (
  _id: string,
  _page: number,
  _notificationDateFrom: string | undefined,
  _notificationDateTo: string | undefined,
  _status: string | undefined
): Promise<PageRewardExportsDTO> =>
  InitiativeApiMocked.getExportsPaged(
    mockedExportsPaged.id,
    mockedExportsPaged.page,
    mockedExportsPaged.notificationDateFrom,
    mockedExportsPaged.notificationDateTo,
    mockedExportsPaged.status,
    mockedExportsPaged.sort
  );

export const getRewardFileDownload = (_id: string, _filePath: string): Promise<SasToken> =>
  InitiativeApiMocked.getRewardFileDownload(mockedInitiativeId, mockedFilePath);

export const getOnboardingStatus = (
  _id: string,
  _page: number,
  _notificationDateFrom: string | undefined,
  _notificationDateTo: string | undefined,
  _status: string | undefined,
  _beneficiary: string | undefined
): Promise<OnboardingDTO> =>
  InitiativeApiMocked.getOnboardingStatus(
    mockedOnBoardingStatus.id,
    mockedOnBoardingStatus.page,
    mockedOnBoardingStatus.dateFrom,
    mockedOnBoardingStatus.dateTo,
    mockedOnBoardingStatus.status
  );

export const putDispFileUpload = (_id: string, _filename: string, _file: File): Promise<void> =>
  InitiativeApiMocked.putDispFileUpload(mockedInitiativeId, mockedFileName, mockedFile);

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

export const getRewardNotificationImportsPaged = (
  _id: string,
  _page: number,
  _sort: string
): Promise<PageRewardImportsDTO> =>
  InitiativeApiMocked.getRewardNotificationImportsPaged(
    mockedExportsPaged.id,
    mockedExportsPaged.page,
    mockedExportsPaged.sort
  );

export const uploadAndUpdateLogo = (_id: string, _file: File): Promise<LogoDTO> =>
  InitiativeApiMocked.uploadAndUpdateLogo(mockedInitiativeId, mockedFile);

export const getDispFileErrors = (_id: string, _name: string): Promise<CsvDTO> =>
  InitiativeApiMocked.getDispFileErrors(mockedInitiativeId, mockedFilePath);

export const getInitiativeOnboardingRankingStatusPaged = (
  _id: string,
  _page: number,
  _beneficiary: string | undefined,
  _state: string | undefined
): Promise<PageOnboardingRankingsDTO> =>
  InitiativeApiMocked.getInitiativeOnboardingRankingStatusPaged(
    mockedRankingStatus.id,
    mockedRankingStatus.page,
    mockedRankingStatus.beneficiary,
    mockedRankingStatus.state
  );

export const getRankingFileDownload = (_id: string, _filename: string): Promise<SasToken> =>
  InitiativeApiMocked.getRankingFileDownload(mockedInitiativeId, mockedFileName);

export const notifyCitizenRankings = (_id: string): Promise<void> =>
  InitiativeApiMocked.notifyCitizenRankings(mockedInitiativeId);

// export const verifySaveInitiativeGeneralBodyMockExecution = (generalBody: InitiativeInfoDTO) =>
//   expect(generalBody).toStrictEqual(mockedInitiativeGeneralBody);

// export const saveGeneralInfoService = (_mockedInitiativeGeneralBody: InitiativeInfoDTO) =>
//   new Promise((resolve) => resolve('createdInitiativeId'));

export const mockedRankingStatus = {
  id: '62e29002aac2e94cfa3763dd',
  page: 10,
  beneficiary: 'MCCGRL01C25M052R',
  state: 'DEFAULT',
};

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

export const mockedTrxAndRewardRules = {
  rewardRule: { _type: 'rewardValue', rewardValue: 1 },
};

export const mockedInitiativeId = '62e29002aac2e94cfa3763dd';

export const mockedInitiativeStatistics = {
  accruedRewards: '10',

  lastUpdatedDateTime: new Date(),

  onboardedCitizenCount: 2,
};

export const mockedExportsPaged = {
  id: '62e29002aac2e94cfa3763dd',
  page: 10,
  status: 'EXPORTED',
  notificationDateFrom: '11/11/2022',
  notificationDateTo: '11/11/2022',
  sort: 'DESC',
};

export const mockedOnBoardingStatus = {
  id: '62e29002aac2e94cfa3763dd',
  page: 10,
  status: 'EXPORTED',
  dateFrom: '11/11/2022',
  dateTo: '11/11/2022',
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

// TODO check status

export const mockedInitiativeUsersPage1 = {
  pageNo: 1,
  pageSize: 15,
  totalElements: 30,
  totalPages: 2,
  content: [
    {
      beneficiary: 'AOISFN73R54B745Z',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAAHMD77P30Z330S',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAAMRO82C23Z330C',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAEBNR90E20Z216W',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAEKKK44D42Z219I',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAEKSR79L06Z249S',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAEMRD84E66Z216B',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAICLD60M12F205M',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAICLD79L54A089Y',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAICNH82A02Z210D',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAICNL90L30Z129Z',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAICRI60R13F839M',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIDNL73C60E202V',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIGNE51S23F465N',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIGPP69L63A064W',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
  ],
};

export const mockedInitiativeUsersPage2 = {
  pageNo: 2,
  pageSize: 15,
  totalElements: 30,
  totalPages: 2,
  content: [
    {
      beneficiary: 'BAIGRG96R70H501Y',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIHNN88T51Z330L',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIHSN70S23Z352B',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAILRA61S60I625H',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIMLB77D52F912F',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIMNC71A64L157Q',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIMRA46M10H537K',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIMRC53L56G972Q',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMRK76P01H501R',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMRK76P01H501R',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMRO63S13E152B',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMRS68B49H501V',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMTF79D04Z240X',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAINRN76H11F205N',
      updateStatusDate: new Date(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAINTN66B06F895L',
      updateStatusDate: new Date(),
      beneficiaryState: 'WAITING',
    },
  ],
};

export const fetchInitiativeUsers = (page: number) => {
  if (page === 0) {
    return new Promise<InitiativeUsersResponse>((resolve) => resolve(mockedInitiativeUsersPage1));
  } else {
    return new Promise<InitiativeUsersResponse>((resolve) => resolve(mockedInitiativeUsersPage2));
  }
};
