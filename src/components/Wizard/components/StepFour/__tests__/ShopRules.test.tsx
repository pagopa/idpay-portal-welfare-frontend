/* eslint-disable react/jsx-no-bind */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
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
  saveThreshold,
  saveTrxCount,
  setInitiative,
  setInitiativeId,
} from '../../../../../redux/slices/initiativeSlice';
import { mockedInitiativeId } from '../../../../../services/__mocks__/groupService';
import { mockedInitiative } from '../../../../../model/__tests__/Initiative.test';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);
window.scrollTo = jest.fn();

describe('<RefundRules />', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  const setAction = jest.fn();
  const setCurrentStep = jest.fn();
  const setDisabledNext = jest.fn();
  const trxCount = { from: 2, fromIncluded: true, to: 3, toIncluded: true };
  const threshold = { from: 2, fromIncluded: true, to: 3, toIncluded: true };
  const mccFilter = { allowedList: true, values: ['0742', '0743'] };
  const rewardLimits = [{ frequency: 'DAILY', rewardLimit: 2 }];
  const daysOfWeekIntervals = [
    {
      daysOfWeek: 'MONDAY',
      startTime: '00:00',
      endTime: '23:59',
    },
  ];

  test('should render correctly the ShopRules component action SUMBIT', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
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
            currentStep={0}
            setCurrentStep={setCurrentStep(3)}
            setDisabledNext={setDisabledNext}
          />
        </Router>
      </Provider>
    );

    // await waitFor(() => expect(screen.getByTestId('criteria-button-test')).not.toBeNull());
  });

  test('should render correctly the ShopRules component action DRAFT', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    render(
      <Provider store={store}>
        <Router history={history}>
          <ShopRules
            action={WIZARD_ACTIONS.DRAFT}
            setAction={setAction}
            currentStep={0}
            setCurrentStep={setCurrentStep}
            setDisabledNext={setDisabledNext}
          />
        </Router>
      </Provider>
    );
  });
});
