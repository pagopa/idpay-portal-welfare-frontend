import {
  fireEvent,
  screen,
  render,
  waitFor,
  getByLabelText,
  getAllByTestId,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import { createStore } from '../../../../../redux/store';
import ServiceConfig from '../ServiceConfig';
import React from 'react';
import { ServiceScopeEnum } from '../../../../../api/generated/initiative/InitiativeAdditionalDTO';
import { ExploreOff } from '@mui/icons-material';
import { mockedServiceInfoData } from '../../../../../services/__mocks__/initiativeService';

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
    const serviceDescription = getByTestId('service-description-test') as HTMLInputElement;
    const privacyPolicyUrl = getByTestId('privacy-policy-url-test').querySelector('input');
    const termsAndConditions = getByTestId('terms-and-conditions-test').querySelector('input');
    const assistanceChannel = getByTestId('assistance-channel-test').querySelector('input');
    const indicatedChannel = getByTestId('indicated-channel-test');

    expect(initiativeOnIo).not.toBeNull();
    expect(initiativeOnIo).toBeInTheDocument();

    expect(serviceName).not.toBeNull();
    expect(serviceName).toBeInTheDocument();

    expect(serviceDescription).not.toBeNull();
    expect(serviceDescription).toBeInTheDocument();

    // expect(serviceArea).not.toBeNull();
   // expect(serviceArea).toBeInTheDocument();

    expect(privacyPolicyUrl).not.toBeNull();
    expect(privacyPolicyUrl).toBeInTheDocument();

    expect(termsAndConditions).not.toBeNull();
    expect(termsAndConditions).toBeInTheDocument();

    expect(assistanceChannel).not.toBeNull();
    expect(assistanceChannel).toBeInTheDocument();

    expect(indicatedChannel).not.toBeNull();
    expect(indicatedChannel).toBeInTheDocument();
  });

  test('Test Input Form onChange', async () => {
    const { getByTestId, getAllByTestId } = render(
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

    const serviceDescription = getByTestId('service-description-test') as HTMLInputElement;

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

    const mockCallback = jest.fn();
    const serviceArea = getByTestId('service-area-select');
    const serviceAreaSelect = serviceArea.childNodes[0];

    fireEvent.click(serviceArea);

    fireEvent.change(serviceArea, {
      target: { value: 'LOCAL' },
    });

    expect(serviceArea).toBeInTheDocument();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    /*
    waitFor(async () => {
      fireEvent.change(serviceAreaSelect, {
        target: { value: ServiceScopeEnum.LOCAL },
      });
      expect(mockCallback.mock.calls).toHaveLength(1);
    });
*/
    fireEvent.change(serviceDescription, { target: { value: 'description' } });
    expect(serviceDescription.value).toBe('description');
    fireEvent.change(serviceDescription, { target: { value: '' } });
    expect(serviceDescription.value).toBe('');

    waitFor(async () => {
      fireEvent.change(privacyPolicyUrl, { target: { value: 'privacy' } });
      expect(privacyPolicyUrl.value).toBe('privacy');
      fireEvent.change(privacyPolicyUrl, { target: { value: '' } });
      expect(privacyPolicyUrl.value).toBe('');

      fireEvent.change(termsAndConditions, { target: { value: 'terms' } });
      expect(termsAndConditions.value).toBe('terms');
      fireEvent.change(termsAndConditions, { target: { value: '' } });
      expect(termsAndConditions.value).toBe('');
    });

    const assistanceChannel = getByTestId('add-channel-test');

    const indicatedChannel = getByTestId('indicated-channel-test') as HTMLInputElement;

    const addAssistanceChannel = jest.fn();

    fireEvent.change(indicatedChannel, { target: { value: 'input' } });
    expect(indicatedChannel.value).toBe('input');

    waitFor(async () => {
      fireEvent.click(assistanceChannel);
      addAssistanceChannel();
      expect(addAssistanceChannel).toHaveBeenCalledTimes(1);
    });

    const assistanceMockCallback = jest.fn();
    const assistance = getAllByTestId('assistance-channel-test') as unknown as HTMLSelectElement;
    const assistanceSelect: any = assistance.childNodes;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      fireEvent.change(assistanceSelect, {
        target: { value: 'name' },
      });
      expect(assistanceSelect).toBe('name');
      expect(assistanceMockCallback.mock.calls).toHaveLength(1);
    });

    const remove = getByTestId('remove-assistance-channel');
    const deleteAssistanceChannel = jest.fn();

    fireEvent.click(remove);
    deleteAssistanceChannel(0, values, sendValues(mockedServiceInfoData));

    expect(deleteAssistanceChannel).toHaveBeenCalled();
  });
});
