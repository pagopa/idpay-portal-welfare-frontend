/* eslint-disable react/jsx-no-bind */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import React from 'react';
import ApprovedToast from '../Alert/ApprovedToast';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<StatusSnacBar />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const handleClose = jest.fn();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the SnackBar component', async () => {
    render(
      <Provider store={store}>
        <ApprovedToast openToast={true} handleClose={handleClose} />
      </Provider>
    );

    const approved = screen.getByText('pages.initiativeDetail.alert.approved');
    const snackBar = screen.getByTestId('snack-bar-test');

    expect(approved).toBeInTheDocument();
    fireEvent.click(snackBar);
  });
});
