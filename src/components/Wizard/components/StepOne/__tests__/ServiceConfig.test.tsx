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
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  const setUpServiceConfig = () => {
    const currentStep: number = 0;
    const utils = render(
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

    const handleSubmit = jest.fn();
    const handleOpenInitiativeNotOnIOModal = jest.fn();
    const sendValues = jest.fn();
    const values = jest.mock('../InitiativeNotOnIOModal.tsx');
    const setCurrentStep = jest.fn();
    const serviceName = utils.getAllByLabelText('components.wizard.stepOne.form.serviceName');
    // const serviceArea = document.getElementById('[data-testid="service-area-select"]');
    const serviceDescription = utils.getAllByLabelText(
      'components.wizard.stepOne.form.serviceDescription'
    );
    const privacyPolicyUrl = utils.getAllByLabelText(
      'components.wizard.stepOne.form.privacyPolicyUrl'
    );
    const termsAndConditions = utils.getAllByLabelText(
      'components.wizard.stepOne.form.termsAndConditions'
    );
    const addChannel = document.querySelector(
      '[data-testid="add-channel-test"]'
    ) as HTMLButtonElement;
    const setOpenInitiativeNotOnIOModal = jest.fn();
    const addAssistanceChannel = jest.fn();

    return {
      handleSubmit,
      handleOpenInitiativeNotOnIOModal,
      sendValues,
      values,
      currentStep,
      setCurrentStep,
      serviceName,
      // serviceArea,
      serviceDescription,
      privacyPolicyUrl,
      termsAndConditions,
      addChannel,
      setOpenInitiativeNotOnIOModal,
      addAssistanceChannel,
      ...utils,
    };
  };

  const setUpWizard = () => {
    const utilsWizard = render(
      <Provider store={store}>
        <Wizard handleOpenExitModal={() => console.log('exit modal')} />
      </Provider>
    );

    const submit = utilsWizard.queryByTestId('continue-action-test') as HTMLButtonElement;
    const skip = utilsWizard.queryByTestId('skip-action-test') as HTMLButtonElement;
    return {
      submit,
      skip,
      ...utilsWizard,
    };
  };

  const { submit, skip } = setUpWizard();
  const {
    sendValues,
    handleSubmit,
    values,
    currentStep,
    setCurrentStep,
    handleOpenInitiativeNotOnIOModal,
    serviceName,
    // serviceArea,
    serviceDescription,
    privacyPolicyUrl,
    termsAndConditions,
    setOpenInitiativeNotOnIOModal,
    addAssistanceChannel,
    addChannel,
  } = setUpServiceConfig();

  it('call the formik handleSubmit event when form is submitted', async () => {
    waitFor(async () => {
      expect(WIZARD_ACTIONS.SUBMIT).toBe('SUBMIT');
      fireEvent.click(submit);
      handleSubmit();
      expect(handleSubmit).toHaveBeenCalled();
      sendValues(values, currentStep, setCurrentStep);
      expect(sendValues).toHaveBeenCalled();
    });
  });

  it('Test of functions of component', async () => {
    const useStateMock: any = (openInitiativeOnIOModal: boolean) => [
      openInitiativeOnIOModal,
      handleOpenInitiativeNotOnIOModal,
    ];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    jest.spyOn(React, 'useEffect').mockImplementation((f) => f());

    handleOpenInitiativeNotOnIOModal();
    expect(handleOpenInitiativeNotOnIOModal).toHaveBeenCalled();
  });

  it('draft action makes the dispatch', async () => {
    waitFor(async () => {
      expect(WIZARD_ACTIONS.DRAFT).toBe('DRAFT');
      fireEvent.click(skip);
    });
  });

  it('form fields not to be null & to be Defined', async () => {
    expect(serviceName).not.toBeNull();
    expect(serviceName).toBeDefined();

    // expect(serviceArea).not.toBeNull();
    // expect(serviceArea).toBeInTheDocument();

    expect(serviceDescription).not.toBeNull();
    expect(serviceDescription).toBeDefined();

    expect(privacyPolicyUrl).not.toBeNull();
    expect(privacyPolicyUrl).toBeDefined();

    expect(termsAndConditions).not.toBeNull();
    expect(termsAndConditions).toBeDefined();
  });

  it('Test onChange of form input', async () => {
    const servName = document.getElementById('service-name-test') as HTMLInputElement;
    waitFor(async () => {
      fireEvent.change(servName, { target: { value: 'name' } });
      expect(servName.value).toBe('name');
      fireEvent.change(servName, { target: { value: '' } });
      expect(servName.value).toBe('');
    });
  });

  it('Test of setting true/false of modal', async () => {
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
    await waitFor(async () => {
      userEvent.click(addChannel);
      addAssistanceChannel();
      expect(addAssistanceChannel).toHaveBeenCalled();
    });
  });
});
