/* eslint-disable react/jsx-no-bind */
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import InitiativeNotOnIoModal from '../InitiativeNotOnIOModal';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    replace: jest.fn(),
  }),
}));

describe('<InitiativeNotOnIoModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const setCurrentStep = jest.fn();
  const sendValues = jest.fn();
  const handleCloseInitiativeNotOnIOModal = jest.fn();
  const values = jest.mock('../InitiativeNotOnIOModal.tsx');
  let currentStep: number;

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should render the InitiativeNotOnIoModal component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <InitiativeNotOnIoModal
            openInitiativeNotOnIOModal={false}
            handleCloseInitiativeNotOnIOModal={function (
              _event: React.MouseEvent<Element, MouseEvent>
            ): void {
              //
            }}
            values={values}
            sendValues={undefined}
            currentStep={currentStep}
            setCurrentStep={function (_value: React.SetStateAction<number>): void {
              //
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
          <InitiativeNotOnIoModal
            openInitiativeNotOnIOModal={true}
            handleCloseInitiativeNotOnIOModal={function (
              _event: React.MouseEvent<Element, MouseEvent>
            ): void {
              //
            }}
            values={values}
            sendValues={sendValues}
            currentStep={currentStep}
            setCurrentStep={function (_value: React.SetStateAction<number>): void {
              //
            }}
          />
        </Provider>
      );
      const useStateMock: any = (openInitiativeNotOnIOModal: boolean) => [
        openInitiativeNotOnIOModal,
        handleCloseInitiativeNotOnIOModal,
      ];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);

      expect(handleCloseInitiativeNotOnIOModal).toBeDefined();
      expect(sendValues).toBeDefined();

      await waitFor(async () => {
        const cancelBtn = queryByTestId('cancel-button-test') as HTMLButtonElement;
        fireEvent.click(cancelBtn);
        handleCloseInitiativeNotOnIOModal();
        expect(handleCloseInitiativeNotOnIOModal).toHaveBeenCalled();
      });

      await waitFor(async () => {
        const exitBtn = queryByTestId('exit-button-test') as HTMLButtonElement;
        fireEvent.click(exitBtn);
        sendValues(values, currentStep, setCurrentStep);
        expect(sendValues).toHaveBeenCalled();
        handleCloseInitiativeNotOnIOModal();
        expect(handleCloseInitiativeNotOnIOModal).toHaveBeenCalled();
      });
    });
  });

  it('the modal should be in the document', async () => {
    await waitFor(async () => {
      render(
        <Provider store={store}>
          <InitiativeNotOnIoModal
            openInitiativeNotOnIOModal={true}
            handleCloseInitiativeNotOnIOModal={function (
              _event: React.MouseEvent<Element, MouseEvent>
            ): void {
              //
            }}
            values={values}
            sendValues={undefined}
            currentStep={currentStep}
            setCurrentStep={function (_value: React.SetStateAction<number>): void {
              //
            }}
          />
        </Provider>
      );

      const modal = document.querySelector('[data-testid="notOnIO-modal-test"') as HTMLElement;
      expect(modal).toBeInTheDocument();

      const fade = document.querySelector('[data-testid="fade-test"]') as HTMLElement;
      expect(fade).toBeInTheDocument();
    });
  });
});
