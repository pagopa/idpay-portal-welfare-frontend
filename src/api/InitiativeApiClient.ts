import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import { InitiativeDTO } from './generated/initiative/InitiativeDTO';
import { createClient, WithDefaultsT } from './generated/initiative/client';
import { InitiativeBeneficiaryRuleDTO } from './generated/initiative/InitiativeBeneficiaryRuleDTO';
import { InitiativeSummaryArrayDTO } from './generated/initiative/InitiativeSummaryArrayDTO';
import { ConfigBeneficiaryRuleArrayDTO } from './generated/initiative/ConfigBeneficiaryRuleArrayDTO';
import { ConfigTrxRuleArrayDTO } from './generated/initiative/ConfigTrxRuleArrayDTO';
import { ConfigMccArrayDTO } from './generated/initiative/ConfigMccArrayDTO';
import { InitiativeRewardAndTrxRulesDTO } from './generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { InitiativeRefundRuleDTO } from './generated/initiative/InitiativeRefundRuleDTO';
import { InitiativeAdditionalDTO } from './generated/initiative/InitiativeAdditionalDTO';
import { InitiativeGeneralDTO } from './generated/initiative/InitiativeGeneralDTO';
import { InitiativeStatisticsDTO } from './generated/initiative/InitiativeStatisticsDTO';
import { PageRewardExportsDTO } from './generated/initiative/PageRewardExportsDTO';
import { OnboardingDTO } from './generated/initiative/OnboardingDTO';
import { SasToken } from './generated/initiative/SasToken';
import { PageRewardImportsDTO } from './generated/initiative/PageRewardImportsDTO';

const withBearerAndPartyId: WithDefaultsT<'Bearer'> = (wrappedOperation) => (params: any) => {
  const token = storageTokenOps.read();
  return wrappedOperation({
    ...params,
    Bearer: `Bearer ${token}`,
  });
};

const apiClient = createClient({
  baseUrl: ENV.URL_API.INITIATIVE,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.INITIATIVE),
  withDefaults: withBearerAndPartyId,
});

const onRedirectToLogin = () =>
  store.dispatch(
    appStateActions.addError({
      id: 'tokenNotValid',
      error: new Error(),
      techDescription: 'token expired or not valid',
      toNotify: false,
      blocking: false,
      displayableTitle: i18n.t('session.expired.title'),
      displayableDescription: i18n.t('session.expired.message'),
    })
  );

