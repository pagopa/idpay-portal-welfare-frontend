import type {
  InitiativeSummaryArrayDTO,
  OrganizationListDTO,
  InitiativeDTO,
  InitiativeAdditionalDTO,
  InitiativeGeneralDTO,
  InitiativeBeneficiaryRuleDTO,
  InitiativeRefundRuleDTO,
  InitiativeRewardAndTrxRulesDTO,
  InitiativeStatisticsDTO,
  PageRewardExportsDTO,
  SasToken,
  OnboardingDTO,
  ConfigBeneficiaryRuleArrayDTO,
  PageRewardImportsDTO,
  LogoDTO,
  CsvDTO,
  PageOnboardingRankingsDTO,
  ExportSummaryDTO,
  ExportListDTO,
  RefundDetailDTO,
  OnboardingStatusDTO,
  IbanDTO,
  TimelineDTO,
  InstrumentListDTO,
  OperationDTO,
  WalletDTO,
  FamilyUnitCompositionDTO,
  InitiativeRewardRuleDTO,
  RewardGroupsDTO,
  RewardValueDTO,
} from '../../api/generated/initiative/apiClient';
import {
  AccumulatedAmountDtoAccumulatedTypeEnum as ApiAccumulatedAmountDtoAccumulatedTypeEnum,
  AutomatedCriteriaDtoIseeTypesEnum as ApiAutomatedCriteriaDtoIseeTypesEnum,
  ChannelDtoTypeEnum as ApiChannelDtoTypeEnum,
  InitiativeAdditionalDtoServiceScopeEnum as ApiInitiativeAdditionalDtoServiceScopeEnum,
  InitiativeGeneralDtoBeneficiaryTypeEnum as ApiInitiativeGeneralDtoBeneficiaryTypeEnum,
  InitiativeDtoInitiativeRewardTypeEnum as ApiInitiativeRewardTypeEnum,
  InitiativeRewardAndTrxRulesDtoInitiativeRewardTypeEnum as ApiInitiativeRewardAndTrxRulesDtoInitiativeRewardTypeEnum,
  InitiativeRewardRuleDtoRewardValueTypeEnum as ApiInitiativeRewardRuleDtoRewardValueTypeEnum,
  IbanOperationDtoOperationTypeEnum as ApiIbanOperationDtoOperationTypeEnum,
  InstrumentDtoInstrumentTypeEnum as ApiInstrumentDtoInstrumentTypeEnum,
  InstrumentDtoStatusEnum as ApiInstrumentDtoStatusEnum,
  InstrumentOperationDtoInstrumentTypeEnum as ApiInstrumentOperationDtoInstrumentTypeEnum,
  InstrumentOperationDtoOperationTypeEnum as ApiInstrumentOperationDtoOperationTypeEnum,
  OnboardingOperationDtoOperationTypeEnum as ApiOnboardingOperationDtoOperationTypeEnum,
  OnboardingDetailDtoStatusEnum as ApiOnboardingDetailDtoStatusEnum,
  OnboardingStatusDtoStatusEnum as ApiOnboardingStatusDtoStatusEnum,
  RejectedInstrumentOperationDtoInstrumentTypeEnum as ApiRejectedInstrumentOperationDtoInstrumentTypeEnum,
  RejectedInstrumentOperationDtoOperationTypeEnum as ApiRejectedInstrumentOperationDtoOperationTypeEnum,
  RefundOperationDtoOperationTypeEnum as ApiRefundOperationDtoOperationTypeEnum,
  RewardImportsDtoStatusEnum as ApiRewardImportsDtoStatusEnum,
  TransactionOperationDtoOperationTypeEnum as ApiTransactionOperationDtoOperationTypeEnum,
  TransactionOperationDtoStatusEnum as ApiTransactionOperationDtoStatusEnum,
  TimeParameterDtoTimeTypeEnum as ApiTimeParameterDtoTimeTypeEnum,
  StatusOnboardingDtosBeneficiaryStateEnum as ApiStatusOnboardingDtosBeneficiaryStateEnum,
  WalletDtoStatusEnum as ApiWalletDtoStatusEnum,
} from '../../api/generated/initiative/apiClient';
import type { InitiativeRefundsResponse } from '../../model/InitiativeRefunds';
import type { InitiativeUsersResponse } from '../../model/InitiativeUsers';

