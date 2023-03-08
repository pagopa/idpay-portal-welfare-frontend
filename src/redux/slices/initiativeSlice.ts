/* eslint-disable functional/immutable-data */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  Initiative,
  GeneralInfo,
  AdditionalInfo,
  AutomatedCriteriaItem,
  ManualCriteriaItem,
  RewardLimit,
  Threshold,
  TrxCount,
  DaysOfWeekInterval,
  RewardRule,
  RefundRule,
} from '../../model/Initiative';

import { BeneficiaryTypeEnum } from '../../utils/constants';
import { MccFilterDTO } from '../../api/generated/initiative/MccFilterDTO';
import { LogoDTO } from '../../api/generated/initiative/LogoDTO';
import { RewardValueTypeEnum } from '../../api/generated/initiative/InitiativeRewardRuleDTO';

const initialState: Initiative = {
  initiativeId: undefined,
  organizationId: undefined,
  status: undefined,
  initiativeName: undefined,
  creationDate: undefined,
  updateDate: undefined,
  additionalInfo: {
    initiativeOnIO: true,
    serviceName: '',
    serviceArea: '',
    serviceDescription: '',
    logoFileName: '',
    logoURL: '',
    logoUploadDate: '',
    privacyPolicyUrl: '',
    termsAndConditions: '',
    assistanceChannels: [{ type: 'web', contact: '' }],
  },
  generalInfo: {
    beneficiaryType: BeneficiaryTypeEnum.PF,
    // beneficiaryKnown: 'false',
    // rankingEnabled: 'true',
    beneficiaryKnown: undefined,
    rankingEnabled: undefined,
    budget: '',
    beneficiaryBudget: '',
    startDate: '',
    endDate: '',
    rankingStartDate: '',
    rankingEndDate: '',
    introductionTextIT: '',
    introductionTextEN: '',
    introductionTextFR: '',
    introductionTextDE: '',
    introductionTextSL: '',
  },
  beneficiaryRule: {
    apiKeyClientId: undefined,
    apiKeyClientAssertion: undefined,
    selfDeclarationCriteria: [],
    automatedCriteria: [],
  },
  rewardRule: {
    _type: 'rewardValue',
    rewardValue: undefined,
    rewardValueType: RewardValueTypeEnum.PERCENTAGE,
  },
  trxRule: {
    mccFilter: {
      allowedList: false,
      values: [],
    },
    rewardLimits: [{ frequency: 'DAILY', rewardLimit: undefined }],
    threshold: { from: undefined, fromIncluded: true, to: undefined, toIncluded: true },
    trxCount: { from: undefined, fromIncluded: true, to: undefined, toIncluded: true },
    daysOfWeekIntervals: [{ daysOfWeek: 'MONDAY', startTime: '', endTime: '' }],
  },
  refundRule: {
    reimbursmentQuestionGroup: '',
    timeParameter: '',
    accumulatedAmount: '',
    additionalInfo: '',
    reimbursementThreshold: '',
  },
};

