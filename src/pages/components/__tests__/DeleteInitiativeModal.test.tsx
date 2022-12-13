/* eslint-disable react/jsx-no-bind */
import { cleanup, fireEvent, render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { setInitiative } from '../../../redux/slices/initiativeSlice';
import { createStore } from '../../../redux/store';
import DeleteInitiativeModal from '../DeleteInitiativeModal';
import { mockedInitiative } from '../../../model/__tests__/Initiative.test';
import { setPermissionsList } from '../../../redux/slices/permissionsSlice';

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

afterEach(cleanup);

describe('<DeleteInitiativeModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const handleCloseInitiativeDeleteModal = jest.fn();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
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

  test('should display the ConfirmPublishInitiativeModal component', async () => {
    store.dispatch(setInitiative(mockedInitiative));
    store.dispatch(
      setPermissionsList([
        { name: 'deleteInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    console.log(store.getState().initiative.initiativeId, store.getState().initiative.status);
    render(
      <Provider store={store}>
        <DeleteInitiativeModal
          initiativeId={store.getState().initiative.initiativeId}
          initiativeStatus={store.getState().initiative.status}
          openInitiativeDeleteModal={true}
          handleCloseInitiativeDeleteModal={handleCloseInitiativeDeleteModal}
        />
      </Provider>
    );
    fireEvent.click(screen.getByText('pages.initiativeOverview.modal.delete'));
  });
});