export const InitiativeRewardTypeEnum = ApiInitiativeRewardTypeEnum;
const WalletDtoStatusEnum = ApiWalletDtoStatusEnum;
const InstrumentDtoStatusEnum = ApiInstrumentDtoStatusEnum;
const InstrumentDtoInstrumentTypeEnum = ApiInstrumentDtoInstrumentTypeEnum;
const RewardImportsDtoStatusEnum = ApiRewardImportsDtoStatusEnum;
const StatusOnboardingDtosBeneficiaryStateEnum = ApiStatusOnboardingDtosBeneficiaryStateEnum;
const OnboardingStatusDtoStatusEnum = ApiOnboardingStatusDtoStatusEnum;
const OnboardingDetailDtoStatusEnum = ApiOnboardingDetailDtoStatusEnum;

const getInitiativeApiMocked = (): any =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('../../api/__mocks__/InitiativeApiClient').InitiativeApiMocked;

export const verifyGetInitiativeSummaryMockExecution = (
  initiativeSummary: InitiativeSummaryArrayDTO
) => {
  if (JSON.stringify(initiativeSummary) !== JSON.stringify(mockedInitiativeSummary)) {
    throw new Error('initiativeSummary mock verification failed');
  }
};

export const getOrganizationsList = (): Promise<OrganizationListDTO> =>
  getInitiativeApiMocked().getOrganizationsList();

export const getInitativeSummary = (): Promise<InitiativeSummaryArrayDTO> =>
  getInitiativeApiMocked().getInitativeSummary();

export const verifyGetInitiativeDetailMockExecution = (initiativeDetail: InitiativeDTO) => {
  if (JSON.stringify(initiativeDetail) !== JSON.stringify(mockedInitiativeDetail)) {
    throw new Error('initiativeDetail mock verification failed');
  }
};

export const getInitiativeDetail = (id: string): Promise<InitiativeDTO> =>
  getInitiativeApiMocked().getInitiativeById(id);

export const createInitiativeServiceInfo = (data: InitiativeAdditionalDTO) =>
  getInitiativeApiMocked().saveInitiativeServiceInfo(data);

export const updateInitiativeGeneralInfo = (id: string, data: InitiativeGeneralDTO) =>
  getInitiativeApiMocked().updateInitiativeGeneralInfo(id, data);

export const updateInitiativeGeneralInfoDraft = (id: string, data: InitiativeGeneralDTO) =>
  getInitiativeApiMocked().updateInitiativeGeneralInfoDraft(id, data);

export const updateInitiativeServiceInfo = (
  id: string,
  data: InitiativeAdditionalDTO
): Promise<void> => getInitiativeApiMocked().updateInitiativeServiceInfo(id, data);

export const putBeneficiaryRuleService = (id: string, data: InitiativeBeneficiaryRuleDTO) =>
  getInitiativeApiMocked().initiativeBeneficiaryRulePut(id, data);

export const putBeneficiaryRuleDraftService = (
  id: string,
  data: InitiativeBeneficiaryRuleDTO
) => getInitiativeApiMocked().initiativeBeneficiaryRulePutDraft(id, data);

export const putRefundRule = (id: string, data: InitiativeRefundRuleDTO): Promise<void> =>
  getInitiativeApiMocked().updateInitiativeRefundRulePut(id, data);

export const putRefundRuleDraft = (id: string, data: InitiativeRefundRuleDTO): Promise<void> =>
  getInitiativeApiMocked().updateInitiativeRefundRuleDraftPut(id, data);

