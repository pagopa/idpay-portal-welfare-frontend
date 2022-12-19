/* eslint-disable react/jsx-no-bind */
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import ShopRulesContentBody from '../StepFour/ShopRuleContentBody';
import React from 'react';
import { mockedInitiative } from '../../../../model/__tests__/Initiative.test';
import { Initiative } from '../../../../model/Initiative';
import { BeneficiaryTypeEnum } from '../../../../utils/constants';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<ShopRulesContentBody />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const initiative = store.getState().initiative;
  const printRewardRuleAsString = jest.fn();
  // const printMccFilterAsString = jest.fn();
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the ShopRulesContentBody component with his functions', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ShopRulesContentBody initiativeDetail={initiative} />
        </Provider>
      );
    });
  });

  test('should display the ShopRulesContentBody component with mocked initiative', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ShopRulesContentBody initiativeDetail={mockedInitiative} />
        </Provider>
      );
    });
  });

  test('should display the ShopRulesContentBody component with undefined values', async () => {
    const undefinedInitative: Initiative = {
      initiativeId: undefined,
      organizationId: undefined,
      status: undefined,
      initiativeName: undefined,
      creationDate: undefined,
      updateDate: undefined,
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
        serviceArea: 'NATIONAL',
        serviceDescription: 'newStepOneTest',
        privacyPolicyUrl: 'http://test.it',
        termsAndConditions: 'http://test.it',
        assistanceChannels: [{ type: 'web', contact: 'http://test.it' }],
      },
      beneficiaryRule: {
        selfDeclarationCriteria: [],
        automatedCriteria: [],
      },
      rewardRule: { _type: 'rewardValue', rewardValue: 1 },
      trxRule: {
        mccFilter: { allowedList: undefined, values: ['string', ''] },
        rewardLimits: [
          { frequency: 'string', rewardLimit: undefined },
          { frequency: 'string', rewardLimit: 2 },
        ],
        threshold: undefined,
        trxCount: undefined,
        daysOfWeekIntervals: [
          {
            daysOfWeek: 'string',
            startTime: 'string',
            endTime: 'string',
          },
          {
            daysOfWeek: 'string',
            startTime: 'string',
            endTime: 'string',
          },
        ],
      },
      refundRule: {
        reimbursementThreshold: 'THRESHOLD_REACHED',
        reimbursmentQuestionGroup: 'true',
        additionalInfo: 'aaaaaa',
        timeParameter: '',
        accumulatedAmount: '',
      },
    };
    await act(async () => {
      render(
        <Provider store={store}>
          <ShopRulesContentBody initiativeDetail={undefinedInitative} />
        </Provider>
      );
    });
  });
});
