/* eslint-disable react/jsx-no-bind */
import { fireEvent, render } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import TransactionNumberItem from '../TransactionNumberItem';
import React from 'react';
import { TrxCount } from '../../../../../model/Initiative';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<TransactionNumberItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should render correctly the TransactionNumberItem component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <TransactionNumberItem
            title={''}
            code={''}
            handleShopListItemRemoved={undefined}
            action={WIZARD_ACTIONS.DRAFT}
            shopRulesToSubmit={[]}
            setShopRulesToSubmit={function (
              _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
            ): void {
              //
            }}
            data={undefined}
            setData={function (_value: any): void {
              //
            }}
          />
        </Provider>
      );
    });
  });

  it('test on handleSubmit', async () => {
    const mockedHandleShopListItemRemoved = jest.fn();
    const trxCount: TrxCount = { from: 2, fromIncluded: true, to: 3, toIncluded: true };

    await act(async () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <TransactionNumberItem
            title={'title'}
            code={'code'}
            handleShopListItemRemoved={mockedHandleShopListItemRemoved}
            action={WIZARD_ACTIONS.SUBMIT}
            shopRulesToSubmit={[
              { code: 'code', dispatched: false },
              { code: 'code', dispatched: true },
            ]}
            setShopRulesToSubmit={function (
              _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
            ): void {
              //
            }}
            data={trxCount}
            setData={function (_value: any): void {
              //
            }}
          />
        </Provider>
      );
      const deleteBtn = getByTestId('delete-button-test') as HTMLButtonElement;
      const maxSpendingLimit = getByTestId('max-spending-limit') as HTMLInputElement;
      const minSpendingLimit = getByTestId('min-spending-limit') as HTMLInputElement;
      // const removeIcon = getAllByTestId('remove-icon-test');
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
