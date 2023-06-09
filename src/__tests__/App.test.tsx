/* istanbul ignore file */
import { render /* , screen, waitFor */, waitFor } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { createStore, store } from '../redux/store';

import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { theme } from '@pagopa/mui-italia';
import '../locale';
import React from 'react';
import { ThemeProvider } from '@mui/system';
// import { PartiesState } from '../redux/slices/partiesSlice';

jest.mock('@pagopa/mui-italia/dist/components/Footer/Footer', () => ({
  Footer: () => {},
}));

const mockSignOutFn = jest.fn();

jest.mock('../hooks/useTCAgreement', () => () => ({
  isTOSAccepted: true,
  acceptTOS: mockSignOutFn,
  firstAcceptance: false,
}));

jest.mock('../decorators/withLogin');
jest.mock('../decorators/withParties');
jest.mock('../decorators/withSelectedParty');
jest.mock('../decorators/withSelectedPartyProducts');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    </ThemeProvider>
  );
  return { store, history };
};

test('Test rendering', () => {
  const { store } = renderApp();

  // //Header component decoration will load parties
  // verifyPartiesMockExecution(store.getState());

  // //Secured Routes in App will load User Party e Products
  // verifyLoginMockExecution(store.getState());
  // verifySelectedPartyProductsMockExecution(store.getState());
});

test('Test rendering dashboard parties loaded', () => {
  const history = createMemoryHistory();
  history.push('/dashboard/6');

  const { store } = renderApp(undefined, history);

  // verifyLoginMockExecution(store.getState());
  // expect(store.getState().parties.list).toBe(mockedParties); // the new UI is always fetching parties list
});

test('Test routing ', async () => {
  const history = createMemoryHistory();
  renderApp();
  await waitFor(() => expect(history.location.pathname).toBe('/'));
});
// function verifyPartiesMockExecution(arg0: {
//   parties: PartiesState;
//   // user: UserState;
//   // appState: AppStateState;
//   initiative: import('../model/Initiative').Initiative;
// }) {
//   throw new Error('Function not implemented.');
// }

// function verifyLoginMockExecution(arg0: {
//   parties: PartiesState;
//   // user: UserState;
//   // appState: AppStateState;
//   initiative: import('../model/Initiative').Initiative;
// }) {
//   throw new Error('Function not implemented.');
// }

// function verifySelectedPartyProductsMockExecution(arg0: {
//   parties: PartiesState;
//   // user: UserState;
//   // appState: AppStateState;
//   initiative: import('../model/Initiative').Initiative;
// }) {
//   throw new Error('Function not implemented.');
// }
