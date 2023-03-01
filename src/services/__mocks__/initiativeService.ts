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
import { StatusEnum } from '../../api/generated/initiative/RewardImportsDTO';
import { WalletDTO } from '../../api/generated/initiative/WalletDTO';
import { StatusEnum as WalletStatusEnum } from '../../api/generated/initiative/WalletDTO';
import { StatusEnum as InstrumentStatusEnum } from '../../api/generated/initiative/InstrumentDTO';
import { IbanDTO } from '../../api/generated/initiative/IbanDTO';
import { InstrumentListDTO } from '../../api/generated/initiative/InstrumentListDTO';
import { TimelineDTO } from '../../api/generated/initiative/TimelineDTO';
import { OperationDTO } from '../../api/generated/initiative/OperationDTO';
import { ExportSummaryDTO } from '../../api/generated/initiative/ExportSummaryDTO';
import { ExportListDTO } from '../../api/generated/initiative/ExportListDTO';
import { RefundDetailDTO } from '../../api/generated/initiative/RefundDetailDTO';
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
    mockedExportsPagedParam.id,
    mockedExportsPagedParam.page,
    mockedExportsPagedParam.notificationDateFrom,
    mockedExportsPagedParam.notificationDateTo,
    mockedExportsPagedParam.status,
    mockedExportsPagedParam.sort
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
    mockedOnBoardingStatusParam.id,
    mockedOnBoardingStatusParam.page,
    mockedOnBoardingStatusParam.dateFrom,
    mockedOnBoardingStatusParam.dateTo,
    mockedOnBoardingStatusParam.status
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
    mockedExportsPagedParam.id,
    mockedExportsPagedParam.page,
    mockedExportsPagedParam.sort
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

export const getExportSummary = (
  initaitveId: string,
  exportId: string
): Promise<ExportSummaryDTO> => InitiativeApiMocked.getExportSummary(initaitveId, exportId);

export const getExportRefundsListPaged = (
  initaitveId: string,
  exportId: string,
  page: number,
  _cro?: string,
  _status?: string
): Promise<ExportListDTO> =>
  InitiativeApiMocked.getExportRefundsListPaged(initaitveId, exportId, page);

export const getRefundDetail = (initiativeId: string, eventId: string): Promise<RefundDetailDTO> =>
  InitiativeApiMocked.getRefundDetail(initiativeId, eventId);

export const getRankingFileDownload = (_id: string, _filename: string): Promise<SasToken> =>
  InitiativeApiMocked.getRankingFileDownload(mockedInitiativeId, mockedFileName);

export const notifyCitizenRankings = (_id: string): Promise<void> =>
  InitiativeApiMocked.notifyCitizenRankings(mockedInitiativeId);

// export const verifySaveInitiativeGeneralBodyMockExecution = (generalBody: InitiativeInfoDTO) =>
//   expect(generalBody).toStrictEqual(mockedInitiativeGeneralBody);

// export const saveGeneralInfoService = (_mockedInitiativeGeneralBody: InitiativeInfoDTO) =>
//   new Promise((resolve) => resolve('createdInitiativeId'));

// export const getWalletInfo = (_id: string, _cf: string): Promise<MockedWalletDTO> =>
//   InitiativeApiMocked.getWalletInfo(mockedInitiativeId, mockedFiscalCode);

export const getIban = (_iban: string): Promise<IbanDTO> => InitiativeApiMocked.getIban(mockedIban);

export const getTimeLine = (
  _cf: string,
  _id: string,
  _opeType?: string,
  _dateFrom?: string,
  _dateTo?: string,
  _page?: number,
  _size?: number
): Promise<TimelineDTO> => InitiativeApiMocked.getTimeLine(mockedFiscalCode, mockedInitiativeId);

export const getInstrumentList = (_id: string, _cf: string): Promise<InstrumentListDTO> =>
  InitiativeApiMocked.getInstrumentList(mockedInitiativeId, mockedFiscalCode);

export const getTimelineDetail = (
  _cf: string,
  _id: string,
  _operationId: string
): Promise<OperationDTO> =>
  InitiativeApiMocked.getTimelineDetail(
    mockedOperationId,
    mockedOperationType,
    mockedOperationDate
  );

export const getWalletDetail = (_id: string, _cf: string): Promise<WalletDTO> =>
  InitiativeApiMocked.getWalletDetail(mockedInitiativeId, mockedFiscalCode);

export const mockedFiscalCode = 'TRNFNC96R02H501I';
export const mockedIban = 'IT12T1234512345123456789012';
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
    updateDate: new Date('2022-08-09T08:35:36.516'),
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

export const mockedWallet = {
  initiativeId: '62e29002aac2e94cfa3763dd',
  initiativeName: 'Test wallet',
  status: WalletStatusEnum.REFUNDABLE,
  endDate: new Date('2023-01-04T15:44:53.816Z'),
  amount: 5,
  accrued: 10,
  refunded: 15,
  lastCounterUpdate: new Date('2023-01-04T15:44:53.816Z'),
  iban: 'IT12T1234512345123456789012',
  nInstr: 0,
};