export const putTrxAndRewardRules = (id: string, data: InitiativeRewardAndTrxRulesDTO) =>
  getInitiativeApiMocked().initiativeTrxAndRewardRulesPut(id, data);

export const putTrxAndRewardRulesDraft = (id: string, data: InitiativeRewardAndTrxRulesDTO) =>
  getInitiativeApiMocked().initiativeTrxAndRewardRulesPutDraft(id, data);

export const updateInitiativeApprovedStatus = (id: string) =>
  getInitiativeApiMocked().updateInitiativeApprovedStatus(id);

export const updateInitiativeToCheckStatus = (id: string) =>
  getInitiativeApiMocked().updateInitiativeToCheckStatus(id);

export const updateInitiativePublishedStatus = (id: string) =>
  getInitiativeApiMocked().updateInitiativePublishedStatus(id);

export const logicallyDeleteInitiative = (id: string) =>
  getInitiativeApiMocked().logicallyDeleteInitiative(id);

export const initiativeStatistics = (id: string): Promise<InitiativeStatisticsDTO> =>
  getInitiativeApiMocked().initiativeStatistics(id);

export const getExportsPaged = (
  id: string,
  page: number,
  notificationDateFrom: string | undefined,
  notificationDateTo: string | undefined,
  status: string | undefined
): Promise<PageRewardExportsDTO> =>
  getInitiativeApiMocked().getExportsPaged(
    id,
    page,
    notificationDateFrom,
    notificationDateTo,
    status,
    mockedExportsPagedParam.sort
  );

export const getRewardFileDownload = (id: string, filePath: string): Promise<SasToken> =>
  getInitiativeApiMocked().getRewardFileDownload(id, filePath);

export const getOnboardingStatus = (
  id: string,
  page: number,
  beneficiary: string | undefined,
  dateFrom: string | undefined,
  dateTo: string | undefined,
  status: string | undefined
): Promise<OnboardingDTO> =>
  getInitiativeApiMocked().getOnboardingStatus(
    id,
    page,
    beneficiary,
    dateFrom,
    dateTo,
    status
  );

export const putDispFileUpload = (id: string, filename: string, file: File): Promise<void> =>
  getInitiativeApiMocked().putDispFileUpload(id, filename, file);

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

export const getEligibilityCriteriaForSidebar = (): Promise<ConfigBeneficiaryRuleArrayDTO> =>
  getInitiativeApiMocked().getEligibilityCriteriaForSidebar();

export const getRewardNotificationImportsPaged = (
  id: string,
  page: number,
  sort: string
): Promise<PageRewardImportsDTO> =>
  getInitiativeApiMocked().getRewardNotificationImportsPaged(id, page, sort);

export const uploadAndUpdateLogo = (id: string, file: File): Promise<LogoDTO> =>
  getInitiativeApiMocked().uploadAndUpdateLogo(id, file);

export const getDispFileErrors = (id: string, name: string): Promise<CsvDTO> =>
  getInitiativeApiMocked().getDispFileErrors(id, name);

export const getInitiativeOnboardingRankingStatusPaged = (
  id: string,
  page: number,
  beneficiary: string | undefined,
  state: string | undefined
): Promise<PageOnboardingRankingsDTO> =>
  getInitiativeApiMocked().getInitiativeOnboardingRankingStatusPaged(id, page, beneficiary, state);

export const trascodeRewardRule = (rewardRule: InitiativeRewardRuleDTO) => {
  if (!rewardRule || typeof rewardRule !== 'object') {
    return undefined;
  }
 
  const rewardRuleType = Reflect.get(rewardRule, '_type');
 
  switch (rewardRuleType) {
    case 'rewardGroups':
      return rewardRule as RewardGroupsDTO;
 
    case 'rewardValue':
      return rewardRule as RewardValueDTO;
 
    default:
      throw new Error(`Unknown type: ${String(rewardRuleType)}`);
  }
};
export const getExportSummary = (
  initaitveId: string,
  exportId: string
): Promise<ExportSummaryDTO> => getInitiativeApiMocked().getExportSummary(initaitveId, exportId);

