/* eslint-disable react/jsx-no-bind */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { createMemoryHistory } from 'history';
import ShopRules from '../ShopRules';
import {
  saveDaysOfWeekIntervals,
  saveMccFilter,
  saveRewardLimits,
  saveRewardRule,
  saveThreshold,
  saveTrxCount,
  setInitiativeId,
} from '../../../../../redux/slices/initiativeSlice';
import { mockedInitiativeId } from '../../../../../services/__mocks__/groupService';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);
window.scrollTo = jest.fn();

export const shopRulesToSubmit = [
  { code: 'PRCREC', dispatched: false },
  { code: 'THRESHOLD', dispatched: false },
  { code: 'MCC', dispatched: false },
  { code: 'TRXCOUNT', dispatched: false },
  { code: 'REWARDLIMIT', dispatched: false },
  { code: 'DAYHOURSWEEK', dispatched: false },
];

export const trxCount = { from: 2, fromIncluded: true, to: 3, toIncluded: true };
export const threshold = { from: 2, fromIncluded: true, to: 3, toIncluded: true };
export const mccFilter = { allowedList: true, values: ['0742', '0743'] };
export const rewardLimits = [
  { frequency: 'DAILY', rewardLimit: 2 },
  { frequency: 'MONTHLY', rewardLimit: 2 },
];
export const daysOfWeekIntervals = [
  {
    daysOfWeek: 'MONDAY',
    startTime: '00:00',
    endTime: '23:59',
  },
  {
    daysOfWeek: 'THUESDAY',
    startTime: '00:00',
    endTime: '23:59',
  },
];
export const perRec = { _type: 'rewardValue', rewardValue: 2 };

describe('<RefundRules />', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  const setAction = jest.fn();
  const setCurrentStep = jest.fn();
  const setDisabledNext = jest.fn();

  test('should render correctly the ShopRules component action SUMBIT', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    store.dispatch(saveRewardRule(perRec));
    store.dispatch(saveTrxCount(trxCount));
    store.dispatch(saveThreshold(threshold));
    store.dispatch(saveMccFilter(mccFilter));
    store.dispatch(saveRewardLimits(rewardLimits));
    store.dispatch(saveDaysOfWeekIntervals(daysOfWeekIntervals));
    render(
      <Provider store={store}>
        <Router history={history}>
          <ShopRules
            action={WIZARD_ACTIONS.SUBMIT}
            setAction={setAction}
            currentStep={3}
            setCurrentStep={setCurrentStep(3)}
            setDisabledNext={setDisabledNext}
          />
        </Router>
      </Provider>
    );
  });

  test('should render correctly the ShopRules component action DRAFT', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    render(
      <Provider store={store}>
        <Router history={history}>
          <ShopRules
            action={WIZARD_ACTIONS.DRAFT}
            setAction={setAction}
            currentStep={3}
            setCurrentStep={setCurrentStep(3)}
            setDisabledNext={setDisabledNext}
          />
        </Router>
      </Provider>
    );

    const toast = await waitFor(() => {
      return screen.getByText(/components.wizard.common.draftSaved/);
    });
    expect(toast).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('CloseIcon'));
  });
});
