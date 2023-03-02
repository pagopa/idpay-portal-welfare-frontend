/* eslint-disable react/jsx-no-bind */
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import TransactionTimeItem from '../TransactionTimeItem';
import { daysOfWeekIntervals, shopRulesToSubmit } from './ShopRules.test';
import { renderWithHistoryAndStore } from '../../../../../utils/test-utils';

window.scrollTo = jest.fn();

describe('<TransactionTimeItem />', () => {
  const data = [
    {
      daysOfWeek: 'MONDAY',
      startTime: '00:00',
      endTime: '23:59',
    },
  ];

  test('should render correctly the TransactionTimeItem component', async () => {
    renderWithHistoryAndStore(
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
    );

    const itemMaxTimeInput = screen.getByTestId('item-maxTime') as HTMLInputElement;
    const addIconBtn = screen.getByText(
      'components.wizard.stepFour.form.addTransactionTimeItem'
    ) as HTMLButtonElement;

    fireEvent.change(itemMaxTimeInput, {
      target: { value: 'minTime' },
    });

    fireEvent.click(addIconBtn);
  });

  it('test on handleSubmit', async () => {
    renderWithHistoryAndStore(
      <TransactionTimeItem
        key={0}
        title={'title'}
        code={'DAYHOURSWEEK'}
        handleShopListItemRemoved={jest.fn()}
        action={WIZARD_ACTIONS.SUBMIT}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
        data={daysOfWeekIntervals}
        setData={jest.fn()}
      />
    );
    const deleteBtn = screen.getByTestId('delete-button-test') as HTMLButtonElement;
    const itemMinTimeInput = screen.getAllByTestId('item-minTime') as HTMLInputElement[];
    const selectDayOfWeek = screen.getAllByTestId('selectDayOfWeek') as HTMLSelectElement[];
    const removeCircleIcon = screen.getAllByTestId('removeCircleIcon') as HTMLElement[];

    fireEvent.click(deleteBtn);
    fireEvent.change(itemMinTimeInput[0], {
      target: { value: 'minTime' },
    });
    fireEvent.click(selectDayOfWeek[0]);
    fireEvent.change(selectDayOfWeek[0], {
      target: { value: 'WEDNESDAY' },
    });
    fireEvent.click(removeCircleIcon[0]);
  });

  test('render component with startDate undefined', () => {
    const data = [
      {
        daysOfWeek: 'MONDAY',
        startTime: '',
        endTime: '23:59',
      },
    ];

    renderWithHistoryAndStore(
      <TransactionTimeItem
        key={0}
        title={'title'}
        code={'DAYHOURSWEEK'}
        handleShopListItemRemoved={jest.fn()}
        action={WIZARD_ACTIONS.SUBMIT}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
        data={data}
        setData={jest.fn()}
      />
    );
  });

  test('render component with action DRAFT and data undefined', () => {
    renderWithHistoryAndStore(
      <TransactionTimeItem
        key={0}
        title={'title'}
        code={'DAYHOURSWEEK'}
        handleShopListItemRemoved={jest.fn()}
        action={''}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
        data={undefined}
        setData={jest.fn()}
      />
    );
  });
});
