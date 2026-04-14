import * as t from 'io-ts';
import type {
  RewardGroupsDTO,
  RewardValueDTO as RewardValueDTOType,
} from '../../api/generated/initiative/apiClient';
import { InitiativeRewardRuleDtoRewardValueTypeEnum } from '../../api/generated/initiative/apiClient';
import { decode } from '../io-utils';

type InitiativeRewardAndTrxRulesDTORewardRule = RewardGroupsDTO | RewardValueDTOType;

const RewardGroupDTO = t.unknown;
const RewardValueDTO = t.unknown;

describe('decode', () => {
  test('returns decoded values when validation succeeds', () => {
    const value: InitiativeRewardAndTrxRulesDTORewardRule = {
      _type: 'rewardGroups',
      rewardValueType: InitiativeRewardRuleDtoRewardValueTypeEnum.PERCENTAGE,
      rewardGroups: [
        {
          from: 0,
          to: 5,
          rewardValue: 10,
        },
      ],
    };

    const result = decode(value, RewardGroupDTO) as InitiativeRewardAndTrxRulesDTORewardRule;

    expect(result).toBe(value);
  });

  test('throws when validation fails', () => {
    expect(() => decode('not-a-number' as unknown as number, t.number)).toThrow();
  });

  test('returns falsy values as-is without decoding', () => {
    expect(decode(undefined, RewardValueDTO)).toBeUndefined();
    expect(decode(null, RewardValueDTO)).toBeNull();
    expect(decode(false, t.boolean)).toBe(false);
  });
});
