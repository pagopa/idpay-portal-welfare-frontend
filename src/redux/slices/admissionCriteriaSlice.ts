import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { AdmissionCriteria } from '../../model/AdmissionCriteria';

interface AdmissionCriteriaState {
  list?: Array<AdmissionCriteria>;
}

const initialState: AdmissionCriteriaState = {};

/* eslint-disable functional/immutable-data */
export const admissionCriteriaSlice = createSlice({
  name: 'admissionCriteria',
  initialState,
  reducers: {
    setAdmissionCriteriaList: (state, action: PayloadAction<Array<AdmissionCriteria>>) => {
      state.list = action.payload;
    },
  },
});

export const admissionCriteriaActions = admissionCriteriaSlice.actions;
export const admissionCriteriaReducer = admissionCriteriaSlice.reducer;
export const admissionCriteriaSelectors = {
  selectAdmissionCriteriaList: (state: RootState): Array<AdmissionCriteria> | undefined =>
    state.admissionCriteria.list,
};
