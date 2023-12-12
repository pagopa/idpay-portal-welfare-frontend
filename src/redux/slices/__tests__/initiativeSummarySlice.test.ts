import { InitiativeSummaryArrayDTO } from '../../../api/generated/initiative/InitiativeSummaryArrayDTO';
import { createStore } from '../../store';
import {
  initiativeSummaryReducer,
  initiativeSummarySelector,
  InitiativeSummaryState,
  setInitiativeSummaryList,
} from '../initiativeSummarySlice';

describe('initiative Summary slice ', () => {
  const store = createStore();
  const mockedInitialState: InitiativeSummaryState = {};
  const mockedInitiativeSummaryArrayDTO: InitiativeSummaryArrayDTO = [];
  test('initiative Summary slice actions', () => {
    expect(
      initiativeSummaryReducer(
        mockedInitialState,
        setInitiativeSummaryList(mockedInitiativeSummaryArrayDTO)
      )
    ).toBeDefined();
  });
  test('initiative Summary slice slectors', () => {
    expect(initiativeSummarySelector(store.getState())).not.toBeNull();
  });
});
