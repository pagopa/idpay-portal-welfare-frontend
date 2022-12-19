import { cleanup, render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import InitiativeOverview from '../initiativeOverview';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { setStatus } from '../../../redux/slices/initiativeSlice';
import { setPermissionsList } from '../../../redux/slices/permissionsSlice';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';

export function mockLocationFunction() {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useLocation: jest.fn().mockReturnValue({
      pathname: '/localhost:3000/portale-enti',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }),
  };
}

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

window.scrollTo = jest.fn();

describe('<InitiativeOverview />', (injectedStore?: ReturnType<
  typeof createStore
>, injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test Button details', async () => {
    store.dispatch(setStatus('IN_REVISION'));
    store.dispatch(
      setPermissionsList([
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
      ])
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );

    const datailsBtn = screen.getByTestId('view-datails-test') as HTMLButtonElement;
    fireEvent.click(datailsBtn);
  });

  test('Test TO_CHECK button', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'publishInitiative', description: 'description', mode: 'enabled' },
      ])
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );
    store.dispatch(setStatus('TO_CHECK'));

    const toCheckBtn = screen.getByTestId('to-check-onclick-test');
    fireEvent.click(toCheckBtn);
  });

  test('Test APPROVED button', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'publishInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );
    store.dispatch(setStatus('APPROVED'));
    const approvedBtn = screen.getByTestId('approved-onclick-test');
    fireEvent.click(approvedBtn);
  });

  test('Test DRAFT button', async () => {
    store.dispatch(setStatus('DRAFT'));
    store.dispatch(
      setPermissionsList([
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
      ])
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );
    store.dispatch(setStatus('DRAFT'));

    const draftBtn = screen.getByTestId('draft-onclick-test');
    fireEvent.click(draftBtn);
  });

  test('Testing breadCrumb back button', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );

    const overviewBackBtn = screen.getByTestId('overview-back-bread') as HTMLButtonElement;
    // Not Found
    const oldLocPathname = history.location.pathname;
    fireEvent.click(overviewBackBtn);
    await waitFor(() => expect(oldLocPathname !== history.location.pathname).toBeTruthy());
  });

  test('Test revision Button', () => {
    store.dispatch(setStatus('IN_REVISION'));
    store.dispatch(
      setPermissionsList([
        { name: 'reviewInitiative', description: 'description', mode: 'enabled' },
      ])
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );

    const revisionBtn = screen.getByTestId('revision-onclick-test') as HTMLButtonElement;
    fireEvent.click(revisionBtn);
  });

  test('Test of update action button', () => {
    store.dispatch(
      setPermissionsList([
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );
    store.dispatch(setStatus('APPROVED'));

    const updateActionBtn = screen.getByText('pages.initiativeList.actions.update');
    fireEvent.click(updateActionBtn);
  });

  test('Test of view users button', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <InitiativeOverview />
          </Router>
        </ThemeProvider>
      </Provider>
    );
    store.dispatch(setStatus('PUBLISHED'));
    const viewUsers = screen.getByText(/pages.initiativeOverview.next.ViewUsers/);
    fireEvent.click(viewUsers);
  });
});
