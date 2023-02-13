/* eslint-disable react/jsx-no-bind */
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import TransactionTimeItem from '../TransactionTimeItem';
import { daysOfWeekIntervals, shopRulesToSubmit } from './ShopRules.test';

window.scrollTo = jest.fn();

describe('<TransactionTimeItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const mockedHandleShopListItemRemoved = jest.fn();
  const data = [
    {
      daysOfWeek: 'MONDAY',
      startTime: '00:00',
      endTime: '23:59',
    },
  ];

  test('should render correctly the TransactionTimeItem component', async () => {
    await act(async () => {
      const { getByTestId, getByText } = render(
        <Provider store={store}>
          <TransactionTimeItem
            key={0}
            title={'title'}
            code={'DAYHOURSWEEK'}
            handleShopListItemRemoved={undefined}
            action={WIZARD_ACTIONS.DRAFT}
            shopRulesToSubmit={shopRulesToSubmit}
            setShopRulesToSubmit={jest.fn()}
            data={data}
            setData={jest.fn()}
          />
        </Provider>
      );

      const itemMaxTimeInput = getByTestId('item-maxTime') as HTMLInputElement;
      const addIconBtn = getByText(
        'components.wizard.stepFour.form.addTransactionTimeItem'
      ) as HTMLButtonElement;

      fireEvent.change(itemMaxTimeInput, {
        target: { value: 'minTime' },
      });

      fireEvent.click(addIconBtn);

      // fireEvent.focusOut(itemMinTimeInput);
      expect(itemMaxTimeInput).toBeDefined();
      expect(addIconBtn).toBeInTheDocument();
    });
  });

  it('test on handleSubmit', async () => {
    await act(async () => {
      const { getByTestId, getAllByTestId, debug } = render(
        <Provider store={store}>
          <TransactionTimeItem
            key={0}
            title={'title'}
            code={'DAYHOURSWEEK'}
            handleShopListItemRemoved={mockedHandleShopListItemRemoved}
            action={WIZARD_ACTIONS.SUBMIT}
            shopRulesToSubmit={shopRulesToSubmit}
            setShopRulesToSubmit={jest.fn()}
            data={daysOfWeekIntervals}
            setData={jest.fn()}
          />
        </Provider>
      );
      const deleteBtn = getByTestId('delete-button-test') as HTMLButtonElement;
      const itemMinTimeInput = getAllByTestId('item-minTime') as HTMLInputElement[];
      const selectDayOfWeek = getAllByTestId('selectDayOfWeek') as HTMLSelectElement[];
      const removeCircleIcon = getAllByTestId('removeCircleIcon') as HTMLElement[];
      // const removeIcon = getAllByTestId('remove-icon-test');
      fireEvent.click(deleteBtn);
      expect(mockedHandleShopListItemRemoved).toHaveBeenCalledTimes(1);
      //debug();

      fireEvent.change(itemMinTimeInput[0], {
        target: { value: 'minTime' },
      });
      // fireEvent.focusOut(itemMinTimeInput);
      expect(itemMinTimeInput[0]).toBeInTheDocument();

      fireEvent.change(selectDayOfWeek[0], {
        target: { value: 'MONDAY' },
      });
      expect(selectDayOfWeek[0]).toBeInTheDocument();
      fireEvent.click(removeCircleIcon[0]);
      expect(removeCircleIcon[0]).toBeInTheDocument();
    });
  });
});
