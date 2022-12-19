/* eslint-disable react/jsx-no-bind */
import { fireEvent, render } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import SpendingLimitItem from '../SpendingLimitItem';
import React from 'react';
import { Threshold } from '../../../../../model/Initiative';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<SpendingLimitItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should render correctly the SpendingLimitItem component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <SpendingLimitItem
            title={''}
            code={''}
            handleShopListItemRemoved={undefined}
            action={'DRAFT'}
            shopRulesToSubmit={[]}
            setShopRulesToSubmit={function (
              _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
            ): void {}}
            data={undefined}
            setData={function (_value: any): void {}}
          />
        </Provider>
      );
    });
  });

  it('test on handleSubmit', async () => {
    const threshold: Threshold = { from: 3, fromIncluded: true, to: 4, toIncluded: true };
    await act(async () => {
      const handleSubmit = jest.fn();
      const mockedHandleShopListItemRemoved = jest.fn();
      const { debug, getByTestId } = render(
        <Provider store={store}>
          <SpendingLimitItem
            title={'title'}
            code={'code'}
            handleShopListItemRemoved={mockedHandleShopListItemRemoved}
            action={WIZARD_ACTIONS.SUBMIT}
            shopRulesToSubmit={[
              { code: 'code', dispatched: true },
              { code: 'code', dispatched: true },
            ]}
            setShopRulesToSubmit={function (
              _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
            ): void {
              //
            }}
            data={threshold}
            setData={function (_value: any): void {
              //
            }}
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

      // debug();
      handleSubmit();
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  it('call the submit event when form is submitted', async () => {
    await act(async () => {
      const handleSubmit = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <Wizard handleOpenExitModal={() => console.log('exit modal')} />
        </Provider>
      );

      const submit = getByTestId('continue-action-test');
      fireEvent.click(submit);
      expect(WIZARD_ACTIONS.SUBMIT).toBe('SUBMIT');
      expect(handleSubmit).toBeDefined();
    });
  });

  it('draf action makes the dispatch', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <Wizard handleOpenExitModal={() => console.log('exit modal')} />
        </Provider>
      );

      const skip = getByTestId('skip-action-test');
      // eslint-disable-next-line @typescript-eslint/await-thenable
      fireEvent.click(skip);
      expect(WIZARD_ACTIONS.DRAFT).toBe('DRAFT');
    });
  });

});
