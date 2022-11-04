import { InitiativeRewardAndTrxRulesDTORewardRule } from '../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { RewardGroupDTO } from '../../api/generated/initiative/RewardGroupDTO';
import { RewardValueDTO } from '../../api/generated/initiative/RewardValueDTO';
import { decode } from '../io-utils';

test('test decode successful', () => {
  const value: InitiativeRewardAndTrxRulesDTORewardRule = {
    _type: 'rewardGroups',
    rewardGroups: [
      {
        from: 0,
        to: 5,
        rewardValue: 10,
      },
    ],
  };
  const result: RewardGroupDTO = decode(value, RewardGroupDTO);
  expect(result).toBe(value);
});

test('test decode with error', () => {
  const value: InitiativeRewardAndTrxRulesDTORewardRule = {
    _type: 'rewardGroups',
    rewardGroupsDummy: [
      {
        from: 0,
        to: 5,
        rewardValue: 10,
      },
    ],
  };
  try {
    decode(value, RewardGroupDTO);
    fail('Expected an error');
  } catch (error) {
    // do nothing
  }
});
