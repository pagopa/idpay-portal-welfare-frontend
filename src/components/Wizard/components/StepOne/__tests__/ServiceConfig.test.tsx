import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import { createStore } from '../../../../../redux/store';
import ServiceConfig from '../ServiceConfig';
import React from 'react';
import { ServiceScopeEnum } from '../../../../../api/generated/initiative/InitiativeAdditionalDTO';

window.scrollTo = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<ServiceConfig />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  const setUpServiceConfig = () => {
    const currentStep: number = 0;
    const utils = render(
      <Provider store={store}>
        <ServiceConfig
          action={WIZARD_ACTIONS.BACK}
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
    addAssistanceChannel,
    addChannel,
  } = setUpServiceConfig();

  it('call the formik handleSubmit event when form is submitted', async () => {
    await waitFor(async () => {
      expect(WIZARD_ACTIONS.SUBMIT).toBe('SUBMIT');
      fireEvent.click(submit);
      handleSubmit();
      expect(handleSubmit).toHaveBeenCalled();
      sendValues(values, currentStep, setCurrentStep);
      expect(sendValues).toHaveBeenCalled();
    });
  });

  it('Add Channel Test', async () => {
    await waitFor(async () => {
      userEvent.click(addChannel);
      addAssistanceChannel();
      expect(addAssistanceChannel).toHaveBeenCalled();
    });
  });

  it('form fields not to be null & to be in the document', async () => {
    const { getByTestId, container } = render(
      <Provider store={store}>
        <ServiceConfig
          action={WIZARD_ACTIONS.SUBMIT}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (_value: SetStateAction<string>): void {
            //
          }}
          currentStep={currentStep}
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

    const initiativeOnIo = getByTestId('initiative-on-io-test').querySelector('input');
    const serviceName = getByTestId('service-name-test').querySelector('input');
    const serviceArea = getByTestId('service-area-select').querySelector('input');
    const serviceDescription = getByTestId('service-description-test').querySelector('input');
    const locale = container.querySelector('#serviceScope-local-test');
    const nazionale = container.querySelector('#serviceScope-national-test');
    const privacyPolicyUrl = getByTestId('privacy-policy-url-test').querySelector('input');
    const termsAndConditions = getByTestId('terms-and-conditions-test').querySelector('input');

    expect(initiativeOnIo).not.toBeNull();
    expect(initiativeOnIo).toBeInTheDocument();

    expect(serviceName).not.toBeNull();
    expect(serviceName).toBeInTheDocument();

    expect(serviceDescription).toBeNull();
    expect(serviceDescription).not.toBeInTheDocument();

    expect(serviceArea).not.toBeNull();
    expect(serviceArea).toBeInTheDocument();

    expect(locale).toBeNull();
    expect(locale).not.toBeInTheDocument();

    expect(nazionale).toBeNull();
    expect(nazionale).not.toBeInTheDocument();

    expect(privacyPolicyUrl).not.toBeNull();
    expect(privacyPolicyUrl).toBeDefined();

    expect(termsAndConditions).not.toBeNull();
    expect(termsAndConditions).toBeDefined();
  });

  test('Test Input Form onChange', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <ServiceConfig
          action={WIZARD_ACTIONS.DRAFT}
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

    const serviceName = getByTestId('service-name-test').querySelector('input') as HTMLInputElement;
    const serviceDescription = getByTestId('service-description-test').querySelector(
      'input'
    ) as HTMLInputElement;
    const mockCallback = jest.fn();
    const privacyPolicyUrl = getByTestId('privacy-policy-url-test').querySelector(
      'input'
    ) as HTMLInputElement;
    const termsAndConditions = getByTestId('terms-and-conditions-test').querySelector(
      'input'
    ) as HTMLInputElement;

    waitFor(async () => {
      fireEvent.click(serviceName);
      fireEvent.change(serviceName, { target: { value: 'name' } });
      expect(serviceName.value).toBe('name');
      fireEvent.click(serviceName);
      fireEvent.change(serviceName, { target: { value: '' } });
      expect(serviceName.value).toBe('');

      fireEvent.change(serviceDescription, { target: { value: 'description' } });
      expect(serviceDescription.value).toBe('description');
      fireEvent.change(serviceDescription, { target: { value: '' } });
      expect(serviceDescription.value).toBe('');

      fireEvent.change(privacyPolicyUrl, { target: { value: 'privacy' } });
      expect(privacyPolicyUrl.value).toBe('privacy');
      fireEvent.change(privacyPolicyUrl, { target: { value: '' } });
      expect(privacyPolicyUrl.value).toBe('');
    });

    const initiativeOnIo = getByTestId('initiative-on-io-test').querySelector(
      'input'
    ) as HTMLInputElement;

    waitFor(async () => {
      fireEvent.click(initiativeOnIo);
      fireEvent.change(initiativeOnIo, { target: { checked: false } });
      expect(initiativeOnIo.value).toBe(false);
      fireEvent.click(initiativeOnIo);
      fireEvent.change(initiativeOnIo, { target: { checked: true } });
      expect(initiativeOnIo.value).toBe(true);
    });

    const serviceArea = getByTestId('service-area-select') as HTMLSelectElement;

    const servAreaSelect = serviceArea.childNodes[0];

    const locale = document.getElementById('serviceScopeLocal-test');
    const nazionale = document.getElementById('serviceScopeNational-test');

    waitFor(async () => {
      expect(locale).toBeInTheDocument();
      expect(nazionale).toBeInTheDocument();

      fireEvent.change(servAreaSelect, { target: { value: ServiceScopeEnum.LOCAL } });
      expect(servAreaSelect).toBe(ServiceScopeEnum.LOCAL);
      expect(mockCallback.mock.calls).toHaveLength(1);
    });
  });
});