export const getExportRefundsListPaged = (
  initaitveId: string,
  exportId: string,
  page: number,
  _cro?: string,
  _status?: string
): Promise<ExportListDTO> =>
  getInitiativeApiMocked().getExportRefundsListPaged(initaitveId, exportId, page);

export const getRefundDetail = (initiativeId: string, eventId: string): Promise<RefundDetailDTO> =>
  getInitiativeApiMocked().getRefundDetail(initiativeId, eventId);

export const getBeneficiaryOnboardingStatus = (
  _initiativeId: string,
  _fiscalCode: string
): Promise<OnboardingStatusDTO> =>
  getInitiativeApiMocked().getBeneficiaryOnboardingStatus(mockedInitiativeId, mockedFiscalCode);

export const suspendUser = (
  initiativeId: string,
  fiscalCode: string,
  rewardType: string
): Promise<void> => {
  if (rewardType === InitiativeRewardTypeEnum.REFUND) {
    return getInitiativeApiMocked().suspendUserRefund(initiativeId, fiscalCode);
  } else {
    return getInitiativeApiMocked().suspendUserDiscount(initiativeId, fiscalCode);
  }
};

export const readmitUser = (
  initiativeId: string,
  fiscalCode: string,
  rewardType: string
): Promise<void> => {
  if (rewardType === InitiativeRewardTypeEnum.REFUND) {
    return getInitiativeApiMocked().readmitUserRefund(initiativeId, fiscalCode);
  } else {
    return getInitiativeApiMocked().readmitUserDiscount(initiativeId, fiscalCode);
  }
};
// export const getRankingFileDownload = (_id: string, _filename: string): Promise<SasToken> =>
//   InitiativeApiMocked.getRankingFileDownload(mockedInitiativeId, mockedFileName);

export const notifyCitizenRankings = (id: string): Promise<void> =>
  getInitiativeApiMocked().notifyCitizenRankings(id);

// export const verifySaveInitiativeGeneralBodyMockExecution = (generalBody: InitiativeInfoDTO) =>
//   expect(generalBody).toStrictEqual(mockedInitiativeGeneralBody);

// export const saveGeneralInfoService = (_mockedInitiativeGeneralBody: InitiativeInfoDTO) =>
//   new Promise((resolve) => resolve('createdInitiativeId'));

// export const getWalletInfo = (_id: string, _cf: string): Promise<MockedWalletDTO> =>
//   InitiativeApiMocked.getWalletInfo(mockedInitiativeId, mockedFiscalCode);

export const getIban = (id: string, cf: string, iban: string): Promise<IbanDTO> =>
  getInitiativeApiMocked().getIban(id, cf, iban);

export const getTimeLine = (
  cf: string,
  id: string,
  opeType?: string,
  dateFrom?: string,
  dateTo?: string,
  page?: number,
  size?: number
): Promise<TimelineDTO> =>
  getInitiativeApiMocked().getTimeLine(cf, id, opeType, dateFrom, dateTo, page, size);

export const getInstrumentList = (id: string, cf: string): Promise<InstrumentListDTO> =>
  getInitiativeApiMocked().getInstrumentList(id, cf);

export const getTimelineDetail = (
  cf: string,
  id: string,
  operationId: string
): Promise<OperationDTO> =>
  getInitiativeApiMocked().getTimelineDetail(cf, id, operationId);

export const getWalletDetail = (id: string, cf: string): Promise<WalletDTO> =>
  getInitiativeApiMocked().getWalletDetail(id, cf);

export const mockedFiscalCode = 'TRNFNC96R02H501I';
export const mockedIban = 'IT12T1234512345123456789012';
export const mockedRankingStatus = {
  id: '62e29002aac2e94cfa3763dd',
  page: 10,
  beneficiary: 'MCCGRL01C25M052R',
  state: 'DEFAULT',
};

