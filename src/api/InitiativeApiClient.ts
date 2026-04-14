import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { ENV } from '../utils/env';
import {
  Api,
  HttpClient,
  RequestParams,
  ConfigBeneficiaryRuleArrayDTO,
  ConfigMccArrayDTO,
  ConfigTrxRuleArrayDTO,
  CsvDTO,
  ExportListDTO,
  ExportSummaryDTO,
  FamilyUnitCompositionDTO,
  IbanDTO,
  InitiativeAdditionalDTO,
  InitiativeBeneficiaryRuleDTO,
  InitiativeDTO,
  InitiativeGeneralDTO,
  InitiativeRefundRuleDTO,
  InitiativeRewardAndTrxRulesDTO,
  InitiativeStatisticsDTO,
  InitiativeSummaryArrayDTO,
  InstrumentListDTO,
  LogoDTO,
  OnboardingDTO,
  OnboardingStatusDTO,
  OperationDTO,
  OrganizationListDTO,
  PageOnboardingRankingsDTO,
  PageRewardExportsDTO,
  PageRewardImportsDTO,
  RefundDetailDTO,
  SasToken,
  TimelineDTO,
  WalletDTO,
} from './generated/initiative/apiClient';
import { handleUnauthorizedError } from './swaggerApiClientUtils';

const initiativeSwaggerHttpClient = new HttpClient<{ token: string }>({
  baseURL: ENV.URL_API.INITIATIVE,
  timeout: ENV.API_TIMEOUT_MS.INITIATIVE,
  securityWorker: (securityData) => ({
    headers: {
      Authorization: `Bearer ${securityData?.token ?? ''}`,
    },
  }),
});

const api = new Api(initiativeSwaggerHttpClient);

const withAuth = () =>
  initiativeSwaggerHttpClient.setSecurityData({
    token: storageTokenOps.read(),
  });

const execute = async <T>(operation: () => Promise<{ data: T }>): Promise<T> => {
  withAuth();
  try {
    const response = await operation();
    return response.data;
  } catch (error) {
    return handleUnauthorizedError<T>(error);
  }
};

const executeVoid = async (operation: () => Promise<unknown>): Promise<void> => {
  withAuth();
  try {
    await operation();
  } catch (error) {
    return handleUnauthorizedError<void>(error);
  }
};

const fiscalCodeHeader = (fiscalCode: string): RequestParams => ({
  headers: {
    'Fiscal-Code': fiscalCode,
  },
});

