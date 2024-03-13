/* eslint-disable react/jsx-no-bind */
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import TransactionNumberItem from '../TransactionNumberItem';
import { shopRulesToSubmit, trxCount } from './ShopRules.test';

jest.mock('../../../../../services/intitativeService');

window.scrollTo = jest.fn();

describe('<TransactionNumberItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  test('should render correctly the TransactionNumberItem component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <TransactionNumberItem
            title={''}
            code={'TRXCOUNT'}
            handleShopListItemRemoved={undefined}
            action={WIZARD_ACTIONS.DRAFT}
            shopRulesToSubmit={shopRulesToSubmit}
            setShopRulesToSubmit={jest.fn()}
            data={trxCount}
            setData={jest.fn()}
          />
        </Provider>
      );
    });
  });

  it('test on handleSubmit', async () => {
    const mockedHandleShopListItemRemoved = jest.fn();

    await act(async () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <TransactionNumberItem
            title={''}
            code={'TRXCOUNT'}
            handleShopListItemRemoved={mockedHandleShopListItemRemoved}
            action={WIZARD_ACTIONS.SUBMIT}
            shopRulesToSubmit={shopRulesToSubmit}
            setShopRulesToSubmit={jest.fn()}
            data={trxCount}
            setData={jest.fn()}
          />
        </Provider>
      );
      const deleteBtn = getByTestId('delete-button-test') as HTMLButtonElement;
      const maxSpendingLimit = getByTestId('max-spending-limit') as HTMLInputElement;
      const minSpendingLimit = getByTestId('min-spending-limit') as HTMLInputElement;

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
    });
  });
});
