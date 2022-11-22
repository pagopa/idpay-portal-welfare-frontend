import {
  AdditionalInfo,
  AutomatedCriteriaItem,
  GeneralInfo,
  automatedCriteria2AutomatedCriteriaItem,
  InitiativeAdditional2AdditionalInfo,
  initiativeGeneral2GeneralInfo,
  Initiative2Initiative,
  Initiative,
} from '../Initiative';
import { TypeEnum } from '../../api/generated/initiative/ChannelDTO';
import { ServiceScopeEnum } from '../../api/generated/initiative/InitiativeAdditionalDTO';
import { BeneficiaryTypeEnum } from '../../utils/constants';
import { AccumulatedTypeEnum } from '../../api/generated/initiative/AccumulatedAmountDTO';

const mockedGeneralBody: GeneralInfo = {
  beneficiaryType: BeneficiaryTypeEnum.PF,
  beneficiaryKnown: 'false',
  budget: '8515',
  beneficiaryBudget: '801',
  rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
  rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
  startDate: new Date('2022-10-01T00:00:00.000Z'),
  endDate: new Date('2023-01-31T00:00:00.000Z'),
  introductionTextIT: undefined,
  introductionTextEN: undefined,
  introductionTextFR: undefined,
  introductionTextDE: undefined,
  introductionTextSL: undefined,
  rankingEnabled: 'false',
};

const mockedAdditionalInfo: AdditionalInfo = {
  initiativeOnIO: true,
  serviceName: 'newStepOneTest',
  serviceArea: ServiceScopeEnum.NATIONAL,
  serviceDescription: 'newStepOneTest',
  privacyPolicyUrl: 'http://test.it',
  termsAndConditions: 'http://test.it',
  assistanceChannels: [{ type: TypeEnum.web, contact: 'http://test.it' }],
};

const mockedAutomatedCriteria: AutomatedCriteriaItem = {
  authority: 'AUTH1',
  code: 'BIRTHDATE',
  field: 'year',
  operator: 'GT',
  value: '18',
  value2: '',
};

export const mockedInitiative: Initiative = {
  initiativeId: '62e29002aac2e94cfa3763dd',
  initiativeName: 'prova313',
  organizationId: '2f63a151-da4e-4e1e-acf9-adecc0c4d727',
  status: 'DRAFT',
  creationDate: new Date('2022-07-28T13:32:50.002'),
  updateDate: new Date('2022-08-09T08:35:36.516'),
  generalInfo: {
    beneficiaryType: BeneficiaryTypeEnum.PF,
    beneficiaryKnown: 'false',
    budget: '8515',
    beneficiaryBudget: '801',
    rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
    rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
    startDate: new Date('2022-10-01T00:00:00.000Z'),
    endDate: new Date('2023-01-31T00:00:00.000Z'),
    introductionTextIT: 'string',
    introductionTextEN: 'string',
    introductionTextFR: 'string',
    introductionTextDE: 'string',
    introductionTextSL: 'string',
    rankingEnabled: 'false',
  },
  additionalInfo: {
    initiativeOnIO: true,
    serviceName: 'prova313',
    serviceArea: ServiceScopeEnum.NATIONAL,
    serviceDescription: 'newStepOneTest',
    privacyPolicyUrl: 'http://test.it',
    termsAndConditions: 'http://test.it',
    assistanceChannels: [{ type: TypeEnum.web, contact: 'http://test.it' }],
  },
  beneficiaryRule: {
    selfDeclarationCriteria: [
      {
        _type: 'boolean',
        description: 'string',
        code: 'string',
      },
      {
        _type: 'multi',
        description: 'string',
        code: 'string',
        multiValue: [],
      },
    ],
    automatedCriteria: [
      {
        authority: 'AUTH1',
        code: 'BIRTHDATE',
        field: 'year',
        operator: 'GT',
        value: '18',
      },
      {
        authority: 'AUTH1',
        code: 'BIRTHDATE',
        field: 'year',
        operator: 'EQ',
        value: '18',
      },
      {
        authority: 'AUTH1',
        code: 'BIRTHDATE',
        field: 'year',
        operator: 'LT',
        value: '18',
      },
      {
        authority: 'AUTH1',
        code: 'BIRTHDATE',
        field: 'year',
        operator: 'GE',
        value: '18',
      },
      {
        authority: 'AUTH1',
        code: 'BIRTHDATE',
        field: 'year',
        operator: 'LE',
        value: '18',
      },
      {
        authority: 'AUTH1',
        code: 'BIRTHDATE',
        field: 'year',
        operator: 'BTW_OPEN',
        value: '18',
      },
      {
        authority: 'INPS',
        code: 'ISEE',
        field: 'ISEE',
        operator: 'GT',
        value: '40000',
      },
      {
        authority: 'INPS',
        code: 'RESIDENCE',
        field: 'ISEE',
        operator: 'GT',
        value: '40000',
      },
      {
        authority: 'INPS',
        code: 'RESIDENCE',
        field: 'ISEE',
        operator: 'EQ',
        value: '40000',
      },
      {
        authority: 'INPS',
        code: 'RESIDENCE',
        field: 'ISEE',
        operator: 'NOT_EQ',
        value: '40000',
      },
      {
        authority: 'INPS',
        code: '',
        field: 'ISEE',
        operator: 'GT',
        value: '40000',
      },
      {
        authority: 'INPS',
        code: 'ISEE',
        field: 'ISEE',
        operator: 'LT',
        value: '40000',
      },
      {
        authority: 'INPS',
        code: 'ISEE',
        field: 'ISEE',
        operator: 'GE',
        value: '40000',
      },
      {
        authority: 'INPS',
        code: 'ISEE',
        field: 'ISEE',
        operator: 'LE',
        value: '40000',
      },
      {
        authority: 'INPS',
        code: 'ISEE',
        field: 'ISEE',
        operator: 'BTW_OPEN',
        value: '40000',
      },
      {
        authority: 'INPS',
        code: 'ISEE',
        field: 'ISEE',
        operator: 'EQ',
        value: '40000',
      },
    ],
  },
  rewardRule: { _type: 'rewardValue', rewardValue: 1 },
  trxRule: {
    mccFilter: { allowedList: true, values: ['string', ''] },
    rewardLimits: [{ frequency: 'string', rewardLimit: 2 }],
    threshold: undefined,
    trxCount: {from: 2, to: 3},
    daysOfWeekIntervals: [
      {
        daysOfWeek: 'string',
        startTime: 'string',
        endTime: 'string',
      },
    ],
  },
  refundRule: {
    reimbursementThreshold: AccumulatedTypeEnum.THRESHOLD_REACHED,
    reimbursmentQuestionGroup: 'true',
    additionalInfo: 'aaaaaa',
    timeParameter: '',
    accumulatedAmount: '',
  },
};

