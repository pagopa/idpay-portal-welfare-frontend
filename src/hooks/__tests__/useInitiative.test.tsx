import { render, waitFor } from '@testing-library/react';
import React from 'react';
import * as redux from 'react-redux';
import { InitiativeApi } from '../../api/InitiativeApiClient';
import { getInitiativeDetail } from '../../services/intitativeService';
import { mockedInitiativeId } from '../../services/__mocks__/initiativeService';
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
} from '../useInitiative';
import { BeneficiaryTypeEnum } from '../../utils/constants';
import { InitiativeDTO } from '../../api/generated/initiative/InitiativeDTO';
import { useAppDispatch } from '../../redux/hooks';
import { InitiativeRefundRuleDTO } from '../../api/generated/initiative/InitiativeRefundRuleDTO';

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
    // parseGeneralInfo();
    // await waitFor(() => expect(parseGeneralInfo).toHaveBeenCalled());
    await waitFor(() => expect(returnVal).toBeDefined());
  });

  test('parseAdditionalInfo', () => {
    expect(
      parseAdditionalInfo({
        initiativeOnIO: false,
        serviceName: '',
        serviceArea: '',
        serviceDescription: '',
        privacyPolicyUrl: '',
        termsAndConditions: '',
        assistanceChannels: [{ type: 'web', contact: '' }],
      })
    ).not.toBeNull();
  });

  test('parseGeneralInfo', () => {
    const mockedGeneralInfo = (benType?: string) => {
      return {
        beneficiaryType: benType,
        beneficiaryKnown: 'false',
        budget: '',
        beneficiaryBudget: '',
        startDate: '',
        endDate: '',
        rankingStartDate: '',
        rankingEndDate: '',
      };
    };
    expect(parseGeneralInfo(mockedGeneralInfo('PF'))).not.toBeNull();

    expect(parseGeneralInfo(mockedGeneralInfo('PG'))).not.toBeNull();
  });

  test('parseAutomatedCriteria', () => {
    const mockedParseAutomatedCriteria: InitiativeDTO = {};
    expect(parseAutomatedCriteria(mockedParseAutomatedCriteria)).not.toBeNull();
  });

  test('parseManualCriteria', () => {
    const mockedParseManualCriteria: InitiativeDTO = {};
    expect(parseManualCriteria(mockedParseManualCriteria)).not.toBeNull();
  });

  test('parseRewardRule', () => {
    const mockedParseRewardRule: InitiativeDTO = {};
    const dispatch = useAppDispatch();
    // expect(parseRewardRule(mockedParseRewardRule, dispatch)).toBeCalled();
  });

  test('parseRefundRule', () => {
    const mockedRefundRule: InitiativeRefundRuleDTO = {};
    expect(parseRefundRule(mockedRefundRule)).toBeDefined();
  });
});
