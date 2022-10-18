import { InitiativeRewardAndTrxRulesDTORewardRule } from '../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { RewardGroupDTO } from '../../api/generated/initiative/RewardGroupDTO';
import { RewardValueDTO } from '../../api/generated/initiative/RewardValueDTO';
import {
  getInitativeSummary,
  getInitiativeDetail,
  putBeneficiaryRuleDraftService,
  putBeneficiaryRuleService,
  trascodeRewardRule,
  createInitiativeServiceInfo,
  updateInitiativeGeneralInfo,
  putRefundRule,
  putRefundRuleDraft,
  updateInitiativeGeneralInfoDraft,
  putTrxAndRewardRules,
  putTrxAndRewardRulesDraft,
  updateInitiativeApprovedStatus,
  updateInitiativeToCheckStatus,
  updateInitiativePublishedStatus,
  logicallyDeleteInitiative,
  updateInitiativeServiceInfo,
  getEligibilityCriteriaForSidebar,
} from '../intitativeService';

import {} from '../admissionCriteriaService';

import {
  mockedInitiativeBeneficiaryRuleBody,
  mockedInitiativeGeneralBody,
  mockedInitiativeId,
  mockedRefundRules,
  mockedServiceInfoData,
  mockedTrxAndRewardRules,
} from '../__mocks__/initiativeService';

import { InitiativeApi } from '../../api/InitiativeApiClient';

jest.mock('../../api/InitiativeApiClient');

beforeEach(() => {
  jest.spyOn(InitiativeApi, 'getInitativeSummary');
  jest.spyOn(InitiativeApi, 'getInitiativeById');
  jest.spyOn(InitiativeApi, 'saveInitiativeServiceInfo');
  jest.spyOn(InitiativeApi, 'updateInitiativeServiceInfo');
  jest.spyOn(InitiativeApi, 'updateInitiativeGeneralInfo');
  jest.spyOn(InitiativeApi, 'updateInitiativeGeneralInfoDraft');
  jest.spyOn(InitiativeApi, 'initiativeBeneficiaryRulePut');
  jest.spyOn(InitiativeApi, 'initiativeBeneficiaryRulePutDraft');
  jest.spyOn(InitiativeApi, 'initiativeTrxAndRewardRulesPut');
  jest.spyOn(InitiativeApi, 'initiativeTrxAndRewardRulesPutDraft');
  jest.spyOn(InitiativeApi, 'updateInitiativeRefundRulePut');
  jest.spyOn(InitiativeApi, 'updateInitiativeRefundRuleDraftPut');
  jest.spyOn(InitiativeApi, 'updateInitiativeApprovedStatus');
  jest.spyOn(InitiativeApi, 'updateInitiativeToCheckStatus');
  jest.spyOn(InitiativeApi, 'updateInitiativePublishedStatus');
  jest.spyOn(InitiativeApi, 'logicallyDeleteInitiative');
  jest.spyOn(InitiativeApi, 'getEligibilityCriteriaForSidebar');
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
  await createInitiativeServiceInfo(mockedInitiativeGeneralBody);
  expect(InitiativeApi.saveInitiativeServiceInfo).toBeCalled();
});

test('update initiative (service info)', async () => {
  await updateInitiativeServiceInfo(mockedInitiativeId, mockedServiceInfoData);
  expect(InitiativeApi.updateInitiativeServiceInfo).toBeCalledWith(
    mockedInitiativeId,
    mockedServiceInfoData
  );
});

test('update initiative (general info)', async () => {
  await updateInitiativeGeneralInfo(mockedInitiativeId, mockedInitiativeGeneralBody);
  expect(InitiativeApi.updateInitiativeGeneralInfo).toBeCalledWith(
    mockedInitiativeId,
    mockedInitiativeGeneralBody
  );
});

test('update initiative draft (general info)', async () => {
  await updateInitiativeGeneralInfoDraft(mockedInitiativeId, mockedInitiativeGeneralBody);
  expect(InitiativeApi.updateInitiativeGeneralInfoDraft).toBeCalledWith(
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

test('update initiative (reward rules)', async () => {
  await putTrxAndRewardRules(mockedInitiativeId, mockedTrxAndRewardRules);
  expect(InitiativeApi.initiativeTrxAndRewardRulesPut).toBeCalledWith(
    mockedInitiativeId,
    mockedTrxAndRewardRules
  );
});

test('update initiative draft (reward rules)', async () => {
  await putTrxAndRewardRulesDraft(mockedInitiativeId, mockedTrxAndRewardRules);
  expect(InitiativeApi.initiativeTrxAndRewardRulesPutDraft).toBeCalledWith(
    mockedInitiativeId,
    mockedTrxAndRewardRules
  );
});

test('update initiative (Refund Rules)', async () => {
  await putRefundRule(mockedInitiativeId, mockedRefundRules);
  expect(InitiativeApi.updateInitiativeRefundRulePut).toBeCalledWith(
    mockedInitiativeId,
    mockedRefundRules
  );
});

test('update initiative draft (Refund Rules)', async () => {
  await putRefundRuleDraft(mockedInitiativeId, mockedRefundRules);
  expect(InitiativeApi.updateInitiativeRefundRuleDraftPut).toBeCalledWith(
    mockedInitiativeId,
    mockedRefundRules
  );
});

test('update initiative status (Approved)', async () => {
  await updateInitiativeApprovedStatus(mockedInitiativeId);
  expect(InitiativeApi.updateInitiativeApprovedStatus).toBeCalledWith(mockedInitiativeId);
});

test('update initiative status (To Check)', async () => {
  await updateInitiativeToCheckStatus(mockedInitiativeId);
  expect(InitiativeApi.updateInitiativeToCheckStatus).toBeCalledWith(mockedInitiativeId);
});

test('update initiative status (Published)', async () => {
  await updateInitiativePublishedStatus(mockedInitiativeId);
  expect(InitiativeApi.updateInitiativePublishedStatus).toBeCalledWith(mockedInitiativeId);
});

test('delete initiative', async () => {
  await logicallyDeleteInitiative(mockedInitiativeId);
  expect(InitiativeApi.logicallyDeleteInitiative).toBeCalledWith(mockedInitiativeId);
});

test('eligibility criteria for sidebar', async () => {
  await getEligibilityCriteriaForSidebar();
  expect(InitiativeApi.getEligibilityCriteriaForSidebar).toBeCalled();
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