export const mockedIbanInfo = {
  iban: 'IT12T1234512345123456789012',
  checkIbanStatus: 'ok',
  holderBank: 'Intesa Sanpaolo S.p.A',
  description: 'descrizione',
  channel: 'IO',
  bicCode: 'bic code',
  queueDate: 'queue Date',
  checkIbanResponseDate: new Date('2023-01-04T16:38:43.590Z'),
};

export const mockedWalletInstrument = {
  instrumentList: [
    {
      idWallet: '12345',
      instrumentId: '1122334455',
      maskedPan: '1111 2222 3333 4444',
      channel: 'channel',
      brandLogo:
        'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
      status: InstrumentStatusEnum.ACTIVE,
      activationDate: new Date('2023-01-04T16:38:43.590Z'),
    },
    {
      idWallet: '678910',
      instrumentId: '667788991010',
      maskedPan: '5555 6666 7777 8888',
      channel: 'channel',
      brandLogo:
        'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
      status: InstrumentStatusEnum.ACTIVE,
      activationDate: new Date('2023-01-04T16:38:43.590Z'),
    },
    {
      idWallet: '678910',
      instrumentId: '667788991010',
      maskedPan: '5555 6666 7777 8888',
      channel: 'channel',
      brandLogo:
        'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
      status: InstrumentStatusEnum.PENDING_DEACTIVATION_REQUEST,
      activationDate: new Date('2023-01-04T16:38:43.590Z'),
    },
    {
      idWallet: '678910',
      instrumentId: '667788991010',
      maskedPan: '5555 6666 7777 8888',
      channel: 'channel',
      brandLogo:
        'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
      status: InstrumentStatusEnum.PENDING_ENROLLMENT_REQUEST,
      activationDate: new Date('2023-01-04T16:38:43.590Z'),
    },
  ],
};

export const mockedOperationList: TimelineDTO = {
  lastUpdate: new Date('2023-01-05T10:22:28.012Z'),
  operationList: [
    {
      operationId: '1u1u1u1u1u1u1u',
      operationType: 'PAID_REFUND',
      operationDate: '2023-02-05T10:22:28.012Z',
      maskedPan: '1234123412341234',
      amount: 345,
      accrued: 10,
      circuitType: 'circuito',
      iban: '',
      channel: 'App IO',
      brandLogo: '',
      idTrxAcquirer: '349589304999',
      idTrxIssuer: '0001923192038',
      eventId: '111111',
    },
    {
      operationId: '2e2e2e2e2e2e2e2',
      operationType: 'TRANSACTION',
      operationDate: '2023-01-05T10:22:28.012Z',
      maskedPan: '1234123412341234',
      amount: 34,
      accrued: 0,
      circuitType: 'circuito',
      iban: '',
      channel: '',
      brandLogo: '',
      idTrxAcquirer: '349589304999',
      idTrxIssuer: '0001923192038',
    },
    {
      operationId: '3e3e3e3e3e3e3e3e',
      operationType: 'ADD_IBAN',
      operationDate: '2023-01-05T10:22:28.012Z',
      maskedPan: '1234123412341234',
      amount: 34,
      accrued: 0,
      circuitType: 'circuito',
      iban: 'IT12T1234512345123456789012',
      channel: 'App IO',
      brandLogo: '',
      idTrxAcquirer: '349589304999',
      idTrxIssuer: '0001923192038',
    },
  ],
  pageNo: 0,
  pageSize: 10,
  totalElements: 3,
  totalPages: 1,
};

export const mockedOperationDetail: OperationDTO = {
  operationId: '1u1u1u1u1u1u1u',
  operationType: 'PAID_REFUND',
  operationDate: '2023-02-05T10:22:28.012Z',
  maskedPan: '1234123412341234',
  amount: 345,
  accrued: 10,
  brand: 'VISA',
  iban: '',
  channel: 'App IO',
  brandLogo: '',
  idTrxAcquirer: '349589304999',
  idTrxIssuer: '0001923192038',
};

export const mockedOperationType = 'PAID_REFUND';
export const mockedOperationId = '63ecc1eb10dc9d6cfb01371e';
export const mockedOperationDate = '2023-02-15T12:28:42.949';

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
  initiativeOnIO: true,
  serviceName: 'newStepOneTest',
  serviceScope: ServiceScopeEnum.NATIONAL,
  serviceDescription: 'newStepOneTest',
  privacyPolicyUrl: 'http://test.it',
  termsAndConditions: 'http://test.it',
  channels: [{ type: TypeEnum.web, contact: 'http://test.it' }],
  assistanceChannels: [{ type: 'web', contact: 'string' }],
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

