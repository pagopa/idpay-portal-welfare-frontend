import { InitiativeRewardTypeEnum } from '../../../../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { RewardValueTypeEnum } from '../../../../../api/generated/initiative/InitiativeRewardRuleDTO';
import { MccFilterDTO } from '../../../../../api/generated/initiative/MccFilterDTO';
import { RewardLimit, TrxCount } from '../../../../../model/Initiative';
import {
  checkThresholdChecked,
  checkMccFilterChecked,
  checkTrxCountChecked,
  checkRewardLimitsChecked,
  checkDaysOfWeekIntervalsChecked,
  mapResponse,
  renderShopRuleIcon,
  setError,
  setErrorText,
  handleShopRulesToSubmit,
  mapDataToSend,
} from '../helpers';

const mockedMapResponse = (code: string | undefined) => {
  return [
    {
      checked: true,
      code: code,
      description: 't.string',
      enabled: true,
    },
  ];
};
const switchOptions = [
  'THRESHOLD',
  'MCC',
  'ATECO',
  'TRXCOUNT',
  'REWARDLIMIT',
  'DAYHOURSWEEK',
  'GIS',
];
type Colors =
  | 'inherit'
  | 'disabled'
  | 'action'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
  | undefined;

const threshhold = { from: 2, fromIncluded: false };
describe('testing helper of step four', () => {
  test('Test checkThresholdChecked', () => {
    expect(checkThresholdChecked(threshhold)).toBeTruthy();
    
    expect(checkThresholdChecked(undefined)).toBeFalsy();
  });
  test('checkMccFilterChecked', () => {
    const MccFilter: MccFilterDTO = { allowedList: true, values: ['string', 'string2'] };

    expect(checkMccFilterChecked(undefined)).toBeFalsy();

    expect(checkMccFilterChecked(MccFilter)).toEqual(true);
  });
  test('checkTrxCountChecked', () => {
    const trxCount: TrxCount = { from: 2, fromIncluded: true, to: 3, toIncluded: true };

    const trxCount2: TrxCount = {};

    expect(checkTrxCountChecked(undefined)).toBeFalsy();

    expect(checkTrxCountChecked(trxCount)).toBeTruthy();

    expect(checkTrxCountChecked(trxCount2)).toBeFalsy();
  });

  test('checkRewardLimitsChecked', () => {
    const rewardLimit: Array<RewardLimit> = [{ frequency: 'string', rewardLimit: 2 }];

    const rewardLimit2: Array<RewardLimit> = [];

    expect(checkRewardLimitsChecked(undefined)).toEqual(false);

    expect(checkRewardLimitsChecked(rewardLimit)).toEqual(true);

    expect(checkRewardLimitsChecked(rewardLimit2)).toEqual(false);
  });

  test('checkDaysOfWeekIntervalsChecked', () => {
    expect(checkDaysOfWeekIntervalsChecked(undefined)).toEqual(false);

    expect(
      checkDaysOfWeekIntervalsChecked([
        {
          daysOfWeek: 'string',
          startTime: '',
          endTime: '',
        },
      ])
    ).toEqual(false);
  });

  test('mapResponse step four', () => {
    switchOptions.forEach((item) => {
      expect(mapResponse(mockedMapResponse(item))).toBeDefined();
    });

    expect(mapResponse(mockedMapResponse(undefined))).toBeDefined();

    expect(
      mapResponse([
        {
          checked: true,
          description: 't.string',
          enabled: true,
        },
      ])
    ).toBeDefined();
  });
  test('renderShopRuleIcon', () => {
    switchOptions.forEach((item) => {
      expect(renderShopRuleIcon(item, 2, 'inherit')).toBeDefined();
    });

    expect(renderShopRuleIcon('stringa per default', 2, 'inherit')).toBeNull();
  });

  test('handleShopRulesToSubmit', () => {
    expect(
      handleShopRulesToSubmit(
        [
          {
            code: 'code',
            dispatched: false,
          },
        ],
        'code'
      )
    ).toEqual([
      {
        code: 'code',
        dispatched: true,
      },
    ]);
  });

  test('handleShopRulesToSubmit', () => {
    expect(
      handleShopRulesToSubmit(
        [
          {
            code: 'string',
            dispatched: false,
          },
        ],
        'code'
      )
    ).toEqual([
      {
        code: 'string',
        dispatched: false,
      },
    ]);
  });
  test('setError', () => {
    expect(setError(false, '')).toBeFalsy();

    expect(setError(true, 'string')).toBeTruthy();
  });
  test('setErrorText', () => {
    expect(setErrorText(true, 'string')).toBe('string');
  });
  test('mapDataToSend', () => {
    expect(
      mapDataToSend(
        InitiativeRewardTypeEnum.REFUND,
        {
          _type: 'string',
          rewardValue: 2,
          rewardValueType: RewardValueTypeEnum.PERCENTAGE,
        },
        {
          allowedList: true,
          values: ['string'],
        },
        [
          {
            frequency: 'string',
            rewardLimit: 2,
          },
        ],
        threshhold,
        threshhold,
        [
          {
            daysOfWeek: 'string',
            startTime: 'string',
            endTime: 'string',
          },
        ]
      )
    ).not.toBeNull();
  });
});
