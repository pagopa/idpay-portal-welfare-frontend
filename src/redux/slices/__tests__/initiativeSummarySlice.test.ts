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
  test('initiative Summary slice actions sorts initiatives when the payload is an array', () => {
    const unsortedSummary: InitiativeSummaryArrayDTO = [
      {
        initiativeName: 'Test 3',
      },
      {
        initiativeName: 'Test 1',
      },
      {
        initiativeName: 'Test 2',
      },
    ];

    const nextState = initiativeSummaryReducer(
      mockedInitialState,
      setInitiativeSummaryList(unsortedSummary)
    );

    expect(nextState.list).toEqual([
      {
        initiativeName: 'Test 1',
      },
      {
        initiativeName: 'Test 2',
      },
      {
        initiativeName: 'Test 3',
      },
    ]);
  });

  test('initiative Summary slice actions keeps the order for initiatives with the same name', () => {
    const summaryWithDuplicateNames: InitiativeSummaryArrayDTO = [
      {
        initiativeName: 'Test 1',
      },
      {
        initiativeName: 'Test 1',
      },
      {
        initiativeName: 'Test 2',
      },
    ];

    const nextState = initiativeSummaryReducer(
      mockedInitialState,
      setInitiativeSummaryList(summaryWithDuplicateNames)
    );

    expect(nextState.list).toEqual([
      {
        initiativeName: 'Test 1',
      },
      {
        initiativeName: 'Test 1',
      },
      {
        initiativeName: 'Test 2',
      },
    ]);
  });

  test('initiative Summary slice actions keeps the payload when it is not an array', () => {
    const payload = new Set([
      {
        initiativeName: 'Single item',
      },
    ]);

    const nextState = initiativeSummaryReducer(
      mockedInitialState,
      {
        type: setInitiativeSummaryList.type,
        payload: payload as any,
      } as any
    );

    expect(nextState.list).toEqual([{ initiativeName: 'Single item' }]);
  });

  test('initiative Summary slice selectors', () => {
    store.dispatch(
      setInitiativeSummaryList([
        {
          initiativeName: 'Test 1',
        },
      ])
    );

    expect(initiativeSummarySelector(store.getState())).toEqual([
      {
        initiativeName: 'Test 1',
      },
    ]);
  });
});