/* eslint-disable react/jsx-no-bind */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import ConfirmRejectInitiativeModal from '../ConfirmRejectInitiativeModal/ConfirmRejectInitiativeModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<ConfirmRejectInitiativeModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const handleRejectInitiative = jest.fn();
  const setRejectModalOpen = jest.fn();

  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  it('the modal should be in the document', async () => {
    render(
      <Provider store={store}>
        <ConfirmRejectInitiativeModal
          rejectModalOpen={true}
          setRejectModalOpen={setRejectModalOpen}
          initiativeId={undefined}
          handleRejectInitiative={handleRejectInitiative}
          userCanRejectInitiative={false}
        />
      </Provider>
    );

    const modal = document.querySelector('[data-testid="reject-modal-test"]') as HTMLElement;
    expect(modal).toBeInTheDocument();

    const fade = document.querySelector('[data-testid="fade-test"]') as HTMLElement;
    expect(fade).toBeInTheDocument();

    const cancelBtn = screen.getByTestId('cancel-button-test') as HTMLButtonElement;
    fireEvent.click(cancelBtn);
    expect(setRejectModalOpen).toHaveBeenCalledTimes(1);

    const rejectBtn = screen.getByTestId('reject-button-test') as HTMLButtonElement;
    fireEvent.click(rejectBtn);

    fireEvent.keyDown(modal, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
  });
});
