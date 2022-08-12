import { InitiativeRewardAndTrxRulesDTORewardRule } from '../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { RewardGroupDTO } from '../../api/generated/initiative/RewardGroupDTO';
import { RewardValueDTO } from '../../api/generated/initiative/RewardValueDTO';
import {
  getInitativeSummary,
  getInitiativeDetail,
  putBeneficiaryRuleDraftService,
  putBeneficiaryRuleService,
  putGeneralInfo,
  saveGeneralInfoService,
  trascodeRewardRule,
} from '../intitativeService';
import {
  mockedInitiativeBeneficiaryRuleBody,
  mockedInitiativeGeneralBody,
  mockedInitiativeId,
} from '../__mocks__/initiativeService';

import { InitiativeApi } from '../../api/InitiativeApiClient';

jest.mock('../../api/InitiativeApiClient');

beforeEach(() => {
  jest.spyOn(InitiativeApi, 'getInitativeSummary');
  jest.spyOn(InitiativeApi, 'getInitiativeById');
  jest.spyOn(InitiativeApi, 'initiativeGeneralPost');
  jest.spyOn(InitiativeApi, 'initiativeGeneralPut');
  jest.spyOn(InitiativeApi, 'initiativeBeneficiaryRulePut');
  jest.spyOn(InitiativeApi, 'initiativeBeneficiaryRulePutDraft');
});

test('test get initiative summary', async () => {
  await getInitativeSummary();
  expect(InitiativeApi.getInitativeSummary).toBeCalled();
});

test('test get initiative by id', async () => {
  await getInitiativeDetail(mockedInitiativeId);
  expect(InitiativeApi.getInitiativeById).toBeCalledWith(mockedInitiativeId);
});

test('create initiative', async () => {
  await saveGeneralInfoService(mockedInitiativeGeneralBody);
  expect(InitiativeApi.initiativeGeneralPost).toBeCalled();
});

test('update initiative (general info)', async () => {
  await putGeneralInfo(mockedInitiativeId, mockedInitiativeGeneralBody);
  expect(InitiativeApi.initiativeGeneralPut).toBeCalledWith(
    mockedInitiativeId,
    mockedInitiativeGeneralBody
  );
});

test('update initiative (beneficiary rule)', async () => {
  await putBeneficiaryRuleService(mockedInitiativeId, mockedInitiativeBeneficiaryRuleBody);
  expect(InitiativeApi.initiativeBeneficiaryRulePut).toBeCalledWith(
    mockedInitiativeId,
    mockedInitiativeBeneficiaryRuleBody
  );
});

test('update initiative draft (beneficiary rule)', async () => {
  await putBeneficiaryRuleDraftService(mockedInitiativeId, mockedInitiativeBeneficiaryRuleBody);
  expect(InitiativeApi.initiativeBeneficiaryRulePutDraft).toBeCalledWith(
    mockedInitiativeId,
    mockedInitiativeBeneficiaryRuleBody
  );
});

test('test trascodeRewardRule using RewardGroupDTO', () => {
  const value: InitiativeRewardAndTrxRulesDTORewardRule = {
    _type: 'rewardGroups',
    rewardGroups: [
      {
        from: 0,
        to: 5,
        rewardValue: 10,
      },
    ],
  };
  const result: RewardGroupDTO = trascodeRewardRule(value);
  expect(result).toBe(value);
});

test('test trascodeRewardRule using RewardValueDTO', () => {
  const value: InitiativeRewardAndTrxRulesDTORewardRule = {
    _type: 'rewardValue',
    rewardValue: 0.23,
  };
  const result: RewardValueDTO = trascodeRewardRule(value);
  expect(result).toBe(value);
});

test('test trascodeRewardRule using null', () => {
  const result: RewardValueDTO = trascodeRewardRule(
    null as unknown as InitiativeRewardAndTrxRulesDTORewardRule
  );
  expect(result).toBeNull();
});

test('test trascodeRewardRule using invalid type', () => {
  const value: InitiativeRewardAndTrxRulesDTORewardRule = {
    _type: 'dummy',
    rewardValue: 0.23,
  };
  try {
    trascodeRewardRule(value);
    fail('Expected an error');
  } catch (error) {
    // do nothing
  }
});
