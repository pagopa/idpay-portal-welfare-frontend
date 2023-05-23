import { InitiativeRewardAndTrxRulesDTORewardRule } from '../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { RewardGroupDTO } from '../../api/generated/initiative/RewardGroupDTO';
import { RewardValueDTO } from '../../api/generated/initiative/RewardValueDTO';
import { mockedOnBoardingStatusParam, mockedRankingStatus } from '../__mocks__/initiativeService';

import {
  createInitiativeServiceInfo,
  getDispFileErrors,
  getExportsPaged,
  getInitativeSummary,
  getInitiativeDetail,
  getInitiativeOnboardingRankingStatusPaged,
  getOnboardingStatus,
  getRankingFileDownload,
  getRewardFileDownload,
  getRewardNotificationImportsPaged,
  initiativeStatistics,
  logicallyDeleteInitiative,
  notifyCitizenRankings,
  putBeneficiaryRuleDraftService,
  putBeneficiaryRuleService,
  putDispFileUpload,
  putRefundRule,
  putRefundRuleDraft,
  putTrxAndRewardRules,
  putTrxAndRewardRulesDraft,
  trascodeRewardRule,
  updateInitiativeApprovedStatus,
  updateInitiativeGeneralInfo,
  updateInitiativeGeneralInfoDraft,
  updateInitiativePublishedStatus,
  updateInitiativeServiceInfo,
  updateInitiativeToCheckStatus,
  uploadAndUpdateLogo,
} from '../intitativeService';

import {
  fetchAdmissionCriteria,
  getEligibilityCriteriaForSidebar,
} from '../__mocks__/admissionCriteriaService';

import { cleanup } from '@testing-library/react';
import { InitiativeApiMocked } from '../../api/__mocks__/InitiativeApiClient';
import { mockedAdmissionCriteria } from '../__mocks__/admissionCriteriaService';
import { mockedFile } from '../__mocks__/groupService';
import {
  mockedExportsPagedParam,
  mockedFileName,
  mockedFilePath,
  mockedInitiativeBeneficiaryRuleBody,
  mockedInitiativeGeneralBody,
  mockedInitiativeId,
  mockedRefundRules,
  mockedServiceInfoData,
  mockedTrxAndRewardRules,
} from '../__mocks__/initiativeService';

jest.mock('../../api/__mocks__/InitiativeApiClient');
jest.mock('../../api/InitiativeApiClient');

beforeEach(() => {
  jest.clearAllMocks();
});
afterEach(cleanup);

test('test get initiative summary', async () => {
  await getInitativeSummary();
  expect(InitiativeApiMocked.getInitativeSummary).toHaveBeenCalled();
});

test('test get initiative by id', async () => {
  await getInitiativeDetail(mockedInitiativeId);
  expect(InitiativeApiMocked.getInitiativeById).toHaveBeenCalled();
});

test('create initiative', async () => {
  await createInitiativeServiceInfo(mockedInitiativeGeneralBody);
  expect(InitiativeApiMocked.saveInitiativeServiceInfo).toHaveBeenCalled();
});

test('update initiative (service info)', async () => {
  await updateInitiativeServiceInfo(mockedInitiativeId, mockedServiceInfoData);
  expect(InitiativeApiMocked.updateInitiativeServiceInfo).toHaveBeenCalled();
});

test('update initiative (general info)', async () => {
  await updateInitiativeGeneralInfo(mockedInitiativeId, mockedInitiativeGeneralBody);
  expect(InitiativeApiMocked.updateInitiativeGeneralInfo).toHaveBeenCalled();
});

test('update initiative draft (general info)', async () => {
  await updateInitiativeGeneralInfoDraft(mockedInitiativeId, mockedInitiativeGeneralBody);
  expect(InitiativeApiMocked.updateInitiativeGeneralInfoDraft).toHaveBeenCalled();
});

test('update initiative (beneficiary rule)', async () => {
  await putBeneficiaryRuleService(mockedInitiativeId, mockedInitiativeBeneficiaryRuleBody);
  expect(InitiativeApiMocked.initiativeBeneficiaryRulePut).toHaveBeenCalled();
});

test('update initiative draft (beneficiary rule)', async () => {
  await putBeneficiaryRuleDraftService(mockedInitiativeId, mockedInitiativeBeneficiaryRuleBody);
  expect(InitiativeApiMocked.initiativeBeneficiaryRulePutDraft).toHaveBeenCalled();
});

test('update initiative (reward rules)', async () => {
  await putTrxAndRewardRules(mockedInitiativeId, mockedTrxAndRewardRules);
  expect(InitiativeApiMocked.initiativeTrxAndRewardRulesPut).toHaveBeenCalled();
});

