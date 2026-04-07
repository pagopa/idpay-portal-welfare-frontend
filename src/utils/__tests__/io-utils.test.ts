import * as t from 'io-ts';
import { InitiativeRewardAndTrxRulesDTORewardRule } from '../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { RewardGroupDTO } from '../../api/generated/initiative/RewardGroupDTO';
import { RewardValueDTO } from '../../api/generated/initiative/RewardValueDTO';
import { decode } from '../io-utils';

describe('decode', () => {
  test('returns decoded values when validation succeeds', () => {
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

  test('throws when validation fails', () => {
    expect(() => decode('not-a-number' as unknown as number, t.number)).toThrow();
  });

  test('returns falsy values as-is without decoding', () => {
    // @ts-expect-error deliberate falsy runtime inputs
    expect(decode(undefined, RewardValueDTO)).toBeUndefined();
    // @ts-expect-error deliberate falsy runtime inputs
    expect(decode(null, RewardValueDTO)).toBeNull();
    expect(decode(false, t.boolean)).toBe(false);
  });
});
