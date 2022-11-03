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

export const getInitativeSummary = (): Promise<InitiativeSummaryArrayDTO> =>
  InitiativeApi.getInitativeSummary().then((res) => res);

export const getInitiativeDetail = (id: string): Promise<InitiativeDTO> =>
  InitiativeApi.getInitiativeById(id).then((res) => res);

export const createInitiativeServiceInfo = (
  data: InitiativeAdditionalDTO
): Promise<InitiativeDTO | void | undefined> =>
  InitiativeApi.saveInitiativeServiceInfo(data).then((res) => res);

export const updateInitiativeServiceInfo = (
  id: string,
  data: InitiativeAdditionalDTO
): Promise<void> => InitiativeApi.updateInitiativeServiceInfo(id, data).then((res) => res);

export const updateInitiativeGeneralInfo = (
  id: string,
  data: InitiativeGeneralDTO
): Promise<void> => InitiativeApi.updateInitiativeGeneralInfo(id, data).then((res) => res);

export const updateInitiativeGeneralInfoDraft = (
  id: string,
  data: InitiativeGeneralDTO
): Promise<void> => InitiativeApi.updateInitiativeGeneralInfoDraft(id, data).then((res) => res);

export const putBeneficiaryRuleService = (
  id: string,
  data: InitiativeBeneficiaryRuleDTO
): Promise<void> => InitiativeApi.initiativeBeneficiaryRulePut(id, data).then((res) => res);

export const putBeneficiaryRuleDraftService = (
  id: string,
  data: InitiativeBeneficiaryRuleDTO
): Promise<void> => InitiativeApi.initiativeBeneficiaryRulePutDraft(id, data).then((res) => res);

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

export const putRefundRule = (id: string, data: InitiativeRefundRuleDTO): Promise<void> =>
  InitiativeApi.updateInitiativeRefundRulePut(id, data).then((res) => res);

export const putRefundRuleDraft = (id: string, data: InitiativeRefundRuleDTO): Promise<void> =>
  InitiativeApi.updateInitiativeRefundRuleDraftPut(id, data).then((res) => res);

export const updateInitiativeApprovedStatus = (id: string): Promise<void> =>
  InitiativeApi.updateInitiativeApprovedStatus(id).then((res) => res);

export const updateInitiativeToCheckStatus = (id: string): Promise<void> =>
  InitiativeApi.updateInitiativeToCheckStatus(id).then((res) => res);

export const updateInitiativePublishedStatus = (id: string): Promise<void> =>
  InitiativeApi.updateInitiativePublishedStatus(id).then((res) => res);

export const logicallyDeleteInitiative = (id: string): Promise<void> =>
  InitiativeApi.logicallyDeleteInitiative(id).then((res) => res);

export const getEligibilityCriteriaForSidebar = (): Promise<ConfigBeneficiaryRuleArrayDTO> =>
  InitiativeApi.getEligibilityCriteriaForSidebar().then((res) => res);

export const getGroupOfBeneficiaryStatusAndDetails = (
  id: string
): Promise<InitiativeStatisticsDTO> =>
  InitiativeApi.getGroupOfBeneficiaryStatusAndDetails(id).then((res) => res);

export const getExportsPaged = (id: string, page: number): Promise<PageRewardExportsDTO> =>
  InitiativeApi.getExportsPaged(id, page).then((res) => res);
