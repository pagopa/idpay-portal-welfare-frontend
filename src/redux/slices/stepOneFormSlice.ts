import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface StepOneFormModel {
  beneficiaryType: string;
  beneficiaryKnown: string;
  budget: string;
  beneficiaryBudget: string;
  startDate: string;
  endDate: string;
  rankingStartDate: string;
  rankingEndDate: string;
}

interface StepOneFormState {
  form: StepOneFormModel;
}

const initialState: StepOneFormState = {
  form: {
    beneficiaryType: 'PF',
    beneficiaryKnown: 'false',
    budget: '',
    beneficiaryBudget: '',
    startDate: '',
    endDate: '',
    rankingStartDate: '',
    rankingEndDate: '',
  },
};

export const stepOneFormSlice = createSlice({
  name: 'stepOneForm',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<StepOneFormModel>) => {
      // eslint-disable-next-line no-param-reassign, functional/immutable-data
      state.form = { ...action.payload };
    },
  },
});

export const stepOneFormActions = stepOneFormSlice.actions;
export const stepOneFormReducer = stepOneFormSlice.reducer;
export const stepOneFormSelector = (state: RootState): StepOneFormState => state.stepOneForm;
export const stepOneBeneficiaryKnownSelector = (state: RootState): string =>
  state.stepOneForm.form.beneficiaryKnown;