export const initiativeSlice = createSlice({
  name: 'initiative',
  initialState,
  reducers: {
    resetInitiative: () => initialState,
    setInitiative: (state, action: PayloadAction<Initiative>) => ({
      ...state,
      initiativeId: action.payload.initiativeId,
      organizationId: action.payload.organizationId,
      status: action.payload.status,
      generalInfo: { ...action.payload.generalInfo },
      // additionalInfo: { ...action.payload.additionalInfo },
    }),
    setInitiativeId: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      initiativeId: action.payload,
    }),
    setOrganizationId: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      organizationId: action.payload,
    }),
    setStatus: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      status: action.payload,
    }),
    setInitiativeName: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      initiativeName: action.payload,
    }),
    setInitiativeCreationDate: (state, action: PayloadAction<Date | undefined>) => ({
      ...state,
      creationDate: action.payload,
    }),
    setInitiativeUpdateDate: (state, action: PayloadAction<Date | undefined>) => ({
      ...state,
      updateDate: action.payload,
    }),
    setGeneralInfo: (state, action: PayloadAction<GeneralInfo>) => ({
      ...state,
      generalInfo: {
        beneficiaryType: action.payload.beneficiaryType,
        beneficiaryKnown: action.payload.beneficiaryKnown,
        rankingEnabled: action.payload.rankingEnabled,
        budget: action.payload.budget,
        beneficiaryBudget: action.payload.beneficiaryBudget,
        startDate: action.payload.startDate || '',
        endDate: action.payload.endDate || '',
        rankingStartDate: action.payload.rankingStartDate || '',
        rankingEndDate: action.payload.rankingEndDate || '',
        introductionTextIT: action.payload.introductionTextIT || '',
        introductionTextEN: action.payload.introductionTextEN || '',
        introductionTextFR: action.payload.introductionTextFR || '',
        introductionTextDE: action.payload.introductionTextDE || '',
        introductionTextSL: action.payload.introductionTextSL || '',
      },
    }),
    setAdditionalInfo: (state, action: PayloadAction<AdditionalInfo>) => ({
      ...state,
      additionalInfo: { ...state.additionalInfo, ...action.payload },
    }),
    setInitiativeLogo: (state, action: PayloadAction<LogoDTO>) => ({
      ...state,
      additionalInfo: { ...state.additionalInfo, ...action.payload },
    }),
    saveApiKeyClientId: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      beneficiaryRule: {
        ...state.beneficiaryRule,
        apiKeyClientId: action.payload,
      },
    }),
    saveApiKeyClientAssertion: (state, action: PayloadAction<string | undefined>) => ({
      ...state,
      beneficiaryRule: {
        ...state.beneficiaryRule,
        apiKeyClientAssertion: action.payload,
      },
    }),
    saveAutomatedCriteria: (state, action: PayloadAction<Array<AutomatedCriteriaItem>>) => {
      state.beneficiaryRule.automatedCriteria = [];
      state.beneficiaryRule.automatedCriteria = [...action.payload];
    },
    saveManualCriteria: (state, action: PayloadAction<Array<ManualCriteriaItem>>) => {
      state.beneficiaryRule.selfDeclarationCriteria = [];
      state.beneficiaryRule.selfDeclarationCriteria = [...action.payload];
    },
    setAutomatedCriteria: (state, action: PayloadAction<AutomatedCriteriaItem>) => {
      /* eslint-disable functional/no-let */
      let criteriaFound = false;
      let i = 0;
      const automatedCriteria = [...state.beneficiaryRule.automatedCriteria];
      while (criteriaFound === false && i < automatedCriteria.length) {
        criteriaFound = automatedCriteria[i].field === action.payload.field;
        i++;
      }
      /* eslint-disable functional/immutable-data */
      if (criteriaFound) {
        i--;
        const newAutomatedCriteria = [...automatedCriteria.splice(i, 0)];
        newAutomatedCriteria.push(action.payload);
        state.beneficiaryRule.automatedCriteria = [...newAutomatedCriteria];
      } else {
        state.beneficiaryRule.automatedCriteria.push(action.payload);
      }
    },
    setManualCriteria: (state, action: PayloadAction<ManualCriteriaItem>) => {
      /* eslint-disable functional/no-let */
      let criteriaFound = false;
      let i = 0;
      const selfDeclarationCriteria = [...state.beneficiaryRule.selfDeclarationCriteria];
      while (criteriaFound === false && i < selfDeclarationCriteria.length) {
        criteriaFound = selfDeclarationCriteria[i].code === action.payload.code;
        i++;
      }
      /* eslint-disable functional/immutable-data */
      if (criteriaFound) {
        i--;
        const newSelfDeclarationCriteria = [...selfDeclarationCriteria.splice(i, 0)];
        newSelfDeclarationCriteria.push(action.payload);
        state.beneficiaryRule.selfDeclarationCriteria = [...newSelfDeclarationCriteria];
      } else {
        state.beneficiaryRule.selfDeclarationCriteria.push(action.payload);
      }
    },
    saveRewardRule: (
      state,
      action: PayloadAction<{ _type: string; rewardValue: number | undefined ; rewardValueType: RewardValueTypeEnum}>
    ) => ({
      ...state,
      rewardRule: {
        // eslint-disable-next-line no-underscore-dangle
        _type: action.payload._type,
        // eslint-disable-next-line no-prototype-builtins
        rewardValue: action.payload.hasOwnProperty('rewardValue')
          ? action.payload.rewardValue
          : undefined,
          rewardValueType: action.payload.rewardValueType,
      },
    }),
    saveMccFilter: (state, action: PayloadAction<MccFilterDTO>) => ({
      ...state,
      trxRule: {
        ...state.trxRule,
        mccFilter: {
          allowedList: action.payload.allowedList,
          values: action.payload.values,
        },
      },
    }),
    saveRewardLimits: (state, action: PayloadAction<Array<RewardLimit>>) => ({
      ...state,
      trxRule: {
        ...state.trxRule,
        rewardLimits: [...action.payload],
      },
    }),
    saveThreshold: (state, action: PayloadAction<Threshold>) => ({
      ...state,
      trxRule: {
        ...state.trxRule,
        threshold: {
          from: action.payload.from,
          fromIncluded: action.payload.fromIncluded,
          to: action.payload.to,
          toIncluded: action.payload.toIncluded,
        },
      },
    }),
    saveTrxCount: (state, action: PayloadAction<TrxCount>) => ({
      ...state,
      trxRule: {
        ...state.trxRule,
        trxCount: {
          from: action.payload.from,
          fromIncluded: action.payload.fromIncluded,
          to: action.payload.to,
          toIncluded: action.payload.toIncluded,
        },
      },
    }),
    saveDaysOfWeekIntervals: (state, action: PayloadAction<Array<DaysOfWeekInterval>>) => ({
      ...state,
      trxRule: {
        ...state.trxRule,
        daysOfWeekIntervals: [...action.payload],
      },
    }),
    saveRefundRule: (state, action: PayloadAction<RefundRule>) => ({
      ...state,
      refundRule: {
        reimbursmentQuestionGroup: action.payload.reimbursmentQuestionGroup,
        timeParameter: action.payload.timeParameter,
        accumulatedAmount: action.payload.accumulatedAmount,
        additionalInfo: action.payload.additionalInfo,
        reimbursementThreshold: action.payload.reimbursementThreshold,
      },
    }),
  },
});

