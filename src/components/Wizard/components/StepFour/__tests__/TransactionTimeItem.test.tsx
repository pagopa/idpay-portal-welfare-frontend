/* eslint-disable react/jsx-no-bind */
import {
  fireEvent,
  render,
} from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { DaysOfWeekInterval } from '../../../../../model/Initiative';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import TransactionTimeItem from '../TransactionTimeItem';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<TransactionTimeItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should render correctly the TransactionTimeItem component', async () => {
    await act(async () => {
      const { debug, getByTestId, getByText } = render(
        <Provider store={store}>
          <TransactionTimeItem
            key={0}
            title={'title'}
            code={'code'}
            handleShopListItemRemoved={undefined}
            action={WIZARD_ACTIONS.DRAFT}
            shopRulesToSubmit={[]}
            setShopRulesToSubmit={function (
              _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
            ): void {
              //
            }}
            data={undefined}
            setData={function (
              _value: SetStateAction<Array<DaysOfWeekInterval> | undefined>
            ): void {
              //
            }}
          />
        </Provider>
      );
      //debug();
      const itemMaxTimeInput = getByTestId('item-maxTime') as HTMLElement;
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
    const daysOfWeek: Array<DaysOfWeekInterval> = [
      { daysOfWeek: 'MONDAY', startTime: '20112070', endTime: '20122070' },
      { daysOfWeek: 'TUESDAY', startTime: '20112070', endTime: '20122070' },
      { daysOfWeek: 'THURSDAY', startTime: '20112070', endTime: '20122070' },
      { daysOfWeek: 'WEDNESDAY', startTime: '20112070', endTime: '20122070' },
      { daysOfWeek: 'FRIDAY', startTime: '20112070', endTime: '20122070' },
      { daysOfWeek: 'SATURDAY', startTime: '20112070', endTime: '20122070' },
      { daysOfWeek: 'SUNDAY', startTime: '20112070', endTime: '20122070' },
    ];
    const mockedHandleShopListItemRemoved = jest.fn();

    await act(async () => {
      const { getByTestId, getAllByTestId, debug } = render(
        <Provider store={store}>
          <TransactionTimeItem
            key={1}
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
            data={daysOfWeek}
            setData={function (
              _value: SetStateAction<Array<DaysOfWeekInterval> | undefined>
            ): void {
              //
            }}
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
