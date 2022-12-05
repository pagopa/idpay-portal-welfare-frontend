import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
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

  test('should not display the ConfirmPublishInitiativeModal component', async () => {
    render(
      <Provider store={store}>
        <ConfirmPublishInitiativeModal
          publishModalOpen={false}
          setPublishModalOpen={function (_value: SetStateAction<boolean>): void {
            //
          }}
          initiative={initiative}
          beneficiaryReached={25}
          handlePusblishInitiative={handlePusblishInitiative}
          userCanPublishInitiative={false}
        />
      </Provider>
    );
  });

  it('Modal to be in the document', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <ConfirmPublishInitiativeModal
          publishModalOpen={true}
          // eslint-disable-next-line react/jsx-no-bind
          setPublishModalOpen={function (_value: SetStateAction<boolean>): void {
            //
          }}
          initiative={initiative}
          beneficiaryReached={25}
          // eslint-disable-next-line react/jsx-no-bind
          handlePusblishInitiative={handlePusblishInitiative}
          userCanPublishInitiative={false}
        />
      </Provider>
    );

    const modal = document.querySelector('[data-testid="confirm-modal-publish"') as HTMLElement;
    expect(modal).toBeInTheDocument();

    const fade = document.querySelector('[data-testid="fade-test"]') as HTMLElement;
    expect(fade).toBeInTheDocument();

    const useStateMock: any = (openPublishModal: boolean) => [
      openPublishModal,
      setOpenPublishModal,
    ];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    await waitFor(async () => {
      const cancelBtn = getByTestId('cancel-button-test') as HTMLButtonElement;
      fireEvent.click(cancelBtn);
    });

    await waitFor(async () => {
      const publishlBtn = getByTestId('publish-button-test') as HTMLButtonElement;
      fireEvent.click(publishlBtn);
    });
  });
});
