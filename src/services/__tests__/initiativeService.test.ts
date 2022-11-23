import { InitiativeRewardAndTrxRulesDTORewardRule } from '../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { RewardGroupDTO } from '../../api/generated/initiative/RewardGroupDTO';
import { RewardValueDTO } from '../../api/generated/initiative/RewardValueDTO';
import {
  getInitativeSummary,
  getInitiativeDetail,
  putBeneficiaryRuleDraftService,
  putBeneficiaryRuleService,
  createInitiativeServiceInfo,
  updateInitiativeGeneralInfo,
  putRefundRule,
  putRefundRuleDraftPut,
  updateInitiativeGeneralInfoDraft,
  putTrxAndRewardRules,
  putTrxAndRewardRulesDraft,
  updateInitiativeApprovedStatus,
  updateInitiativeToCheckStatus,
  updateInitiativePublishedStatus,
  logicallyDeleteInitiative,
  updateInitiativeServiceInfo,
  getExportsPaged,
  getRewardFileDownload,
  getOnboardingStatus,
  putDispFileUpload,
  mockedOnBoardingStatus,
} from '../__mocks__/initiativeService';

import { trascodeRewardRule } from '../intitativeService';

import {
  fetchAdmissionCriteria,
  getEligibilityCriteriaForSidebar,
} from '../__mocks__/admissionCriteriaService';

import {
  mockedExportsPaged,
  mockedFileName,
  mockedFilePath,
  mockedInitiativeBeneficiaryRuleBody,
  mockedInitiativeGeneralBody,
  mockedInitiativeId,
  mockedRefundRules,
  mockedServiceInfoData,
  mockedTrxAndRewardRules,
} from '../__mocks__/initiativeService';

import { InitiativeApiMocked } from '../../api/__mocks__/InitiativeApiClient';
import { mockedAdmissionCriteria } from '../__mocks__/admissionCriteriaService';
import { fetchTransactionRules } from '../transactionRuleService';
import { mockedFile } from '../__mocks__/groupService';

jest.mock('../../api/__mocks__/InitiativeApiClient.ts');

beforeEach(() => {
  jest.spyOn(InitiativeApiMocked, 'getInitativeSummary');
  jest.spyOn(InitiativeApiMocked, 'getInitiativeById');
  jest.spyOn(InitiativeApiMocked, 'saveInitiativeServiceInfo');
  jest.spyOn(InitiativeApiMocked, 'updateInitiativeServiceInfo');
  jest.spyOn(InitiativeApiMocked, 'updateInitiativeGeneralInfo');
  jest.spyOn(InitiativeApiMocked, 'updateInitiativeGeneralInfoDraft');
  jest.spyOn(InitiativeApiMocked, 'initiativeBeneficiaryRulePut');
  jest.spyOn(InitiativeApiMocked, 'initiativeBeneficiaryRulePutDraft');
  jest.spyOn(InitiativeApiMocked, 'initiativeTrxAndRewardRulesPut');
  jest.spyOn(InitiativeApiMocked, 'initiativeTrxAndRewardRulesPutDraft');
  jest.spyOn(InitiativeApiMocked, 'updateInitiativeRefundRulePut');
  jest.spyOn(InitiativeApiMocked, 'updateInitiativeRefundRuleDraftPut');
  jest.spyOn(InitiativeApiMocked, 'updateInitiativeApprovedStatus');
  jest.spyOn(InitiativeApiMocked, 'updateInitiativeToCheckStatus');
  jest.spyOn(InitiativeApiMocked, 'updateInitiativePublishedStatus');
  jest.spyOn(InitiativeApiMocked, 'logicallyDeleteInitiative');
  jest.spyOn(InitiativeApiMocked, 'getEligibilityCriteriaForSidebar');
  jest.spyOn(InitiativeApiMocked, 'getExportsPaged');
  jest.spyOn(InitiativeApiMocked, 'getRewardFileDownload');
  jest.spyOn(InitiativeApiMocked, 'getOnboardingStatus');
  jest.spyOn(InitiativeApiMocked, 'putDispFileUpload');
});

test('test get initiative summary', async () => {
  await getInitativeSummary();
  expect(InitiativeApiMocked.getInitativeSummary).toBeCalled();
});

test('test get initiative by id', async () => {
  await getInitiativeDetail(mockedInitiativeId);
  expect(InitiativeApiMocked.getInitiativeById).toBeCalledWith(mockedInitiativeId);
});

test('create initiative', async () => {
  await createInitiativeServiceInfo(mockedInitiativeGeneralBody);
  expect(InitiativeApiMocked.saveInitiativeServiceInfo).toBeCalled();
});

test('update initiative (service info)', async () => {
  await updateInitiativeServiceInfo(mockedInitiativeId, mockedServiceInfoData);
  expect(InitiativeApiMocked.updateInitiativeServiceInfo).toBeCalledWith(
    mockedInitiativeId,
    mockedServiceInfoData
  );
});

test('update initiative (general info)', async () => {
  await updateInitiativeGeneralInfo(mockedInitiativeId, mockedInitiativeGeneralBody);
  expect(InitiativeApiMocked.updateInitiativeGeneralInfo).toBeCalledWith(
    mockedInitiativeId,
    mockedInitiativeGeneralBody
  );
});

test('update initiative draft (general info)', async () => {
  await updateInitiativeGeneralInfoDraft(mockedInitiativeId, mockedInitiativeGeneralBody);
  expect(InitiativeApiMocked.updateInitiativeGeneralInfoDraft).toBeCalledWith(
    mockedInitiativeId,
    mockedInitiativeGeneralBody
  );
});

