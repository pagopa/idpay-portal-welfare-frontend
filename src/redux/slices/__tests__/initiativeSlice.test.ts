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
  resetInitiative,
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
  setInitiativeUpdateDate,
  setManualCriteria,
  setOrganizationId,
  setStatus,
  stepTwoBeneficiaryKnownSelector,
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
      initiativeReducer(mockedInitialState, setAutomatedCriteria(mockedAutomatedCriteriaItem))
    ).toBeDefined();
    expect(
      initiativeReducer(mockedInitialState, saveAutomatedCriteria([mockedAutomatedCriteriaItem]))
    ).toBeDefined();
    expect(
      initiativeReducer(mockedInitialState, setManualCriteria(mockedManualCriteriaItem))
    ).toBeDefined();
    expect(
      initiativeReducer(mockedInitialState, saveManualCriteria([mockedManualCriteriaItem]))
    ).toBeDefined();
    expect(
      initiativeReducer(
        mockedInitialState,
        saveRewardRule({
          _type: 'string',
          rewardValue: 2,
          rewardValueType: RewardValueTypeEnum.PERCENTAGE,
        })
      )
    ).toBeDefined();
    expect(initiativeReducer(mockedInitialState, saveMccFilter(mockedMccFilterDTO))).toBeDefined();
    expect(
      initiativeReducer(mockedInitialState, saveRewardLimits([mockedRewardLimit]))
    ).toBeDefined();
    expect(initiativeReducer(mockedInitialState, saveThreshold(mockedThreshHold))).toBeDefined();
    expect(initiativeReducer(mockedInitialState, saveTrxCount(mockedTrxCount))).toBeDefined();
    expect(
      initiativeReducer(mockedInitialState, saveDaysOfWeekIntervals([mockedDaysOfWeekInterval]))
    ).toBeDefined();
    expect(initiativeReducer(mockedInitialState, saveRefundRule(mockedRefundRule))).toEqual({
      ...mockedInitialState,
      refundRule: mockedRefundRule,
    });
  });
  test('selectors initiative slice', () => {
    expect(initiativeSelector(store.getState())).toEqual(mockedInitialState);
    expect(generalInfoSelector(store.getState())).not.toBeNull();
    expect(additionalInfoSelector(store.getState())).not.toBeNull();
    expect(stepTwoBeneficiaryKnownSelector(store.getState())).not.toBeNull();
    expect(beneficiaryRuleSelector(store.getState())).not.toBeNull();
    expect(initiativeIdSelector(store.getState())).not.toBeNull();
    expect(initiativeRewardRuleSelector(store.getState())).not.toBeNull();
    expect(initiativeMccFilterSelector(store.getState())).not.toBeNull();
    expect(initiativeRewardLimitsSelector(store.getState())).not.toBeNull();
    expect(initiativeThresholdSelector(store.getState())).not.toBeNull();
    expect(initiativeTrxCountSelector(store.getState())).not.toBeNull();
    expect(initiativeDaysOfWeekIntervalsSelector(store.getState())).not.toBeNull();
    expect(initiativeRefundRulesSelector(store.getState())).not.toBeNull();
    expect(initiativeStatusSelector(store.getState())).not.toBeNull();
  });
});
