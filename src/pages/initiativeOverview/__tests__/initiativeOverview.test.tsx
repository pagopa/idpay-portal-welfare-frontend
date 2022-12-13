/* eslint-disable react/jsx-no-bind */
import { cleanup, render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import InitiativeOverview from '../initiativeOverview';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { setStatus } from '../../../redux/slices/initiativeSlice';
import { setPermissionsList } from '../../../redux/slices/permissionsSlice';

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

  test('should display the InitiativeOverview component', async () => {
    store.dispatch(setStatus('IN_REVISION'));
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );

    const condition = screen.getByTestId('revision-onclick-test') as HTMLButtonElement;
    fireEvent.click(condition);

    const viewDetailsBtn = screen.getByText(
      /pages.initiativeOverview.info.otherinfo.details/i
    ) as HTMLButtonElement;
    fireEvent.click(viewDetailsBtn);

    store.dispatch(
      setPermissionsList([
        { name: 'reviewInitiative', description: 'description', mode: 'enabled' },
      ])
    );
  });

  test('should display the InitiativeOverview component status TO_CHECK', async () => {
    store.dispatch(setStatus('TO_CHECK'));

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );
  });

  test('should display the InitiativeOverview component status APPROVED', async () => {
    store.dispatch(setStatus('APPROVED'));
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

    store.dispatch(
      setPermissionsList([
        { name: 'publishInitiative', description: 'description', mode: 'enabled' },
      ])
    );
  });

  test('should display the InitiativeOverview component status DRAFT', async () => {
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

    store.dispatch(
      setPermissionsList([
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
      ])
    );
  });

  test('Testing functions calls', async () => {
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
});
