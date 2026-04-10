/* eslint-disable react/jsx-no-bind */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { InitiativeApiMocked } from '../../../../../api/__mocks__/InitiativeApiClient';
import { ConfigTrxRuleArrayDTO, InitiativeRewardAndTrxRulesDTO, InitiativeRewardRuleDtoRewardValueTypeEnum as RewardValueTypeEnum } from '../../../../../api/generated/initiative/apiClient';
import Layout from '../../../../../components/Layout/Layout';
import {
  setInitiativeId,
} from '../../../../../redux/slices/initiativeSlice';
import { store } from '../../../../../redux/store';
import { mockedInitiativeId } from '../../../../../services/__mocks__/groupsService';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { renderWithContext } from '../../../../../utils/test-utils';
import ShopRules from '../ShopRules';


jest.mock('../../../../../services/intitativeService');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => cleanup);
window.scrollTo = jest.fn();

export const shopRulesToSubmit = [
  { code: 'TYPE', dispatched: false },
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
export const perRec = {
  _type: 'rewardValue',
  rewardValue: 2,
  rewardValueType: RewardValueTypeEnum.PERCENTAGE,
};

describe('<RefundRules />', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  const setAction = jest.fn();
  const setCurrentStep = jest.fn();
  const setDisabledNext = jest.fn();

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

  test('test percentage-recognized-value input', async () => {
    renderWithContext(
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

    fireEvent.change(screen.getByTestId('percentage-recognized-value'), {
      target: {
        value: '10',
      },
    });
  });

  test('test catch case api getTransactionConfigRules', async () => {
    InitiativeApiMocked.getTransactionConfigRules = async (): Promise<any> =>
      Promise.reject('mocked error response for tests');

    store.dispatch(setInitiativeId(mockedInitiativeId));
    InitiativeApiMocked.initiativeTrxAndRewardRulesPutDraft = async (): Promise<void> =>
      Promise.reject('mocked error response for tests');

    renderWithContext(
      <ShopRules
        action={''}
        setAction={setAction}
        currentStep={3}
        setCurrentStep={setCurrentStep(3)}
        setDisabledNext={setDisabledNext}
      />
    );
  });
});
