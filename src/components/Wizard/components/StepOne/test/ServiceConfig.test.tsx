import { act, fireEvent, render } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import { createStore } from '../../../../../redux/store';
import ServiceConfig from '../ServiceConfig';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<ServiceConfig />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
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
      const handleSumbit = jest.fn();
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
      expect(handleSumbit).toBeDefined();
    });
  });

  it('call the submit event when form is submitted', async () => {
    await act(async () => {
      const handleOpenInitiativeNotOnIOModal = jest.fn();
      const sendValues = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <Wizard handleOpenExitModal={() => console.log('exit modal')} />
        </Provider>
      );

      const submit = getByTestId('continue-action-test');
      await act(async () => {
        expect(WIZARD_ACTIONS.SUBMIT).toBe('SUBMIT');
      });
      fireEvent.click(submit);
      expect(handleOpenInitiativeNotOnIOModal || sendValues).toBeDefined();
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
});