export const InitiativeApi = {
  getInitativeSummary: async (): Promise<InitiativeSummaryArrayDTO> => {
    const result = await apiClient.getInitativeSummary({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getInitiativeById: async (id: string): Promise<InitiativeDTO> => {
    const result = await apiClient.getInitiativeDetail({ initiativeId: id });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  saveInitiativeServiceInfo: async (data: InitiativeAdditionalDTO): Promise<InitiativeDTO> => {
    const result = await apiClient.saveInitiativeServiceInfo({ body: { ...data } });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  updateInitiativeServiceInfo: async (id: string, data: InitiativeAdditionalDTO): Promise<void> => {
    const result = await apiClient.updateInitiativeServiceInfo({
      initiativeId: id,
      body: { ...data },
    });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  updateInitiativeGeneralInfo: async (id: string, data: InitiativeGeneralDTO): Promise<void> => {
    const result = await apiClient.updateInitiativeGeneralInfo({
      initiativeId: id,
      body: { ...data },
    });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  updateInitiativeGeneralInfoDraft: async (
    id: string,
    data: InitiativeGeneralDTO
  ): Promise<void> => {
    const result = await apiClient.updateInitiativeGeneralInfoDraft({
      initiativeId: id,
      body: { ...data },
    });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  initiativeBeneficiaryRulePut: async (
    id: string,
    data: InitiativeBeneficiaryRuleDTO
  ): Promise<void> => {
    const result = await apiClient.updateInitiativeBeneficiary({
      initiativeId: id,
      body: {
        ...data,
      },
    });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  initiativeBeneficiaryRulePutDraft: async (
    id: string,
    data: InitiativeBeneficiaryRuleDTO
  ): Promise<void> => {
    const result = await apiClient.updateInitiativeBeneficiaryDraft({
      initiativeId: id,
      body: { ...data },
    });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  getEligibilityCriteriaForSidebar: async (): Promise<ConfigBeneficiaryRuleArrayDTO> => {
    const result = await apiClient.getBeneficiaryConfigRules({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getTransactionConfigRules: async (): Promise<ConfigTrxRuleArrayDTO> => {
    const result = await apiClient.getTransactionConfigRules({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getMccConfig: async (): Promise<ConfigMccArrayDTO> => {
    const result = await apiClient.getMccConfig({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  initiativeTrxAndRewardRulesPut: async (
    id: string,
    data: InitiativeRewardAndTrxRulesDTO
  ): Promise<void> => {
    const result = await apiClient.updateTrxAndRewardRules({
      initiativeId: id,
      body: { ...data },
    });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  initiativeTrxAndRewardRulesPutDraft: async (
    id: string,
    data: InitiativeRewardAndTrxRulesDTO
  ): Promise<void> => {
    const result = await apiClient.updateTrxAndRewardRulesDraft({
      initiativeId: id,
      body: { ...data },
    });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  updateInitiativeRefundRulePut: async (
    id: string,
    data: InitiativeRefundRuleDTO
  ): Promise<void> => {
    const result = await apiClient.updateInitiativeRefundRule({
      initiativeId: id,
      body: { ...data },
    });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  updateInitiativeRefundRuleDraftPut: async (
    id: string,
    data: InitiativeRefundRuleDTO
  ): Promise<void> => {
    const result = await apiClient.updateInitiativeRefundRuleDraft({
      initiativeId: id,
      body: { ...data },
    });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  updateInitiativeApprovedStatus: async (id: string): Promise<void> => {
    const result = await apiClient.updateInitiativeApprovedStatus({ initiativeId: id });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  updateInitiativeToCheckStatus: async (id: string): Promise<void> => {
    const result = await apiClient.updateInitiativeToCheckStatus({ initiativeId: id });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  updateInitiativePublishedStatus: async (id: string): Promise<void> => {
    const result = await apiClient.updateInitiativePublishedStatus({ initiativeId: id });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  logicallyDeleteInitiative: async (id: string): Promise<void> => {
    const result = await apiClient.logicallyDeleteInitiative({ initiativeId: id });
    return extractResponse(result, 204, onRedirectToLogin);
  },

  initiativeStatistics: async (id: string): Promise<InitiativeStatisticsDTO> => {
    const result = await apiClient.initiativeStatistics({ initiativeId: id });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getExportsPaged: async (
    id: string,
    page: number,
    notificationDateFrom?: string,
    notificationDateTo?: string,
    status?: string
  ): Promise<PageRewardExportsDTO> => {
    const result = await apiClient.getRewardNotificationExportsPaged({
      initiativeId: id,
      page,
      size: 10,
      notificationDateFrom,
      notificationDateTo,
      status,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getRewardFileDownload: async (initiativeId: string, filePath: string): Promise<SasToken> => {
    const result = await apiClient.getRewardFileDownload({ initiativeId, filename: filePath });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  getOnboardingStatus: async (
    id: string,
    page: number,
    beneficiary?: string,
    dateFrom?: string,
    dateTo?: string,
    state?: string
  ): Promise<OnboardingDTO> => {
    const result = await apiClient.getOnboardingStatus({
      initiativeId: id,
      page,
      size: 10,
      beneficiary,
      dateFrom,
      dateTo,
      state,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  putDispFileUpload: async (id: string, filename: string, file: File): Promise<void> => {
    const result = await apiClient.putDispFileUpload({ initiativeId: id, filename, file });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  getRewardNotificationImportsPaged: async (
    id: string,
    page: number
  ): Promise<PageRewardImportsDTO> => {
    const result = await apiClient.getRewardNotificationImportsPaged({
      initiativeId: id,
      page,
      size: 10,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
