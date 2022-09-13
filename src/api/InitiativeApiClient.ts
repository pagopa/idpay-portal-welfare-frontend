import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
// import { InitiativeInfoDTO } from './generated/initiative/InitiativeInfoDTO';
import { InitiativeDTO } from './generated/initiative/InitiativeDTO';
import { createClient, WithDefaultsT } from './generated/initiative/client';
import { InitiativeBeneficiaryRuleDTO } from './generated/initiative/InitiativeBeneficiaryRuleDTO';
import { InitiativeSummaryArrayDTO } from './generated/initiative/InitiativeSummaryArrayDTO';
import { ConfigBeneficiaryRuleArrayDTO } from './generated/initiative/ConfigBeneficiaryRuleArrayDTO';
import { ConfigTrxRuleArrayDTO } from './generated/initiative/ConfigTrxRuleArrayDTO';
import { ConfigMccArrayDTO } from './generated/initiative/ConfigMccArrayDTO';
import { InitiativeRewardAndTrxRulesDTO } from './generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { InitiativeRefundRuleDTO } from './generated/initiative/InitiativeRefundRuleDTO';

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

  // initiativeGeneralPost: async (data: InitiativeInfoDTO): Promise<InitiativeDTO> => {
  //   const result = await apiClient.saveInitiativeGeneralInfo({
  //     body: {
  //       general: {
  //         ...data.general,
  //       },
  //       additionalInfo: {
  //         ...data.additionalInfo,
  //       },
  //     },
  //   });
  //   return extractResponse(result, 201, onRedirectToLogin);
  // },

  // initiativeGeneralPut: async (id: string, data: InitiativeInfoDTO): Promise<void> => {
  //   const result = await apiClient.updateInitiativeGeneralInfo({
  //     initiativeId: id,
  //     body: { ...data },
  //   });
  //   return extractResponse(result, 204, onRedirectToLogin);
  // },

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
};
