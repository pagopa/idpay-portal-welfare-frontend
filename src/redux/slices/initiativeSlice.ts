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
    setInitiativeId: (state, action: PayloadAction<string | undefined>) => {
      // eslint-disable-next-line functional/immutable-data
      state.initiativeId = action.payload;
    },
    setOrganizationId: (state, action: PayloadAction<string | undefined>) => {
      // eslint-disable-next-line functional/immutable-data
      state.organizationId = action.payload;
    },
    setStatus: (state, action: PayloadAction<string | undefined>) => {
      // eslint-disable-next-line functional/immutable-data
      state.status = action.payload;
    },
    setGeneralInfo: (state, action: PayloadAction<GeneralInfo>) => {
      // eslint-disable-next-line no-param-reassign, functional/immutable-data
      state.generalInfo = { ...action.payload };
    },
    setAdditionalInfo: (state, action: PayloadAction<AdditionalInfo>) => {
      // eslint-disable-next-line no-param-reassign, functional/immutable-data
      state.additionalInfo = { ...action.payload };
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
    setManualCriteria: (
      state,
      action: PayloadAction<SelfDeclarationCriteriaBoolItem | SelfDeclarationCriteriaMultiItem>
    ) => {
      state.beneficiaryRule.selfDeclarationCriteria = [
        ...state.beneficiaryRule.selfDeclarationCriteria,
        action.payload,
      ];
    },
  },
});

export const {
  setInitiativeId,
  setOrganizationId,
  setStatus,
  setGeneralInfo,
  setAdditionalInfo,
  setAutomatedCriteria,
  setManualCriteria,
} = initiativeSlice.actions;
export const initiativeReducer = initiativeSlice.reducer;
export const initiativeSelector = (state: RootState): Initiative => state.initiative;
export const generalInfoSelector = (state: RootState): GeneralInfo => state.initiative.generalInfo;
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