export const getFamilyComposition = (_id: string, _cf: string): Promise<FamilyUnitCompositionDTO> =>
  getInitiativeApiMocked().getFamilyComposition(_id, _cf);

export const mockedInitiativeSummary: InitiativeSummaryArrayDTO = [
  {
    initiativeId: '62e29002aac2e94cfa3763dd',
    initiativeName: 'Servizio Test 1',
    status: 'DRAFT',
    creationDate: new Date('2022-07-28T13:32:50.002').toISOString(),
    updateDate: new Date('2022-08-09T08:35:36.516').toISOString(),
  },
  {
    initiativeId: '62e2b88a186e8b0b359dd06e',
    initiativeName: 'Fish',
    status: 'PUBLISHED',
    creationDate: new Date('2022-07-10T16:25:46.363').toISOString(),
    updateDate: new Date('2022-08-09T08:35:36.516').toISOString(),
  },
  {
    initiativeId: '62e2bdae186e8b0b359dd06f',
    initiativeName: 'Soap',
    status: 'APPROVED',
    creationDate: new Date('2022-07-28T16:47:42.05').toISOString(),
    updateDate: new Date('2022-07-28T16:47:43.402').toISOString(),
  },
  {
    initiativeId: '62e2be2a186e8b0b359dd070',
    initiativeName: 'Pants',
    status: 'TO_CHECK',
    creationDate: new Date('2022-07-10T16:49:46.494').toISOString(),
    updateDate: new Date('2022-07-28T16:49:46.982').toISOString(),
  },
];

export const mockedWallet = {
  initiativeId: '62e29002aac2e94cfa3763dd',
  initiativeName: 'Test wallet',
  status: WalletDtoStatusEnum.REFUNDABLE,
  endDate: new Date('2023-01-04T15:44:53.816Z').toISOString(),
  amount: 5,
  accrued: 10,
  refunded: 15,
  lastCounterUpdate: new Date('2023-01-04T15:44:53.816Z').toISOString(),
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
  checkIbanResponseDate: new Date('2023-01-04T16:38:43.590Z').toISOString(),
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
      status: InstrumentDtoStatusEnum.ACTIVE,
      activationDate: new Date('2023-01-04T16:38:43.590Z').toISOString(),
      instrumentType: InstrumentDtoInstrumentTypeEnum.CARD,
    },
    {
      idWallet: '678910',
      instrumentId: '667788991010',
      maskedPan: '5555 6666 7777 8888',
      channel: 'channel',
      brandLogo:
        'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
      status: InstrumentDtoStatusEnum.ACTIVE,
      activationDate: new Date('2023-01-04T16:38:43.590Z').toISOString(),
      instrumentType: InstrumentDtoInstrumentTypeEnum.CARD,
    },
    {
      idWallet: '678910',
      instrumentId: '667788991010',
      maskedPan: '5555 6666 7777 8888',
      channel: 'channel',
      brandLogo:
        'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
      status: InstrumentDtoStatusEnum.PENDING_DEACTIVATION_REQUEST,
      activationDate: new Date('2023-01-04T16:38:43.590Z').toISOString(),
      instrumentType: InstrumentDtoInstrumentTypeEnum.CARD,
    },
    {
      idWallet: '678910',
      instrumentId: '667788991010',
      maskedPan: '5555 6666 7777 8888',
      channel: 'channel',
      brandLogo:
        'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
      status: InstrumentDtoStatusEnum.PENDING_ENROLLMENT_REQUEST,
      activationDate: new Date('2023-01-04T16:38:43.590Z').toISOString(),
      instrumentType: InstrumentDtoInstrumentTypeEnum.CARD,
    },
  ],
};

