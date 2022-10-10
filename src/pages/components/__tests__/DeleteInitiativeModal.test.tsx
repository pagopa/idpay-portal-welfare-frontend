/* eslint-disable react/jsx-no-bind */
import { render, waitFor } from '@testing-library/react';
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
      render(
        <Provider store={store}>
          <DeleteInitiativeModal
            openInitiativeDeleteModal={false}
            handleCloseInitiativeDeleteModal={handleCloseInitiativeDeleteModal}
          />
        </Provider>
      );

      expect(handleCloseInitiativeDeleteModal).toBeDefined();
    });
  });

  it('the modal should be in the document', async () => {
    await waitFor(async () => {
      render(
        <Provider store={store}>
          <DeleteInitiativeModal
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
    await logicallyDeleteInitiative(mockedInitiativeId);
    expect(InitiativeApi.logicallyDeleteInitiative).toBeCalledWith(mockedInitiativeId);
  });
});
