import { InitiativeRewardAndTrxRulesDTORewardRule } from '../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { RewardGroupDTO } from '../../api/generated/initiative/RewardGroupDTO';
import { RewardValueDTO } from '../../api/generated/initiative/RewardValueDTO';
import { mockedExportsPagedResponse, mockedOnBoardingStatusParam, mockedRankingStatus } from '../__mocks__/intitativeService';

import {
  createInitiativeServiceInfo,
  getDispFileErrors,
  getExportsPaged,
  getInitativeSummary,
  getInitiativeDetail,
  getInitiativeOnboardingRankingStatusPaged,
  getOnboardingStatus,
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

import { InitiativeApi } from '../../api/InitiativeApiClient';
import { mockedFile } from '../__mocks__/groupsService';
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
} from '../__mocks__/intitativeService';

jest.mock('../../services/intitativeService.ts');

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
  jest.spyOn(InitiativeApi, 'logicallyDeleteInitiative');
  jest.spyOn(InitiativeApi, 'updateInitiativePublishedStatus');
  jest.spyOn(InitiativeApi, 'getEligibilityCriteriaForSidebar');
  jest.spyOn(InitiativeApi, 'initiativeStatistics');
  jest.spyOn(InitiativeApi, 'getEligibilityCriteriaForSidebar');
  jest.spyOn(InitiativeApi, 'getExportsPaged');
  jest.spyOn(InitiativeApi, 'getRewardFileDownload');
  jest.spyOn(InitiativeApi, 'getOnboardingStatus');
  jest.spyOn(InitiativeApi, 'putDispFileUpload');
  jest.spyOn(InitiativeApi, 'getRewardNotificationImportsPaged');
  jest.spyOn(InitiativeApi, 'uploadAndUpdateLogo');
  jest.spyOn(InitiativeApi, 'getDispFileErrors');
  jest.spyOn(InitiativeApi, 'getInitiativeOnboardingRankingStatusPaged');
  jest.spyOn(InitiativeApi, 'notifyCitizenRankings');
  jest.spyOn(InitiativeApi, 'getInitiativeOnboardingRankingStatusPaged');
});

test('test get initiative summary', async () => {
  await getInitativeSummary();
  expect(InitiativeApi.getInitativeSummary).not.toHaveBeenCalled();
});

test('test get initiative by id', async () => {
  await getInitiativeDetail(mockedInitiativeId);
  expect(InitiativeApi.getInitiativeById).not.toHaveBeenCalled();
});

test('create initiative', async () => {
  const result = await createInitiativeServiceInfo(mockedInitiativeGeneralBody);
  expect(InitiativeApi.saveInitiativeServiceInfo).not.toHaveBeenCalled();
  expect(result).toEqual({});
});

test('update initiative (service info)', async () => {
  await updateInitiativeServiceInfo(mockedInitiativeId, mockedServiceInfoData);
  expect(InitiativeApi.updateInitiativeServiceInfo).not.toHaveBeenCalled();
  
});

test('update initiative (general info)', async () => {
  await updateInitiativeGeneralInfo(mockedInitiativeId, mockedInitiativeGeneralBody);
  expect(InitiativeApi.updateInitiativeGeneralInfo).not.toHaveBeenCalled();
});

test('update initiative draft (general info)', async () => {
  await updateInitiativeGeneralInfoDraft(mockedInitiativeId, mockedInitiativeGeneralBody);
  expect(InitiativeApi.updateInitiativeGeneralInfoDraft).not.toHaveBeenCalled();
});

test('update initiative (beneficiary rule)', async () => {
  await putBeneficiaryRuleService(mockedInitiativeId, mockedInitiativeBeneficiaryRuleBody);
  expect(InitiativeApi.initiativeBeneficiaryRulePut).not.toHaveBeenCalled();
});

test('update initiative draft (beneficiary rule)', async () => {
  await putBeneficiaryRuleDraftService(mockedInitiativeId, mockedInitiativeBeneficiaryRuleBody);
  expect(InitiativeApi.initiativeBeneficiaryRulePutDraft).not.toHaveBeenCalled();
});

test('update initiative (reward rules)', async () => {
  await putTrxAndRewardRules(mockedInitiativeId, mockedTrxAndRewardRules);
  expect(InitiativeApi.initiativeTrxAndRewardRulesPut).not.toHaveBeenCalled();
});

test('update initiative draft (reward rules)', async () => {
  await putTrxAndRewardRulesDraft(mockedInitiativeId, mockedTrxAndRewardRules);
  expect(InitiativeApi.initiativeTrxAndRewardRulesPutDraft).not.toHaveBeenCalled();
});

