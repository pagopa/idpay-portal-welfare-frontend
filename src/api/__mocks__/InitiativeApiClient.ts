import { InitiativeDTO } from '../generated/initiative/InitiativeDTO';
import { InitiativeSummaryArrayDTO } from '../generated/initiative/InitiativeSummaryArrayDTO';
// import { InitiativeInfoDTO } from '../generated/initiative/InitiativeInfoDTO';
import { mockedAdmissionCriteria } from '../../services/__mocks__/admissionCriteriaService';
import { mockedFile } from '../../services/__mocks__/groupService';
import {
  mockedBeneficaryStatus,
  mockedExportsPagedResponse,
  mockedFamilyUnitComposition,
  mockedGetDispFileError,
  mockedGetIniOnboardingRankingStatusPaged,
  // mockedGetRankingFileDownload,
  mockedGetRewardFileDownload,
  mockedIbanInfo,
  mockedInitiativeDetail,
  mockedInitiativeStatistics,
  mockedInitiativeSummary,
  mockedNotificationReward,
  mockedOnBoardingStatusResponse,
  mockedOperationDetail,
  mockedOperationList,
  mockedOrganizationsList,
  mockedRefundsDetailsByEventRes,
  mockedRefundsDetailsListItem,
  mockedRefundsDetailsSummary,
  mockedWallet,
  mockedWalletInstrument,
} from '../../services/__mocks__/initiativeService';
import { mockedMccCodes } from '../../services/__mocks__/mccCodesServices';
import { mockedTransactionRules } from '../../services/__mocks__/transactionRuleService';
import { ConfigBeneficiaryRuleArrayDTO } from '../generated/initiative/ConfigBeneficiaryRuleArrayDTO';
import { ConfigMccArrayDTO } from '../generated/initiative/ConfigMccArrayDTO';
import { ConfigTrxRuleArrayDTO } from '../generated/initiative/ConfigTrxRuleArrayDTO';
import { CsvDTO } from '../generated/initiative/CsvDTO';
import { InitiativeAdditionalDTO } from '../generated/initiative/InitiativeAdditionalDTO';
import { InitiativeBeneficiaryRuleDTO } from '../generated/initiative/InitiativeBeneficiaryRuleDTO';
import { InitiativeGeneralDTO } from '../generated/initiative/InitiativeGeneralDTO';
import { InitiativeRefundRuleDTO } from '../generated/initiative/InitiativeRefundRuleDTO';
import { InitiativeRewardAndTrxRulesDTO } from '../generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { InitiativeStatisticsDTO } from '../generated/initiative/InitiativeStatisticsDTO';
import { LogoDTO } from '../generated/initiative/LogoDTO';
import { OnboardingDTO } from '../generated/initiative/OnboardingDTO';
import { PageOnboardingRankingsDTO } from '../generated/initiative/PageOnboardingRankingsDTO';
import { PageRewardExportsDTO } from '../generated/initiative/PageRewardExportsDTO';
import { PageRewardImportsDTO } from '../generated/initiative/PageRewardImportsDTO';
import { SasToken } from '../generated/initiative/SasToken';
import { OrganizationListDTO } from '../generated/initiative/OrganizationListDTO';
import { WalletDTO } from '../generated/initiative/WalletDTO';
import { IbanDTO } from '../generated/initiative/IbanDTO';
import { InstrumentListDTO } from '../generated/initiative/InstrumentListDTO';
import { TimelineDTO } from '../generated/initiative/TimelineDTO';
import { OperationDTO } from '../generated/initiative/OperationDTO';
import { ExportListDTO } from '../generated/initiative/ExportListDTO';
import { ExportSummaryDTO } from '../generated/initiative/ExportSummaryDTO';
import { RefundDetailDTO } from '../generated/initiative/RefundDetailDTO';
import { OnboardingStatusDTO } from '../generated/initiative/OnboardingStatusDTO';
import { FamilyUnitCompositionDTO } from '../generated/initiative/FamilyUnitCompositionDTO';

