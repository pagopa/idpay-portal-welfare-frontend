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
import routes from '../routes';
import useTCAgreement from '../hooks/useTCAgreement';
import { usePermissions } from '../hooks/usePermissions';
import { USER_PERMISSIONS } from '../utils/constants';

jest.mock('@pagopa/mui-italia/dist/components/Footer/Footer', () => ({
  Footer: () => {},
}));

const mockSignOutFn = jest.fn();

jest.mock('../hooks/useTCAgreement', () => jest.fn());
jest.mock('../hooks/usePermissions', () => ({
  usePermissions: jest.fn(),
}));

jest.mock('../decorators/withLogin', () => (Component: any) => Component);
jest.mock('../decorators/withParties', () => (Component: any) => Component);
jest.mock('../decorators/withSelectedParty', () => (Component: any) => Component);
jest.mock('../decorators/withSelectedPartyProducts', () => (Component: any) => Component);

const mockedUseTCAgreement = jest.mocked(useTCAgreement);
const mockedUsePermissions = jest.mocked(usePermissions);

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  mockedUseTCAgreement.mockReturnValue({
    isTOSAccepted: true,
    acceptTOS: mockSignOutFn,
    firstAcceptance: false,
  });
  mockedUsePermissions.mockReturnValue(true);
});

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  const renderResult = render(
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    </ThemeProvider>
  );
  return { store, history, ...renderResult };
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

test('Test rendering with undefined TOS', async () => {
  mockedUseTCAgreement.mockReturnValue({
    isTOSAccepted: undefined,
    acceptTOS: mockSignOutFn,
    firstAcceptance: false,
  });
  const history = createMemoryHistory();
  history.push(routes.NEW_INITIATIVE);
  const { container } = renderApp(undefined, history);
  await waitFor(() => expect(container.firstChild).toBeEmptyDOMElement());
});

test('Test routing with unaccepted TOS', async () => {
  mockedUseTCAgreement.mockReturnValue({
    isTOSAccepted: false,
    acceptTOS: mockSignOutFn,
    firstAcceptance: false,
  });
  const history = createMemoryHistory();
  history.push(routes.NEW_INITIATIVE);
  renderApp(undefined, history);
  await waitFor(() => expect(history.location.pathname).toBe(routes.NEW_INITIATIVE));
});

test('Test routing without create initiative permissions', async () => {
  mockedUsePermissions.mockImplementation((permission) => permission !== USER_PERMISSIONS.CREATE_INITIATIVE);
  const history = createMemoryHistory();
  history.push(routes.NEW_INITIATIVE);
  renderApp(undefined, history);
  await waitFor(() => expect(history.location.pathname).toBe(routes.HOME));
});

test('Test routing without update initiative permissions', async () => {
  mockedUsePermissions.mockImplementation((permission) => permission !== USER_PERMISSIONS.UPDATE_INITIATIVE);
  const history = createMemoryHistory();
  history.push(routes.INITIATIVE);
  renderApp(undefined, history);
  await waitFor(() => expect(history.location.pathname).toBe(routes.HOME));
});

test('Test routing to choose organization without create permissions', async () => {
  mockedUsePermissions.mockImplementation((permission) => permission !== USER_PERMISSIONS.CREATE_INITIATIVE);
  const history = createMemoryHistory();
  history.push(routes.CHOOSE_ORGANIZATION);
  renderApp(undefined, history);
  await waitFor(() => expect(history.location.pathname).toBe(routes.CHOOSE_ORGANIZATION));
});

test('Test routing to choose organization with create permissions', async () => {
  mockedUsePermissions.mockImplementation((permission) => permission === USER_PERMISSIONS.CREATE_INITIATIVE);
  const history = createMemoryHistory();
  history.push(routes.CHOOSE_ORGANIZATION);
  renderApp(undefined, history);
  await waitFor(() => expect(history.location.pathname).toBe(routes.HOME));
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