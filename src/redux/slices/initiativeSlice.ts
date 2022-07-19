import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Initiative, GeneralInfo, AdditionalInfo } from '../../model/Initiative';

const initialState: Initiative = {
  initiativeId: '',
  status: '',
  generalInfo: {
    beneficiaryType: 'PF',
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
    setInitiativeId: (state, action: PayloadAction<string>) => {
      // eslint-disable-next-line functional/immutable-data
      state.initiativeId = action.payload;
    },
    setGeneralInfo: (state, action: PayloadAction<GeneralInfo>) => {
      // eslint-disable-next-line no-param-reassign, functional/immutable-data
      state.generalInfo = { ...action.payload };
    },
    setAdditionalInfo: (state, action: PayloadAction<AdditionalInfo>) => {
      // eslint-disable-next-line no-param-reassign, functional/immutable-data
      state.additionalInfo = { ...action.payload };
    },
  },
});

export const { setInitiativeId, setGeneralInfo, setAdditionalInfo } = initiativeSlice.actions;
export const initiativeReducer = initiativeSlice.reducer;
export const initiativeSelector = (state: RootState): Initiative => state.initiative;
export const generalInfoSelector = (state: RootState): GeneralInfo => state.initiative.generalInfo;
export const stepOneBeneficiaryKnownSelector = (state: RootState): string =>
  state.initiative.generalInfo.beneficiaryKnown;