test('Test initiativeGeneral2GeneralInfo', () => {
  const generalInfo = initiativeGeneral2GeneralInfo(mockedGeneralBody);
  expect(generalInfo).toStrictEqual({
    beneficiaryType: BeneficiaryTypeEnum.PF,
    beneficiaryKnown: 'false',
    budget: '8515',
    beneficiaryBudget: '801',
    rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
    rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
    startDate: new Date('2022-10-01T00:00:00.000Z'),
    endDate: new Date('2023-01-31T00:00:00.000Z'),
  });
});

test('Test InitiativeAdditional2AdditionalInfo', () => {
  const additionalInfo = InitiativeAdditional2AdditionalInfo(mockedAdditionalInfo);
  expect(additionalInfo).toStrictEqual({
    initiativeOnIO: true,
    serviceName: 'newStepOneTest',
    serviceArea: ServiceScopeEnum.NATIONAL,
    serviceDescription: 'newStepOneTest',
    privacyPolicyUrl: 'http://test.it',
    termsAndConditions: 'http://test.it',
    assistanceChannels: [{ type: TypeEnum.web, contact: 'http://test.it' }],
  });
});

test('Test automatedCriteria2AutomatedCriteriaItem', () => {
  const automatedCriteria = automatedCriteria2AutomatedCriteriaItem(mockedAutomatedCriteria);
  expect(automatedCriteria).toStrictEqual({
    authority: 'AUTH1',
    code: 'BIRTHDATE',
    field: 'year',
    operator: 'GT',
    value: '18',
    value2: '',
  });
});

