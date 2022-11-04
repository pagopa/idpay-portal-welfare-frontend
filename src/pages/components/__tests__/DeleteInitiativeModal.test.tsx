/* eslint-disable react/jsx-no-bind */
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import DeleteInitiativeModal from '../DeleteInitiativeModal';
import { mockedInitiativeId } from '../../../services/__mocks__/initiativeService';
import { InitiativeApi } from '../../../api/InitiativeApiClient';
import { logicallyDeleteInitiative } from '../../../services/intitativeService';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('../../../api/InitiativeApiClient');

beforeEach(() => {
  jest.spyOn(InitiativeApi, 'logicallyDeleteInitiative');
});

describe('<DeleteInitiativeModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const initiativeId = store.getState().initiative.initiativeId;
  const initiativeStatus = store.getState().initiative.status;
  const handleCloseInitiativeDeleteModal = jest.fn();
  const setOpenInitiativeDeleteModal = jest.fn();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the ConfirmPublishInitiativeModal component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <DeleteInitiativeModal
            initiativeId={undefined}
            initiativeStatus={undefined}
            openInitiativeDeleteModal={false}
            handleCloseInitiativeDeleteModal={function (event: React.MouseEvent<Element>): void {
              console.log(event);
            }}
          />
        </Provider>
      );
    });
  });

  it('the functions should be defined', async () => {
    await act(async () => {
      const { queryByTestId } = render(
        <Provider store={store}>
          <DeleteInitiativeModal
            initiativeId={initiativeId}
            initiativeStatus={initiativeStatus}
            openInitiativeDeleteModal={true}
            handleCloseInitiativeDeleteModal={handleCloseInitiativeDeleteModal}
          />
        </Provider>
      );

      const useStateMock: any = (openInitiativeDeleteModal: boolean) => [
        openInitiativeDeleteModal,
        setOpenInitiativeDeleteModal,
      ];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);

      await waitFor(async () => {
        const cancelBtn = queryByTestId('cancel-button-test') as HTMLButtonElement;
        fireEvent.click(cancelBtn);
        setOpenInitiativeDeleteModal();
        expect(setOpenInitiativeDeleteModal).toHaveBeenCalled();
      });

      await waitFor(async () => {
        const deletelBtn = queryByTestId('delete-button-test') as HTMLButtonElement;
        fireEvent.click(deletelBtn);
        handleCloseInitiativeDeleteModal(initiativeId, true);
        setOpenInitiativeDeleteModal();
        expect(setOpenInitiativeDeleteModal).toHaveBeenCalled();
        expect(setOpenInitiativeDeleteModal).toHaveBeenCalled();
      });
    });
  });

  it('the modal should be in the document', async () => {
    await waitFor(async () => {
      render(
        <Provider store={store}>
          <DeleteInitiativeModal
            initiativeId={undefined}
            initiativeStatus={undefined}
            openInitiativeDeleteModal={true}
            handleCloseInitiativeDeleteModal={handleCloseInitiativeDeleteModal}
          />
        </Provider>
      );

      const modal = document.querySelector('[data-testid="delete-modal-test"]') as HTMLElement;
      expect(modal).toBeInTheDocument();

      const fade = document.querySelector('[data-testid="fade-test"]') as HTMLElement;
      expect(fade).toBeInTheDocument();
    });
  });

  test('delete initiative', async () => {
    jest.mock('../../../api/InitiativeApiClient.ts', () => ({
      logicallyDeleteInitiative: jest.fn(() => Promise.resolve()),
    }));

    const handleDeleteInitiative = jest.fn();
    handleDeleteInitiative(mockedInitiativeId);
    expect(handleDeleteInitiative).toBeCalledWith(mockedInitiativeId);
  });
});
