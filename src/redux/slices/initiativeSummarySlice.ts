import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitiativeSummaryArrayDTO } from '../../api/generated/initiative/InitiativeSummaryArrayDTO';
import type { RootState } from '../store';

export interface InitiativeSummaryState {
  list?: InitiativeSummaryArrayDTO;
}

const initialState: InitiativeSummaryState = {};

export const initiativeSummarySlice = createSlice({
  name: 'initiativeSummary',
  initialState,
  reducers: {
    setInitiativeSummaryList: (state, action: PayloadAction<InitiativeSummaryArrayDTO>) => ({
      ...state,
      list: [...action.payload],
    }),
  },
});

export const { setInitiativeSummaryList } = initiativeSummarySlice.actions;
export const initiativeSummaryReducer = initiativeSummarySlice.reducer;

export const initiativeSummarySelector = (
  state: RootState
): InitiativeSummaryArrayDTO | undefined => state.initiativeSummary.list;
