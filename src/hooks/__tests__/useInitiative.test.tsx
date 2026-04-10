import { render, waitFor } from '@testing-library/react';
import { Provider, useDispatch, useSelector } from 'react-redux';
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
import { InitiativeDTO } from '../../api/generated/initiative/apiClient';
import { useAppDispatch } from '../../redux/hooks';
import { InitiativeRefundRuleDTO } from '../../api/generated/initiative/apiClient';
import {
  AutomatedCriteriaDtoOrderDirectionEnum as OrderDirectionEnum,
  InitiativeGeneralDtoBeneficiaryTypeEnum as BeneficiaryTypeEnum,
  AccumulatedAmountDtoAccumulatedTypeEnum as AccumulatedTypeEnum,
  RewardLimitsDtoFrequencyEnum as FrequencyEnum,
  SelfCriteriaBoolDtoTypeEnum,
  SelfCriteriaMultiDtoTypeEnum,
  SelfCriteriaTextDtoTypeEnum,
  TimeParameterDtoTimeTypeEnum as TimeTypeEnum,
} from '../../api/generated/initiative/apiClient';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
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

  const mockedUseSelector = useSelector as unknown as jest.Mock;
  const mockedUseDispatch = useDispatch as unknown as jest.Mock;
  let mockDispatch: jest.Mock<any, any>;

  beforeEach(() => {
    mockedUseSelector.mockReturnValue([{ id: 1, text: 'Old Item' }]);
    mockDispatch = jest.fn();
    mockedUseDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
        daysOfWeek: [
          'MONDAY',
          'TUESDAY',
          'WEDNESDAY',
          'THURSDAY',
          'FRIDAY',
          'SATURDAY',
          'SUNDAY',
        ] as any,
      },
    };
    const mockedParseAutomatedCriteriaWithBeneficary: InitiativeDTO = {
      beneficiaryRule: {
        selfDeclarationCriteria: [
          {
            _type: SelfCriteriaBoolDtoTypeEnum.Boolean,
            description: 'string',
            value: true,
            code: 'string',
          },
          {
            _type: SelfCriteriaMultiDtoTypeEnum.Multi,
            description: 'string',
            value: ['value1', 'value2', 'value3'],
            code: 'string',
          },
          {
            _type: SelfCriteriaTextDtoTypeEnum.Text,
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
            _type: SelfCriteriaBoolDtoTypeEnum.Boolean,
            description: 'string',
            value: true,
            code: 'string',
          },
          {
            _type: SelfCriteriaMultiDtoTypeEnum.Multi,
            description: 'string',
            value: ['value1', 'value2', 'value3'],
            code: 'string',
          },
          {
            _type: SelfCriteriaTextDtoTypeEnum.Text,
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
          ] as any,
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
        ] as any,
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
          ] as any,
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
        ] as any,
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
