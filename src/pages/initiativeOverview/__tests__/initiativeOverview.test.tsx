/* eslint-disable react/jsx-no-bind */
import { cleanup, render, waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import InitiativeOverview from '../initiativeOverview';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { setInitiative, setInitiativeId, setStatus } from '../../../redux/slices/initiativeSlice';
import { mockedInitiative } from '../../../model/__tests__/Initiative.test';

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

// jest.mock('react-router-dom', () => mockLocationFunction());

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useLocation: () => ({
//     pathname: 'localhost:3000/portale-enti',
//   }),
// }));

// eslint-disable-next-line @typescript-eslint/no-floating-promises
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
    store.dispatch(setInitiative(mockedInitiative));
    store.dispatch(setStatus('IN_REVISION'));
    // await waitFor(() => setInitiativeId('333'));
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
  });

  test('Testing functions calls', async () => {
    const { queryByTestId } = render(
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

  test('Testing functions calls', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );
  });
});