export const mockedOperationList: TimelineDTO = {
  // lastUpdate: new Date('2023-01-05T10:22:28.012Z'),
  operationList: [
    {
      operationId: 'string',
      operationType: ApiTransactionOperationDtoOperationTypeEnum.TRANSACTION,
      operationDate: '2023-03-28T13:35:25.146Z',
      brandLogo: 'string',
      maskedPan: 'string',
      amountCents: 0,
      accruedCents: 0,
      circuitType: 'string',
      status: ApiTransactionOperationDtoStatusEnum.REWARDED,
    },
    {
      operationId: 'string',
      operationType: ApiInstrumentOperationDtoOperationTypeEnum.ADD_INSTRUMENT,
      operationDate: '2023-03-28T13:35:25.146Z',
      brandLogo: 'string',
      maskedPan: 'string',
      channel: 'string',
      instrumentType: ApiInstrumentOperationDtoInstrumentTypeEnum.CARD,
    },
    {
      operationId: 'string',
      operationType: ApiInstrumentOperationDtoOperationTypeEnum.DELETE_INSTRUMENT,
      operationDate: '2023-03-28T13:35:25.146Z',
      brandLogo: 'string',
      maskedPan: 'string',
      channel: 'string',
      instrumentType: ApiInstrumentOperationDtoInstrumentTypeEnum.CARD,
    },
    {
      operationId: 'string',
      operationType: ApiRejectedInstrumentOperationDtoOperationTypeEnum.REJECTED_DELETE_INSTRUMENT,
      operationDate: '2023-03-28T13:35:25.146Z',
      brandLogo: 'string',
      maskedPan: 'string',
      channel: 'string',
      instrumentType: ApiRejectedInstrumentOperationDtoInstrumentTypeEnum.CARD,
    },
    {
      operationId: 'string',
      operationType: ApiRejectedInstrumentOperationDtoOperationTypeEnum.REJECTED_ADD_INSTRUMENT,
      operationDate: '2023-03-28T13:35:25.146Z',
      brandLogo: 'string',
      instrumentId: 'string',
      maskedPan: 'string',
      channel: 'string',
      instrumentType: ApiRejectedInstrumentOperationDtoInstrumentTypeEnum.CARD,
    },
    {
      operationId: 'string',
      operationType: ApiIbanOperationDtoOperationTypeEnum.ADD_IBAN,
      operationDate: '2023-03-28T13:35:25.146Z',
      iban: 'string',
      channel: 'string',
    },
    {
      operationId: 'string',
      operationType: ApiOnboardingOperationDtoOperationTypeEnum.ONBOARDING,
      operationDate: '2023-03-28T13:35:25.146Z',
    },
    {
      operationId: 'string',
      eventId: 'string',
      operationType: ApiRefundOperationDtoOperationTypeEnum.PAID_REFUND,
      operationDate: '2023-03-28',
      amountCents: 0,
      accruedCents: 0,
    },
  ],
  pageNo: 0,
  pageSize: 10,
  totalElements: 3,
  totalPages: 1,
};

export const mockedOperationDetail: OperationDTO = {
  operationId: '1u1u1u1u1u1u1u',
  eventId: 'paid-refund-event-id',
  operationType: ApiRefundOperationDtoOperationTypeEnum.PAID_REFUND,
  operationDate: '2023-02-05',
  amountCents: 345,
  accruedCents: 10,
};

export const mockedOperationType = ApiRefundOperationDtoOperationTypeEnum.PAID_REFUND;
export const mockedOperationId = '63ecc1eb10dc9d6cfb01371e';
export const mockedOperationDate = '2023-02-15T12:28:42.949';

