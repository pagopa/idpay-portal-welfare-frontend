import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  Initiative,
  GeneralInfo,
  AdditionalInfo,
  AutomatedCriteriaItem,
  SelfDeclarationCriteriaBoolItem,
  SelfDeclarationCriteriaMultiItem,
} from '../../model/Initiative';
// import { ManualCriteriaOptions } from '../../utils/constants';
import { BeneficiaryTypeEnum } from '../../utils/constants';

const initialState: Initiative = {
  initiativeId: undefined,
  organizationId: undefined,
  status: undefined,
  generalInfo: {
    beneficiaryType: BeneficiaryTypeEnum.PF,
    beneficiaryKnown: 'false',
    budget: '',
    beneficiaryBudget: '',
    startDate: '',
    endDate: '',
    rankingStartDate: '',
    rankingEndDate: '',
  },
  additionalInfo: {
    serviceId: '',
    serviceName: '',
    argument: '',
    description: '',
    channels: [{ type: 'web', contact: '' }],
  },
  beneficiaryRule: {
    selfDeclarationCriteria: [],
    automatedCriteria: [],
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
    setGeneralInfo: (state, action: PayloadAction<GeneralInfo>) => ({
      ...state,
      generalInfo: {
        beneficiaryType: action.payload.beneficiaryType,
        beneficiaryKnown: action.payload.beneficiaryKnown,
        budget: action.payload.budget,
        beneficiaryBudget: action.payload.beneficiaryBudget,
        startDate: action.payload.startDate || '',
        endDate: action.payload.endDate || '',
        rankingStartDate: action.payload.rankingStartDate || '',
        rankingEndDate: action.payload.rankingEndDate || '',
      },
    }),
    setAdditionalInfo: (state, action: PayloadAction<AdditionalInfo>) => ({
      ...state,
      additionalInfo: { ...action.payload },
    }),
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
    saveAutomatedCriteria: (state, action: PayloadAction<Array<AutomatedCriteriaItem>>) => {
      state.beneficiaryRule.automatedCriteria = [];
      state.beneficiaryRule.automatedCriteria = [...action.payload];
    },
    setManualCriteria: (
      state,
      action: PayloadAction<SelfDeclarationCriteriaBoolItem | SelfDeclarationCriteriaMultiItem>
    ) => {
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

      // state.beneficiaryRule.selfDeclarationCriteria = [
      //   ...state.beneficiaryRule.selfDeclarationCriteria,
      //   action.payload,
      // ];
    },
    saveManualCriteria: (
      state,
      action: PayloadAction<
        Array<SelfDeclarationCriteriaBoolItem | SelfDeclarationCriteriaMultiItem>
      >
    ) => {
      state.beneficiaryRule.selfDeclarationCriteria = [];
      state.beneficiaryRule.selfDeclarationCriteria = [...action.payload];
    },
  },
});

export const {
  setInitiative,
  resetInitiative,
  setInitiativeId,
  setOrganizationId,
  setStatus,
  setGeneralInfo,
  setAdditionalInfo,
  setAutomatedCriteria,
  saveAutomatedCriteria,
  setManualCriteria,
  saveManualCriteria,
} = initiativeSlice.actions;
export const initiativeReducer = initiativeSlice.reducer;
export const initiativeSelector = (state: RootState): Initiative => state.initiative;
export const generalInfoSelector = (state: RootState): GeneralInfo => state.initiative.generalInfo;
export const additionalInfoSelector = (state: RootState): AdditionalInfo =>
  state.initiative.additionalInfo;
export const stepOneBeneficiaryKnownSelector = (state: RootState): string | undefined =>
  state.initiative.generalInfo.beneficiaryKnown;
export const beneficiaryRuleSelector = (
  state: RootState
): {
  selfDeclarationCriteria: Array<
    SelfDeclarationCriteriaMultiItem | SelfDeclarationCriteriaBoolItem
  >;
  automatedCriteria: Array<AutomatedCriteriaItem>;
} => state.initiative.beneficiaryRule;
export const initiativeIdSelector = (state: RootState): string | undefined =>
  state.initiative.initiativeId;
