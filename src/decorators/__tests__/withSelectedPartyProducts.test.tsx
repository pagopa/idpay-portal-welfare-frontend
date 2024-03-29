import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, RootState } from '../../redux/store';
import { verifyFetchPartyDetailsMockExecution } from '../../services/__mocks__/partyService';
import { verifyFetchPartyProductsMockExecution } from '../../services/__mocks__/productService';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { testToken } from '../../utils/constants';
import withSelectedPartyProducts from '../withSelectedPartyProducts';
import React, { Fragment } from 'react';

jest.mock('../../services/partyService');
jest.mock('../../services/productService');

const expectedPartyId: string = '2f63a151-da4e-4e1e-acf9-adecc0c4d727';

let fetchPartyDetailsSpy: jest.SpyInstance;
let fetchPartyProductsSpy: jest.SpyInstance;

beforeEach(() => {
  fetchPartyDetailsSpy = jest.spyOn(require('../../services/partyService'), 'fetchPartyDetails');
  fetchPartyProductsSpy = jest.spyOn(require('../../services/productService'), 'fetchProducts');
  
  storageTokenOps.write(testToken); // party with partyId="onboarded"
});

const renderApp = async (
  waitSelectedParty: boolean,
  injectedStore?: ReturnType<typeof createStore>
) => {
  const store = injectedStore ? injectedStore : createStore();

  const Component = () => <Fragment></Fragment>;
  const DecoratedComponent = withSelectedPartyProducts(Component);

  render(
    <Provider store={store}>
      <DecoratedComponent />
    </Provider>
  );

  if (waitSelectedParty) {
    await waitFor(() => expect(store.getState().parties.selected).not.toBeUndefined());
  }

  return { store, history };
};

test('Test default behavior when no parties', async () => {
  const { store } = await renderApp(true);
  checkSelectedParty(store.getState());

  // test when selected party already in store
  await renderApp(true, store);
  checkMockInvocation(1);
});

const checkSelectedParty = (state: RootState) => {
  const party = state.parties.selected;
  const partyProducts = state.parties.selectedProducts;
  verifyFetchPartyDetailsMockExecution(party!);
  verifyFetchPartyProductsMockExecution(partyProducts!);
};

const checkMockInvocation = (expectedCallsNumber: number) => {
  expect(fetchPartyDetailsSpy).toBeCalledTimes(expectedCallsNumber);
  expect(fetchPartyDetailsSpy).toBeCalledWith(expectedPartyId, undefined);

  expect(fetchPartyProductsSpy).toBeCalledTimes(expectedCallsNumber);
  expect(fetchPartyProductsSpy).toBeCalledWith(expectedPartyId);
};