export const InitiativeApiMocked = {
  getInitativeSummary: async (): Promise<InitiativeSummaryArrayDTO> =>
    new Promise((resolve) => resolve(mockedInitiativeSummary)),

  getInitiativeById: async (_id: string): Promise<InitiativeDTO> =>
    new Promise((resolve) => resolve(mockedInitiativeDetail)),

  saveInitiativeServiceInfo: async (_data: InitiativeAdditionalDTO): Promise<InitiativeDTO> =>
    new Promise((resolve) => resolve({})),

  updateInitiativeServiceInfo: async (_id: string, _data: InitiativeAdditionalDTO): Promise<void> =>
    new Promise((resolve) => resolve()),

  initiativeBeneficiaryRulePut: async (
    _id: string,
    _data: InitiativeBeneficiaryRuleDTO
  ): Promise<void> => new Promise((resolve) => resolve()),

  initiativeBeneficiaryRulePutDraft: async (
    _id: string,
    _data: InitiativeBeneficiaryRuleDTO
  ): Promise<void> => new Promise((resolve) => resolve()),

  updateInitiativeRefundRulePut: async (
    _id: string,
    _data: InitiativeRefundRuleDTO
  ): Promise<void> => new Promise((resolve) => resolve()),

  updateInitiativeRefundRuleDraftPut: async (
    _id: string,
    _data: InitiativeRefundRuleDTO
  ): Promise<void> => new Promise((resolve) => resolve()),

  getEligibilityCriteriaForSidebar: async (): Promise<ConfigBeneficiaryRuleArrayDTO> =>
    new Promise((resolve) => resolve(mockedAdmissionCriteria)),

  initiativeTrxAndRewardRulesPut: async (
    _id: string,
    _data: InitiativeRewardAndTrxRulesDTO
  ): Promise<void> => new Promise((resolve) => resolve()),

  initiativeTrxAndRewardRulesPutDraft: async (
    _id: string,
    _data: InitiativeRewardAndTrxRulesDTO
  ): Promise<void> => new Promise((resolve) => resolve()),

  updateInitiativeGeneralInfo: async (_id: string, _data: InitiativeGeneralDTO): Promise<void> =>
    new Promise((resolve) => resolve()),

  updateInitiativeGeneralInfoDraft: async (
    _id: string,
    _data: InitiativeGeneralDTO
  ): Promise<void> => new Promise((resolve) => resolve()),

  initiativeStatistics: async (_id: string): Promise<InitiativeStatisticsDTO> =>
    new Promise((resolve) => resolve(mockedInitiativeStatistics)),

  updateInitiativeApprovedStatus: async (_id: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  updateInitiativeToCheckStatus: async (_id: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  updateInitiativePublishedStatus: async (_id: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  logicallyDeleteInitiative: async (_id: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  getTransactionConfigRules: async (): Promise<ConfigTrxRuleArrayDTO> =>
    new Promise((resolve) => resolve(mockedTransactionRules)),

  getGroupOfBeneficiaryStatusAndDetails: async (_id: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  getExportsPaged: async (
    _id: string,
    _page: number,
    _notificationDateFrom: string | undefined,
    _notificationDateTo: string | undefined,
    _status: string | undefined,
    _sort: string | undefined
  ): Promise<PageRewardExportsDTO> => new Promise((resolve) => resolve(mockedExportsPagedResponse)),

  getOnboardingStatus: async (
    _id: string,
    _page: number,
    _notificationDateFrom: string | undefined,
    _notificationDateTo: string | undefined,
    _status: string | undefined
  ): Promise<OnboardingDTO> => new Promise((resolve) => resolve(mockedOnBoardingStatusResponse)),

  getExportSummary: async (_initiativeId: string, _exportId: string): Promise<ExportSummaryDTO> =>
    new Promise((resolve) => resolve(mockedRefundsDetailsSummary)),

  getExportRefundsListPaged: async (
    _initiativeId: string,
    _exportId: string,
    _page: number,
    _cro?: string,
    _status?: string
  ): Promise<ExportListDTO> => new Promise((resolve) => resolve(mockedRefundsDetailsListItem)),

  getRefundDetail: async (
    _initiativeId: string,
    _refundEventId: string
  ): Promise<RefundDetailDTO> => new Promise((resolve) => resolve(mockedRefundsDetailsByEventRes)),

  getRewardFileDownload: async (_id: string, _filePath: string): Promise<SasToken> =>
    new Promise((resolve) => resolve(mockedGetRewardFileDownload)),

  putDispFileUpload: async (_id: string, _filename: string, _file: File): Promise<void> =>
    new Promise((resolve) => resolve()),

  getRewardNotificationImportsPaged: async (
    _id: string,
    _page: number,
    _sort: string
  ): Promise<PageRewardImportsDTO> => new Promise((resolve) => resolve(mockedNotificationReward)),

  uploadAndUpdateLogo: async (_id: string, _file: File): Promise<LogoDTO> =>
    new Promise((resolve) => resolve(mockedFile)),

  getDispFileErrors: async (_id: string, _name: string): Promise<CsvDTO> =>
    new Promise((resolve) => resolve(mockedGetDispFileError)),

  getInitiativeOnboardingRankingStatusPaged: async (
    _id: string,
    _page: number,
    _beneficiary: string | undefined,
    _state: string | undefined
  ): Promise<PageOnboardingRankingsDTO> =>
    new Promise((resolve) => resolve(mockedGetIniOnboardingRankingStatusPaged)),

  // getRankingFileDownload: async (_id: string, _filename: string): Promise<SasToken> =>
  //   new Promise((resolve) => resolve(mockedGetRankingFileDownload)),

  notifyCitizenRankings: async (_id: string): Promise<void> => new Promise((resolve) => resolve()),

  getMccConfig: async (): Promise<ConfigMccArrayDTO> =>
    new Promise((resolve) => resolve(mockedMccCodes)),

  getWalletDetail: async (_id: string, _cf: string): Promise<WalletDTO> =>
    new Promise((resolve) => resolve(mockedWallet)),

  getIban: async (_iban: string): Promise<IbanDTO> =>
    new Promise((resolve) => resolve(mockedIbanInfo)),

  getTimeLine: async (
    _cf: string,
    _id: string,
    _opeType?: string,
    _dateFrom?: string,
    _dateTo?: string,
    _page?: number,
    _size?: number
  ): Promise<TimelineDTO> => new Promise((resolve) => resolve(mockedOperationList)),

  getTimelineDetail: async (_cf: string, _id: string, _opeId: string): Promise<OperationDTO> =>
    new Promise((resolve) => resolve(mockedOperationDetail)),

  getInstrumentList: async (_id: string, _cf: string): Promise<InstrumentListDTO> =>
    new Promise((resolve) => resolve(mockedWalletInstrument)),

  getOrganizationsList: async (): Promise<OrganizationListDTO> =>
    new Promise((resolve) => resolve(mockedOrganizationsList)),

  getBeneficiaryOnboardingStatus: async (
    _initiativeId: string,
    _fiscalCode: string
  ): Promise<OnboardingStatusDTO> => new Promise((resolve) => resolve(mockedBeneficaryStatus)),

  suspendUser: async (_initiativeId: string, _fiscalCode: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  readmitUser: async (_initiativeId: string, _fiscalCode: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  getFamilyComposition: async (
    _initiativeId: string,
    _fiscalCode: string
  ): Promise<FamilyUnitCompositionDTO> =>
    new Promise((resolve) => resolve(mockedFamilyUnitComposition)),
};
