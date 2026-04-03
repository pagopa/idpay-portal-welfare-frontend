import {
  AdditionalInfo,
  AutomatedCriteriaItem,
  DaysOfWeekInterval,
  Initiative,
  ManualCriteriaItem,
  RefundRule,
  RewardLimit,
  Threshold,
  TrxCount,
} from '../../../model/Initiative';
import {
  additionalInfoSelector,
  beneficiaryRuleSelector,
  generalInfoSelector,
  initiativeDaysOfWeekIntervalsSelector,
  initiativeIdSelector,
  initiativeMccFilterSelector,
  initiativeReducer,
  initiativeRefundRulesSelector,
  initiativeRewardLimitsSelector,
  initiativeRewardRuleSelector,
  initiativeSelector,
  initiativeStatusSelector,
  initiativeThresholdSelector,
  initiativeTrxCountSelector,
  initiativeBeneficiaryTypeSelector,
  resetInitiative,
  saveApiKeyClientAssertion,
  saveApiKeyClientId,
  saveAutomatedCriteria,
  saveDaysOfWeekIntervals,
  saveManualCriteria,
  saveMccFilter,
  saveRefundRule,
  saveRewardLimits,
  saveRewardRule,
  saveThreshold,
  saveTrxCount,
  setAdditionalInfo,
  setAutomatedCriteria,
  setGeneralInfo,
  setInitiative,
  setInitiativeCreationDate,
  setInitiativeId,
  setInitiativeName,
  setInitiativeLogo,
  setInitiativeUpdateDate,
  setManualCriteria,
  setOrganizationId,
  setStatus,
  stepTwoBeneficiaryKnownSelector,
  stepTwoBeneficiaryTypeSelector,
  stepTwoRankingEnabledSelector,
} from '../initiativeSlice';

import { BeneficiaryTypeEnum } from '../../../api/generated/initiative/InitiativeGeneralDTO';
import { RewardValueTypeEnum } from '../../../api/generated/initiative/InitiativeRewardRuleDTO';
import { MccFilterDTO } from '../../../api/generated/initiative/MccFilterDTO';
import { GeneralInfo } from '../../../model/Initiative';
import { createStore } from '../../store';

