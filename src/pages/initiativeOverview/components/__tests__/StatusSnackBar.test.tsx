/* eslint-disable react/jsx-no-bind */
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
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

describe('<StatusSnacBar />', (injectedStore?: ReturnType<
  typeof createStore
>, injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const store = injectedStore ? injectedStore : createStore();

  const user = userEvent.setup();
  const initiativeStatus = store.getState().initiative.status;
  const initiativeId = store.getState().initiative.initiativeId;
  const setOpenSnackBar = jest.fn();
  // const history = { replace: jest.fn() };
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the SnackBar component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <StatusSnackBar
            openSnackBar={true}
            setOpenSnackBar={function (_value: SetStateAction<boolean>): void {
              //
            }}
            fileStatus={initiativeStatus}
            beneficiaryReached={25}
            initiativeId={initiativeId}
          />
        </Provider>
      );
    });
  });

  test('on click close modale', async () => {
    const { queryByTestId } = render(
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

    const useStateMock: any = (openSnackBar: boolean) => [openSnackBar, setOpenSnackBar];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    const closeBtn = queryByTestId('close-bar-test') as HTMLElement;
    act(() => {
      fireEvent.click(closeBtn);
    });
    expect(setOpenSnackBar).toBeCalled();
  });

  it('Test pathname replace on click snackbar', async () => {
    await act(async () => {
      const { queryByTestId } = render(
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

      const currentPath = history.location.pathname;
      const viewBtn = queryByTestId('view-users-test') as HTMLElement;
      act(() => {
        fireEvent.click(viewBtn);
      });
      expect(currentPath !== history.location.pathname).toBeTruthy();
    });
  });

  const statusOptions = ['OK', 'KO', 'PROC_KO', '', 'TO_SHEDULE'];
  statusOptions.forEach((item) => {
    it('Test render of snackbar', async () => {
      await act(async () => {
        const { queryByTestId } = render(
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
        /*
      const useStateMock: any = (openSnackBar: boolean) => [openSnackBar, setOpenSnackBar];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);

      const closeBtn = queryByTestId('close-bar-test') as HTMLElement;
      user.click(closeBtn);
      setOpenSnackBar();
      expect(setOpenSnackBar).toHaveBeenCalled();
      */
      });
    });
  });
});
