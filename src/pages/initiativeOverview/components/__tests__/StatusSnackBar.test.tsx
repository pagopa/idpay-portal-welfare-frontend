/* eslint-disable react/jsx-no-bind */
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import StatusSnackBar from '../StatusSnackBar';
import React from 'react';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<StatusSnacBar />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const user = userEvent.setup();
  const initiativeStatus = store.getState().initiative.status;
  const initiativeId = store.getState().initiative.initiativeId;
  const setOpenSnackBar = jest.fn();

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

  it('Test on close of snackbar', async () => {
    await act(async () => {
      const { queryByTestId } = render(
        <Provider store={store}>
          <StatusSnackBar
            openSnackBar={true}
            setOpenSnackBar={setOpenSnackBar}
            fileStatus={initiativeStatus}
            beneficiaryReached={25}
            initiativeId={initiativeId}
          />
        </Provider>
      );

      const useStateMock: any = (openSnackBar: boolean) => [openSnackBar, setOpenSnackBar];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);

      const closeBtn = queryByTestId('close-bar-test') as HTMLElement;
      user.click(closeBtn);
      setOpenSnackBar();
      expect(setOpenSnackBar).toHaveBeenCalled();
    });
  });
});
