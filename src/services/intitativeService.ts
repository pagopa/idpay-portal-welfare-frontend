import { InitiativeDTO } from '../api/generated/initiative/InitiativeDTO';
import { InitiativeGeneralDTO } from '../api/generated/initiative/InitiativeGeneralDTO';
import { InitiativeInfoDTO } from '../api/generated/initiative/InitiativeInfoDTO';
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

export const saveGeneralInfoService = (
  generalInfo: InitiativeInfoDTO
): Promise<InitiativeDTO | void | undefined> =>
  InitiativeApi.initiativeGeneralPost(generalInfo).then((res) => res);

export const getInitativeSummary = (): Promise<InitiativeSummaryArrayDTO> =>
  InitiativeApi.getInitativeSummary().then((res) => res);

export const getInitiativeDetail = (id: string): Promise<InitiativeDTO> =>
  InitiativeApi.getInitiativeById(id).then((res) => res);

export const putBeneficiaryRuleService = (
  id: string,
  data: InitiativeBeneficiaryRuleDTO
): Promise<void> => InitiativeApi.initiativeBeneficiaryRulePut(id, data).then((res) => res);

export const putBeneficiaryRuleDraftService = (
  id: string,
  data: InitiativeBeneficiaryRuleDTO
): Promise<void> => InitiativeApi.initiativeBeneficiaryRulePutDraft(id, data).then((res) => res);

export const putGeneralInfo = (id: string, data: InitiativeGeneralDTO): Promise<void> =>
  InitiativeApi.initiativeGeneralPut(id, data).then((res) => res);

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
