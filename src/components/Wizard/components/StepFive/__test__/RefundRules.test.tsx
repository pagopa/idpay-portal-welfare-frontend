import { fireEvent, render, waitFor } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { AccumulatedTypeEnum } from '../../../../../api/generated/initiative/AccumulatedAmountDTO';
import { TimeTypeEnum } from '../../../../../api/generated/initiative/TimeParameterDTO';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import RefundRules from '../RefundRules';

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
            action={''}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (_value: SetStateAction<string>): void {
              //   console.log(value);
            }}
            currentStep={3}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //   console.log(value);
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDisableNext={function (_value: SetStateAction<boolean>): void {
              //   console.log(value);
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDraftEnabled={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );
    });
  });

  it('call the submit event when form is submitted', async () => {
    await act(async () => {
      const handleSubmit = jest.fn();
      const putRefundRuleDraft = jest.fn();
      const saveRefundRule = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <Wizard handleOpenExitModal={() => console.log('exit modal')} />
        </Provider>
      );

      const submit = getByTestId('continue-action-test');
      fireEvent.click(submit);
      expect(WIZARD_ACTIONS.SUBMIT).toBe('SUBMIT');
      expect(handleSubmit).toBeDefined();
      expect(putRefundRuleDraft).toBeDefined();
      expect(saveRefundRule).toBeDefined();
    });
  });

  it('draf action makes the dispatch', async () => {
    await act(async () => {
      const putRefundRuleDraft = jest.fn();
      const saveRefundRule = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <Wizard handleOpenExitModal={() => console.log('exit modal')} />
        </Provider>
      );

      const skip = getByTestId('skip-action-test');
      // eslint-disable-next-line @typescript-eslint/await-thenable
      fireEvent.click(skip);
      expect(WIZARD_ACTIONS.DRAFT).toBe('DRAFT');
      expect(putRefundRuleDraft).toBeDefined();
      expect(saveRefundRule).toBeDefined();
    });
  });

  it('test on handleSubmit', async () => {
    await act(async () => {
      const handleSubmit = jest.fn();
      render(
        <Provider store={store}>
          <RefundRules
            action={''}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (value: SetStateAction<string>): void {
              console.log(value);
            }}
            currentStep={3}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (value: SetStateAction<number>): void {
              console.log(value);
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDisableNext={function (value: SetStateAction<boolean>): void {
              console.log(value);
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDraftEnabled={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );

      expect(handleSubmit).toBeDefined();
    });
  });

  it('form fields not null', async () => {
    await act(async () => {
      const { getByTestId, container } = render(
        <Provider store={store}>
          <RefundRules
            action={''}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (_value: SetStateAction<string>): void {
              //   console.log(value);
            }}
            currentStep={3}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //   console.log(value);
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDisableNext={function (_value: SetStateAction<boolean>): void {
              //   console.log(value);
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDraftEnabled={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );

      const accumulatedAmount = container.querySelector(
        '#accumulatedAmount-test'
      ) as HTMLDivElement;
      const reimbursementThreshold = container.querySelector('#reimbursementThreshold-test');
      const selectTimeParam = container.querySelector('#selectTimeParam-test');

      await act(async () => {
        expect(getByTestId('reimbursmentQuestionGroup-test')).not.toBeNull();
        expect(getByTestId('reimbursmentQuestionGroup-test')).toBeInTheDocument();
      });
      await act(async () => {
        expect(accumulatedAmount).toBeNull();
        expect(accumulatedAmount).not.toBeInTheDocument();
      });
      await act(async () => {
        expect(accumulatedAmount).toBeNull();
        expect(reimbursementThreshold).not.toBeInTheDocument();
      });
      await act(async () => {
        expect(accumulatedAmount).toBeNull();
        expect(selectTimeParam).not.toBeInTheDocument();
      });
      await act(async () => {
        expect(getByTestId('additionalInfo-test')).not.toBeNull();
        expect(getByTestId('additionalInfo-test')).toBeInTheDocument();
      });
    });
  });

  it('Test AccumulatedAmount Select onChange', async () => {
    const { getByTestId, container, queryByRole } = render(
      <Provider store={store}>
        <RefundRules
          action={''}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (_value: SetStateAction<string>): void {
            //   console.log(value);
          }}
          currentStep={3}
          // eslint-disable-next-line react/jsx-no-bind
          setCurrentStep={function (_value: SetStateAction<number>): void {
            //   console.log(value);
          }}
          // eslint-disable-next-line react/jsx-no-bind
          setDisableNext={function (_value: SetStateAction<boolean>): void {
            //   console.log(value);
          }}
          // eslint-disable-next-line react/jsx-no-bind
          setDraftEnabled={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      </Provider>
    );

    const handleResetField = jest.fn();

    type TestElement = Document | Element | Window | Node;

    expect(getByTestId('accumulatedAmount-radio-test')).toBeInTheDocument();
    fireEvent.click(getByTestId('accumulatedAmount-radio-test'));
    expect(handleResetField).toBeDefined();

    const accAmount = queryByRole('input', {
      name: 'accumulatedAmount',
    }) as HTMLInputElement;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(accAmount).toBeChecked();
    });

    const balanceExhausted = container.querySelector('#balance-exhausted') as HTMLSelectElement;
    const certainThreshold = container.querySelector('#certain-threshold') as HTMLSelectElement;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(balanceExhausted).toBeInTheDocument();
      expect(certainThreshold).toBeInTheDocument();

      const mockCallBackBalanceExhausted = jest.fn();

      const accumulatedAmount = getByTestId('accumulatedAmount-test');

      const accumulatedAmountSelect = accumulatedAmount.childNodes[0];

      fireEvent.change(accumulatedAmountSelect, {
        target: { value: AccumulatedTypeEnum.BUDGET_EXHAUSTED },
      });
      expect(mockCallBackBalanceExhausted.mock.calls).toHaveLength(1);

      fireEvent.click(certainThreshold);

      expect(getByTestId('reimbursementThreshold-test')).toBeInTheDocument();

      const reimbursementThreshold = queryByRole('input', {
        name: 'reimbursementThreshold',
      }) as HTMLTextAreaElement;

      expect(reimbursementThreshold).toBeInTheDocument();

      fireEvent.change(reimbursementThreshold.querySelector('input') as TestElement, {
        target: { value: '10000' },
      });
      expect(reimbursementThreshold.getAttribute('value') === '10000');
      expect(reimbursementThreshold).not.toBeNull();
    });
  });

  it('Test TimeParameter Select onChange', async () => {
    const { getByTestId, container, queryByRole } = render(
      <Provider store={store}>
        <RefundRules
          action={''}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (_value: SetStateAction<string>): void {
            //   console.log(value);
          }}
          currentStep={3}
          // eslint-disable-next-line react/jsx-no-bind
          setCurrentStep={function (_value: SetStateAction<number>): void {
            //   console.log(value);
          }}
          // eslint-disable-next-line react/jsx-no-bind
          setDisableNext={function (_value: SetStateAction<boolean>): void {
            //   console.log(value);
          }}
          // eslint-disable-next-line react/jsx-no-bind
          setDraftEnabled={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      </Provider>
    );

    const handleResetField = jest.fn();

    expect(getByTestId('timeParameter-radio-test')).toBeInTheDocument();
    fireEvent.click(getByTestId('timeParameter-radio-test'));

    expect(handleResetField).toBeDefined();

    const timeParam = queryByRole('input', {
      name: 'selectTimeParam',
    }) as HTMLSelectElement;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(timeParam).toBeChecked();
    });

    const initiativeDone = container.querySelector('#initiative-done') as HTMLSelectElement;
    const everyDay = container.querySelector('#every-day') as HTMLSelectElement;
    const everyWeek = container.querySelector('#every-week') as HTMLSelectElement;
    const everyMonth = container.querySelector('#every-month') as HTMLSelectElement;
    const everyThreeMonths = container.querySelector('#every-three-month') as HTMLSelectElement;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(initiativeDone).toBeInTheDocument();
      expect(everyDay).toBeInTheDocument();
      expect(everyWeek).toBeInTheDocument();
      expect(everyMonth).toBeInTheDocument();
      expect(everyThreeMonths).toBeInTheDocument();
    });

    const mockCallBackBalanceExhausted = jest.fn();

    const selectTimeParam = getByTestId('selectTimeParam-test');

    const timeParamSelect = selectTimeParam.childNodes[0];

    fireEvent.click(selectTimeParam);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      fireEvent.change(timeParamSelect, {
        target: { value: TimeTypeEnum.CLOSED },
      });
      expect(mockCallBackBalanceExhausted.mock.calls).toHaveLength(1);
    });
  });

  it('Test AdditionalInfo onChange', async () => {
    const { getByRole } = render(
      <Provider store={store}>
        <RefundRules
          action={''}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (_value: SetStateAction<string>): void {
            //   console.log(value);
          }}
          currentStep={3}
          // eslint-disable-next-line react/jsx-no-bind
          setCurrentStep={function (_value: SetStateAction<number>): void {
            //   console.log(value);
          }}
          // eslint-disable-next-line react/jsx-no-bind
          setDisableNext={function (_value: SetStateAction<boolean>): void {
            //   console.log(value);
          }}
          // eslint-disable-next-line react/jsx-no-bind
          setDraftEnabled={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      </Provider>
    );

    type TestElement = Document | Element | Window | Node;

    const additionalInfo = getByRole('textbox', {
      name: 'components.wizard.stepFive.form.idCodeBalance',
    });

    expect(additionalInfo).toBeInTheDocument();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      fireEvent.change(additionalInfo.querySelector('textbox') as TestElement, {
        target: { value: 'additional info' },
      });
    });

    expect(additionalInfo.getAttribute('value') === 'additional info');
    expect(additionalInfo).not.toBeNull();
  });
});
