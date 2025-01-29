import { render, waitFor } from '@testing-library/react';
import React from 'react';
import * as redux from 'react-redux';
import { Provider } from 'react-redux';
import { createStore } from '../../redux/store';
import {
  parseAdditionalInfo,
  parseGeneralInfo,
  useInitiative,
  parseAutomatedCriteria,
  parseManualCriteria,
  parseRewardRule,
  parseRefundRule,
  parseThreshold,
  parseMccFilter,
  parseTrxCount,
  parseRewardLimits,
  parseDaysOfWeekIntervals,
} from '../useInitiative';
import { InitiativeDTO } from '../../api/generated/initiative/InitiativeDTO';
import { useAppDispatch } from '../../redux/hooks';
import { InitiativeRefundRuleDTO } from '../../api/generated/initiative/InitiativeRefundRuleDTO';
import { OrderDirectionEnum } from '../../api/generated/initiative/AutomatedCriteriaDTO';
import { FrequencyEnum } from '../../api/generated/initiative/RewardLimitsDTO';
import { AccumulatedTypeEnum } from '../../api/generated/initiative/AccumulatedAmountDTO';
import { TimeTypeEnum } from '../../api/generated/initiative/TimeParameterDTO';
import { BeneficiaryTypeEnum } from '../../api/generated/initiative/InitiativeGeneralDTO';

jest.mock('react-router-dom', () => Function());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

const returnVal = {};
const HookWrapper = () => {
  Object.assign(returnVal, useInitiative());
  // result = useInitiative();
  return null;
};