export const mockedNotificationReward = {
  content: [
    {
      contentLength: 0,
      eTag: 'string',
      elabDate: new Date(),
      errorsSize: 1,
      exportIds: ['string'],
      feedbackDate: new Date(),
      filePath: 'string',
      initiativeId: 'string',
      organizationId: 'string',
      percentageResulted: 'string',
      percentageResultedOk: 'string',
      percentageResultedOkElab: 'string',
      rewardsResulted: 0,
      rewardsResultedError: 0,
      rewardsResultedOk: 0,
      rewardsResultedOkError: 0,
      status: StatusEnum.COMPLETE,
      url: 'string',
    },
  ],
  totalElements: 5,
  totalPages: 1,
};

export const mockedInitiativeStatistics = {
  accruedRewards: '10',

  lastUpdatedDateTime: new Date(),

  onboardedCitizenCount: 2,
};

export const mockedGetDispFileError = {
  data: 'string',
};

export const mockedGetRewardFileDownload = {
  sas: 'string',
};

export const mockedGetRankingFileDownload = {
  sas: 'string',
};

export const mockedGetIniOnboardingRankingStatusPaged = {
  content: [
    {
      beneficiary: 'string',
      criteriaConsensusTimestamp: new Date(),
      rankingValue: 0,
      ranking: 0,
      beneficiaryRankingStatus: 'ELIGIBLE_OK',
    },
  ],
  pageNumber: 0,
  pageSize: 0,
  totalElements: 0,
  totalPages: 0,
  rankingStatus: 'COMPLETED',
  rankingPublishedTimestamp: new Date(),
  rankingGeneratedTimestamp: new Date(),
  totalEligibleOk: 0,
  totalEligibleKo: 0,
  totalOnboardingKo: 0,
  rankingFilePath: 'string',
};

export const mockedExportsPagedParam = {
  id: '62e29002aac2e94cfa3763dd',
  page: 10,
  status: 'EXPORTED',
  notificationDateFrom: '11/11/2022',
  notificationDateTo: '11/11/2022',
  sort: 'DESC',
};

export const mockedExportsPagedResponse = {
  content: [
    {
      feedbackDate: new Date(),
      filePath: 'string',
      id: 'string',
      initiativeId: 'string',
      initiativeName: 'string',
      notificationDate: new Date(),
      organizationId: 'string',
      percentageResulted: 'string',
      percentageResultedOk: 'string',
      percentageResults: 'string',
      rewardsExported: 'string',
      rewardsNotified: 0,
      rewardsResulted: 0,
      rewardsResultedOk: 0,
      rewardsResults: 'string',
      status: StatusEnum.COMPLETE,
    },
  ],
  totalElements: 0,
  totalPages: 0,
};

export const mockedOnBoardingStatusParam = {
  id: '62e29002aac2e94cfa3763dd',
  page: 10,
  status: 'EXPORTED',
  dateFrom: '11/11/2022',
  dateTo: '11/11/2022',
  beneficiary: 'MCCGRL01C25M052R',
};

export const mockedOnBoardingStatusResponse = {
  content: [
    {
      beneficiary: 'string',
      beneficiaryState: 'string',
      updateStatusDate: new Date(),
    },
  ],
  pageNo: 0,
  pageSize: 0,
  totalElements: 0,
  totalPages: 0,
};

export const mockedRefundsDetailsSummary = {
  createDate: new Date(),
  totalAmount: 5678090800,
  totalRefundedAmount: 3500090800,
  totalRefunds: 2250789,
  successPercentage: '10',
  status: 'EXPORTED',
};

export const mockedRefundsDetailsListItem = {
  content: [
    {
      id: 'string',
      iban: 'string',
      amount: 0,
      status: 'string',
    },
  ],
  pageNo: 0,
  pageSize: 0,
  totalElements: 0,
  totalPages: 0,
};

export const mockedRefundsDetailsByEventRes = {
  fiscalCode: 'AAAAAA00A00A000C',
  iban: 'IT99C1234567890123456789012',
  amount: 9999999999,
  startDate: new Date(),
  endDate: new Date(),
  status: 'DONE',
  refundType: 'Ordinario',
  cro: '12345678901',
  transferDate: new Date(),
  userNotificationDate: new Date(),
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

export const mockedOrganizationsList = [
  {
    organizationId: '1',
    organizationName: 'Comune di Milano',
  },
  {
    organizationId: '2',
    organizationName: 'Comune di Roma',
  },
  {
    organizationId: '3',
    organizationName: 'Comune di Genova',
  },
  {
    organizationId: '4',
    organizationName: 'Comune di Firenze',
  },
  {
    organizationId: '5',
    organizationName: 'Comune di Aosta',
  },
  {
    organizationId: '6',
    organizationName: 'Comune di Venezia',
  },
  {
    organizationId: '7',
    organizationName: 'Comune di Genoveffa',
  },
];
