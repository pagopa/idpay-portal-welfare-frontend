/* eslint-disable react/jsx-no-bind */
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
// import { groupsApiMocked } from '../../../api/__mocks__/groupsApiClient';

import { createStore } from '../../../redux/store';
import InitiativeOverview from '../initiativeOverview';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { setInitiative, setInitiativeId } from '../../../redux/slices/initiativeSlice';
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

jest.mock('react-router-dom', () => mockLocationFunction());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

describe('<InitiativeOverview />', (injectedStore?: ReturnType<
  typeof createStore
>, injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const store = injectedStore ? injectedStore : createStore();
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the InitiativeOverview component', async () => {
    store.dispatch(setInitiative(mockedInitiative));
    await waitFor(() => setInitiativeId('333'));
    await waitFor(async () => {
      render(
        <Provider store={store}>
          <InitiativeOverview />
        </Provider>
      );
      /*
      store.dispatch({
        type: 'POPULATE_DATA',
        initiativeId: 'id',
      });
      
      console.log('state', store.getState());
*/
    });
  });

  test('Testing functions calls', async () => {
    const history = injectedHistory ? injectedHistory : createMemoryHistory();
    const { queryByTestId, debug, getByTestId } = render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );

    // debug(undefined, 99999);
    const overviewBackBtn = getByTestId('overview-back-bread') as HTMLButtonElement;
    // Not Found
    //const overviewViewBtn = getByTestId('view-custom-test') as HTMLButtonElement;
    const oldLocPathname = history.location.pathname;

    userEvent.click(overviewBackBtn);

    await waitFor(() => expect(oldLocPathname !== history.location.pathname).toBeTruthy());
    // await waitFor(() => expect(overviewViewBtn).toBeInTheDocument());

    const condition = queryByTestId('contion-onclick-test') as HTMLButtonElement;
    userEvent.click(condition);
  });
});
