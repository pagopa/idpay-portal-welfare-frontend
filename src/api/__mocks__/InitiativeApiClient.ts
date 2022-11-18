import { InitiativeDTO } from '../generated/initiative/InitiativeDTO';
import { InitiativeSummaryArrayDTO } from '../generated/initiative/InitiativeSummaryArrayDTO';
// import { InitiativeInfoDTO } from '../generated/initiative/InitiativeInfoDTO';
import { InitiativeBeneficiaryRuleDTO } from '../generated/initiative/InitiativeBeneficiaryRuleDTO';
import {
  mockedInitiativeDetail,
  mockedInitiativeSummary,
} from '../../services/__mocks__/initiativeService';
import { mockedAdmissionCriteria } from '../../services/__mocks__/admissionCriteriaService';
import { ConfigBeneficiaryRuleArrayDTO } from '../generated/initiative/ConfigBeneficiaryRuleArrayDTO';
import { InitiativeRefundRuleDTO } from '../generated/initiative/InitiativeRefundRuleDTO';
import { InitiativeAdditionalDTO } from '../generated/initiative/InitiativeAdditionalDTO';
import { InitiativeGeneralDTO } from '../generated/initiative/InitiativeGeneralDTO';
import { InitiativeRewardAndTrxRulesDTO } from '../generated/initiative/InitiativeRewardAndTrxRulesDTO';

export const InitiativeApi = {
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

  updateInitiativeApprovedStatus: async (_id: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  updateInitiativeToCheckStatus: async (_id: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  updateInitiativePublishedStatus: async (_id: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  logicallyDeleteInitiative: async (_id: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  getTransactionConfigRules: async (): Promise<void> => new Promise((resolve) => resolve()),

  getGroupOfBeneficiaryStatusAndDetails: async (_id: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  getExportsPaged: async (
    _id: string,
    _page: number,
    _notificationDateFrom: string | undefined,
    _notificationDateTo: string | undefined,
    _status: string | undefined
  ): Promise<void> => new Promise((resolve) => resolve()),

  getOnboardingStatus: async (
    _id: string,
    _page: number,
    _notificationDateFrom: string | undefined,
    _notificationDateTo: string | undefined,
    _status: string | undefined
  ): Promise<void> => new Promise((resolve) => resolve()),

  getRewardFileDownload: async (_id: string, _filePath: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  putDispFileUpload: async (_id: string, _filename: string, _file: File): Promise<void> =>
    new Promise((resolve) => resolve()),
};
