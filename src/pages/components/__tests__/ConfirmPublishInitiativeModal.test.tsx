import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import ConfirmPublishInitiativeModal from '../ConfirmPublishInitiativeModal';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<ConfirmPublishInitiativeModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  const handlePusblishInitiative = jest.fn();
  const setOpenPublishModal = jest.fn();
  const initiative = store.getState().initiative;

  it('Modal to be in the document', async () => {
    render(
      <Provider store={store}>
        <ConfirmPublishInitiativeModal
          publishModalOpen={true}
          setPublishModalOpen={setOpenPublishModal}
          initiative={initiative}
          beneficiaryReached={25}
          handlePusblishInitiative={handlePusblishInitiative}
          userCanPublishInitiative={false}
        />
      </Provider>
    );

    const modal = document.querySelector('[data-testid="confirm-modal-publish"') as HTMLElement;
    expect(modal).toBeInTheDocument();

    const fade = document.querySelector('[data-testid="fade-test"]') as HTMLElement;
    expect(fade).toBeInTheDocument();

    const cancelBtn = screen.getByTestId('cancel-button-test') as HTMLButtonElement;
    fireEvent.click(cancelBtn);

    expect(setOpenPublishModal.mock.calls.length).toBe(1);

    const publishlBtn = screen.getByTestId('publish-button-test') as HTMLButtonElement;
    fireEvent.click(publishlBtn);
  });
});