test('update initiative draft (reward rules)', async () => {
  await putTrxAndRewardRulesDraft(mockedInitiativeId, mockedTrxAndRewardRules);
  expect(InitiativeApiMocked.initiativeTrxAndRewardRulesPutDraft).toHaveBeenCalled();
});

test('update initiative (Refund Rules)', async () => {
  await putRefundRule(mockedInitiativeId, mockedRefundRules);
  expect(InitiativeApiMocked.updateInitiativeRefundRulePut).toHaveBeenCalled();
});

test('update initiative draft (Refund Rules)', async () => {
  await putRefundRuleDraft(mockedInitiativeId, mockedRefundRules);
  expect(InitiativeApiMocked.updateInitiativeRefundRuleDraftPut).toHaveBeenCalled();
});

test('update initiative status (Approved)', async () => {
  await updateInitiativeApprovedStatus(mockedInitiativeId);
  expect(InitiativeApiMocked.updateInitiativeApprovedStatus).toHaveBeenCalled();
});

test('update initiative status (To Check)', async () => {
  await updateInitiativeToCheckStatus(mockedInitiativeId);
  expect(InitiativeApiMocked.updateInitiativeToCheckStatus).toHaveBeenCalled();
});

test('update initiative status (Published)', async () => {
  await updateInitiativePublishedStatus(mockedInitiativeId);
  expect(InitiativeApiMocked.updateInitiativePublishedStatus).toHaveBeenCalled();
});

test('delete initiative', async () => {
  await logicallyDeleteInitiative(mockedInitiativeId);
  expect(InitiativeApiMocked.logicallyDeleteInitiative).toHaveBeenCalled();
});

test('fetch admission criteria get eligibility criteria for sidebar', async () => {
  // await fetchAdmissionCriteria();
  await getEligibilityCriteriaForSidebar();
  expect(InitiativeApiMocked.getEligibilityCriteriaForSidebar).toHaveBeenCalled();
});

test('test initiative statistic', async () => {
  await initiativeStatistics(mockedInitiativeId);
  expect(InitiativeApiMocked.initiativeStatistics).toHaveBeenCalled();
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
    mockedExportsPagedParam.id,
    mockedExportsPagedParam.page,
    mockedExportsPagedParam.notificationDateFrom,
    mockedExportsPagedParam.notificationDateTo,
    mockedExportsPagedParam.status
  );
  expect(InitiativeApiMocked.getExportsPaged).toHaveBeenCalled();
});

test('get reward file download', async () => {
  await getRewardFileDownload(mockedInitiativeId, mockedFilePath);
  expect(InitiativeApiMocked.getRewardFileDownload).toHaveBeenCalled();
});

test('get Onboarding Status', async () => {
  await getOnboardingStatus(
    mockedOnBoardingStatusParam.id,
    mockedOnBoardingStatusParam.page,
    mockedOnBoardingStatusParam.dateFrom,
    mockedOnBoardingStatusParam.dateTo,
    mockedOnBoardingStatusParam.status,
    mockedOnBoardingStatusParam.beneficiary
  );
  expect(InitiativeApiMocked.getOnboardingStatus).toHaveBeenCalled();
});

test('put Disp File Upload', async () => {
  await putDispFileUpload(mockedInitiativeId, mockedFileName, mockedFile);
  expect(InitiativeApiMocked.putDispFileUpload).toHaveBeenCalled();
});

test('get reward notification imports paged', async () => {
  await getRewardNotificationImportsPaged(
    mockedExportsPagedParam.id,
    mockedExportsPagedParam.page,
    mockedExportsPagedParam.sort
  );
  expect(InitiativeApiMocked.getRewardNotificationImportsPaged).toHaveBeenCalled();
});

test('upload adn update logo', async () => {
  await uploadAndUpdateLogo(mockedInitiativeId, mockedFile);
  expect(InitiativeApiMocked.uploadAndUpdateLogo).toHaveBeenCalled();
});

test('get disp file errors', async () => {
  await getDispFileErrors(mockedInitiativeId, mockedFilePath);
  expect(InitiativeApiMocked.getDispFileErrors).toHaveBeenCalled();
});

test('get initiative Onboarding ranking status paged', async () => {
  await getInitiativeOnboardingRankingStatusPaged(
    mockedRankingStatus.id,
    mockedRankingStatus.page,
    mockedRankingStatus.beneficiary,
    mockedRankingStatus.state
  );
  expect(InitiativeApiMocked.getInitiativeOnboardingRankingStatusPaged).toHaveBeenCalled();
});

test('get ranking file download', async () => {
  await getRankingFileDownload(mockedInitiativeId, mockedFileName);
  expect(InitiativeApiMocked.getRankingFileDownload).toHaveBeenCalled();
});

test('notify citizen rankings', async () => {
  await notifyCitizenRankings(mockedInitiativeId);
  expect(InitiativeApiMocked.notifyCitizenRankings).toHaveBeenCalled();
});
// hey
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
