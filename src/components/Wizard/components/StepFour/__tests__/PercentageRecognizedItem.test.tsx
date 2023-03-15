/* eslint-disable react/jsx-no-bind */
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { RewardValueTypeEnum } from '../../../../../api/generated/initiative/InitiativeRewardRuleDTO';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { renderWithHistoryAndStore } from '../../../../../utils/test-utils';
import PercentageRecognizedItem from '../PercentageRecognizedItem';
import { perRec, shopRulesToSubmit } from './ShopRules.test';

window.scrollTo = jest.fn();

describe('<PercentageRecognizedItem />', () => {
  const mockedSetData = jest.fn();
  test('should render correctly the PercentageRecognizedItem component ABSOLUTE', async () => {
    const mockedData = {
      _type: 'rewardValue',
      rewardValue: 2,
      rewardValueType: RewardValueTypeEnum.ABSOLUTE,
    };

    renderWithHistoryAndStore(
      <PercentageRecognizedItem
        code={'PRCREC'}
        action={WIZARD_ACTIONS.DRAFT}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
        data={mockedData}
        setData={mockedSetData}
      />
    );

    const fixedPremium = (await screen.findByTestId('fixed-premium-value')) as HTMLInputElement;
    expect(fixedPremium).toBeInTheDocument;
  });

  it('test PercentageRecognizedItem with data', async () => {
    renderWithHistoryAndStore(
      <PercentageRecognizedItem
        code={'PRCREC'}
        action={WIZARD_ACTIONS.SUBMIT}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
        data={perRec}
        setData={mockedSetData}
      />
    );

    // inital state pecentage input visible
    const percentageRecognized = screen.getByTestId(
      'percentage-recognized-value'
    ) as HTMLInputElement;

    fireEvent.change(percentageRecognized, {
      target: { value: '1' },
    });

    expect(mockedSetData.mock.calls.length).toEqual(1);
    expect(percentageRecognized).toBeInTheDocument();
    // change premium type
    const selectRewardType = screen.getByTestId('rewardValueType-test') as HTMLSelectElement;

    fireEvent.change(selectRewardType, {
      target: { value: 'ABSOLUTE' },
    });
    // fixed premium now visible
    const fixedPremium = (await screen.findByTestId('fixed-premium-value')) as HTMLInputElement;
    fireEvent.change(fixedPremium, {
      target: { value: '1000' },
    });

    expect(fixedPremium.value).toBe('1000');
  });
});
