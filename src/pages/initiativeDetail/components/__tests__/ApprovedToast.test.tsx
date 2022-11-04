/* eslint-disable react/jsx-no-bind */
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import React from 'react';
import ApprovedToast from '../Alert/ApprovedToast';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<StatusSnacBar />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const user = userEvent.setup();
  const handleClose = jest.fn();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the SnackBar component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ApprovedToast
            openToast={false}
            handleClose={function (): void {
              //
            }}
          />
        </Provider>
      );
    });
  });

  it('Test on close of snackbar', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ApprovedToast openToast={true} handleClose={handleClose} />
        </Provider>
      );

      handleClose();
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