test('update initiative (Refund Rules)', async () => {
  await putRefundRule(mockedInitiativeId, mockedRefundRules);
  expect(InitiativeApi.updateInitiativeRefundRulePut).not.toHaveBeenCalled();
});

test('update initiative draft (Refund Rules)', async () => {
  await putRefundRuleDraft(mockedInitiativeId, mockedRefundRules);
  expect(InitiativeApi.updateInitiativeRefundRuleDraftPut).not.toHaveBeenCalled();
});

test('update initiative status (Approved)', async () => {
  await updateInitiativeApprovedStatus(mockedInitiativeId);
  expect(InitiativeApi.updateInitiativeApprovedStatus).not.toHaveBeenCalled();
});

test('update initiative status (To Check)', async () => {
  await updateInitiativeToCheckStatus(mockedInitiativeId);
  expect(InitiativeApi.updateInitiativeToCheckStatus).not.toHaveBeenCalled();
});

test('update initiative status (Published)', async () => {
  await updateInitiativePublishedStatus(mockedInitiativeId);
  expect(InitiativeApi.updateInitiativePublishedStatus).not.toHaveBeenCalled();
});

test('delete initiative', async () => {
  await logicallyDeleteInitiative(mockedInitiativeId);
  expect(InitiativeApi.logicallyDeleteInitiative).not.toHaveBeenCalled();
});

test('fetch admission criteria get eligibility criteria for sidebar', async () => {
  // await fetchAdmissionCriteria();
  await getEligibilityCriteriaForSidebar();
  expect(InitiativeApi.getEligibilityCriteriaForSidebar).not.toHaveBeenCalled();
});

test('test initiative statistic', async () => {
  await initiativeStatistics(mockedInitiativeId);
  expect(InitiativeApi.initiativeStatistics).not.toHaveBeenCalled();
});

test('test fetch admission criteria mocked Admission', async () => {
  await fetchAdmissionCriteria();
    await getEligibilityCriteriaForSidebar();
    expect(InitiativeApi.getEligibilityCriteriaForSidebar).not.toHaveBeenCalled();
});

test('get Exports Paged', async () => {
  const result = await getExportsPaged(
    mockedExportsPagedParam.id,
    mockedExportsPagedParam.page,
    mockedExportsPagedParam.notificationDateFrom,
    mockedExportsPagedParam.notificationDateTo,
    mockedExportsPagedParam.status
  );
  expect(InitiativeApi.getExportsPaged).not.toHaveBeenCalled();
  expect(result).toEqual(mockedExportsPagedResponse);
});

test('get reward file download', async () => {
  await getRewardFileDownload(mockedInitiativeId, mockedFilePath);
  expect(InitiativeApi.getRewardFileDownload).not.toHaveBeenCalled();
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
  expect(InitiativeApi.getOnboardingStatus).not.toHaveBeenCalled();
});

test('put Disp File Upload', async () => {
  await putDispFileUpload(mockedInitiativeId, mockedFileName, mockedFile);
  expect(InitiativeApi.putDispFileUpload).not.toHaveBeenCalled();
});

test('get reward notification imports paged', async () => {
  await getRewardNotificationImportsPaged(
    mockedExportsPagedParam.id,
    mockedExportsPagedParam.page,
    mockedExportsPagedParam.sort
  );
  expect(InitiativeApi.getRewardNotificationImportsPaged).not.toHaveBeenCalled();
});

test('upload adn update logo', async () => {
  await uploadAndUpdateLogo(mockedInitiativeId, mockedFile);
  expect(InitiativeApi.uploadAndUpdateLogo).not.toHaveBeenCalled();
});

test('get disp file errors', async () => {
  await getDispFileErrors(mockedInitiativeId, mockedFilePath);
  expect(InitiativeApi.getDispFileErrors).not.toHaveBeenCalled();
});

test('get initiative Onboarding ranking status paged', async () => {
  await getInitiativeOnboardingRankingStatusPaged(
    mockedRankingStatus.id,
    mockedRankingStatus.page,
    mockedRankingStatus.beneficiary,
    mockedRankingStatus.state
  );
  expect(InitiativeApi.getInitiativeOnboardingRankingStatusPaged).not.toHaveBeenCalled();
});

// test('get ranking file download', async () => {
//   await getRankingFileDownload(mockedInitiativeId, mockedFileName);
//   expect(InitiativeApi.getRankingFileDownload).toHaveBeenCalled();
// });

test('notify citizen rankings', async () => {
  await notifyCitizenRankings(mockedInitiativeId);
  expect(InitiativeApi.notifyCitizenRankings).not.toHaveBeenCalled();
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