test('Test initiative2Initiative', () => {
  const initiative = Initiative2Initiative(mockedInitiative);
  expect(initiative).toStrictEqual({
    initiativeId: '62e29002aac2e94cfa3763dd',
    initiativeName: 'prova313',
    organizationId: '2f63a151-da4e-4e1e-acf9-adecc0c4d727',
    status: 'DRAFT',
    creationDate: new Date('2022-07-28T13:32:50.002'),
    updateDate: new Date('2022-08-09T08:35:36.516'),
    generalInfo: {
      beneficiaryType: BeneficiaryTypeEnum.PF,
      beneficiaryKnown: 'false',
      budget: '8515',
      beneficiaryBudget: '801',
      rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
      rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
      startDate: new Date('2022-10-01T00:00:00.000Z'),
      endDate: new Date('2023-01-31T00:00:00.000Z'),
      introductionTextIT: 'string',
      introductionTextEN: 'string',
      introductionTextFR: 'string',
      introductionTextDE: 'string',
      introductionTextSL: 'string',
      rankingEnabled: 'false',
    },
    additionalInfo: {
      initiativeOnIO: true,
      serviceName: 'prova313',
      serviceArea: ServiceScopeEnum.NATIONAL,
      serviceDescription: 'newStepOneTest',
      privacyPolicyUrl: 'http://test.it',
      termsAndConditions: 'http://test.it',
      assistanceChannels: [{ type: TypeEnum.web, contact: 'http://test.it' }],
    },
    beneficiaryRule: {
      selfDeclarationCriteria: [
        {
          _type: 'boolean',
          description: 'string',
          code: 'string',
        },
        {
          _type: 'multi',
          description: 'string',
          code: 'string',
          multiValue: [],
        },
      ],
      automatedCriteria: [
        {
          authority: 'AUTH1',
          code: 'BIRTHDATE',
          field: 'year',
          operator: 'GT',
          value: '18',
        },
        {
          authority: 'AUTH1',
          code: 'BIRTHDATE',
          field: 'year',
          operator: 'EQ',
          value: '18',
        },
        {
          authority: 'AUTH1',
          code: 'BIRTHDATE',
          field: 'year',
          operator: 'LT',
          value: '18',
        },
        {
          authority: 'AUTH1',
          code: 'BIRTHDATE',
          field: 'year',
          operator: 'GE',
          value: '18',
        },
        {
          authority: 'AUTH1',
          code: 'BIRTHDATE',
          field: 'year',
          operator: 'LE',
          value: '18',
        },
        {
          authority: 'AUTH1',
          code: 'BIRTHDATE',
          field: 'year',
          operator: 'BTW_OPEN',
          value: '18',
        },
        {
          authority: 'INPS',
          code: 'ISEE',
          field: 'ISEE',
          operator: 'GT',
          value: '40000',
        },
        {
          authority: 'INPS',
          code: 'RESIDENCE',
          field: 'ISEE',
          operator: 'GT',
          value: '40000',
        },
        {
          authority: 'INPS',
          code: 'RESIDENCE',
          field: 'ISEE',
          operator: 'EQ',
          value: '40000',
        },
        {
          authority: 'INPS',
          code: 'RESIDENCE',
          field: 'ISEE',
          operator: 'NOT_EQ',
          value: '40000',
        },
        {
          authority: 'INPS',
          code: '',
          field: 'ISEE',
          operator: 'GT',
          value: '40000',
        },
        {
          authority: 'INPS',
          code: 'ISEE',
          field: 'ISEE',
          operator: 'LT',
          value: '40000',
        },
        {
          authority: 'INPS',
          code: 'ISEE',
          field: 'ISEE',
          operator: 'GE',
          value: '40000',
        },
        {
          authority: 'INPS',
          code: 'ISEE',
          field: 'ISEE',
          operator: 'LE',
          value: '40000',
        },
        {
          authority: 'INPS',
          code: 'ISEE',
          field: 'ISEE',
          operator: 'BTW_OPEN',
          value: '40000',
        },
        {
          authority: 'INPS',
          code: 'ISEE',
          field: 'ISEE',
          operator: 'EQ',
          value: '40000',
        },
      ],
    },
    rewardRule: { _type: 'rewardValue', rewardValue: 1 },
    trxRule: {
      mccFilter: { allowedList: true, values: ['string', ''] },
      rewardLimits: [{ frequency: 'string', rewardLimit: 2 }],
      threshold: undefined,
      trxCount: {from: 2, to: 3},
      daysOfWeekIntervals: [
        {
          daysOfWeek: 'string',
          startTime: 'string',
          endTime: 'string',
        },
      ],
    },
    refundRule: {
      reimbursementThreshold: AccumulatedTypeEnum.THRESHOLD_REACHED,
      reimbursmentQuestionGroup: 'true',
      additionalInfo: 'aaaaaa',
      timeParameter: '',
      accumulatedAmount: '',
    },
  });
});
