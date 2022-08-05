import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, RootState } from '../../redux/store';
import withSelectedParty from '../withSelectedParty';
import { verifyFetchPartyDetailsMockExecution } from '../../services/__mocks__/partyService';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { testToken } from '../../utils/constants';
import React, { Fragment } from 'react';

jest.mock('../../services/partyService');

const expectedPartyId: string = '2f63a151-da4e-4e1e-acf9-adecc0c4d727';

let fetchPartyDetailsSpy: jest.SpyInstance;

beforeEach(() => {
  fetchPartyDetailsSpy = jest.spyOn(require('../../services/partyService'), 'fetchPartyDetails');

  storageTokenOps.write(testToken); // party with partyId="onboarded"
});

const renderApp = async (
  waitSelectedParty: boolean,
  injectedStore?: ReturnType<typeof createStore>
) => {
  const store = injectedStore ? injectedStore : createStore();

  const Component = () => <Fragment></Fragment>;
  const DecoratedComponent = withSelectedParty(Component);

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

test('Test party not active', async () => {
  const store = createStore();

  // party with partyId="2"
  storageTokenOps.write(
    'eyJraWQiOiJqd3QtZXhjaGFuZ2VfZDQ6ZWY6NjQ6NzY6YWY6MjI6MWY6NDg6MTA6MDM6ZTQ6NjE6NmU6Y2M6Nzk6MmYiLCJhbGciOiJSUzI1NiJ9.eyJlbWFpbCI6ImRtYXJ0aW5vQGxpdmUuY29tIiwiZmFtaWx5X25hbWUiOiJMb25nbyIsImZpc2NhbF9udW1iZXIiOiJMTkdNTEU4NVAxOUM4MjZKIiwibmFtZSI6IkVtaWxpYSIsImZyb21fYWEiOmZhbHNlLCJ1aWQiOiJiOWI4OWVmOS00ZGNiLTRlMjctODE5Mi1kOTcyZWZlZjYxNGUiLCJsZXZlbCI6IkwyIiwiaWF0IjoxNjU1OTgyMjE0LCJleHAiOjE2NTU5ODIyMjksImF1ZCI6InBvcnRhbGUtcGEuY29sbC5wbi5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL3VhdC5zZWxmY2FyZS5wYWdvcGEuaXQiLCJqdGkiOiI5NWM3M2M0OS0xNTE3LTRlODAtYWNhNy1iZjE4NDZkOTJhNTMiLCJvcmdhbml6YXRpb24iOnsiaWQiOiIyIiwicm9sZXMiOlt7InBhcnR5Um9sZSI6Ik1BTkFHRVIiLCJyb2xlIjoiYWRtaW4ifV0sImZpc2NhbF9jb2RlIjoiODAwMDg1MTA3NTQifSwiZGVzaXJlZF9leHAiOjE2NTYwMTQ2MDR9.VjoWV-iWxqGh2VwB82fTJT04VnY5cIEePMUCQBHVAt7GziuCg12XV8EKQa0cqVa25ggF6peReHicO_WEuhrXsFdLohYT5OCe1gA_65SGJp1bxvPL-0yOvrnEje7XE57nU3YzE6ssq9KDi4wdVr4_RC1JwliiAPq411j1-osyt9vtqQU_b-cfJxQ-v99dlq-TiRPCWX37h8Y-2q4zOF0RTw6McCP8_6j-iaq0tFOi5aq-NjssEvr_eYLLtQwBsBOX3OFysmmhq5dUPDov24WaPZcpbbzCEBPiqW6J69qSxyQUmztNjRfFYD5lsWKvThbmYWh0DSUbWuk8uahITriytw'
  );

  await renderApp(false, store);

  await waitFor(() => expect(store.getState().appState.errors.length).toBe(1));
  expect(store.getState().parties.selected).toBeUndefined();
});

const checkSelectedParty = (state: RootState) => {
  const party = state.parties.selected;
  verifyFetchPartyDetailsMockExecution(party!);
};

const checkMockInvocation = (expectedCallsNumber: number) => {
  expect(fetchPartyDetailsSpy).toBeCalledTimes(expectedCallsNumber);
  expect(fetchPartyDetailsSpy).toBeCalledWith(expectedPartyId, undefined);
};