export const {
  setInitiative,
  resetInitiative,
  setInitiativeId,
  setOrganizationId,
  setStatus,
  setInitiativeName,
  setInitiativeCreationDate,
  setInitiativeUpdateDate,
  setGeneralInfo,
  setAdditionalInfo,
  setInitiativeLogo,
  saveApiKeyClientId,
  saveApiKeyClientAssertion,
  setAutomatedCriteria,
  saveAutomatedCriteria,
  setManualCriteria,
  saveManualCriteria,
  saveRewardRule,
  saveMccFilter,
  saveRewardLimits,
  saveThreshold,
  saveTrxCount,
  saveDaysOfWeekIntervals,
  saveRefundRule,
} = initiativeSlice.actions;

export const initiativeReducer = initiativeSlice.reducer;
export const initiativeSelector = (state: RootState): Initiative => state.initiative;
export const generalInfoSelector = (state: RootState): GeneralInfo => state.initiative.generalInfo;
export const additionalInfoSelector = (state: RootState): AdditionalInfo =>
  state.initiative.additionalInfo;
export const stepTwoBeneficiaryKnownSelector = (state: RootState): string | undefined =>
  state.initiative.generalInfo.beneficiaryKnown;
export const stepTwoRankingEnabledSelector = (state: RootState): string | undefined =>
  state.initiative.generalInfo.rankingEnabled;
export const beneficiaryRuleSelector = (
  state: RootState
): {
  apiKeyClientId: string | undefined;
  apiKeyClientAssertion: string | undefined;
  selfDeclarationCriteria: Array<ManualCriteriaItem>;
  automatedCriteria: Array<AutomatedCriteriaItem>;
} => state.initiative.beneficiaryRule;
export const initiativeIdSelector = (state: RootState): string | undefined =>
  state.initiative.initiativeId;
export const initiativeRewardRuleSelector = (state: RootState): RewardRule =>
  state.initiative.rewardRule;
export const initiativeMccFilterSelector = (state: RootState): MccFilterDTO | undefined =>
  state.initiative.trxRule.mccFilter;
export const initiativeRewardLimitsSelector = (state: RootState): Array<RewardLimit> | undefined =>
  state.initiative.trxRule.rewardLimits;
export const initiativeThresholdSelector = (state: RootState): Threshold | undefined =>
  state.initiative.trxRule.threshold;
export const initiativeTrxCountSelector = (state: RootState): TrxCount | undefined =>
  state.initiative.trxRule.trxCount;
export const initiativeDaysOfWeekIntervalsSelector = (
  state: RootState
): Array<DaysOfWeekInterval> | undefined => state.initiative.trxRule.daysOfWeekIntervals;
export const initiativeRefundRulesSelector = (state: RootState): RefundRule =>
  state.initiative.refundRule;
export const initiativeStatusSelector = (state: RootState): string | undefined =>
  state.initiative.status;
