import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { InitiativeSummaryArrayDTO } from '../../api/generated/initiative/apiClient';

export interface InitiativeSummaryState {
  list?: InitiativeSummaryArrayDTO;
}

const initialState: InitiativeSummaryState = {};

export const initiativeSummarySlice = createSlice({
  name: 'initiativeSummary',
  initialState,
  reducers: {
    setInitiativeSummaryList: (state, action: PayloadAction<InitiativeSummaryArrayDTO>) => {
      if (Array.isArray(action.payload)) {
        // eslint-disable-next-line functional/immutable-data
        const orderedList = action.payload.sort((a, b) => {
          if(a.initiativeName && b.initiativeName){
            return a.initiativeName > b.initiativeName ? 1 : b.initiativeName > a.initiativeName ? -1 : 0;
          } else{
            return 0;
          }
        });
        return {
          ...state,
          list: [...orderedList],
        };
      } else {
        return {
          ...state,
          list: [...action.payload],
        };
      }
    },
  },
});

export const { setInitiativeSummaryList } = initiativeSummarySlice.actions;
export const initiativeSummaryReducer = initiativeSummarySlice.reducer;

export const initiativeSummarySelector = (
  state: RootState
): InitiativeSummaryArrayDTO | undefined => state.initiativeSummary.list;
