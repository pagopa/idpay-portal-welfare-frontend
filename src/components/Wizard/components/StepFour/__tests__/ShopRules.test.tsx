/* eslint-disable react/jsx-no-bind */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { ConfigTrxRuleArrayDTO } from '../../../../../api/generated/initiative/ConfigTrxRuleArrayDTO';
import { InitiativeRewardAndTrxRulesDTO } from '../../../../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { InitiativeApiMocked } from '../../../../../api/__mocks__/InitiativeApiClient';
import Layout from '../../../../../components/Layout/Layout';
import {
  saveDaysOfWeekIntervals,
  saveMccFilter,
  saveRewardLimits,
  saveRewardRule,
  saveThreshold,
  saveTrxCount,
  setInitiativeId,
} from '../../../../../redux/slices/initiativeSlice';
import { store } from '../../../../../redux/store';
import { mockedInitiativeId } from '../../../../../services/__mocks__/groupService';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { renderWithHistoryAndStore } from '../../../../../utils/test-utils';
import ShopRules from '../ShopRules';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

afterEach(() => cleanup);
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

  test('should render correctly the ShopRules component action SUMBIT and delete mcc btn', async () => {
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

    // delete btns tests

    const deleteMccBtn = await screen.findByTestId('delete-button-mcc-test');
    fireEvent.click(deleteMccBtn);

    const deleteSpendingLimitBtn = await screen.findByTestId('delete-button-spending-limit-test');
    fireEvent.click(deleteSpendingLimitBtn);

    // add new Criteria

    const addNewCriteria = await screen.findByTestId('criteria-button-test');
    fireEvent.click(addNewCriteria);

    const shopRulesModalTitle = await screen.findByText('components.wizard.stepFour.modal.title');
    expect(shopRulesModalTitle).toBeInTheDocument();

    fireEvent.click(
      await screen.findByText('components.wizard.stepFour.form.addTransactionTimeItem')
    );
    fireEvent.click(await screen.findByTestId('add-shopList-MCC-btn'));
    // screen.debug(undefined, 99999);
  });

  test('should render correctly the ShopRules component action DRAFT', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    InitiativeApiMocked.initiativeTrxAndRewardRulesPutDraft = async (
      _id: string,
      _data: InitiativeRewardAndTrxRulesDTO
    ): Promise<void> => new Promise((resolve) => resolve());
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

  test('test getTransactionConfigRules', () => {
    InitiativeApiMocked.getTransactionConfigRules = async (): Promise<ConfigTrxRuleArrayDTO> =>
      new Promise((resolve) =>
        resolve([
          {
            checked: false,
            code: undefined,
            description: 'description',
            enabled: true,
          },
          {
            checked: false,
            code: undefined,
            description: 'description',
            enabled: true,
          },
          {
            checked: false,
            code: undefined,
            description: 'description',
            enabled: false,
          },
          {
            checked: false,
            code: undefined,
            description: 'description',
            enabled: true,
          },
          {
            checked: false,
            code: undefined,
            description: 'description',
            enabled: true,
          },
          {
            checked: false,
            code: undefined,
            description: 'description',
            enabled: true,
          },
          {
            checked: false,
            code: undefined,
            description: 'description',
            enabled: false,
          },
        ])
      );

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

  test('test getTransactionConfigRules', () => {
    InitiativeApiMocked.getTransactionConfigRules = async (): Promise<ConfigTrxRuleArrayDTO> =>
      new Promise((resolve) => resolve([]));

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

  test('test percetage-recognized-value input', async () => {
    renderWithHistoryAndStore(
      <Layout>
        <ShopRules
          action={WIZARD_ACTIONS.SUBMIT}
          setAction={setAction}
          currentStep={3}
          setCurrentStep={setCurrentStep(3)}
          setDisabledNext={setDisabledNext}
        />
      </Layout>
    );

    fireEvent.change(screen.getByTestId('percetage-recognized-value'), {
      target: {
        value: '10',
      },
    });
  });

  test('test catch case api getTransactionConfigRules', async () => {
    (InitiativeApiMocked.getTransactionConfigRules = async (): Promise<any> =>
      Promise.reject('mocked error response for tests')),
      renderWithHistoryAndStore(
        <ShopRules
          action={''}
          setAction={setAction}
          currentStep={3}
          setCurrentStep={setCurrentStep(3)}
          setDisabledNext={setDisabledNext}
        />
      );
  });

  test('test catch case api putTrxAndRewardRulesDraft', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    InitiativeApiMocked.initiativeTrxAndRewardRulesPutDraft = async (): Promise<void> =>
      Promise.reject('mocked error response for tests');
    renderWithHistoryAndStore(
      <ShopRules
        action={WIZARD_ACTIONS.DRAFT}
        setAction={setAction}
        currentStep={3}
        setCurrentStep={setCurrentStep(3)}
        setDisabledNext={setDisabledNext}
      />
    );
  });
});