export const InitiativeApi = {
  getInitativeSummary: async (): Promise<InitiativeSummaryArrayDTO> =>
    execute(() => api.summary.getInitativeSummary()),

  getInitiativeById: async (id: string): Promise<InitiativeDTO> =>
    execute(() =>
      api.initiativeId.getInitiativeDetail({
        initiativeId: id,
      })
    ),

  saveInitiativeServiceInfo: async (data: InitiativeAdditionalDTO): Promise<InitiativeDTO> =>
    execute(() => api.info.saveInitiativeServiceInfo(data)),

  updateInitiativeServiceInfo: async (id: string, data: InitiativeAdditionalDTO): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.updateInitiativeServiceInfo(
        {
          initiativeId: id,
        },
        data
      )
    ),

  updateInitiativeGeneralInfo: async (id: string, data: InitiativeGeneralDTO): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.updateInitiativeGeneralInfo(
        {
          initiativeId: id,
        },
        data
      )
    ),

  updateInitiativeGeneralInfoDraft: async (
    id: string,
    data: InitiativeGeneralDTO
  ): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.updateInitiativeGeneralInfoDraft(
        {
          initiativeId: id,
        },
        data
      )
    ),

  initiativeBeneficiaryRulePut: async (
    id: string,
    data: InitiativeBeneficiaryRuleDTO
  ): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.updateInitiativeBeneficiary(
        {
          initiativeId: id,
        },
        data
      )
    ),

  initiativeBeneficiaryRulePutDraft: async (
    id: string,
    data: InitiativeBeneficiaryRuleDTO
  ): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.updateInitiativeBeneficiaryDraft(
        {
          initiativeId: id,
        },
        data
      )
    ),

  getEligibilityCriteriaForSidebar: async (): Promise<ConfigBeneficiaryRuleArrayDTO> =>
    execute(() => api.config.getBeneficiaryConfigRules()),

  getTransactionConfigRules: async (): Promise<ConfigTrxRuleArrayDTO> =>
    execute(() => api.config.getTransactionConfigRules()),

  getMccConfig: async (): Promise<ConfigMccArrayDTO> =>
    execute(() => api.config.getMccConfig()),

  initiativeTrxAndRewardRulesPut: async (
    id: string,
    data: InitiativeRewardAndTrxRulesDTO
  ): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.updateTrxAndRewardRules(
        {
          initiativeId: id,
        },
        data
      )
    ),

  initiativeTrxAndRewardRulesPutDraft: async (
    id: string,
    data: InitiativeRewardAndTrxRulesDTO
  ): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.updateTrxAndRewardRulesDraft(
        {
          initiativeId: id,
        },
        data
      )
    ),

  updateInitiativeRefundRulePut: async (
    id: string,
    data: InitiativeRefundRuleDTO
  ): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.updateInitiativeRefundRule(
        {
          initiativeId: id,
        },
        data
      )
    ),

  updateInitiativeRefundRuleDraftPut: async (
    id: string,
    data: InitiativeRefundRuleDTO
  ): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.updateInitiativeRefundRuleDraft(
        {
          initiativeId: id,
        },
        data
      )
    ),

  updateInitiativeApprovedStatus: async (id: string): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.updateInitiativeApprovedStatus({
        initiativeId: id,
      })
    ),

  updateInitiativeToCheckStatus: async (id: string): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.updateInitiativeToCheckStatus({
        initiativeId: id,
      })
    ),

  updateInitiativePublishedStatus: async (id: string): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.updateInitiativePublishedStatus({
        initiativeId: id,
      })
    ),

  logicallyDeleteInitiative: async (id: string): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.logicallyDeleteInitiative({
        initiativeId: id,
      })
    ),

  initiativeStatistics: async (id: string): Promise<InitiativeStatisticsDTO> =>
    execute(() =>
      api.initiativeId.initiativeStatistics({
        initiativeId: id,
      })
    ),

  getExportsPaged: async (
    id: string,
    page: number,
    notificationDateFrom?: string,
    notificationDateTo?: string,
    status?: string,
    sort?: string
  ): Promise<PageRewardExportsDTO> =>
    execute(() =>
      api.initiativeId.getRewardNotificationExportsPaged({
        initiativeId: id,
        page,
        size: 10,
        notificationDateFrom,
        notificationDateTo,
        status,
        sort,
      })
    ),

  getRewardFileDownload: async (initiativeId: string, filePath: string): Promise<SasToken> =>
    execute(() =>
      api.initiativeId.getRewardFileDownload({
        initiativeId,
        filename: filePath,
      })
    ),

  getOnboardingStatus: async (
    id: string,
    page: number,
    beneficiary?: string,
    dateFrom?: string,
    dateTo?: string,
    state?: string
  ): Promise<OnboardingDTO> =>
    execute(() =>
      api.initiativeId.getOnboardingStatus({
        initiativeId: id,
        page,
        size: 10,
        beneficiary,
        dateFrom,
        dateTo,
        state,
      })
    ),

  putDispFileUpload: async (id: string, filename: string, file: File): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.putDispFileUpload(
        {
          initiativeId: id,
          filename,
        },
        { file }
      )
    ),

  uploadAndUpdateLogo: async (id: string, logo: File): Promise<LogoDTO> =>
    execute(() =>
      api.initiativeId.uploadAndUpdateLogo(
        {
          initiativeId: id,
        },
        { logo }
      )
    ),

  getRewardNotificationImportsPaged: async (
    id: string,
    page: number,
    sort: string
  ): Promise<PageRewardImportsDTO> =>
    execute(() =>
      api.initiativeId.getRewardNotificationImportsPaged({
        initiativeId: id,
        page,
        sort,
      })
    ),

  getDispFileErrors: async (id: string, name: string): Promise<CsvDTO> =>
    execute(() =>
      api.initiativeId.getDispFileErrors({
        initiativeId: id,
        filename: name,
      })
    ),

  getInitiativeOnboardingRankingStatusPaged: async (
    id: string,
    page: number,
    beneficiary?: string,
    state?: string
  ): Promise<PageOnboardingRankingsDTO> =>
    execute(() =>
      api.initiativeId.getInitiativeOnboardingRankingStatusPaged({
        initiativeId: id,
        page,
        beneficiary,
        state,
      })
    ),

  notifyCitizenRankings: async (id: string): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.notifyCitizenRankings({
        initiativeId: id,
      })
    ),

  getOrganizationsList: async (): Promise<OrganizationListDTO> =>
    execute(() => api.organizations.getListOfOrganization()),

  getIban: async (id: string, cf: string, iban: string): Promise<IbanDTO> =>
    execute(() =>
      api.initiativeId.getIban(
        {
          initiativeId: id,
          iban,
        },
        fiscalCodeHeader(cf)
      )
    ),

  getWalletDetail: async (id: string, cf: string): Promise<InitiativeDTO | WalletDTO> =>
    execute(() =>
      api.initiativeId.getWalletDetail(
        {
          initiativeId: id,
        },
        fiscalCodeHeader(cf)
      )
    ),

  getInstrumentList: async (id: string, cf: string): Promise<InstrumentListDTO> =>
    execute(() =>
      api.initiativeId.getInstrumentList(
        {
          initiativeId: id,
        },
        fiscalCodeHeader(cf)
      )
    ),

  getTimeLine: async (
    cf: string,
    id: string,
    opeType?: string,
    dateFrom?: string,
    dateTo?: string,
    page?: number
  ): Promise<TimelineDTO> =>
    execute(() =>
      api.initiativeId.getTimeline(
        {
          initiativeId: id,
          operationType: opeType,
          dateFrom,
          dateTo,
          page,
          size: 10,
        },
        fiscalCodeHeader(cf)
      )
    ),

  getTimelineDetail: async (cf: string, id: string, opeId: string): Promise<OperationDTO> =>
    execute(() =>
      api.initiativeId.getTimelineDetail(
        {
          initiativeId: id,
          operationId: opeId,
        },
        fiscalCodeHeader(cf)
      )
    ),

  getExportSummary: async (initiativeId: string, exportId: string): Promise<ExportSummaryDTO> =>
    execute(() =>
      api.initiativeId.getExportSummary({
        initiativeId,
        exportId,
      })
    ),

  getExportRefundsListPaged: async (
    initiativeId: string,
    exportId: string,
    page: number,
    cro?: string,
    status?: string
  ): Promise<ExportListDTO> =>
    execute(() =>
      api.initiativeId.getExportRefundsListPaged({
        initiativeId,
        exportId,
        page,
        cro,
        status,
        size: 10,
      })
    ),

  getRefundDetail: async (initiativeId: string, eventId: string): Promise<RefundDetailDTO> =>
    execute(() =>
      api.initiativeId.getRefundDetail({
        initiativeId,
        eventId,
      })
    ),

  getBeneficiaryOnboardingStatus: async (
    initiativeId: string,
    fiscalCode: string
  ): Promise<OnboardingStatusDTO> =>
    execute(() =>
      api.initiativeId.getBeneficiaryOnboardingStatus(
        {
          initiativeId,
        },
        fiscalCodeHeader(fiscalCode)
      )
    ),

  suspendUserRefund: async (initiativeId: string, fiscalCode: string): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.suspendUserRefund(
        {
          initiativeId,
        },
        fiscalCodeHeader(fiscalCode)
      )
    ),

  readmitUserRefund: async (initiativeId: string, fiscalCode: string): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.readmitUserRefund(
        {
          initiativeId,
        },
        fiscalCodeHeader(fiscalCode)
      )
    ),

  suspendUserDiscount: async (initiativeId: string, fiscalCode: string): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.suspendUserDiscount(
        {
          initiativeId,
        },
        fiscalCodeHeader(fiscalCode)
      )
    ),

  readmitUserDiscount: async (initiativeId: string, fiscalCode: string): Promise<void> =>
    executeVoid(() =>
      api.initiativeId.readmitUserDiscount(
        {
          initiativeId,
        },
        fiscalCodeHeader(fiscalCode)
      )
    ),

  getFamilyComposition: async (
    initiativeId: string,
    fiscalCode: string
  ): Promise<FamilyUnitCompositionDTO> =>
    execute(() =>
      api.initiativeId.getFamilyComposition(
        {
          initiativeId,
        },
        fiscalCodeHeader(fiscalCode)
      )
    ),
};