test('update initiative (beneficiary rule)', async () => {
  await putBeneficiaryRuleService(mockedInitiativeId, mockedInitiativeBeneficiaryRuleBody);
  expect(InitiativeApiMocked.initiativeBeneficiaryRulePut).toBeCalledWith(
    mockedInitiativeId,
    mockedInitiativeBeneficiaryRuleBody
  );
});

test('update initiative draft (beneficiary rule)', async () => {
  await putBeneficiaryRuleDraftService(mockedInitiativeId, mockedInitiativeBeneficiaryRuleBody);
  expect(InitiativeApiMocked.initiativeBeneficiaryRulePutDraft).toBeCalledWith(
    mockedInitiativeId,
    mockedInitiativeBeneficiaryRuleBody
  );
});

test('update initiative (reward rules)', async () => {
  await putTrxAndRewardRules(mockedInitiativeId, mockedTrxAndRewardRules);
  expect(InitiativeApiMocked.initiativeTrxAndRewardRulesPut).toBeCalledWith(
    mockedInitiativeId,
    mockedTrxAndRewardRules
  );
});

test('update initiative draft (reward rules)', async () => {
  await putTrxAndRewardRulesDraft(mockedInitiativeId, mockedTrxAndRewardRules);
  expect(InitiativeApiMocked.initiativeTrxAndRewardRulesPutDraft).toBeCalledWith(
    mockedInitiativeId,
    mockedTrxAndRewardRules
  );
});

test('update initiative (Refund Rules)', async () => {
  await putRefundRule(mockedInitiativeId, mockedRefundRules);
  expect(InitiativeApiMocked.updateInitiativeRefundRulePut).toBeCalledWith(
    mockedInitiativeId,
    mockedRefundRules
  );
});

test('update initiative draft (Refund Rules)', async () => {
  await putRefundRuleDraftPut(mockedInitiativeId, mockedRefundRules);
  expect(InitiativeApiMocked.updateInitiativeRefundRuleDraftPut).toBeCalledWith(
    mockedInitiativeId,
    mockedRefundRules
  );
});

test('update initiative status (Approved)', async () => {
  await updateInitiativeApprovedStatus(mockedInitiativeId);
  expect(InitiativeApiMocked.updateInitiativeApprovedStatus).toBeCalledWith(mockedInitiativeId);
});

test('update initiative status (To Check)', async () => {
  await updateInitiativeToCheckStatus(mockedInitiativeId);
  expect(InitiativeApiMocked.updateInitiativeToCheckStatus).toBeCalledWith(mockedInitiativeId);
});

test('update initiative status (Published)', async () => {
  await updateInitiativePublishedStatus(mockedInitiativeId);
  expect(InitiativeApiMocked.updateInitiativePublishedStatus).toBeCalledWith(mockedInitiativeId);
});

test('delete initiative', async () => {
  await logicallyDeleteInitiative(mockedInitiativeId);
  expect(InitiativeApiMocked.logicallyDeleteInitiative).toBeCalledWith(mockedInitiativeId);
});

test('fetch admission criteria get eligibility criteria for sidebar', async () => {
  await fetchAdmissionCriteria();
  if (process.env.REACT_APP_API_MOCK_ADMISSION_CRITERIA === 'false') {
    await getEligibilityCriteriaForSidebar();
    expect(InitiativeApiMocked.getEligibilityCriteriaForSidebar).toBeCalled();
  }
});

test('test fetch admission criteria mocked Admission', async () => {
  await fetchAdmissionCriteria();
  if (process.env.REACT_APP_API_MOCK_ADMISSION_CRITERIA === 'true') {
    expect(new Promise((resolve) => resolve(mockedAdmissionCriteria))).toStrictEqual(
      new Promise(() => ({}))
    );
  } else {
    await getEligibilityCriteriaForSidebar();
    expect(InitiativeApiMocked.getEligibilityCriteriaForSidebar).toHaveBeenCalled();
  }
});

test('get Exports Paged', async () => {
  await getExportsPaged(
    mockedExportsPaged.id,
    mockedExportsPaged.page,
    mockedExportsPaged.notificationDateFrom,
    mockedExportsPaged.notificationDateTo,
    mockedExportsPaged.status
  );
  expect(InitiativeApiMocked.getExportsPaged).toHaveBeenCalledWith(
    mockedExportsPaged.id,
    mockedExportsPaged.page,
    mockedExportsPaged.notificationDateFrom,
    mockedExportsPaged.notificationDateTo,
    mockedExportsPaged.status
  );
});

test('get reward file download', async () => {
  await getRewardFileDownload(mockedInitiativeId, mockedFilePath);
  expect(InitiativeApiMocked.getRewardFileDownload).toHaveBeenCalledWith(
    mockedInitiativeId,
    mockedFilePath
  );
});

test('get Onboarding Status', async () => {
  await getOnboardingStatus(
    mockedOnBoardingStatus.id,
    mockedOnBoardingStatus.page,
    mockedOnBoardingStatus.dateFrom,
    mockedOnBoardingStatus.dateTo,
    mockedOnBoardingStatus.status,
    mockedOnBoardingStatus.beneficiary
  );
  expect(InitiativeApiMocked.getOnboardingStatus).toHaveBeenCalledWith(
    mockedOnBoardingStatus.id,
    mockedOnBoardingStatus.page,
    mockedOnBoardingStatus.dateFrom,
    mockedOnBoardingStatus.dateTo,
    mockedOnBoardingStatus.status
  );
});

test('put Disp File Upload', async () => {
  await putDispFileUpload(mockedInitiativeId, mockedFileName, mockedFile);
  expect(InitiativeApiMocked.putDispFileUpload).toHaveBeenCalledWith(
    mockedInitiativeId,
    mockedFileName,
    mockedFile
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
