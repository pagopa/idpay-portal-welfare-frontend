import React from 'react';
import { renderWithContext } from '../../../../../utils/test-utils';
import RewardType from '../RewardType';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { shopRulesToSubmit } from './ShopRules.test';
import { InitiativeRewardTypeEnum } from '../../../../../api/generated/initiative/InitiativeDTO';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('../../../../../services/intitativeService');

window.scrollTo = jest.fn();

describe('<RewardType />', () => {
  test('should render correctly the RewardType component correctly', async () => {
    renderWithContext(
      <RewardType
        code={'TYPE'}
        action={WIZARD_ACTIONS.DRAFT}
        rewardType={InitiativeRewardTypeEnum.REFUND}
        setRewardType={jest.fn()}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
      />
    );
  });

  test('test form input onChange event', async () => {
    renderWithContext(
      <RewardType
        code={'TYPE'}
        action={WIZARD_ACTIONS.DRAFT}
        rewardType={InitiativeRewardTypeEnum.REFUND}
        setRewardType={jest.fn()}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
      />
    );

    const rewardTypeRadioGroup = screen.getByTestId('initiativeRewardType-test');
    const rewardTypeRefund = screen.getByLabelText(
      'components.wizard.stepFour.form.initiativeRewardType.refund'
    );
    const rewardTypeDiscount = screen.getByLabelText(
      'components.wizard.stepFour.form.initiativeRewardType.discount'
    );

    expect(rewardTypeRadioGroup).toBeInTheDocument();
    expect(rewardTypeRefund).toBeInTheDocument();
    expect(rewardTypeDiscount).toBeInTheDocument();
    fireEvent.click(rewardTypeDiscount);
    expect(rewardTypeDiscount).toBeChecked();
    fireEvent.click(rewardTypeRefund);
    expect(rewardTypeRefund).toBeChecked();
  });
});
