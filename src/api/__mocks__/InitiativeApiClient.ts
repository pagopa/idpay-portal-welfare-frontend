import { InitiativeDTO } from '../generated/initiative/InitiativeDTO';
import { InitiativeSummaryArrayDTO } from '../generated/initiative/InitiativeSummaryArrayDTO';
// import { InitiativeInfoDTO } from '../generated/initiative/InitiativeInfoDTO';
import { InitiativeBeneficiaryRuleDTO } from '../generated/initiative/InitiativeBeneficiaryRuleDTO';
import {
  mockedExportsPaged,
  mockedInitiativeDetail,
  mockedInitiativeId,
  mockedInitiativeSummary,
  mockedOnBoardingStatus,
} from '../../services/__mocks__/initiativeService';
import { mockedAdmissionCriteria } from '../../services/__mocks__/admissionCriteriaService';
import { ConfigBeneficiaryRuleArrayDTO } from '../generated/initiative/ConfigBeneficiaryRuleArrayDTO';
import { InitiativeRefundRuleDTO } from '../generated/initiative/InitiativeRefundRuleDTO';
import { InitiativeAdditionalDTO } from '../generated/initiative/InitiativeAdditionalDTO';
import { InitiativeGeneralDTO } from '../generated/initiative/InitiativeGeneralDTO';
import { InitiativeRewardAndTrxRulesDTO } from '../generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { InitiativeStatisticsDTO } from '../generated/initiative/InitiativeStatisticsDTO';
import { PageRewardExportsDTO } from '../generated/initiative/PageRewardExportsDTO';
import { SasToken } from '../generated/initiative/SasToken';
import { OnboardingDTO } from '../generated/initiative/OnboardingDTO';
import { ConfigTrxRuleArrayDTO } from '../generated/initiative/ConfigTrxRuleArrayDTO';
import { mockedTransactionRules } from '../../services/__mocks__/transactionRuleService';
import { PageRewardImportsDTO } from '../generated/initiative/PageRewardImportsDTO';
import { LogoDTO } from '../generated/initiative/LogoDTO';
import { mockedFile } from '../../services/__mocks__/groupService';
import { CsvDTO } from '../generated/initiative/CsvDTO';
import { PageOnboardingRankingsDTO } from '../generated/initiative/PageOnboardingRankingsDTO';

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
    new Promise((resolve) => resolve(mockedInitiativeId)),

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
  ): Promise<PageRewardExportsDTO> => new Promise((resolve) => resolve(mockedExportsPaged)),

  getOnboardingStatus: async (
    _id: string,
    _page: number,
    _notificationDateFrom: string | undefined,
    _notificationDateTo: string | undefined,
    _status: string | undefined
  ): Promise<OnboardingDTO> => new Promise((resolve) => resolve(mockedOnBoardingStatus)),

  getRewardFileDownload: async (_id: string, _filePath: string): Promise<SasToken> =>
    new Promise((resolve) => resolve(mockedInitiativeId)),

  putDispFileUpload: async (_id: string, _filename: string, _file: File): Promise<void> =>
    new Promise((resolve) => resolve()),

  getRewardNotificationImportsPaged: async (
    _id: string,
    _page: number,
    _sort: string
  ): Promise<PageRewardImportsDTO> => new Promise((resolve) => resolve(mockedInitiativeId)),

  uploadAndUpdateLogo: async (_id: string, _file: File): Promise<LogoDTO> =>
    new Promise((resolve) => resolve(mockedFile)),

  getDispFileErrors: async (_id: string, _name: string): Promise<CsvDTO> =>
    new Promise((resolve) => resolve(mockedInitiativeId)),

  getInitiativeOnboardingRankingStatusPaged: async (
    _id: string,
    _page: number,
    _beneficiary: string | undefined,
    _state: string | undefined
  ): Promise<PageOnboardingRankingsDTO> => new Promise((resolve) => resolve(mockedInitiativeId)),

  getRankingFileDownload: async (_id: string, _filename: string): Promise<SasToken> =>
    new Promise((resolve) => resolve(mockedInitiativeId)),

  notifyCitizenRankings: async (_id: string): Promise<void> => new Promise((resolve) => resolve()),
};
