import { Provider } from 'react-redux';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { createStore } from '../../../redux/store';
import InitiativeDetail from '../initiativeDetail';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { setStatus } from '../../../redux/slices/initiativeSlice';
import { setPermissionsList } from '../../../redux/slices/permissionsSlice';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
  withTranslation: jest.fn(),
}));

describe('<InitiativeDetail />', (injectedStore?: ReturnType<
  typeof createStore
>, injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  // store.dispatch(setInitiative(mockedInitiative));

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('use can review case', async () => {
    //store.dispatch(setInitiative(mockedInitiative));
    store.dispatch(setStatus('IN_REVISION'));
    store.dispatch(
      setPermissionsList([
        { name: 'reviewInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeDetail />
        </Router>
      </Provider>
    );
    const rejectBtn = screen.getByText(
      'pages.initiativeDetail.accordion.buttons.reject'
    ) as HTMLButtonElement;
    expect(rejectBtn).toBeInTheDocument();
    expect(rejectBtn).toBeDisabled();

    const approveBtn = screen.getByText(
      'pages.initiativeDetail.accordion.buttons.approve'
    ) as HTMLButtonElement;
    expect(approveBtn).toBeInTheDocument();
    expect(approveBtn).toBeDisabled();

    const backBtnDetail = screen.getByTestId('backButtonDetail') as HTMLButtonElement;
    const secondBackButton = screen.getByText(/pages.initiativeDetail.accordion.buttons.back/i);

    const oldLocPathname = history.location.pathname;

    fireEvent.click(backBtnDetail);

    await waitFor(() => expect(oldLocPathname !== history.location.pathname).toBeTruthy());

    fireEvent.click(secondBackButton);
    await waitFor(() => expect(oldLocPathname !== history.location.pathname).toBeTruthy());
  });

  it('Test userCanUpdateInitiative', async () => {
    store.dispatch(setStatus('APPROVED'));
    store.dispatch(
      setPermissionsList([
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeDetail />
        </Router>
      </Provider>
    );
  });

  it('Test userCanDeleteInitiative', async () => {
    store.dispatch(setStatus('APPROVED'));
    store.dispatch(
      setPermissionsList([
        { name: 'deleteInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeDetail />
        </Router>
      </Provider>
    );
  });
});