describe('<useInitiaitive />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  // const RenderSuspend = jest.genMockFromModule(useInitiative)

  let spyOnUseSelector: jest.SpyInstance<
    unknown,
    [
      selector: (state: unknown) => unknown,
      equalityFn?: ((left: unknown, right: unknown) => boolean) | undefined
    ]
  >;
  let spyOnUseDispatch;
  let mockDispatch: jest.Mock<any, any>;

  beforeEach(() => {
    // Mock useSelector hook
    spyOnUseSelector = jest.spyOn(redux, 'useSelector');
    spyOnUseSelector.mockReturnValue([{ id: 1, text: 'Old Item' }]);

    // Mock useDispatch hook
    spyOnUseDispatch = jest.spyOn(redux, 'useDispatch');
    // Mock dispatch function returned from useDispatch
    mockDispatch = jest.fn();
    spyOnUseDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('render hook use initiative', async () => {
    render(
      <Provider store={store}>
        <HookWrapper />
      </Provider>
    );
    await waitFor(() => expect(returnVal).toBeDefined());
  });

  test('parseAdditionalInfo', () => {
    expect(
      parseAdditionalInfo({
        initiativeOnIO: false,
        serviceName: 'name',
        serviceArea: 'area',
        serviceScope: 'scope',
        serviceDescription: 'description',
        privacyPolicyUrl: 'privacy',
        termsAndConditions: 'terms',
        assistanceChannels: [{ type: 'web', contact: '' }],
        channels: 'channels',
        tcLink: 'link',
        privacyLink: 'privacy link',
        description: 'data description',
        serviceIO: 'serviceIo',
        logoFileName: 'logoFileName',
        logoURL: 'logo URL',
        logoUploadDate: 'logo date',
      })
    ).not.toBeNull();
  });

  test('parseGeneralInfo', () => {
    const mockedGeneralInfo = (benType?: string) => {
      return {
        beneficiaryType: benType,
        beneficiaryKnown: true,
        budget: '200',
        beneficiaryBudget: '200',
        startDate: '',
        endDate: '',
        rankingEnabled: true,
        rankingStartDate: '',
        rankingEndDate: '',
        descriptionMap: {
          it: 'IT',
          en: 'EN',
          fr: 'FR',
          de: 'DE',
          sl: 'SL',
        },
      };
    };

    expect(parseGeneralInfo(mockedGeneralInfo(BeneficiaryTypeEnum.PF))).not.toBeNull();

    expect(parseGeneralInfo(mockedGeneralInfo(BeneficiaryTypeEnum.PG))).not.toBeNull();
  });

  test('parseAutomatedCriteria', () => {
    const mockedParseAutomatedCriteria: InitiativeDTO = {
      trxRule: {
        mccFilter: { allowedList: true, values: ['string', ''] },
        rewardLimits: [{ frequency: FrequencyEnum.WEEKLY, rewardLimit: 2 }],
        threshold: undefined,
        trxCount: { from: 2, to: 3 },
        daysOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
      },
    };
    const mockedParseAutomatedCriteriaWithBeneficary: InitiativeDTO = {
      beneficiaryRule: {
        selfDeclarationCriteria: [
          {
            _type: 'boolean',
            description: 'string',
            value: true,
            code: 'string',
          },
          {
            _type: 'multi',
            description: 'string',
            value: ['value1', 'value2', 'value3'],
            code: 'string',
          },
          {
            _type: 'text',
            description: 'string',
            value: '',
            code: 'string',
          },
        ],
        automatedCriteria: [
          {
            authority: 'string',
            code: 'string',
            field: 'string',
            operator: 'string',
            value: 'string',
            orderDirection: OrderDirectionEnum.ASC,
            //orderEnabled: OrderDirectionEnum.ASC,
          },
        ],
      },
    };
    expect(parseAutomatedCriteria(mockedParseAutomatedCriteria)).not.toBeNull();
    expect(parseAutomatedCriteria(mockedParseAutomatedCriteriaWithBeneficary)).not.toBeNull();
  });

  test('parseManualCriteria', () => {
    const mockedParseManualCriteria: InitiativeDTO = {
      beneficiaryRule: {
        selfDeclarationCriteria: [
          {
            _type: 'boolean',
            description: 'string',
            value: true,
            code: 'string',
          },
          {
            _type: 'multi',
            description: 'string',
            value: ['value1', 'value2', 'value3'],
            code: 'string',
          },
          {
            _type: 'text',
            description: 'string',
            value: '',
            code: 'string',
          },
        ],
        automatedCriteria: [
          {
            authority: 'string',
            code: 'string',
            field: 'string',
            operator: 'string',
            value: 'string',
            orderDirection: OrderDirectionEnum.ASC,
            //orderEnabled: OrderDirectionEnum.ASC,
          },
        ],
      },
    };
    expect(parseManualCriteria(mockedParseManualCriteria)).not.toBeNull();
  });

  test('parseRewardRule', () => {
    const mockedParseRewardRule: InitiativeDTO = {
      // @ts-ignore
      rewardRule: { _type: 'rewardValue', rewardValue: 'rewardValue' },
    };
    const dispatch = useAppDispatch();
    expect(parseRewardRule(mockedParseRewardRule, dispatch)).not.toBeNull();
  });

  test('parseThreshold', () => {
    const dynamicThreshHold = (threshold: { from: number | undefined; to: number | undefined }) => {
      return {
        trxRule: {
          mccFilter: { allowedList: true, values: ['string', ''] },
          rewardLimits: [{ frequency: FrequencyEnum.WEEKLY, rewardLimit: 2 }],
          threshold: threshold,
          trxCount: { from: 2, to: 3 },
          daysOfWeek: [
            {
              daysOfWeek: [
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
                'SATURDAY',
                'SUNDAY',
              ],
            },
          ],
        },
      };
    };
    const dispatch = useAppDispatch();
    expect(parseThreshold(dynamicThreshHold({ from: 2, to: 3 }), dispatch)).not.toBeNull();
    // @ts-ignore
    expect(parseThreshold(dynamicThreshHold({ from: 2 }), dispatch)).not.toBeNull();
    // @ts-ignore
    expect(parseThreshold(dynamicThreshHold({ to: 3 }), dispatch)).not.toBeNull();
  });

  test('parseMccFilter', () => {
    const mockedParseMccFilter: InitiativeDTO = {
      trxRule: {
        mccFilter: { allowedList: true, values: ['string', ''] },
        rewardLimits: [{ frequency: FrequencyEnum.WEEKLY, rewardLimit: 2 }],
        threshold: { from: 2, to: 3 },
        trxCount: { from: 2, to: 3 },
        daysOfWeek: [
          {
            daysOfWeek: [
              'MONDAY',
              'TUESDAY',
              'WEDNESDAY',
              'THURSDAY',
              'FRIDAY',
              'SATURDAY',
              'SUNDAY',
            ],
          },
        ],
      },
    };
    const dispatch = useAppDispatch();
    expect(parseMccFilter(mockedParseMccFilter, dispatch)).not.toBeNull();
  });

  test('parseTrxCount', () => {
    const dynamicTrxCount = (trxCount: { from: number | undefined; to: number | undefined }) => {
      return {
        trxRule: {
          mccFilter: { allowedList: true, values: ['string', ''] },
          rewardLimits: [{ frequency: FrequencyEnum.WEEKLY, rewardLimit: 2 }],
          threshold: { from: 2, to: 3 },
          trxCount: trxCount,
          daysOfWeek: [
            {
              daysOfWeek: [
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
                'SATURDAY',
                'SUNDAY',
              ],
            },
          ],
        },
      };
    };
    const dispatch = useAppDispatch();
    expect(parseTrxCount(dynamicTrxCount({ from: 2, to: 3 }), dispatch)).not.toBeNull();
    // @ts-ignore
    expect(parseTrxCount(dynamicTrxCount({ from: 2 }), dispatch)).not.toBeNull();
    // @ts-ignore
    expect(parseTrxCount(dynamicTrxCount({ to: 3 }), dispatch)).not.toBeNull();
  });

  test('parseRewardLimits', () => {
    const mockedParseRewardLimits: InitiativeDTO = {
      trxRule: {
        rewardLimits: [{ frequency: FrequencyEnum.WEEKLY, rewardLimit: 2 }],
      },
    };
    const dispatch = useAppDispatch();
    expect(parseRewardLimits(mockedParseRewardLimits, dispatch)).not.toBeNull();
    expect(
      parseRewardLimits(
        {
          trxRule: {
            rewardLimits: [],
          },
        },
        dispatch
      )
    ).not.toBeNull();
  });

  test('parseDaysOfWeekIntervals', () => {
    const mockedParseDaysOfWeekIntervals: InitiativeDTO = {
      trxRule: {
        daysOfWeek: [
          {
            daysOfWeek: [
              'MONDAY',
              'TUESDAY',
              'WEDNESDAY',
              'THURSDAY',
              'FRIDAY',
              'SATURDAY',
              'SUNDAY',
            ],
            intervals: [
              {
                endTime: 'string',
                startTime: 'string',
              },
            ],
          },
        ],
      },
    };
    const dispatch = useAppDispatch();
    expect(parseDaysOfWeekIntervals(mockedParseDaysOfWeekIntervals, dispatch)).not.toBeNull();
  });

  test('parseRefundRule', () => {
    const mockedRefundRule: InitiativeRefundRuleDTO = {
      accumulatedAmount: {
        accumulatedType: AccumulatedTypeEnum.BUDGET_EXHAUSTED,
        refundThreshold: 0,
      },
      timeParameter: {
        timeType: TimeTypeEnum.CLOSED,
      },
      additionalInfo: {
        identificationCode: 'string',
      },
    };

    const mockedTimeParameterNoLength: InitiativeRefundRuleDTO = {
      accumulatedAmount: {
        accumulatedType: AccumulatedTypeEnum.BUDGET_EXHAUSTED,
        refundThreshold: 0,
      },
      // @ts-ignore
      timeParameter: {},
      additionalInfo: {
        identificationCode: 'string',
      },
    };

    const mockedAccumulatedNoLength: InitiativeRefundRuleDTO = {
      // @ts-ignore
      accumulatedAmount: {},
      timeParameter: { timeType: TimeTypeEnum.CLOSED },
      additionalInfo: {
        identificationCode: 'string',
      },
    };

    expect(parseRefundRule(mockedRefundRule)).toBeDefined();
    expect(parseRefundRule(mockedTimeParameterNoLength)).toBeDefined();
    expect(parseRefundRule(mockedAccumulatedNoLength)).toBeDefined();
  });
});
