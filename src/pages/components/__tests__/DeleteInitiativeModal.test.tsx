/* eslint-disable react/jsx-no-bind */
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import DeleteInitiativeModal from '../DeleteInitiativeModal';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    replace: jest.fn(),
  }),
}));

jest.mock('@pagopa/selfcare-common-frontend', () => ({
  ...jest.requireActual('@pagopa/selfcare-common-frontend/hooks/useLoading'),
  useLoading: () => ({}),
}));

describe('<DeleteInitiativeModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const handleCloseInitiativeDeleteModal = jest.fn();

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
            handleCloseInitiativeDeleteModal={handleCloseInitiativeDeleteModal}
          />
        </Provider>
      );
    });
  });

  it('the modal should be in the document', async () => {
    const { queryByTestId } = render(
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

    await waitFor(async () => {
      const deletelBtn = queryByTestId('delete-button-test') as HTMLButtonElement;
      fireEvent.click(deletelBtn);
    });

    await waitFor(async () => {
      const cancelBtn = queryByTestId('cancel-button-test') as HTMLButtonElement;
      fireEvent.click(cancelBtn);
    });
  });
});