export const mockedInitiativeDetail: InitiativeDTO = {
  initiativeId: '62e29002aac2e94cfa3763dd',
  initiativeName: 'prova313',
  organizationId: '2f63a151-da4e-4e1e-acf9-adecc0c4d727',
  status: 'DRAFT',
  creationDate: new Date('2022-07-28T13:32:50.002').toISOString(),
  updateDate: new Date('2022-08-09T08:35:36.516').toISOString(),
  general: {
    budget: 8515,
    beneficiaryType: ApiInitiativeGeneralDtoBeneficiaryTypeEnum.PF,
    beneficiaryKnown: false,
    beneficiaryBudget: 801,
    startDate: new Date('2022-10-01').toISOString(),
    endDate: new Date('2023-01-31').toISOString(),
    rankingStartDate: new Date('2022-09-01').toISOString(),
    rankingEndDate: new Date('2022-09-30').toISOString(),
  },
  additionalInfo: {
    serviceIO: true,
    serviceId: 'provaaaaa316',
    serviceName: 'prova313',
    serviceScope: ApiInitiativeAdditionalDtoServiceScopeEnum.LOCAL,
    description: 'culpa non sint',
    privacyLink: 'https://www.google.it',
    tcLink: 'https://www.google.it',
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
        iseeTypes: [
          ApiAutomatedCriteriaDtoIseeTypesEnum.ORDINARIO,
          ApiAutomatedCriteriaDtoIseeTypesEnum.DOTTORATO,
        ],
      },
    ],
  },
};

export const mockedInitiativeGeneralBody = {
  beneficiaryType: ApiInitiativeGeneralDtoBeneficiaryTypeEnum.PF,
  beneficiaryKnown: false,
  budget: 8515,
  beneficiaryBudget: 801,
  rankingStartDate: new Date('2022-09-01T00:00:00.000Z').toString(),
  rankingEndDate: new Date('2022-09-30T00:00:00.000Z').toString(),
  startDate: new Date('2022-10-01T00:00:00.000Z').toString(),
  endDate: new Date('2023-01-31T00:00:00.000Z').toString(),
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
  serviceScope: ApiInitiativeAdditionalDtoServiceScopeEnum.NATIONAL,
  serviceDescription: 'newStepOneTest',
  privacyPolicyUrl: 'http://test.it',
  termsAndConditions: 'http://test.it',
  channels: [{ type: ApiChannelDtoTypeEnum.Mobile, contact: 'http://test.it' }],
  assistanceChannels: [{ type: 'mobile', contact: 'string' }],
};

export const mockedRefundRules = {
  accumulatedAmount: {
    accumulatedType: ApiAccumulatedAmountDtoAccumulatedTypeEnum.BUDGET_EXHAUSTED,
    refundThreshold: 10000,
  },
  additionalInfo: {
    identificationCode: 'test',
    timeParameter: ApiTimeParameterDtoTimeTypeEnum.CLOSED,
  },
};

export const mockedTrxAndRewardRules: InitiativeRewardAndTrxRulesDTO = {
  initiativeRewardType: ApiInitiativeRewardAndTrxRulesDtoInitiativeRewardTypeEnum.REFUND,
  rewardRule: {
    _type: 'rewardValue',
    rewardValueType: ApiInitiativeRewardRuleDtoRewardValueTypeEnum.PERCENTAGE,
    rewardValue: 1,
  },
};

export const mockedInitiativeId = '62e29002aac2e94cfa3763dd';

export const mockedNotificationReward = {
  content: [
    {
      contentLength: 0,
      eTag: 'string',
      elabDate: new Date().toString(),
      errorsSize: 1,
      exportIds: ['string'],
      feedbackDate: new Date().toString(),
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
      status: RewardImportsDtoStatusEnum.COMPLETE,
      url: 'string',
    },
  ],
  totalElements: 5,
  totalPages: 1,
};

