/* eslint-disable react/jsx-no-bind */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { InitiativeRewardRuleDtoRewardValueTypeEnum as RewardValueTypeEnum } from '../../../../../api/generated/initiative/apiClient';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import SpendingLimitItem from '../SpendingLimitItem';
import { shopRulesToSubmit, threshold } from './ShopRules.test';

jest.mock('../../../../../services/intitativeService');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

window.scrollTo = jest.fn();

describe('<SpendingLimitItem />', () => {
  const renderItem = (
    overrides: Partial<React.ComponentProps<typeof SpendingLimitItem>> = {}
  ) => {
    const props = {
      title: '',
      code: 'THRESHOLD',
      handleShopListItemRemoved: jest.fn(),
      action: WIZARD_ACTIONS.DRAFT,
      shopRulesToSubmit,
      setShopRulesToSubmit: jest.fn(),
      data: threshold,
      setData: jest.fn(),
      rewardRuleData: {
        _type: 'rewardValue',
        rewardValue: 10,
        rewardValueType: RewardValueTypeEnum.PERCENTAGE,
      },
      ...overrides,
    };

    render(
      <Provider store={createStore()}>
        <SpendingLimitItem
          title={props.title}
          code={props.code}
          handleShopListItemRemoved={props.handleShopListItemRemoved}
          action={props.action}
          shopRulesToSubmit={props.shopRulesToSubmit}
          setShopRulesToSubmit={props.setShopRulesToSubmit}
          data={props.data}
          setData={props.setData}
          rewardRuleData={props.rewardRuleData}
        />
      </Provider>
    );

    return props;
  };

  test('stays idle when action is DRAFT', () => {
    const props = renderItem({ action: WIZARD_ACTIONS.DRAFT });

    expect(props.setShopRulesToSubmit).not.toHaveBeenCalled();
  });

  test('ignores actions other than SUBMIT and DRAFT', () => {
    const props = renderItem({ action: WIZARD_ACTIONS.BACK });

    expect(props.setShopRulesToSubmit).not.toHaveBeenCalled();
  });

  test('submits a valid percentage threshold on SUBMIT', async () => {
    const props = renderItem({ action: WIZARD_ACTIONS.SUBMIT });

    await waitFor(() => {
      expect(props.setShopRulesToSubmit).toHaveBeenCalledTimes(1);
    });

    expect(props.setShopRulesToSubmit).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ code: 'THRESHOLD', dispatched: true })])
    );

    fireEvent.click(screen.getByTestId('delete-button-spending-limit-test'));
    expect(props.handleShopListItemRemoved).toHaveBeenCalledWith('THRESHOLD');
  });

  test('submits a valid absolute threshold at the minimum', async () => {
    const props = renderItem({
      action: WIZARD_ACTIONS.SUBMIT,
      rewardRuleData: {
        _type: 'rewardValue',
        rewardValue: 10,
        rewardValueType: RewardValueTypeEnum.ABSOLUTE,
      },
      data: { ...threshold, from: 10, to: 20 },
    });

    await waitFor(() => {
      expect(props.setShopRulesToSubmit).toHaveBeenCalledTimes(1);
    });
  });

  test('shows the absolute minimum cap error when the threshold is too low', async () => {
    const props = renderItem({
      action: WIZARD_ACTIONS.SUBMIT,
      rewardRuleData: {
        _type: 'rewardValue',
        rewardValue: 10,
        rewardValueType: RewardValueTypeEnum.ABSOLUTE,
      },
      data: { ...threshold, from: 4.1, to: 20 },
    });

    await waitFor(() => {
      expect(props.setShopRulesToSubmit).not.toHaveBeenCalled();
    });
  });

  test('shows the max spending limit error when max is lower than min', async () => {
    const props = renderItem({
      action: WIZARD_ACTIONS.SUBMIT,
      data: { ...threshold, from: 10, to: 5 },
    });

    const maxSpendingLimit = screen.getByTestId('max-spending-limit') as HTMLInputElement;
    fireEvent.change(maxSpendingLimit, { target: { value: '4' } });

    await waitFor(() => {
      expect(props.setShopRulesToSubmit).not.toHaveBeenCalled();
    });

    expect(props.setData).toHaveBeenNthCalledWith(1, expect.objectContaining({ to: 4 }));
  });

  test('stores numeric and empty spending limit values while from is undefined', () => {
    const props = renderItem({
      action: WIZARD_ACTIONS.DRAFT,
      data: { ...threshold, from: undefined, to: 20 },
    });

    const minSpendingLimit = screen.getByTestId('min-spending-limit') as HTMLInputElement;

    fireEvent.change(minSpendingLimit, { target: { value: '12.5' } });
    expect(props.setData).toHaveBeenNthCalledWith(1, expect.objectContaining({ from: 12.5 }));

    fireEvent.change(minSpendingLimit, { target: { value: '' } });
    expect(props.setData).toHaveBeenNthCalledWith(2, expect.objectContaining({ from: undefined }));
  });
});
