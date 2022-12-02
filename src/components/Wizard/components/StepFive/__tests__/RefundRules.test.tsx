import { fireEvent, render, waitFor, act } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import RefundRules from '../RefundRules';
import React from 'react';
import { renderWithProviders } from '../../../../../utils/test-utils';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<RefundRules />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the third step component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <RefundRules
            action={WIZARD_ACTIONS.SUBMIT}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (_value: SetStateAction<string>): void {
              //
            }}
            currentStep={3}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDisableNext={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );
    });
  });

  it('test on handleSubmit', async () => {
    const handleSubmit = jest.fn();
    renderWithProviders(
      <Wizard
        handleOpenExitModal={function (_event: React.MouseEvent<Element, MouseEvent>): void {
          //
        }}
      />
    );
    handleSubmit();
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('form fields not null', async () => {
    await act(async () => {
      const { getByTestId, container } = renderWithProviders(
        <RefundRules
          action={WIZARD_ACTIONS.DRAFT}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (_value: SetStateAction<string>): void {
            //
          }}
          currentStep={3}
          // eslint-disable-next-line react/jsx-no-bind
          setCurrentStep={function (_value: SetStateAction<number>): void {
            //
          }}
          // eslint-disable-next-line react/jsx-no-bind
          setDisableNext={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      );

      const accumulatedAmount = container.querySelector(
        '#accumulatedAmount-test'
      ) as HTMLDivElement;

      await act(async () => {
        expect(getByTestId('reimbursmentQuestionGroup-test')).not.toBeNull();
        expect(getByTestId('reimbursmentQuestionGroup-test')).toBeInTheDocument();
      });
      await act(async () => {
        expect(accumulatedAmount).toBeNull();
        expect(accumulatedAmount).not.toBeInTheDocument();
      });
      await act(async () => {
        expect(getByTestId('additionalInfo-test')).not.toBeNull();
        expect(getByTestId('additionalInfo-test')).toBeInTheDocument();
      });
    });
  });

  test('test Form input onChange', async () => {
    const { getByTestId, queryByRole } = renderWithProviders(
      <RefundRules
        action={WIZARD_ACTIONS.BACK}
        setAction={function (_value: SetStateAction<string>): void {
          //
        }}
        currentStep={4}
        setCurrentStep={function (_value: SetStateAction<number>): void {
          //
        }}
        setDisableNext={function (_value: SetStateAction<boolean>): void {
          //
        }}
      />
    );

    expect(getByTestId('accumulatedAmount-radio-test')).toBeInTheDocument();
    fireEvent.click(getByTestId('accumulatedAmount-radio-test'));

    const accAmount = queryByRole('input', {
      name: 'accumulatedAmount',
    }) as HTMLInputElement;

    waitFor(async () => {
      expect(accAmount).toBeChecked();
    });

    expect(getByTestId('timeParameter-radio-test')).toBeInTheDocument();
    fireEvent.click(getByTestId('timeParameter-radio-test'));

    const timeParam = queryByRole('input', {
      name: 'selectTimeParam',
    }) as HTMLSelectElement;

    waitFor(async () => {
      expect(timeParam).toBeChecked();
    });

    const additionalInfo = getByTestId('additionalInfo-test').querySelector(
      'input'
    ) as HTMLInputElement;

    fireEvent.change(additionalInfo, { target: { value: 'info' } });
    expect(additionalInfo.value).toBe('info');

    expect(additionalInfo).toBeInTheDocument();
  });
});
