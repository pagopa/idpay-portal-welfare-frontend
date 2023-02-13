/* eslint-disable react/jsx-no-bind */
import { fireEvent, render } from '@testing-library/react';
import React, { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import SpendingLimitItem from '../SpendingLimitItem';
import { shopRulesToSubmit, threshold } from './ShopRules.test';

window.scrollTo = jest.fn();
describe('<SpendingLimitItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  test('should render correctly the SpendingLimitItem component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <SpendingLimitItem
            title={''}
            code={'THRESHOLD'}
            handleShopListItemRemoved={undefined}
            action={WIZARD_ACTIONS.DRAFT}
            shopRulesToSubmit={shopRulesToSubmit}
            setShopRulesToSubmit={function (
              _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
            ): void {}}
            data={threshold}
            setData={function (_value: any): void {}}
          />
        </Provider>
      );
    });
  });

  it('test on handleSubmit', async () => {
    await act(async () => {
      const handleSubmit = jest.fn();
      const mockedHandleShopListItemRemoved = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <SpendingLimitItem
            title={''}
            code={'THRESHOLD'}
            handleShopListItemRemoved={mockedHandleShopListItemRemoved}
            action={WIZARD_ACTIONS.SUBMIT}
            shopRulesToSubmit={shopRulesToSubmit}
            setShopRulesToSubmit={jest.fn()}
            data={threshold}
            setData={jest.fn()}
          />
        </Provider>
      );
      const deleteBtn = getByTestId('delete-button-test') as HTMLButtonElement;
      const minSpendingLimit = getByTestId('min-spending-limit') as HTMLInputElement;
      const maxSpendingLimit = getByTestId('max-spending-limit') as HTMLInputElement;

      fireEvent.click(deleteBtn);

      expect(mockedHandleShopListItemRemoved.mock.calls.length).toEqual(1);

      fireEvent.change(maxSpendingLimit, {
        target: { value: 'maxLimit' },
      });

      fireEvent.focusOut(maxSpendingLimit);

      expect(maxSpendingLimit.value).toBeDefined();

      fireEvent.change(minSpendingLimit, {
        target: { value: 'maxLimit' },
      });

      expect(maxSpendingLimit.value).toBeDefined();
    });
  });
});
