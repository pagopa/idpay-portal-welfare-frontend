import { InitiativeRewardAndTrxRulesDTORewardRule } from '../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { RewardGroupDTO } from '../../api/generated/initiative/RewardGroupDTO';
import { RewardValueDTO } from '../../api/generated/initiative/RewardValueDTO';
import { trascodeRewardRule } from '../intitativeService';

test('test trascodeRewardRule using RewardGroupDTO', () => {
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
  const result: RewardGroupDTO = trascodeRewardRule(value);
  expect(result).toBe(value);
});

test('test trascodeRewardRule using RewardValueDTO', () => {
  const value: InitiativeRewardAndTrxRulesDTORewardRule = {
    _type: 'rewardValue',
    rewardValue: 0.23,
  };
  const result: RewardValueDTO = trascodeRewardRule(value);
  expect(result).toBe(value);
});

test('test trascodeRewardRule using null', () => {
  const result: RewardValueDTO = trascodeRewardRule(
    null as unknown as InitiativeRewardAndTrxRulesDTORewardRule
  );
  expect(result).toBeNull();
});

test('test trascodeRewardRule using invalid type', () => {
  const value: InitiativeRewardAndTrxRulesDTORewardRule = {
    _type: 'dummy',
    rewardValue: 0.23,
  };
  try {
    trascodeRewardRule(value);
    fail('Expected an error');
  } catch (error) {
    // do nothing
  }
});
