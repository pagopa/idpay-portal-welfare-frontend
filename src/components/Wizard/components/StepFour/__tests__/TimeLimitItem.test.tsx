/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import TimeLimitItem from '../TimeLimitItem';
import { rewardLimits, shopRulesToSubmit } from './ShopRules.test';
import { renderWithContext } from '../../../../../utils/test-utils';

jest.mock('../../../../../services/intitativeService');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<TimeLimitItem />', () => {
  const data = [{ frequency: 'DAILY', rewardLimit: 2 }];
  window.scrollTo = jest.fn();
  test('should render correctly the TimeLimitItem component', async () => {
    renderWithContext(
      <TimeLimitItem
        key={0}
        title={''}
        code={'REWARDLIMIT'}
        handleShopListItemRemoved={undefined}
        action={WIZARD_ACTIONS.DRAFT}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
        data={rewardLimits}
        setData={jest.fn()}
      />
    );
  });

  it('test on handleSubmit', async () => {
    const data = [{ frequency: 'DAILY', rewardLimit: 2 }];
    renderWithContext(
      <TimeLimitItem
        key={1}
        title={'title'}
        code={'REWARDLIMIT'}
        handleShopListItemRemoved={jest.fn()}
        action={WIZARD_ACTIONS.SUBMIT}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
        data={data}
        setData={jest.fn()}
      />
    );

    const deleteBtn = screen.getByTestId('delete-button-test') as HTMLButtonElement;
    fireEvent.click(deleteBtn);

    const rewardLimit = screen.getAllByTestId('timeLimit[0].rewardLimit') as HTMLInputElement[];

    fireEvent.click(rewardLimit[0]);
    fireEvent.change(rewardLimit[0], { target: { value: 'temp text' } });
    fireEvent.change(rewardLimit[0], { target: { value: '' } });

    const addTimeLimitBtn = screen.getByTestId('addTimeLimitItem-test') as HTMLButtonElement;
    fireEvent.click(addTimeLimitBtn);

    const removeItem = screen.getByTestId('removeCircleIconLimit');
    fireEvent.click(removeItem);

    const selectFrequency = screen.getByTestId('select-frequency-test');
    fireEvent.click(selectFrequency);
    fireEvent.change(selectFrequency, { target: { value: 'MONTHLY' } });
  });

  test('Test TimeLimitItem with rewardLimit 0', async () => {
    const data = [{ frequency: '', rewardLimit: 2 }];
    renderWithContext(
      <TimeLimitItem
        key={0}
        title={''}
        code={'REWARDLIMIT'}
        handleShopListItemRemoved={undefined}
        action={WIZARD_ACTIONS.DRAFT}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
        data={data}
        setData={jest.fn()}
      />
    );
  });

  test('Test TimeLimitItem with key not 0', async () => {
    const data = [
      { frequency: 'DAILY', rewardLimit: 2 },
      { frequency: 'DAILY', rewardLimit: 2 },
    ];
    renderWithContext(
      <TimeLimitItem
        key={1}
        title={''}
        code={'REWARDLIMIT'}
        handleShopListItemRemoved={undefined}
        action={''}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
        data={data}
        setData={jest.fn()}
      />
    );

    const removeItem = screen.getByTestId('removeCircleIconLimit');
    fireEvent.click(removeItem);

    const selectFrequency = screen.getByTestId('select-frequency-test');
    fireEvent.click(selectFrequency);
    fireEvent.change(selectFrequency, { target: { value: 'MONTHLY' } });
  });

  test('Test TimeLimitItem with data undefined', async () => {
    renderWithContext(
      <TimeLimitItem
        key={1}
        title={''}
        code={'REWARDLIMIT'}
        handleShopListItemRemoved={undefined}
        action={WIZARD_ACTIONS.SUBMIT}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
        data={undefined}
        setData={jest.fn()}
      />
    );
  });
});
