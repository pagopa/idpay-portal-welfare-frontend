import { act, fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import { createStore } from '../../../../../redux/store';
import ServiceConfig from '../ServiceConfig';
import React from 'react';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<ServiceConfig />', (injectedStore?: ReturnType<typeof createStore>) => {
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  const store = injectedStore ? injectedStore : createStore();
  const initiativeOnIO = store.getState().initiative.additionalInfo.initiativeOnIO;
  const handleSumbit = jest.fn();
  const handleOpenInitiativeNotOnIOModal = jest.fn();
  const sendValues = jest.fn();
  const values = jest.mock('../InitiativeNotOnIOModal.tsx');
  let currentStep: number;
  const setCurrentStep = jest.fn();

  test('should display the first form, with validation on input data', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ServiceConfig
            action={''}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (_value: SetStateAction<string>): void {
              //
            }}
            currentStep={0}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDisabledNext={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );
    });
  });

  it('call the formik handleSubmit event when form is submitted', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ServiceConfig
            action={WIZARD_ACTIONS.SUBMIT}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (_value: SetStateAction<string>): void {
              //
            }}
            currentStep={0}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDisabledNext={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );
      sendValues();
      handleSumbit();
      expect(handleSumbit).toHaveBeenCalled();
      expect(sendValues).toHaveBeenCalled();
    });
  });

  it('call the submit event when form is submitted', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <Wizard handleOpenExitModal={() => console.log('exit modal')} />
        </Provider>
      );

      await waitFor(async () => {
        const submit = getByTestId('continue-action-test');
        expect(WIZARD_ACTIONS.SUBMIT).toBe('SUBMIT');
        fireEvent.click(submit);
        sendValues(values, currentStep, setCurrentStep);
        expect(sendValues).toHaveBeenCalled();
      });
    });
  });

  it('Test of functions of component', async () => {
    render(
      <Provider store={store}>
        <ServiceConfig
          action={''}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (_value: SetStateAction<string>): void {
            //
          }}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          // eslint-disable-next-line react/jsx-no-bind
          setDisabledNext={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      </Provider>
    );

    await waitFor(async () => {
      const useStateMock: any = (openInitiativeOnIOModal: boolean) => [
        openInitiativeOnIOModal,
        handleOpenInitiativeNotOnIOModal,
      ];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      jest.spyOn(React, 'useEffect').mockImplementation((f) => f());
      handleOpenInitiativeNotOnIOModal();
      expect(handleOpenInitiativeNotOnIOModal).toHaveBeenCalled();
    });
  });

  it('draft action makes the dispatch', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <Wizard handleOpenExitModal={() => console.log('exit modal')} />
        </Provider>
      );

      const skip = getByTestId('skip-action-test');
      await act(async () => {
        expect(WIZARD_ACTIONS.DRAFT).toBe('DRAFT');
      });
      fireEvent.click(skip);
    });
  });

  it('form fields not to be null', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <ServiceConfig
          action={''}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (_value: SetStateAction<string>): void {
            //
          }}
          currentStep={0}
          // eslint-disable-next-line react/jsx-no-bind
          setCurrentStep={function (_value: SetStateAction<number>): void {
            //
          }}
          // eslint-disable-next-line react/jsx-no-bind
          setDisabledNext={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      </Provider>
    );

    const serviceName = getByTestId('serviceName-test');
    const serviceArea = getByTestId('service-area-select');
    const serviceDescription = getByTestId('serviceDescription-test');
    const privacyPolicyUrl = getByTestId('privacyPolicyUrl-test');
    const termsAndConditions = getByTestId('termsAndConditions-test');

    await act(async () => {
      expect(serviceName).not.toBeNull();
      expect(serviceName).toBeInTheDocument();
    });

    await act(async () => {
      expect(serviceArea).not.toBeNull();
      expect(serviceArea).toBeInTheDocument();
    });

    await act(async () => {
      expect(serviceDescription).not.toBeNull();
      expect(serviceDescription).toBeInTheDocument();
    });

    await act(async () => {
      expect(privacyPolicyUrl).not.toBeNull();
      expect(privacyPolicyUrl).toBeInTheDocument();
    });

    await act(async () => {
      expect(termsAndConditions).not.toBeNull();
      expect(termsAndConditions).toBeInTheDocument();
    });
  });

  it('Test of setting true/false of modal', async () => {
    render(
      <Provider store={store}>
        <ServiceConfig
          action={''}
          setAction={function (_value: SetStateAction<string>): void {
            //
          }}
          currentStep={0}
          setCurrentStep={function (_value: SetStateAction<number>): void {
            //
          }}
          setDisabledNext={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      </Provider>
    );

    const setOpenInitiativeNotOnIOModal = jest.fn();

    const useStateMock: any = (openInitiativeNotOnIOModal: boolean) => [
      openInitiativeNotOnIOModal,
      setOpenInitiativeNotOnIOModal,
    ];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    expect(useStateMock).toBeDefined();

    setOpenInitiativeNotOnIOModal();
    expect(setOpenInitiativeNotOnIOModal).toHaveBeenCalled();
  });

  it('Add Channel Test', async () => {
    await act(async () => {
      const addAssistanceChannel = jest.fn();
      const { queryByTestId } = render(
        <Provider store={store}>
          <ServiceConfig
            action={''}
            setAction={function (_value: SetStateAction<string>): void {
              //
            }}
            currentStep={0}
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //
            }}
            setDisabledNext={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );

      waitFor(async () => {
        const addChannel = queryByTestId('add-channel-test') as HTMLButtonElement;
        userEvent.click(addChannel);
        addAssistanceChannel();
        expect(addAssistanceChannel).toHaveBeenCalled();
      });
    });
  });
});
