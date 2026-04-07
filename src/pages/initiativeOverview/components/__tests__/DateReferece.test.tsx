/* eslint-disable react/jsx-no-bind */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import DateReference from '../DateReference';
import { BeneficiaryTypeEnum } from '../../../../api/generated/initiative/InitiativeGeneralDTO';
import { mockedInitiative } from '../../../../model/__tests__/Initiative.test';
import { AccumulatedTypeEnum } from '../../../../api/generated/initiative/AccumulatedAmountDTO';
import { TypeEnum } from '../../../../api/generated/initiative/ChannelDTO';
import { ServiceScopeEnum } from '../../../../api/generated/initiative/InitiativeAdditionalDTO';
import { RewardValueTypeEnum } from '../../../../api/generated/initiative/InitiativeRewardRuleDTO';
import { Initiative } from '../../../../model/Initiative';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<DataReference />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const initiative = store.getState().initiative;
  const handleViewDetails = jest.fn();

  window.scrollTo = jest.fn();

  test('should display the DateReference component with his functions', async () => {
    render(
      <Provider store={store}>
        <DateReference initiative={mockedInitiative} handleViewDetails={undefined} />
      </Provider>
    );
  });

  it('test handleViewDetails', async () => {
    const clonedMockedInitiative = { ...initiative, status: 'APPROVED' };
    render(
      <Provider store={store}>
        <DateReference initiative={clonedMockedInitiative} handleViewDetails={handleViewDetails} />
      </Provider>
    );
    const details = (await screen.findByTestId('view-datails-test')) as HTMLButtonElement;
    fireEvent.click(details);
    expect(handleViewDetails).toHaveBeenCalled();
  });

  test('status message date case Approved', async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 11);
    const clonedMockedInitiative2 = {
      ...mockedInitiative,
      status: 'APPROVED',
      generalInfo: {
        beneficiaryType: BeneficiaryTypeEnum.PF,
        beneficiaryKnown: 'false',
        budget: '8515',
        beneficiaryBudget: '801',
        rankingStartDate: undefined,
        rankingEndDate: '',
        startDate: today,
        endDate: tomorrow,
        rankingEnabled: 'true',
        introductionTextIT: '',
        introductionTextEN: '',
        introductionTextFR: '',
        introductionTextDE: '',
        introductionTextSL: '',
      },
    };

    render(
      <Provider store={store}>
        <DateReference initiative={clonedMockedInitiative2} handleViewDetails={undefined} />
      </Provider>
    );

    const message = screen.getByTestId('date-message-status');
    expect(message).toBeInTheDocument();
  });

  test('status message date case empty string', async () => {
    const clonedMockedInitiativeDate3 = {
      ...mockedInitiative,
      status: 'DRAFT',
      generalInfo: {
        beneficiaryType: BeneficiaryTypeEnum.PF,
        beneficiaryKnown: 'false',
        budget: '8515',
        beneficiaryBudget: '801',
        rankingStartDate: '',
        rankingEndDate: '',
        startDate: '',
        endDate: '',
        rankingEnabled: 'true',
        introductionTextIT: '',
        introductionTextEN: '',
        introductionTextFR: '',
        introductionTextDE: '',
        introductionTextSL: '',
      },
    };
    render(
      <Provider store={store}>
        <DateReference initiative={clonedMockedInitiativeDate3} handleViewDetails={undefined} />
      </Provider>
    );
  });

  test('Test formatDate', async () => {
    const mockedInitiative: Initiative = {
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
        rankingStartDate: new Date('2024-09-01T00:00:00.000Z'),
        rankingEndDate: new Date('2024-09-30T00:00:00.000Z'),
        startDate: new Date('2024-10-01T00:00:00.000Z'),
        endDate: new Date('2024-01-31T00:00:00.000Z'),
        introductionTextIT: 'string',
        introductionTextEN: 'string',
        introductionTextFR: 'string',
        introductionTextDE: 'string',
        introductionTextSL: 'string',
        rankingEnabled: 'false',
      },
      additionalInfo: {
        initiativeOnIO: true,
        serviceId: 'service-id',
        serviceName: 'prova313',
        serviceArea: ServiceScopeEnum.NATIONAL,
        serviceDescription: 'newStepOneTest',
        privacyPolicyUrl: 'http://test.it',
        termsAndConditions: 'http://test.it',
        assistanceChannels: [{ type: TypeEnum.web, contact: 'http://test.it' }],
        logoFileName: 'logo file name',
        logoUploadDate: 'logo date',
        logoURL: 'logo url',
      },
      beneficiaryRule: {
        apiKeyClientId: 'string',
        apiKeyClientAssertion: 'string',
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
        ],
      },
      rewardRule: { _type: 'rewardValue', rewardValue: 1, rewardValueType: RewardValueTypeEnum.PERCENTAGE },
      initiativeRewardType: undefined,
      trxRule: {
        mccFilter: { allowedList: true, values: ['string', ''] },
        rewardLimits: [{ frequency: 'string', rewardLimit: 2 }],
        threshold: undefined,
        trxCount: { from: 2, to: 3 },
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
    render(
      <Provider store={store}>
        <DateReference initiative={mockedInitiative} handleViewDetails={undefined} />
      </Provider>
    );
  });

  test('Test renderTimeRangeIcon', async () => {
    const mockedInitiative: Initiative = {
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
        rankingStartDate: new Date('2023-03-02T00:00:00.000Z'),
        rankingEndDate: new Date('2023-03-020T00:00:00.000Z'),
        startDate: new Date('2023-03-02T00:00:00.000Z'),
        endDate: new Date('2023-03-02T00:00:00.000Z'),
        introductionTextIT: 'string',
        introductionTextEN: 'string',
        introductionTextFR: 'string',
        introductionTextDE: 'string',
        introductionTextSL: 'string',
        rankingEnabled: 'false',
      },
      additionalInfo: {
        initiativeOnIO: true,
        serviceId: 'service-id',
        serviceName: 'prova313',
        serviceArea: ServiceScopeEnum.NATIONAL,
        serviceDescription: 'newStepOneTest',
        privacyPolicyUrl: 'http://test.it',
        termsAndConditions: 'http://test.it',
        assistanceChannels: [{ type: TypeEnum.web, contact: 'http://test.it' }],
        logoFileName: 'logo file name',
        logoUploadDate: 'logo date',
        logoURL: 'logo url',
      },
      beneficiaryRule: {
        apiKeyClientId: 'string',
        apiKeyClientAssertion: 'string',
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
        ],
      },
      rewardRule: { _type: 'rewardValue', rewardValue: 1, rewardValueType: RewardValueTypeEnum.PERCENTAGE },
      initiativeRewardType: undefined,
      trxRule: {
        mccFilter: { allowedList: true, values: ['string', ''] },
        rewardLimits: [{ frequency: 'string', rewardLimit: 2 }],
        threshold: undefined,
        trxCount: { from: 2, to: 3 },
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
    render(
      <Provider store={store}>
        <DateReference initiative={mockedInitiative} handleViewDetails={undefined} />
      </Provider>
    );
  });

  test('status message date case start in future', () => {
    const startFuture = new Date();
    startFuture.setDate(startFuture.getDate() + 10);
    const endFuture = new Date(startFuture);
    endFuture.setDate(endFuture.getDate() + 10);

    const initiativeWithFutureDates: Initiative = {
      ...mockedInitiative,
      generalInfo: {
        ...mockedInitiative.generalInfo,
        rankingStartDate: undefined,
        rankingEndDate: undefined,
        startDate: startFuture,
        endDate: endFuture,
      },
    };

    render(
      <Provider store={store}>
        <DateReference initiative={initiativeWithFutureDates} handleViewDetails={undefined} />
      </Provider>
    );

    expect(screen.getByTestId('date-message-status')).toHaveTextContent(
      'pages.initiativeOverview.info.otherInfo.start'
    );
  });
});