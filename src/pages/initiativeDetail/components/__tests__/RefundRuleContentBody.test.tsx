import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import RefundRuleContentBody from '../StepFive/RefundRuleContentBody';
import { BeneficiaryTypeEnum } from '../../../../utils/constants';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<RefundRuleContentBody />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });
  const refunParameters = [
    {
      reimbursmentQuestionGroup: 'true',
      accumulatedAmount: 'THRESHOLD_REACHED',
      timeParameter: 'CLOSED',
    },
    {
      reimbursmentQuestionGroup: 'true',
      accumulatedAmount: 'BUDGET_EXHAUSTED',
      timeParameter: 'CLOSED',
    },
    {
      reimbursmentQuestionGroup: 'false',
      accumulatedAmount: 'BUDGET_EXHAUSTED',
      timeParameter: 'CLOSED',
    },
    {
      reimbursmentQuestionGroup: 'false',
      accumulatedAmount: 'BUDGET_EXHAUSTED',
      timeParameter: 'DAILY',
    },
    {
      reimbursmentQuestionGroup: 'false',
      accumulatedAmount: 'BUDGET_EXHAUSTED',
      timeParameter: 'WEEKLY',
    },
    {
      reimbursmentQuestionGroup: 'false',
      accumulatedAmount: 'BUDGET_EXHAUSTED',
      timeParameter: 'MONTHLY',
    },
    {
      reimbursmentQuestionGroup: 'false',
      accumulatedAmount: 'THRESHOLD_REACHED',
      timeParameter: 'QUARTERLY',
    },
  ];

  const filterFunction = (
    reimbursmentQuestionGroup: string,
    accumulatedAmount: string,
    timeParameter: string
  ) => {
    const filteredRefund = refunParameters.filter((r) => {
      return (
        r.reimbursmentQuestionGroup === reimbursmentQuestionGroup &&
        r.accumulatedAmount === accumulatedAmount &&
        r.timeParameter === timeParameter
      );
    });
    return filteredRefund[0];
  };

  const dynamicMockedRefundInitiative = (
    reimbursmentQuestionGroup: string,
    accumulatedAmount: string,
    timeParameter: string
  ) => {
    return {
      initiativeId: undefined,
      organizationId: undefined,
      status: undefined,
      initiativeName: undefined,
      creationDate: undefined,
      updateDate: undefined,
      additionalInfo: {
        initiativeOnIO: true,
        serviceName: '',
        serviceArea: '',
        serviceDescription: '',
        privacyPolicyUrl: '',
        termsAndConditions: '',
        assistanceChannels: [{ type: 'web', contact: '' }],
      },
      generalInfo: {
        beneficiaryType: BeneficiaryTypeEnum.PF,
        beneficiaryKnown: 'false',
        budget: '',
        beneficiaryBudget: '',
        startDate: '',
        endDate: '',
        rankingStartDate: '',
        rankingEndDate: '',
        rankingEnabled: 'true',
        introductionTextDE: '',
        introductionTextEN: '',
        introductionTextFR: '',
        introductionTextIT: '',
        introductionTextSL: '',
      },
      beneficiaryRule: {
        selfDeclarationCriteria: [],
        automatedCriteria: [],
      },
      rewardRule: {
        _type: 'rewardValue',
        rewardValue: undefined,
      },
      trxRule: {
        mccFilter: {
          allowedList: true,
          values: [],
        },
        rewardLimits: [{ frequency: 'DAILY', rewardLimit: undefined }],
        threshold: { from: undefined, fromIncluded: true, to: undefined, toIncluded: true },
        trxCount: { from: undefined, fromIncluded: true, to: undefined, toIncluded: true },
        daysOfWeekIntervals: [{ daysOfWeek: 'MONDAY', startTime: '', endTime: '' }],
      },
      refundRule: {
        ...filterFunction(reimbursmentQuestionGroup, accumulatedAmount, timeParameter),
        additionalInfo: 'string',
        reimbursementThreshold: '',
      },
    };
  };

  const mapOfRefundParameters = () => {
    const r = refunParameters.map((item) => {
      return dynamicMockedRefundInitiative(
        item.reimbursmentQuestionGroup,
        item.accumulatedAmount,
        item.timeParameter
      );
    });
    return r;
  };

  test('should display the RefundRuleContentBody component with his functions', async () => {
    mapOfRefundParameters().forEach((item) => {
      render(
        <Provider store={store}>
          <RefundRuleContentBody initiativeDetail={item} />
        </Provider>
      );
    });
  });
});