export const mockedInitiativeStatistics = {
  accruedRewards: 10,

  lastUpdatedDateTime: new Date().toString(),

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
      criteriaConsensusTimestamp: new Date().toString(),
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
  rankingPublishedTimestamp: new Date().toString(),
  rankingGeneratedTimestamp: new Date().toString(),
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
      feedbackDate: new Date().toString(),
      filePath: 'string',
      id: 'string',
      initiativeId: 'string',
      initiativeName: 'string',
      notificationDate: new Date().toString(),
      organizationId: 'string',
      percentageResulted: 'string',
      percentageResultedOk: 'string',
      percentageResults: 'string',
      rewardsExported: 'string',
      rewardsNotified: 0,
      rewardsResulted: 0,
      rewardsResultedOk: 0,
      rewardsResults: 'string',
      status: RewardImportsDtoStatusEnum.COMPLETE,
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
      beneficiaryState: StatusOnboardingDtosBeneficiaryStateEnum.ONBOARDING_OK,
      updateStatusDate: new Date().toString(),
    },
  ],
  pageNo: 0,
  pageSize: 0,
  totalElements: 0,
  totalPages: 0,
};

export const mockedRefundsDetailsSummary = {
  createDate: new Date().toString(),
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
  startDate: new Date().toString(),
  endDate: new Date().toString(),
  status: 'DONE',
  refundType: 'ORDINARY',
  cro: '12345678901',
  transferDate: new Date().toString(),
  userNotificationDate: new Date().toString(),
};

export const mockedFilePath = 'download';

export const mockedFileName = 'name';

export const mockedInitiativeRefundsPage1: InitiativeRefundsResponse = {
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

export const mockedInitiativeRefundsPage2: InitiativeRefundsResponse = {
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
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAAHMD77P30Z330S',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAAMRO82C23Z330C',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAEBNR90E20Z216W',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAEKKK44D42Z219I',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAEKSR79L06Z249S',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAEMRD84E66Z216B',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAICLD60M12F205M',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAICLD79L54A089Y',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAICNH82A02Z210D',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAICNL90L30Z129Z',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAICRI60R13F839M',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIDNL73C60E202V',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIGNE51S23F465N',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIGPP69L63A064W',
      updateStatusDate: new Date().toString(),
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
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIHNN88T51Z330L',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIHSN70S23Z352B',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAILRA61S60I625H',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIMLB77D52F912F',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIMNC71A64L157Q',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIMRA46M10H537K',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'WAITING',
    },
    {
      beneficiary: 'BAIMRC53L56G972Q',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMRK76P01H501R',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMRK76P01H501R',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMRO63S13E152B',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMRS68B49H501V',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAIMTF79D04Z240X',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAINRN76H11F205N',
      updateStatusDate: new Date().toString(),
      beneficiaryState: 'REGISTERED',
    },
    {
      beneficiary: 'BAINTN66B06F895L',
      updateStatusDate: new Date().toString(),
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
    organizationName: 'Comune di Test1',
  },
  {
    organizationId: '2',
    organizationName: 'Comune di Test2',
  },
  {
    organizationId: '3',
    organizationName: 'Comune di Test3',
  },
  {
    organizationId: '4',
    organizationName: 'Comune di Test4',
  },
  {
    organizationId: '5',
    organizationName: 'Comune di Test5',
  },
  {
    organizationId: '6',
    organizationName: 'Comune di Test6',
  },
  {
    organizationId: '7',
    organizationName: 'Comune di Test7',
  },
];

export const mockedBeneficaryStatus = {
  status: OnboardingStatusDtoStatusEnum.ONBOARDING_OK,
  statusDate: new Date().toString(),
};

export const mockedFamilyUnitComposition = {
  usersList: [
    {
      familyId: 'qwerty1',
      fiscalCode: 'XXXYYY99M11',
      status: OnboardingDetailDtoStatusEnum.ONBOARDING_OK,
      onboardingDate: new Date().toString(),
    },
    {
      familyId: 'qwerty2',
      fiscalCode: 'ZZZYYY99M11',
      status: OnboardingDetailDtoStatusEnum.DEMANDED,
      onboardingDate: new Date().toString(),
    },
    {
      familyId: 'qwerty3',
      fiscalCode: 'WWWYYY99M11',
      status: OnboardingDetailDtoStatusEnum.DEMANDED,
      onboardingDate: new Date().toString(),
    },
  ],
};
