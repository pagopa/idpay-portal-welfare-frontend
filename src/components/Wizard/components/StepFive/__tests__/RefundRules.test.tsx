import { fireEvent, screen } from '@testing-library/react';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import RefundRules from '../RefundRules';
import React from 'react';
import { renderWithProviders } from '../../../../../utils/test-utils';
import { saveRefundRule, setInitiativeId } from '../../../../../redux/slices/initiativeSlice';
import { mockedInitiativeId } from '../../../../../services/__mocks__/groupService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

window.scrollTo = jest.fn();

describe('<RefundRules />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const setAction = jest.fn();
  const setCurrentStep = jest.fn();
  const setDisableNext = jest.fn();
  const refundRules = {
    reimbursmentQuestionGroup: 'true',
    timeParameter: '',
    accumulatedAmount: 'THRESHOLD_REACHED',
    additionalInfo: '',
    reimbursementThreshold: '',
  };

  test('should display the fifth step component with action submit', async () => {
    renderWithProviders(
      <RefundRules
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={setAction}
        currentStep={4}
        setCurrentStep={setCurrentStep}
        setDisableNext={setDisableNext}
      />
    );
  });

  it('should display the fifth step component with action draft', async () => {
    renderWithProviders(
      <RefundRules
        action={WIZARD_ACTIONS.DRAFT}
        setAction={setAction}
        currentStep={4}
        setCurrentStep={setCurrentStep}
        setDisableNext={setDisableNext}
      />
    );
  });

  test('test Form input onChange with accumulatedAmount ture', async () => {
    renderWithProviders(
      <RefundRules
        action={WIZARD_ACTIONS.BACK}
        setAction={setAction}
        currentStep={4}
        setCurrentStep={setCurrentStep}
        setDisableNext={setDisableNext}
      />
    );

    const reimbursmentQstGroup = screen.getByTestId('accumulatedAmount-radio-test');
    fireEvent.click(reimbursmentQstGroup);

    const accumulatedAmount = screen.getByTestId('accumulatedAmount-test');

    fireEvent.click(accumulatedAmount);
    fireEvent.change(accumulatedAmount, {
      target: { value: 'THRESHOLD_REACHED' },
    });

    expect(accumulatedAmount).toBeInTheDocument();

    const additionalInfo = screen.getByTestId('additionalInfo-test') as HTMLInputElement;

    fireEvent.change(additionalInfo, { target: { value: 'info' } });
    expect(additionalInfo.value).toBe('info');

    expect(additionalInfo).toBeInTheDocument();
  });

  test('test Form input onChange with timeParameter ture', async () => {
    renderWithProviders(
      <RefundRules
        action={WIZARD_ACTIONS.BACK}
        setAction={setAction}
        currentStep={4}
        setCurrentStep={setCurrentStep}
        setDisableNext={setDisableNext}
      />
    );

    const timeParam = screen.getByTestId('timeParameter-radio-test');
    fireEvent.click(timeParam);

    const timeParamSelect = screen.getByTestId('selectTimeParam-test');

    fireEvent.click(timeParamSelect);
    fireEvent.change(timeParamSelect, {
      target: { value: 'CLOSED' },
    });

    expect(timeParamSelect).toBeInTheDocument();
  });

  test('test reimbursmentThreshold onChange', () => {
    store.dispatch(saveRefundRule(refundRules));
    store.dispatch(setInitiativeId(mockedInitiativeId));
    renderWithProviders(
      <RefundRules
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={setAction}
        currentStep={4}
        setCurrentStep={setCurrentStep}
        setDisableNext={setDisableNext}
      />
    );

    const reimbursmentQstGroup = screen.getByTestId('accumulatedAmount-radio-test');
    fireEvent.click(reimbursmentQstGroup);

    const accumulatedAmount = screen.getByTestId('accumulatedAmount-test');
    fireEvent.click(accumulatedAmount);
    fireEvent.change(accumulatedAmount, {
      target: { value: 'THRESHOLD_REACHED' },
    });

    const reimbursementThreshold = screen.getByTestId('reimbursementThreshold-test');
    fireEvent.change(reimbursementThreshold, { target: { value: '1000' } });
  });
});
