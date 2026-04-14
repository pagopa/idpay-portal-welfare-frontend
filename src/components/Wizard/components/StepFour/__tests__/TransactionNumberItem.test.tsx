/* eslint-disable react/jsx-no-bind */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import TransactionNumberItem from '../TransactionNumberItem';
import { shopRulesToSubmit, trxCount } from './ShopRules.test';
import { InitiativeDtoInitiativeRewardTypeEnum as InitiativeRewardTypeEnum } from '../../../../../api/generated/initiative/apiClient';

jest.mock('../../../../../services/intitativeService');

window.scrollTo = jest.fn();

describe('<TransactionNumberItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  const renderComponent = (props?: Partial<React.ComponentProps<typeof TransactionNumberItem>>) => {
    const defaultProps: React.ComponentProps<typeof TransactionNumberItem> = {
      title: '',
      code: 'TRXCOUNT',
      handleShopListItemRemoved: jest.fn(),
      action: WIZARD_ACTIONS.DRAFT,
      shopRulesToSubmit,
      setShopRulesToSubmit: jest.fn(),
      data: trxCount,
      setData: jest.fn(),
      rewardType: InitiativeRewardTypeEnum.REFUND,
    };

    render(
      <Provider store={store}>
        <TransactionNumberItem {...defaultProps} {...props} />
      </Provider>
    );

    return { ...defaultProps, ...props };
  };

  test('should render correctly the TransactionNumberItem component', async () => {
    renderComponent();
    expect(await screen.findByTestId('transaction-number-item-test')).toBeInTheDocument();
  });

  test('submits shop rules only when action is SUBMIT and not when action is DRAFT', async () => {
    const setShopRulesToSubmit = jest.fn();

    const { rerender } = render(
      <Provider store={store}>
        <TransactionNumberItem
          title=""
          code="TRXCOUNT"
          handleShopListItemRemoved={jest.fn()}
          action={WIZARD_ACTIONS.DRAFT}
          shopRulesToSubmit={shopRulesToSubmit}
          setShopRulesToSubmit={setShopRulesToSubmit}
          data={trxCount}
          setData={jest.fn()}
          rewardType={InitiativeRewardTypeEnum.REFUND}
        />
      </Provider>
    );

    expect(setShopRulesToSubmit).not.toHaveBeenCalled();

    rerender(
      <Provider store={store}>
        <TransactionNumberItem
          title=""
          code="TRXCOUNT"
          handleShopListItemRemoved={jest.fn()}
          action={WIZARD_ACTIONS.SUBMIT}
          shopRulesToSubmit={shopRulesToSubmit}
          setShopRulesToSubmit={setShopRulesToSubmit}
          data={trxCount}
          setData={jest.fn()}
          rewardType={InitiativeRewardTypeEnum.REFUND}
        />
      </Provider>
    );

    await waitFor(() => expect(setShopRulesToSubmit).toHaveBeenCalledTimes(1));
  });

  test('sets minimum transaction value to 1 when reward type is DISCOUNT', async () => {
    renderComponent({
      rewardType: InitiativeRewardTypeEnum.DISCOUNT,
      data: { from: 4, fromIncluded: true, to: 7, toIncluded: true },
    });

    const minTransactionNumber = screen.getByTestId('min-spending-limit') as HTMLInputElement;
    expect(minTransactionNumber.value).toBe('1');
  });

  test('updates from/to state with numeric and empty values', async () => {
    const setData = jest.fn();
    renderComponent({ setData, data: { from: undefined, to: undefined } });

    const minTransactionNumber = screen.getByTestId('min-spending-limit') as HTMLInputElement;
    const maxTransactionNumber = screen.getByTestId('max-spending-limit') as HTMLInputElement;

    fireEvent.change(minTransactionNumber, { target: { value: '3' } });
    fireEvent.change(maxTransactionNumber, { target: { value: '6' } });
    fireEvent.change(maxTransactionNumber, { target: { value: '' } });

    expect(setData).toHaveBeenCalledWith(expect.objectContaining({ from: 3 }));
    expect(setData).toHaveBeenCalledWith(expect.objectContaining({ to: 6 }));
    expect(setData).toHaveBeenCalledWith(expect.objectContaining({ to: undefined }));
  });

  it('test on handleSubmit and delete handler', async () => {
    const mockedHandleShopListItemRemoved = jest.fn();
    const setShopRulesToSubmit = jest.fn();

    renderComponent({
      handleShopListItemRemoved: mockedHandleShopListItemRemoved,
      action: WIZARD_ACTIONS.SUBMIT,
      setShopRulesToSubmit,
    });

    const deleteBtn = (await screen.findByTestId('delete-button-test')) as HTMLButtonElement;
    const maxSpendingLimit = screen.getByTestId('max-spending-limit') as HTMLInputElement;
    const minSpendingLimit = screen.getByTestId('min-spending-limit') as HTMLInputElement;

    fireEvent.click(deleteBtn);
    expect(mockedHandleShopListItemRemoved).toHaveBeenCalledTimes(1);

    fireEvent.change(maxSpendingLimit, {
      target: { value: 'maxLimit' },
    });

    fireEvent.focusOut(maxSpendingLimit);

    expect(maxSpendingLimit.value).toBeDefined();

    fireEvent.change(minSpendingLimit, {
      target: { value: 'minLimit' },
    });

    expect(maxSpendingLimit.value).toBeDefined();

    await waitFor(() => expect(setShopRulesToSubmit).toHaveBeenCalledTimes(1));
  });
});
