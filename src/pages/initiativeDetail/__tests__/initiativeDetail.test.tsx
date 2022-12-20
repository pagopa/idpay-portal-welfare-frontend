import { Provider } from 'react-redux';
import { render, waitFor, screen, fireEvent, cleanup } from '@testing-library/react';
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

window.scrollTo = jest.fn();

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<InitiativeDetail />', (injectedStore?: ReturnType<
  typeof createStore
>, injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test Render Initiative Detail component with permission reviewInitiative and Status IN_REVISION, button disabled', async () => {
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

  it('Test Render Initiative Detail component with permission reviewInitiative and Status IN_REVISION, onclick button test', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'reviewInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    store.dispatch(setStatus('IN_REVISION'));

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeDetail />
        </Router>
      </Provider>
    );

    const reject = screen.getByText(
      'pages.initiativeDetail.accordion.buttons.reject'
    ) as HTMLButtonElement;
    const approve = screen.getByText(
      'pages.initiativeDetail.accordion.buttons.approve'
    ) as HTMLButtonElement;

    expect(reject).toBeDisabled();

    const panel1 = screen.getByTestId('panel1-test') as HTMLButtonElement;
    const panel2 = screen.getByTestId('panel2-test') as HTMLButtonElement;
    const panel3 = screen.getByTestId('panel3-test') as HTMLButtonElement;
    const panel4 = screen.getByTestId('panel4-test') as HTMLButtonElement;
    const panel5 = screen.getByTestId('panel5-test') as HTMLButtonElement;

    fireEvent.click(panel1);
    fireEvent.click(panel2);
    fireEvent.click(panel3);
    fireEvent.click(panel4);
    fireEvent.click(panel5);

    fireEvent.click(reject);
    fireEvent.click(approve);
  });

  it('Test Render Initiative Detail component with permission deleteInitiative and Status APPROVED, onclick button', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'deleteInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    store.dispatch(setStatus('APPROVED'));

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeDetail />
        </Router>
      </Provider>
    );

    const deleteBtn = screen.getByText(
      'pages.initiativeDetail.accordion.buttons.delete'
    ) as HTMLButtonElement;

    fireEvent.click(deleteBtn);
  });

  it('Test Render Initiative Detail component with permission updateInitiative and Status APPROVED, onclick button', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    store.dispatch(setStatus('APPROVED'));

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeDetail />
        </Router>
      </Provider>
    );

    const editBtn = screen.getByText(
      'pages.initiativeDetail.accordion.buttons.edit'
    ) as HTMLButtonElement;
    fireEvent.click(editBtn);
  });
});
