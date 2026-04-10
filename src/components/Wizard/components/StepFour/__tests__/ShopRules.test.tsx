/* eslint-disable react/jsx-no-bind */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { InitiativeApiMocked } from '../../../../../api/__mocks__/InitiativeApiClient';
import {
  ConfigTrxRuleArrayDTO,
  InitiativeRewardAndTrxRulesDTO,
  InitiativeRewardRuleDtoRewardValueTypeEnum as RewardValueTypeEnum,
} from '../../../../../api/generated/initiative/apiClient';
import Layout from '../../../../../components/Layout/Layout';
import {
  saveRewardRule,
  setInitiativeId,
  setInitiativeRewardType,
} from '../../../../../redux/slices/initiativeSlice';
import { store } from '../../../../../redux/store';
import { mockedInitiativeId } from '../../../../../services/__mocks__/groupsService';
import * as initiativeService from '../../../../../services/intitativeService';
import { fetchTransactionRules } from '../../../../../services/transactionRuleService';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { renderWithContext } from '../../../../../utils/test-utils';
import ShopRules from '../ShopRules';

jest.mock('../../../../../services/intitativeService');
jest.mock('../../../../../services/transactionRuleService', () => ({
  fetchTransactionRules: jest.fn(),
}));

jest.mock('../ShopRulesModal', () => {
  return function MockShopRulesModal(props: any) {
    if (!props.openModal) {
      return null;
    }

    return (
      <div data-testid="shop-rules-modal">
        <button
          data-testid="add-threshold-rule"
          onClick={() => props.handleShopListItemAdded('THRESHOLD')}
        >
          add threshold
        </button>
        <button data-testid="add-mcc-rule" onClick={() => props.handleShopListItemAdded('MCC')}>
          add mcc
        </button>
      </div>
    );
  };
});

jest.mock('../RewardType', () => {
  const React = require('react');
  return function MockRewardType(props: any) {
    React.useEffect(() => {
      if (props.action === 'SUBMIT' || props.action === 'DRAFT') {
        props.setShopRulesToSubmit((prev: Array<{ code: string; dispatched: boolean }>) =>
          prev.map((item) => (item.code === props.code ? { ...item, dispatched: true } : item))
        );
      }
    }, [props.action, props.code, props.setShopRulesToSubmit]);

    return <div data-testid="reward-type-mock">{props.code}</div>;
  };
});

jest.mock('../PercentageRecognizedItem', () => {
  const React = require('react');
  return function MockPercentageRecognizedItem(props: any) {
    React.useEffect(() => {
      if (props.action === 'SUBMIT' || props.action === 'DRAFT') {
        props.setShopRulesToSubmit((prev: Array<{ code: string; dispatched: boolean }>) =>
          prev.map((item) => (item.code === props.code ? { ...item, dispatched: true } : item))
        );
      }
    }, [props.action, props.code, props.setShopRulesToSubmit]);

    return (
      <input
        data-testid="percentage-recognized-value"
        value={props.data?.rewardValue ?? ''}
        onChange={(e) =>
          props.setData({
            ...props.data,
            rewardValue: Number(e.target.value),
          })
        }
      />
    );
  };
});

jest.mock('../SpendingLimitItem', () => {
  const React = require('react');
  return function MockSpendingLimitItem(props: any) {
    React.useEffect(() => {
      if (props.action === 'SUBMIT' || props.action === 'DRAFT') {
        props.setShopRulesToSubmit((prev: Array<{ code: string; dispatched: boolean }>) =>
          prev.map((item) => (item.code === props.code ? { ...item, dispatched: true } : item))
        );
      }
    }, [props.action, props.code, props.setShopRulesToSubmit]);

    return (
      <div data-testid={`rule-${props.code}`}>
        <span>{props.title ?? props.code}</span>
        <button
          data-testid={`remove-${props.code}`}
          onClick={() => props.handleShopListItemRemoved(props.code)}
        >
          remove
        </button>
      </div>
    );
  };
});

