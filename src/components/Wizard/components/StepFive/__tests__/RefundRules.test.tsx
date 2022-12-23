import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { AccumulatedTypeEnum } from '../../../../../api/generated/initiative/AccumulatedAmountDTO';
import { saveRefundRule, setInitiativeId } from '../../../../../redux/slices/initiativeSlice';
import { store } from '../../../../../redux/store';
import { mockedInitiativeId } from '../../../../../services/__mocks__/groupService';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { renderWithProviders } from '../../../../../utils/test-utils';
import RefundRules from '../RefundRules';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

window.scrollTo = jest.fn();

describe('<RefundRules />', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  const setAction = jest.fn();
  const setCurrentStep = jest.fn();
  const setDisableNext = jest.fn();
  const refundRules = {
    reimbursementThreshold: AccumulatedTypeEnum.THRESHOLD_REACHED,
    reimbursmentQuestionGroup: 'true',
    additionalInfo: 'aaaaaa',
    timeParameter: '',
    accumulatedAmount: '',
  };

  const refundRulesEmpty = {
    reimbursmentQuestionGroup: '',
    timeParameter: '',
    accumulatedAmount: '',
    additionalInfo: '',
    reimbursementThreshold: '',
  };

  test('test Form input onChange with accumulatedAmount ture', async () => {
    store.dispatch(saveRefundRule(refundRules));
    store.dispatch(setInitiativeId(mockedInitiativeId));

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <RefundRules
              action={WIZARD_ACTIONS.DRAFT}
              setAction={setAction}
              currentStep={4}
              setCurrentStep={setCurrentStep}
              setDisableNext={setDisableNext}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const reimbursmentQstGroup = screen.getByTestId('accumulatedAmount-radio-test');
    fireEvent.click(reimbursmentQstGroup);

    const additionalInfo = screen.getByTestId('additionalInfo-test') as HTMLInputElement;

    fireEvent.change(additionalInfo, { target: { value: 'info' } });
    expect(additionalInfo.value).toBe('info');

    expect(additionalInfo).toBeInTheDocument();

    const timeParam = screen.getByTestId('timeParameter-radio-test');
    fireEvent.click(timeParam);

    const timeParamSelect = screen.getByTestId('selectTimeParam-test');

    fireEvent.click(timeParamSelect);
    fireEvent.change(timeParamSelect, {
      target: { value: 'CLOSED' },
    });

    expect(timeParamSelect).toBeInTheDocument();

    fireEvent.click(reimbursmentQstGroup);

    const accumulatedAmount = screen.getByTestId('accumulatedAmount-test');

    fireEvent.click(accumulatedAmount);
    fireEvent.change(accumulatedAmount, {
      target: { value: 'THRESHOLD_REACHED' },
    });

    expect(accumulatedAmount).toBeInTheDocument();

    const reimbursementThreshold = screen.getByTestId('reimbursementThreshold-test');
    fireEvent.change(reimbursementThreshold, { target: { value: '1000' } });

    const draftToast = await waitFor(() => {
      return screen.getByText('components.wizard.common.draftSaved');
    });
    expect(draftToast).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('CloseIcon'));
  });

  test('test reimbursmentThreshold onChange', async () => {
    store.dispatch(saveRefundRule(refundRulesEmpty));
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
    expect(accumulatedAmount).toBeInTheDocument();
  });
});
