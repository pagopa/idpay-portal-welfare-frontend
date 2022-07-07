import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface StepOneFormModel {
  recipientsQuestionGroup: string | undefined;
  recipientsTypeGroup: string | undefined;
  totalBudget: string;
  budgetPerPerson: string;
  joinFrom: string;
  joinTo: string;
  spendFrom: string;
  spendTo: string;
}

interface StepOneFormState {
  form: StepOneFormModel;
}

const initialState: StepOneFormState = {
  form: {
    recipientsQuestionGroup: 'persons',
    recipientsTypeGroup: 'manual_list',
    totalBudget: '',
    budgetPerPerson: '',
    joinFrom: '',
    joinTo: '',
    spendFrom: '',
    spendTo: '',
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
