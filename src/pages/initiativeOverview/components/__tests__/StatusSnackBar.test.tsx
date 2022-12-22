import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import StatusSnackBar from '../StatusSnackBar';
import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

window.scrollTo = jest.fn();

describe('<StatusSnacBar />', (injectedStore?: ReturnType<
  typeof createStore
>, injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  // const user = userEvent.setup();
  // const initiativeStatus = store.getState().initiative.status;
  const initiativeId = store.getState().initiative.initiativeId;
  const setOpenSnackBar = jest.fn();

  test('Test Close Modal and ViewUser Buttons', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <StatusSnackBar
            openSnackBar={true}
            setOpenSnackBar={setOpenSnackBar}
            fileStatus={'OK'}
            beneficiaryReached={25}
            initiativeId={initiativeId}
          />
        </Router>
      </Provider>
    );

    const closeBtn = screen.getByTestId('close-bar-test') as HTMLButtonElement;
    fireEvent.click(closeBtn);
    expect(setOpenSnackBar).toBeCalled();

    const currentPath = history.location.pathname;
    const viewBtn = screen.getByTestId('view-users-test') as HTMLButtonElement;
    fireEvent.click(viewBtn);
    expect(currentPath !== history.location.pathname).toBeTruthy();
  });

  it('Test pathname replace on click snackbar', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <StatusSnackBar
            openSnackBar={true}
            setOpenSnackBar={setOpenSnackBar}
            fileStatus={'KO'}
            beneficiaryReached={25}
            initiativeId={initiativeId}
          />
        </Router>
      </Provider>
    );
    const closeBtn = screen.getByTestId('close-bar-test') as HTMLButtonElement;
    fireEvent.click(closeBtn);
    expect(setOpenSnackBar).toBeCalled();
  });

  it('Test render snackbar with Filetatus TO_SCHEDULE', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <StatusSnackBar
            openSnackBar={true}
            setOpenSnackBar={setOpenSnackBar}
            fileStatus={'TO_SCHEDULE'}
            beneficiaryReached={25}
            initiativeId={initiativeId}
          />
        </Router>
      </Provider>
    );

    const pending = screen.getByText('pages.initiativeOverview.snackBar.pending');
    expect(pending).toBeInTheDocument();
  });

  const statusOptions = ['OK', 'KO', 'PROC_KO', '', 'TO_SHEDULE'];
  statusOptions.forEach((item) => {
    it('Test render of snackbar', () => {
      render(
        <Provider store={store}>
          <StatusSnackBar
            openSnackBar={true}
            setOpenSnackBar={setOpenSnackBar}
            fileStatus={item}
            beneficiaryReached={25}
            initiativeId={initiativeId}
          />
        </Provider>
      );
    });
  });
});
