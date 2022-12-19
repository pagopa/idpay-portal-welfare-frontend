import { fireEvent, waitFor, screen } from '@testing-library/react';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import ServiceConfig from '../ServiceConfig';
import React from 'react';
import { renderWithProviders } from '../../../../../utils/test-utils';

window.scrollTo = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<ServiceConfig />', () => {
  const handleOpenExitModal = jest.fn();
  const setAction = jest.fn();
  const setCurrentStep = jest.fn();
  const setDisabledNext = jest.fn();
  const currentStep: number = 0;

  test('test submit wizard', () => {
    renderWithProviders(<Wizard handleOpenExitModal={handleOpenExitModal} />);
    const submit = screen.getByTestId('continue-action-test') as HTMLButtonElement;
    fireEvent.click(submit);
  });

  test('Test Input Form onChange', async () => {
    renderWithProviders(
      <ServiceConfig
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={setAction}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setDisabledNext={setDisabledNext}
      />
    );
    //TEXTFIELD TEST

    const serviceName = screen.getByTestId('service-name-test') as HTMLInputElement;
    const serviceDescription = screen.getByTestId('service-description-test') as HTMLInputElement;
    const privacyPolicyUrl = screen.getByTestId('privacy-policy-url-test') as HTMLInputElement;
    const termsAndConditions = screen.getByTestId('terms-and-conditions-test') as HTMLInputElement;
    const indicatedChannel = screen.getByTestId('indicated-channel-test') as HTMLInputElement;

    fireEvent.change(serviceName, { target: { value: 'name' } });
    expect(serviceName.value).toBe('name');

    fireEvent.change(serviceDescription, { target: { value: 'description' } });
    expect(serviceDescription.value).toBe('description');

    fireEvent.change(privacyPolicyUrl, { target: { value: 'privacy' } });
    expect(privacyPolicyUrl.value).toBe('privacy');

    fireEvent.change(termsAndConditions, { target: { value: 'terms' } });
    expect(termsAndConditions.value).toBe('terms');

    fireEvent.change(indicatedChannel, { target: { value: 'input' } });
    expect(indicatedChannel.value).toBe('input');

    //SWITCH TEST

    const initiativeOnIo = screen.getByTestId('initiative-on-io-test') as HTMLInputElement;

    waitFor(() => {
      fireEvent.click(initiativeOnIo);
      fireEvent.change(initiativeOnIo, { target: { checked: false } });
      expect(initiativeOnIo.value).toBe(false);
    });

    //SELECT TEST

    const serviceArea = screen.getByTestId('service-area-select');

    fireEvent.click(serviceArea);
    fireEvent.change(serviceArea, {
      target: { value: 'LOCAL' },
    });

    expect(serviceArea).toBeInTheDocument();

    const assistanceSelect = document.querySelector(
      'assistance-channel-test'
    ) as unknown as HTMLSelectElement;

    waitFor(async () => {
      fireEvent.click(assistanceSelect);
      fireEvent.change(assistanceSelect, {
        target: { value: 'name' },
      });
    });

    //BUTTON TEST

    const assistanceChannel = screen.getByTestId('add-channel-test');
    fireEvent.click(assistanceChannel);

    const remove = screen.getByTestId('remove-assistance-channel');
    fireEvent.click(remove);

    const addChannel = screen.getByTestId('add-channel-test') as HTMLButtonElement;
    fireEvent.click(addChannel);
  });
});