jest.mock('../MCCItem', () => (props: any) => <div data-testid={`rule-${props.code}`}>{props.code}</div>);

jest.mock('../TransactionNumberItem', () => (props: any) => (
  <div data-testid={`rule-${props.code}`}>{props.code}</div>
));

jest.mock('../TimeLimitItem', () => (props: any) => (
  <div data-testid={`rule-${props.code}`}>{props.code}</div>
));

jest.mock('../TransactionTimeItem', () => (props: any) => (
  <div data-testid={`rule-${props.code}`}>{props.code}</div>
));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);
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

const mockedTransactionRules = [
  { code: 'THRESHOLD', description: 'threshold', enabled: true, checked: false },
  { code: 'MCC', description: 'mcc', enabled: true, checked: false },
  { code: 'TRXCOUNT', description: 'trx count', enabled: true, checked: false },
  { code: 'REWARDLIMIT', description: 'reward limit', enabled: true, checked: false },
  { code: 'DAYHOURSWEEK', description: 'days/hours', enabled: true, checked: false },
];

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

    (fetchTransactionRules as jest.Mock).mockResolvedValue(mockedTransactionRules);

    render(
      <Provider store={store}>
        <Router history={history}>
          <ShopRules
            action={WIZARD_ACTIONS.DRAFT}
            setAction={setAction}
            currentStep={3}
            setCurrentStep={setCurrentStep}
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

    (fetchTransactionRules as jest.Mock).mockResolvedValue(mockedTransactionRules);

    render(
      <Provider store={store}>
        <Router history={history}>
          <ShopRules
            action={WIZARD_ACTIONS.SUBMIT}
            setAction={setAction}
            currentStep={3}
            setCurrentStep={setCurrentStep}
            setDisabledNext={setDisabledNext}
          />
        </Router>
      </Provider>
    );
  });

  test('test getTransactionConfigRules empty response', () => {
    InitiativeApiMocked.getTransactionConfigRules = async (): Promise<ConfigTrxRuleArrayDTO> =>
      new Promise((resolve) => resolve([]));

    (fetchTransactionRules as jest.Mock).mockResolvedValue([]);

    render(
      <Provider store={store}>
        <Router history={history}>
          <ShopRules
            action={WIZARD_ACTIONS.SUBMIT}
            setAction={setAction}
            currentStep={3}
            setCurrentStep={setCurrentStep}
            setDisabledNext={setDisabledNext}
          />
        </Router>
      </Provider>
    );
  });

  test('test percentage-recognized-value input', async () => {
    (fetchTransactionRules as jest.Mock).mockResolvedValue(mockedTransactionRules);

    renderWithContext(
      <Layout>
        <ShopRules
          action={WIZARD_ACTIONS.SUBMIT}
          setAction={setAction}
          currentStep={3}
          setCurrentStep={setCurrentStep}
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

    (fetchTransactionRules as jest.Mock).mockRejectedValue('mocked error response for tests');

    store.dispatch(setInitiativeId(mockedInitiativeId));
    InitiativeApiMocked.initiativeTrxAndRewardRulesPutDraft = async (): Promise<void> =>
      Promise.reject('mocked error response for tests');

    renderWithContext(
      <ShopRules
        action=""
        setAction={setAction}
        currentStep={3}
        setCurrentStep={setCurrentStep}
        setDisabledNext={setDisabledNext}
      />
    );
  });

  test('opens modal, adds THRESHOLD rule, then removes it', async () => {
    (fetchTransactionRules as jest.Mock).mockResolvedValue(mockedTransactionRules);

    render(
      <Provider store={store}>
        <Router history={history}>
          <ShopRules
            action=""
            setAction={setAction}
            currentStep={3}
            setCurrentStep={setCurrentStep}
            setDisabledNext={setDisabledNext}
          />
        </Router>
      </Provider>
    );

    const addCriteriaButton = await screen.findByTestId('criteria-button-test');
    fireEvent.click(addCriteriaButton);

    expect(screen.getByTestId('shop-rules-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('add-threshold-rule'));

    expect(await screen.findByTestId('rule-THRESHOLD')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('remove-THRESHOLD'));

    await waitFor(() => {
      expect(screen.queryByTestId('rule-THRESHOLD')).not.toBeInTheDocument();
    });
  });

  test('shows mandatory trx count toast on submit when reward type is ABSOLUTE and THRESHOLD is not present', async () => {
    (fetchTransactionRules as jest.Mock).mockResolvedValue(mockedTransactionRules);

    store.dispatch(
      saveRewardRule({
        _type: 'rewardValue',
        rewardValue: 10,
        rewardValueType: RewardValueTypeEnum.ABSOLUTE,
      } as any)
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <ShopRules
            action={WIZARD_ACTIONS.SUBMIT}
            setAction={setAction}
            currentStep={3}
            setCurrentStep={setCurrentStep}
            setDisabledNext={setDisabledNext}
          />
        </Router>
      </Provider>
    );

    expect(
      await screen.findByText(
        /components\.wizard\.stepFour\.form\.trxCountNotPopulatedErrorTitle/
      )
    ).toBeInTheDocument();
  });

  test('submits successfully when THRESHOLD is present', async () => {
    (fetchTransactionRules as jest.Mock).mockResolvedValue(mockedTransactionRules);

    jest.spyOn(initiativeService, 'putTrxAndRewardRules').mockResolvedValue(undefined as never);

    store.dispatch(
      saveRewardRule({
        _type: 'rewardValue',
        rewardValue: 10,
        rewardValueType: RewardValueTypeEnum.ABSOLUTE,
      } as any)
    );
    store.dispatch(setInitiativeRewardType('REFUND' as any));
    store.dispatch(setInitiativeId(mockedInitiativeId));

    const { rerender } = render(
      <Provider store={store}>
        <Router history={history}>
          <ShopRules
            action=""
            setAction={setAction}
            currentStep={3}
            setCurrentStep={setCurrentStep}
            setDisabledNext={setDisabledNext}
          />
        </Router>
      </Provider>
    );

    fireEvent.click(await screen.findByTestId('criteria-button-test'));
    fireEvent.click(screen.getByTestId('add-threshold-rule'));

    expect(await screen.findByTestId('rule-THRESHOLD')).toBeInTheDocument();

    rerender(
      <Provider store={store}>
        <Router history={history}>
          <ShopRules
            action={WIZARD_ACTIONS.SUBMIT}
            setAction={setAction}
            currentStep={3}
            setCurrentStep={setCurrentStep}
            setDisabledNext={setDisabledNext}
          />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(initiativeService.putTrxAndRewardRules).toHaveBeenCalled();
      expect(setCurrentStep).toHaveBeenCalledWith(4);
    });
  });

  test('disables modal button when all optional rules are already checked', async () => {
    (fetchTransactionRules as jest.Mock).mockResolvedValue([
      { code: 'THRESHOLD', description: 'threshold', enabled: true, checked: false },
      { code: 'MCC', description: 'mcc', enabled: true, checked: false },
    ]);

    render(
      <Provider store={store}>
        <Router history={history}>
          <ShopRules
            action=""
            setAction={setAction}
            currentStep={3}
            setCurrentStep={setCurrentStep}
            setDisabledNext={setDisabledNext}
          />
        </Router>
      </Provider>
    );

    fireEvent.click(await screen.findByTestId('criteria-button-test'));
    fireEvent.click(screen.getByTestId('add-threshold-rule'));

    fireEvent.click(screen.getByTestId('criteria-button-test'));
    fireEvent.click(screen.getByTestId('add-mcc-rule'));

    await waitFor(() => {
      expect(screen.queryByTestId('criteria-button-test')).not.toBeInTheDocument();
    });
  });
});