describe('use Initiative slice', () => {
  const mockedInitialState: Initiative = {
    initiativeId: undefined,
    initiativeRewardType: undefined,
    organizationId: undefined,
    status: undefined,
    initiativeName: undefined,
    creationDate: undefined,
    updateDate: undefined,
    additionalInfo: {
      initiativeOnIO: true,
      serviceId:'',
      serviceName: '',
      serviceArea: '',
      serviceDescription: '',
      privacyPolicyUrl: '',
      termsAndConditions: '',
      assistanceChannels: [{ type: 'web', contact: '' }],
      logoFileName: '',
      logoURL: '',
      logoUploadDate: '',
    },
    generalInfo: {
      beneficiaryType: BeneficiaryTypeEnum.PF,
      familyUnitComposition: undefined,
      beneficiaryKnown: 'false',
      budget: '',
      beneficiaryBudget: '',
      startDate: '',
      endDate: '',
      rankingStartDate: '',
      rankingEndDate: '',
      rankingEnabled: 'false',
      introductionTextDE: '',
      introductionTextEN: '',
      introductionTextFR: '',
      introductionTextIT: '',
      introductionTextSL: '',
    },
    beneficiaryRule: {
      apiKeyClientId: undefined,
      apiKeyClientAssertion: undefined,
      selfDeclarationCriteria: [],
      automatedCriteria: [],
    },
    rewardRule: {
      _type: 'rewardValue',
      rewardValue: undefined,
      rewardValueType: RewardValueTypeEnum.PERCENTAGE,
    },
    trxRule: {
      mccFilter: {
        allowedList: false,
        values: [],
      },
      rewardLimits: [{ frequency: 'DAILY', rewardLimit: undefined }],
      threshold: { from: undefined, fromIncluded: true, to: undefined, toIncluded: true },
      trxCount: { from: undefined, fromIncluded: true, to: undefined, toIncluded: true },
      daysOfWeekIntervals: [{ daysOfWeek: 'MONDAY', startTime: '', endTime: '' }],
    },
    refundRule: {
      reimbursmentQuestionGroup: '',
      timeParameter: '',
      accumulatedAmount: '',
      additionalInfo: '',
      reimbursementThreshold: '',
    },
  };
  const mockedDate: Date = new Date();
  const mockedGeneralInfo: GeneralInfo = {
    beneficiaryType: BeneficiaryTypeEnum['PF'],
    beneficiaryKnown: undefined,
    budget: '',
    beneficiaryBudget: '',
    startDate: mockedDate,
    endDate: mockedDate,
    rankingStartDate: mockedDate,
    rankingEndDate: mockedDate,
    rankingEnabled: 'true',
    introductionTextIT: '',
    introductionTextEN: '',
    introductionTextFR: '',
    introductionTextDE: '',
    introductionTextSL: '',
  };
  const mockedAdditionalInfo: AdditionalInfo = {
    initiativeOnIO: undefined,
    serviceId:undefined,
    serviceName: undefined,
    serviceArea: undefined,
    serviceDescription: undefined,
    privacyPolicyUrl: undefined,
    termsAndConditions: undefined,
    assistanceChannels: [],
    logoFileName: '',
    logoURL: '',
    logoUploadDate: '',
  };
  const mockedAutomatedCriteriaItem: AutomatedCriteriaItem = {};
  const mockedManualCriteriaItem: ManualCriteriaItem = {
    description: '',
    code: '',
  };
  const mockedRefundRule: RefundRule = {
    reimbursmentQuestionGroup: '',
    timeParameter: '',
    accumulatedAmount: undefined,
    additionalInfo: '',
    reimbursementThreshold: '',
  };
  const mockedMccFilterDTO: MccFilterDTO = {};
  const mockedRewardLimit: RewardLimit = {
    frequency: '',
    rewardLimit: undefined,
  };
  const mockedThreshHold: Threshold = {};
  const mockedTrxCount: TrxCount = {};
  const mockedDaysOfWeekInterval: DaysOfWeekInterval = {
    daysOfWeek: '',
    startTime: '',
    endTime: '',
  };
  const store = createStore();
  test('actions initiative slice', () => {
    expect(initiativeReducer(mockedInitialState, resetInitiative())).toEqual(mockedInitialState);
    expect(initiativeReducer(mockedInitialState, setInitiative(mockedInitialState))).toEqual(
      mockedInitialState
    );
    expect(initiativeReducer(mockedInitialState, setInitiativeId('initiativeId'))).toEqual({
      ...mockedInitialState,
      initiativeId: 'initiativeId',
    });
    expect(initiativeReducer(mockedInitialState, setOrganizationId('organizationId'))).toEqual({
      ...mockedInitialState,
      organizationId: 'organizationId',
    });
    expect(initiativeReducer(mockedInitialState, setStatus('status'))).toEqual({
      ...mockedInitialState,
      status: 'status',
    });
    expect(initiativeReducer(mockedInitialState, setInitiativeName('initiativeName'))).toEqual({
      ...mockedInitialState,
      initiativeName: 'initiativeName',
    });
    expect(initiativeReducer(mockedInitialState, setInitiativeCreationDate(mockedDate))).toEqual({
      ...mockedInitialState,
      creationDate: mockedDate,
    });
    expect(initiativeReducer(mockedInitialState, setInitiativeUpdateDate(mockedDate))).toEqual({
      ...mockedInitialState,
      updateDate: mockedDate,
    });
    expect(initiativeReducer(mockedInitialState, setGeneralInfo(mockedGeneralInfo))).toEqual({
      ...mockedInitialState,
      generalInfo: mockedGeneralInfo,
    });
    expect(initiativeReducer(mockedInitialState, setAdditionalInfo(mockedAdditionalInfo))).toEqual({
      ...mockedInitialState,
      additionalInfo: mockedAdditionalInfo,
    });
    expect(
      initiativeReducer(
        mockedInitialState,
        setInitiativeLogo({
          logoFileName: 'logo.png',
          logoURL: 'https://example.test/logo.png',
          logoUploadDate: '2024-01-01',
        })
      )
    ).toEqual({
      ...mockedInitialState,
      additionalInfo: {
        ...mockedInitialState.additionalInfo,
        logoFileName: 'logo.png',
        logoURL: 'https://example.test/logo.png',
        logoUploadDate: '2024-01-01',
      },
    });
    expect(initiativeReducer(mockedInitialState, saveApiKeyClientId('client-id'))).toEqual({
      ...mockedInitialState,
      beneficiaryRule: {
        ...mockedInitialState.beneficiaryRule,
        apiKeyClientId: 'client-id',
      },
    });
    expect(initiativeReducer(mockedInitialState, saveApiKeyClientAssertion('client-assertion'))).toEqual({
      ...mockedInitialState,
      beneficiaryRule: {
        ...mockedInitialState.beneficiaryRule,
        apiKeyClientAssertion: 'client-assertion',
      },
    });

    expect(
      initiativeReducer(mockedInitialState, setAutomatedCriteria(mockedAutomatedCriteriaItem))
    ).toEqual({
      ...mockedInitialState,
      beneficiaryRule: {
        ...mockedInitialState.beneficiaryRule,
        automatedCriteria: [mockedAutomatedCriteriaItem],
      },
    });
    expect(
      initiativeReducer(mockedInitialState, saveAutomatedCriteria([mockedAutomatedCriteriaItem]))
    ).toEqual({
      ...mockedInitialState,
      beneficiaryRule: {
        ...mockedInitialState.beneficiaryRule,
        automatedCriteria: [mockedAutomatedCriteriaItem],
      },
    });
    expect(
      initiativeReducer(mockedInitialState, setManualCriteria(mockedManualCriteriaItem))
    ).toEqual({
      ...mockedInitialState,
      beneficiaryRule: {
        ...mockedInitialState.beneficiaryRule,
        selfDeclarationCriteria: [mockedManualCriteriaItem],
      },
    });
    expect(
      initiativeReducer(mockedInitialState, saveManualCriteria([mockedManualCriteriaItem]))
    ).toEqual({
      ...mockedInitialState,
      beneficiaryRule: {
        ...mockedInitialState.beneficiaryRule,
        selfDeclarationCriteria: [mockedManualCriteriaItem],
      },
    });
    expect(
      initiativeReducer(
        mockedInitialState,
        saveRewardRule({
          _type: 'string',
          rewardValue: 2,
          rewardValueType: RewardValueTypeEnum.PERCENTAGE,
        })
      )
    ).toEqual({
      ...mockedInitialState,
      rewardRule: {
        _type: 'string',
        rewardValue: 2,
        rewardValueType: RewardValueTypeEnum.PERCENTAGE,
      },
    });
    expect(
      initiativeReducer(
        mockedInitialState,
        saveRewardRule({
          _type: 'string',
          rewardValueType: RewardValueTypeEnum.PERCENTAGE,
        } as any)
      )
    ).toEqual({
      ...mockedInitialState,
      rewardRule: {
        _type: 'string',
        rewardValue: undefined,
        rewardValueType: RewardValueTypeEnum.PERCENTAGE,
      },
    });
    expect(initiativeReducer(mockedInitialState, saveMccFilter(mockedMccFilterDTO))).toEqual({
      ...mockedInitialState,
      trxRule: {
        ...mockedInitialState.trxRule,
        mccFilter: {
          allowedList: mockedMccFilterDTO.allowedList,
          values: mockedMccFilterDTO.values,
        },
      },
    });
    expect(
      initiativeReducer(mockedInitialState, saveRewardLimits([mockedRewardLimit]))
    ).toEqual({
      ...mockedInitialState,
      trxRule: {
        ...mockedInitialState.trxRule,
        rewardLimits: [mockedRewardLimit],
      },
    });
    expect(initiativeReducer(mockedInitialState, saveThreshold(mockedThreshHold))).toEqual({
      ...mockedInitialState,
      trxRule: {
        ...mockedInitialState.trxRule,
        threshold: {
          from: mockedThreshHold.from,
          fromIncluded: mockedThreshHold.fromIncluded,
          to: mockedThreshHold.to,
          toIncluded: mockedThreshHold.toIncluded,
        },
      },
    });
    expect(initiativeReducer(mockedInitialState, saveTrxCount(mockedTrxCount))).toEqual({
      ...mockedInitialState,
      trxRule: {
        ...mockedInitialState.trxRule,
        trxCount: {
          from: mockedTrxCount.from,
          fromIncluded: mockedTrxCount.fromIncluded,
          to: mockedTrxCount.to,
          toIncluded: mockedTrxCount.toIncluded,
        },
      },
    });
    expect(
      initiativeReducer(mockedInitialState, saveDaysOfWeekIntervals([mockedDaysOfWeekInterval]))
    ).toEqual({
      ...mockedInitialState,
      trxRule: {
        ...mockedInitialState.trxRule,
        daysOfWeekIntervals: [mockedDaysOfWeekInterval],
      },
    });
    expect(initiativeReducer(mockedInitialState, saveRefundRule(mockedRefundRule))).toEqual({
      ...mockedInitialState,
      refundRule: mockedRefundRule,
    });
  });

  test('setGeneralInfo normalizes optional fields to empty strings when omitted', () => {
    const result = initiativeReducer(
      mockedInitialState,
      setGeneralInfo({
        beneficiaryType: BeneficiaryTypeEnum.PF,
        beneficiaryKnown: undefined,
        rankingEnabled: undefined,
        budget: '1000',
        beneficiaryBudget: '500',
        startDate: undefined,
        endDate: undefined,
        rankingStartDate: undefined,
        rankingEndDate: undefined,
        introductionTextIT: undefined,
        introductionTextEN: undefined,
        introductionTextFR: undefined,
        introductionTextDE: undefined,
        introductionTextSL: undefined,
      })
    );

    expect(result.generalInfo).toEqual({
      beneficiaryType: BeneficiaryTypeEnum.PF,
      familyUnitComposition: undefined,
      beneficiaryKnown: undefined,
      rankingEnabled: undefined,
      budget: '1000',
      beneficiaryBudget: '500',
      startDate: '',
      endDate: '',
      rankingStartDate: '',
      rankingEndDate: '',
      introductionTextIT: '',
      introductionTextEN: '',
      introductionTextFR: '',
      introductionTextDE: '',
      introductionTextSL: '',
    });
  });

  test('setInitiative keeps only the fields it owns', () => {
    const result = initiativeReducer(
      {
        ...mockedInitialState,
        initiativeId: 'old-id',
        organizationId: 'old-org',
        status: 'old-status',
        initiativeName: 'existing-name',
      },
      setInitiative({
        ...mockedInitialState,
        initiativeId: 'new-id',
        organizationId: 'new-org',
        status: 'new-status',
        generalInfo: {
          ...mockedGeneralInfo,
          budget: '777',
        },
      })
    );

    expect(result).toEqual({
      ...mockedInitialState,
      initiativeId: 'new-id',
      organizationId: 'new-org',
      status: 'new-status',
      initiativeName: 'existing-name',
      generalInfo: {
        ...mockedGeneralInfo,
        budget: '777',
      },
    });
  });

  test('setAutomatedCriteria replaces an existing item with the same field', () => {
    const initialState = {
      ...mockedInitialState,
      beneficiaryRule: {
        ...mockedInitialState.beneficiaryRule,
        automatedCriteria: [
          { field: 'age', operator: 'gte', value: '18' },
          { field: 'isee', operator: 'lte', value: '15000' },
        ],
      },
    };

    const result = initiativeReducer(
      initialState,
      setAutomatedCriteria({
        field: 'isee',
        operator: 'lte',
        value: '20000',
      })
    );

    expect(result.beneficiaryRule.automatedCriteria).toEqual([
      {
        field: 'isee',
        operator: 'lte',
        value: '20000',
      },
    ]);
  });

  test('setAutomatedCriteria appends when no matching field exists', () => {
    const initialState = {
      ...mockedInitialState,
      beneficiaryRule: {
        ...mockedInitialState.beneficiaryRule,
        automatedCriteria: [{ field: 'age', operator: 'gte', value: '18' }],
      },
    };

    const result = initiativeReducer(
      initialState,
      setAutomatedCriteria({
        field: 'isee',
        operator: 'lte',
        value: '15000',
      })
    );

    expect(result.beneficiaryRule.automatedCriteria).toEqual([
      { field: 'age', operator: 'gte', value: '18' },
      { field: 'isee', operator: 'lte', value: '15000' },
    ]);
  });

  test('setManualCriteria replaces an existing item with the same code', () => {
    const initialState = {
      ...mockedInitialState,
      beneficiaryRule: {
        ...mockedInitialState.beneficiaryRule,
        selfDeclarationCriteria: [
          { code: 'age', description: 'Age' },
          { code: 'isee', description: 'ISEE old' },
        ],
      },
    };

    const result = initiativeReducer(
      initialState,
      setManualCriteria({
        code: 'isee',
        description: 'ISEE new',
      })
    );

    expect(result.beneficiaryRule.selfDeclarationCriteria).toEqual([
      {
        code: 'isee',
        description: 'ISEE new',
      },
    ]);
  });

  test('setManualCriteria appends when no matching code exists', () => {
    const initialState = {
      ...mockedInitialState,
      beneficiaryRule: {
        ...mockedInitialState.beneficiaryRule,
        selfDeclarationCriteria: [{ code: 'age', description: 'Age' }],
      },
    };

    const result = initiativeReducer(
      initialState,
      setManualCriteria({
        code: 'isee',
        description: 'ISEE',
      })
    );

    expect(result.beneficiaryRule.selfDeclarationCriteria).toEqual([
      { code: 'age', description: 'Age' },
      { code: 'isee', description: 'ISEE' },
    ]);
  });
  test('selectors initiative slice', () => {
    expect(initiativeSelector(store.getState())).toEqual(mockedInitialState);
    expect(generalInfoSelector(store.getState())).not.toBeNull();
    expect(additionalInfoSelector(store.getState())).not.toBeNull();
    expect(stepTwoBeneficiaryKnownSelector(store.getState())).toBe('false');
    expect(stepTwoRankingEnabledSelector(store.getState())).toBe('false');
    expect(stepTwoBeneficiaryTypeSelector(store.getState())).toBe(BeneficiaryTypeEnum.PF);
    expect(beneficiaryRuleSelector(store.getState())).toEqual(mockedInitialState.beneficiaryRule);
    expect(initiativeIdSelector(store.getState())).not.toBeNull();
    expect(initiativeRewardRuleSelector(store.getState())).toEqual(mockedInitialState.rewardRule);
    expect(initiativeMccFilterSelector(store.getState())).toEqual(
      mockedInitialState.trxRule.mccFilter
    );
    expect(initiativeRewardLimitsSelector(store.getState())).toEqual(
      mockedInitialState.trxRule.rewardLimits
    );
    expect(initiativeThresholdSelector(store.getState())).toEqual(mockedInitialState.trxRule.threshold);
    expect(initiativeTrxCountSelector(store.getState())).toEqual(mockedInitialState.trxRule.trxCount);
    expect(initiativeDaysOfWeekIntervalsSelector(store.getState())).toEqual(
      mockedInitialState.trxRule.daysOfWeekIntervals
    );
    expect(initiativeRefundRulesSelector(store.getState())).toEqual(mockedInitialState.refundRule);
    expect(initiativeStatusSelector(store.getState())).toBeUndefined();
    expect(initiativeBeneficiaryTypeSelector(store.getState())).toBe(BeneficiaryTypeEnum.PF);
  });
});
