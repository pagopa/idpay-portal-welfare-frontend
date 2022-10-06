/* eslint-disable react/jsx-no-bind */
import { render /* waitFor */ } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import ConfirmRejectInitiativeModal from '../ConfirmRejectInitiativeModal/ConfirmRejectInitiativeModal';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<ConfirmRejectInitiativeModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the ConfirmRejectInitiativeModal component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ConfirmRejectInitiativeModal
            rejectModalOpen={false}
            setRejectModalOpen={function (_value: React.SetStateAction<boolean>): void {
              //
            }}
            initiativeId={undefined}
            handleRejectInitiative={undefined}
            userCanRejectInitiative={false}
          />
        </Provider>
      );
    });
  });

  //   it('the modal should be in the document', async () => {
  //     await waitFor(async () => {
  //       render(
  //         <Provider store={store}>
  //           <ConfirmRejectInitiativeModal
  //             rejectModalOpen={true}
  //             setRejectModalOpen={function (_value: React.SetStateAction<boolean>): void {
  //               //
  //             }}
  //             initiativeId={undefined}
  //             handleRejectInitiative={undefined}
  //           />
  //         </Provider>
  //       );

  //       const modal = document.querySelector('[data-testid="reject-modal-test"]') as HTMLElement;
  //       expect(modal).toBeInTheDocument();

  //       const fade = document.querySelector('[data-testid="fade-test"]') as HTMLElement;
  //       expect(fade).toBeInTheDocument();
  //     });
  //   });
});
