import { InitiativeDTO } from '../api/generated/initiative/InitiativeDTO';
import { InitiativeBeneficiaryRuleDTO } from '../api/generated/initiative/InitiativeBeneficiaryRuleDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';
import { InitiativeSummaryArrayDTO } from '../api/generated/initiative/InitiativeSummaryArrayDTO';
import {
  InitiativeRewardAndTrxRulesDTO,
  InitiativeRewardAndTrxRulesDTORewardRule,
} from '../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { RewardGroupDTO } from '../api/generated/initiative/RewardGroupDTO';
import { decode } from '../utils/io-utils';
import { RewardValueDTO } from '../api/generated/initiative/RewardValueDTO';
import { InitiativeRefundRuleDTO } from '../api/generated/initiative/InitiativeRefundRuleDTO';
import { InitiativeAdditionalDTO } from '../api/generated/initiative/InitiativeAdditionalDTO';
import { InitiativeGeneralDTO } from '../api/generated/initiative/InitiativeGeneralDTO';
import { ConfigBeneficiaryRuleArrayDTO } from '../api/generated/initiative/ConfigBeneficiaryRuleArrayDTO';
import { InitiativeStatisticsDTO } from '../api/generated/initiative/InitiativeStatisticsDTO';
import { PageRewardExportsDTO } from '../api/generated/initiative/PageRewardExportsDTO';
import { OnboardingDTO } from '../api/generated/initiative/OnboardingDTO';
import { SasToken } from '../api/generated/initiative/SasToken';
import { mockedInitiativeDetail, mockedInitiativeSummary } from './__mocks__/initiativeService';
import { mockedAdmissionCriteria } from './__mocks__/admissionCriteriaService';

export const getInitativeSummary = (): Promise<InitiativeSummaryArrayDTO> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return new Promise((resolve) => resolve(mockedInitiativeSummary));
  } else {
    return InitiativeApi.getInitativeSummary().then((res) => res);
  }
};

export const getInitiativeDetail = (id: string): Promise<InitiativeDTO> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return new Promise((resolve) => resolve(mockedInitiativeDetail));
  } else {
    return InitiativeApi.getInitiativeById(id).then((res) => res);
  }
};

export const createInitiativeServiceInfo = (
  data: InitiativeAdditionalDTO
): Promise<InitiativeDTO | void | undefined> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return new Promise((resolve) => resolve({}));
  } else {
    return InitiativeApi.saveInitiativeServiceInfo(data).then((res) => res);
  }
};

export const updateInitiativeServiceInfo = (
  id: string,
  data: InitiativeAdditionalDTO
): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return new Promise((resolve) => resolve());
  } else {
    return InitiativeApi.updateInitiativeServiceInfo(id, data).then((res) => res);
  }
};

export const updateInitiativeGeneralInfo = (
  id: string,
  data: InitiativeGeneralDTO
): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return new Promise((resolve) => resolve());
  } else {
    return InitiativeApi.updateInitiativeGeneralInfo(id, data).then((res) => res);
  }
};

export const updateInitiativeGeneralInfoDraft = (
  id: string,
  data: InitiativeGeneralDTO
): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return new Promise((resolve) => resolve());
  } else {
    return InitiativeApi.updateInitiativeGeneralInfoDraft(id, data).then((res) => res);
  }
};

export const putBeneficiaryRuleService = async (
  id: string,
  data: InitiativeBeneficiaryRuleDTO
): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return new Promise((resolve) => resolve());
  } else {
    return InitiativeApi.initiativeBeneficiaryRulePut(id, data);
  }
};

export const putBeneficiaryRuleDraftService = (
  id: string,
  data: InitiativeBeneficiaryRuleDTO
): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return new Promise((resolve) => resolve());
  } else {
    return InitiativeApi.initiativeBeneficiaryRulePutDraft(id, data).then((res) => res);
  }
};

/** It will accept a {@link InitiativeRewardAndTrxRulesDTORewardRule} and it will transcode it into {@link RewardGroupDTO} or {@link RewardValueDTO} */
export const trascodeRewardRule = (rewardRule: InitiativeRewardAndTrxRulesDTORewardRule) => {
  if (rewardRule) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    switch ((rewardRule as any)['_type']) {
      case 'rewardGroups':
        return decode(rewardRule, RewardGroupDTO);
      case 'rewardValue':
        return decode(rewardRule, RewardValueDTO);
      default:
        throw new Error(`Unknown type: ${rewardRule}`);
    }
  }
  return rewardRule;
};

export const putTrxAndRewardRules = (
  id: string,
  data: InitiativeRewardAndTrxRulesDTO
): Promise<void> => InitiativeApi.initiativeTrxAndRewardRulesPut(id, data).then((res) => res);

export const putTrxAndRewardRulesDraft = (
  id: string,
  data: InitiativeRewardAndTrxRulesDTO
): Promise<void> => InitiativeApi.initiativeTrxAndRewardRulesPutDraft(id, data).then((res) => res);

export const putRefundRule = (id: string, data: InitiativeRefundRuleDTO): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return new Promise((resolve) => resolve());
  } else {
    return InitiativeApi.updateInitiativeRefundRulePut(id, data).then((res) => res);
  }
};

export const putRefundRuleDraft = (id: string, data: InitiativeRefundRuleDTO): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return new Promise((resolve) => resolve());
  } else {
    return InitiativeApi.updateInitiativeRefundRuleDraftPut(id, data).then((res) => res);
  }
};

export const updateInitiativeApprovedStatus = (id: string): Promise<void> =>
  InitiativeApi.updateInitiativeApprovedStatus(id).then((res) => res);

export const updateInitiativeToCheckStatus = (id: string): Promise<void> =>
  InitiativeApi.updateInitiativeToCheckStatus(id).then((res) => res);

export const updateInitiativePublishedStatus = (id: string): Promise<void> =>
  InitiativeApi.updateInitiativePublishedStatus(id).then((res) => res);

export const logicallyDeleteInitiative = (id: string): Promise<void> =>
  InitiativeApi.logicallyDeleteInitiative(id).then((res) => res);

export const getEligibilityCriteriaForSidebar = (): Promise<ConfigBeneficiaryRuleArrayDTO> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return new Promise((resolve) => resolve(mockedAdmissionCriteria));
  } else {
    return InitiativeApi.getEligibilityCriteriaForSidebar().then((res) => res);
  }
};

export const initiativeStatistics = (id: string): Promise<InitiativeStatisticsDTO> =>
  InitiativeApi.initiativeStatistics(id).then((res) => res);

export const getExportsPaged = (
  id: string,
  page: number,
  notificationDateFrom?: string,
  notificationDateTo?: string,
  status?: string
): Promise<PageRewardExportsDTO> =>
  InitiativeApi.getExportsPaged(id, page, notificationDateFrom, notificationDateTo, status).then(
    (res) => res
  );

export const getRewardFileDownload = (id: string, filePath: string): Promise<SasToken> =>
  InitiativeApi.getRewardFileDownload(id, filePath).then((res) => res);

export const getOnboardingStatus = (
  id: string,
  page: number,
  beneficiary?: string,
  dateFrom?: string,
  dateTo?: string,
  state?: string
): Promise<OnboardingDTO> =>
  InitiativeApi.getOnboardingStatus(id, page, beneficiary, dateFrom, dateTo, state).then(
    (res) => res
  );

export const putDispFileUpload = (id: string, filename: string, file: File): Promise<void> =>
  InitiativeApi.putDispFileUpload(id, filename, file).then((res) => res);
