import { InitiativeRewardTypeEnum } from '../../api/generated/initiative/InitiativeDTO';
import { InitiativeRewardAndTrxRulesDTORewardRule } from '../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { RewardGroupDTO } from '../../api/generated/initiative/RewardGroupDTO';
import { RewardValueDTO } from '../../api/generated/initiative/RewardValueDTO';
import { InitiativeApi } from '../../api/InitiativeApiClient';
import { decode } from '../../utils/io-utils';
import { mockedFile } from '../__mocks__/groupsService';
import {
  mockedBeneficaryStatus,
  mockedExportsPagedParam,
  mockedExportsPagedResponse,
  mockedFamilyUnitComposition,
  mockedFileName,
  mockedFilePath,
  mockedFiscalCode,
  mockedGetDispFileError,
  mockedGetIniOnboardingRankingStatusPaged,
  mockedGetRewardFileDownload,
  mockedIbanInfo,
  mockedInitiativeDetail,
  mockedInitiativeGeneralBody,
  mockedInitiativeId,
  mockedInitiativeStatistics,
  mockedInitiativeSummary,
  mockedNotificationReward,
  mockedOnBoardingStatusParam,
  mockedOnBoardingStatusResponse,
  mockedOperationDetail,
  mockedOperationList,
  mockedOrganizationsList,
  mockedRefundRules,
  mockedRefundsDetailsByEventRes,
  mockedRefundsDetailsListItem,
  mockedRefundsDetailsSummary,
  mockedRankingStatus,
  mockedServiceInfoData,
  mockedTrxAndRewardRules,
  mockedWallet,
  mockedWalletInstrument,
} from '../__mocks__/intitativeService';
import {
  createInitiativeServiceInfo,
  getBeneficiaryOnboardingStatus,
  getDispFileErrors,
  getEligibilityCriteriaForSidebar,
  getExportRefundsListPaged,
  getExportSummary,
  getExportsPaged,
  getFamilyComposition,
  getIban,
  getInitativeSummary,
  getInitiativeDetail,
  getInitiativeOnboardingRankingStatusPaged,
  getInstrumentList,
  getOnboardingStatus,
  getOrganizationsList,
  getRefundDetail,
  getRewardFileDownload,
  getRewardNotificationImportsPaged,
  getTimeLine,
  getTimelineDetail,
  getWalletDetail,
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
  readmitUser,
  suspendUser,
  trascodeRewardRule,
  updateInitiativeApprovedStatus,
  updateInitiativeGeneralInfo,
  updateInitiativeGeneralInfoDraft,
  updateInitiativePublishedStatus,
  updateInitiativeServiceInfo,
  updateInitiativeToCheckStatus,
  uploadAndUpdateLogo,
} from '../intitativeService';

jest.mock('../../api/InitiativeApiClient', () => ({
  InitiativeApi: {
    getInitativeSummary: jest.fn(),
    getInitiativeById: jest.fn(),
    saveInitiativeServiceInfo: jest.fn(),
    updateInitiativeServiceInfo: jest.fn(),
    updateInitiativeGeneralInfo: jest.fn(),
    updateInitiativeGeneralInfoDraft: jest.fn(),
    initiativeBeneficiaryRulePut: jest.fn(),
    initiativeBeneficiaryRulePutDraft: jest.fn(),
    getEligibilityCriteriaForSidebar: jest.fn(),
    initiativeStatistics: jest.fn(),
    initiativeTrxAndRewardRulesPut: jest.fn(),
    initiativeTrxAndRewardRulesPutDraft: jest.fn(),
    updateInitiativeRefundRulePut: jest.fn(),
    updateInitiativeRefundRuleDraftPut: jest.fn(),
    updateInitiativeApprovedStatus: jest.fn(),
    updateInitiativeToCheckStatus: jest.fn(),
    updateInitiativePublishedStatus: jest.fn(),
    logicallyDeleteInitiative: jest.fn(),
    getExportsPaged: jest.fn(),
    getRewardFileDownload: jest.fn(),
    getOnboardingStatus: jest.fn(),
    putDispFileUpload: jest.fn(),
    getRewardNotificationImportsPaged: jest.fn(),
    uploadAndUpdateLogo: jest.fn(),
    getDispFileErrors: jest.fn(),
    getInitiativeOnboardingRankingStatusPaged: jest.fn(),
    notifyCitizenRankings: jest.fn(),
    getOrganizationsList: jest.fn(),
    getWalletDetail: jest.fn(),
    getInstrumentList: jest.fn(),
    getIban: jest.fn(),
    getTimeLine: jest.fn(),
    getTimelineDetail: jest.fn(),
    getExportSummary: jest.fn(),
    getExportRefundsListPaged: jest.fn(),
    getRefundDetail: jest.fn(),
    getBeneficiaryOnboardingStatus: jest.fn(),
    suspendUserRefund: jest.fn(),
    suspendUserDiscount: jest.fn(),
    readmitUserRefund: jest.fn(),
    readmitUserDiscount: jest.fn(),
    getFamilyComposition: jest.fn(),
  },
}));

jest.mock('../../utils/io-utils', () => ({
  decode: jest.fn(),
}));

const api = InitiativeApi as jest.Mocked<typeof InitiativeApi>;
const decodeMock = decode as jest.MockedFunction<typeof decode>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('intitativeService', () => {
  it('forwards success responses from the API client', async () => {
    const cases = [
      {
        label: 'getInitativeSummary',
        invoke: () => getInitativeSummary(),
        mock: api.getInitativeSummary,
        response: mockedInitiativeSummary,
        args: [],
      },
      {
        label: 'getInitiativeDetail',
        invoke: () => getInitiativeDetail(mockedInitiativeId),
        mock: api.getInitiativeById,
        response: mockedInitiativeDetail,
        args: [mockedInitiativeId],
      },
      {
        label: 'createInitiativeServiceInfo',
        invoke: () => createInitiativeServiceInfo(mockedServiceInfoData),
        mock: api.saveInitiativeServiceInfo,
        response: mockedInitiativeDetail,
        args: [mockedServiceInfoData],
      },
      {
        label: 'updateInitiativeServiceInfo',
        invoke: () => updateInitiativeServiceInfo(mockedInitiativeId, mockedServiceInfoData),
        mock: api.updateInitiativeServiceInfo,
        response: undefined,
        args: [mockedInitiativeId, mockedServiceInfoData],
      },
      {
        label: 'updateInitiativeGeneralInfo',
        invoke: () => updateInitiativeGeneralInfo(mockedInitiativeId, mockedInitiativeGeneralBody),
        mock: api.updateInitiativeGeneralInfo,
        response: undefined,
        args: [mockedInitiativeId, mockedInitiativeGeneralBody],
      },
      {
        label: 'updateInitiativeGeneralInfoDraft',
        invoke: () =>
          updateInitiativeGeneralInfoDraft(mockedInitiativeId, mockedInitiativeGeneralBody),
        mock: api.updateInitiativeGeneralInfoDraft,
        response: undefined,
        args: [mockedInitiativeId, mockedInitiativeGeneralBody],
      },
      {
        label: 'putBeneficiaryRuleService',
        invoke: () => putBeneficiaryRuleService(mockedInitiativeId, mockedServiceInfoData as any),
        mock: api.initiativeBeneficiaryRulePut,
        response: undefined,
        args: [mockedInitiativeId, mockedServiceInfoData],
      },
      {
        label: 'putBeneficiaryRuleDraftService',
        invoke: () =>
          putBeneficiaryRuleDraftService(mockedInitiativeId, mockedServiceInfoData as any),
        mock: api.initiativeBeneficiaryRulePutDraft,
        response: undefined,
        args: [mockedInitiativeId, mockedServiceInfoData],
      },
      {
        label: 'getEligibilityCriteriaForSidebar',
        invoke: () => getEligibilityCriteriaForSidebar(),
        mock: api.getEligibilityCriteriaForSidebar,
        response: [{ code: 'ISEE', authority: 'INPS', operator: 'EQ', checked: false }],
        args: [],
      },
      {
        label: 'initiativeStatistics',
        invoke: () => initiativeStatistics(mockedInitiativeId),
        mock: api.initiativeStatistics,
        response: mockedInitiativeStatistics,
        args: [mockedInitiativeId],
      },
      {
        label: 'putTrxAndRewardRules',
        invoke: () => putTrxAndRewardRules(mockedInitiativeId, mockedTrxAndRewardRules),
        mock: api.initiativeTrxAndRewardRulesPut,
        response: undefined,
        args: [mockedInitiativeId, mockedTrxAndRewardRules],
      },
      {
        label: 'putTrxAndRewardRulesDraft',
        invoke: () => putTrxAndRewardRulesDraft(mockedInitiativeId, mockedTrxAndRewardRules),
        mock: api.initiativeTrxAndRewardRulesPutDraft,
        response: undefined,
        args: [mockedInitiativeId, mockedTrxAndRewardRules],
      },
      {
        label: 'putRefundRule',
        invoke: () => putRefundRule(mockedInitiativeId, mockedRefundRules),
        mock: api.updateInitiativeRefundRulePut,
        response: undefined,
        args: [mockedInitiativeId, mockedRefundRules],
      },
      {
        label: 'putRefundRuleDraft',
        invoke: () => putRefundRuleDraft(mockedInitiativeId, mockedRefundRules),
        mock: api.updateInitiativeRefundRuleDraftPut,
        response: undefined,
        args: [mockedInitiativeId, mockedRefundRules],
      },
      {
        label: 'updateInitiativeApprovedStatus',
        invoke: () => updateInitiativeApprovedStatus(mockedInitiativeId),
        mock: api.updateInitiativeApprovedStatus,
        response: undefined,
        args: [mockedInitiativeId],
      },
      {
        label: 'updateInitiativeToCheckStatus',
        invoke: () => updateInitiativeToCheckStatus(mockedInitiativeId),
        mock: api.updateInitiativeToCheckStatus,
        response: undefined,
        args: [mockedInitiativeId],
      },
      {
        label: 'updateInitiativePublishedStatus',
        invoke: () => updateInitiativePublishedStatus(mockedInitiativeId),
        mock: api.updateInitiativePublishedStatus,
        response: undefined,
        args: [mockedInitiativeId],
      },
      {
        label: 'logicallyDeleteInitiative',
        invoke: () => logicallyDeleteInitiative(mockedInitiativeId),
        mock: api.logicallyDeleteInitiative,
        response: undefined,
        args: [mockedInitiativeId],
      },
      {
        label: 'getExportsPaged',
        invoke: () =>
          getExportsPaged(
            mockedExportsPagedParam.id,
            mockedExportsPagedParam.page,
            mockedExportsPagedParam.notificationDateFrom,
            mockedExportsPagedParam.notificationDateTo,
            mockedExportsPagedParam.status,
            mockedExportsPagedParam.sort
          ),
        mock: api.getExportsPaged,
        response: mockedExportsPagedResponse,
        args: [
          mockedExportsPagedParam.id,
          mockedExportsPagedParam.page,
          mockedExportsPagedParam.notificationDateFrom,
          mockedExportsPagedParam.notificationDateTo,
          mockedExportsPagedParam.status,
          mockedExportsPagedParam.sort,
        ],
      },
      {
        label: 'getRewardFileDownload',
        invoke: () => getRewardFileDownload(mockedInitiativeId, mockedFilePath),
        mock: api.getRewardFileDownload,
        response: mockedGetRewardFileDownload,
        args: [mockedInitiativeId, mockedFilePath],
      },
      {
        label: 'getOnboardingStatus',
        invoke: () =>
          getOnboardingStatus(
            mockedOnBoardingStatusParam.id,
            mockedOnBoardingStatusParam.page,
            mockedOnBoardingStatusParam.beneficiary,
            mockedOnBoardingStatusParam.dateFrom,
            mockedOnBoardingStatusParam.dateTo,
            mockedOnBoardingStatusParam.status
          ),
        mock: api.getOnboardingStatus,
        response: mockedOnBoardingStatusResponse,
        args: [
          mockedOnBoardingStatusParam.id,
          mockedOnBoardingStatusParam.page,
          mockedOnBoardingStatusParam.beneficiary,
          mockedOnBoardingStatusParam.dateFrom,
          mockedOnBoardingStatusParam.dateTo,
          mockedOnBoardingStatusParam.status,
        ],
      },
      {
        label: 'putDispFileUpload',
        invoke: () => putDispFileUpload(mockedInitiativeId, mockedFileName, mockedFile),
        mock: api.putDispFileUpload,
        response: undefined,
        args: [mockedInitiativeId, mockedFileName, mockedFile],
      },
      {
        label: 'getRewardNotificationImportsPaged',
        invoke: () =>
          getRewardNotificationImportsPaged(
            mockedExportsPagedParam.id,
            mockedExportsPagedParam.page,
            mockedExportsPagedParam.sort
          ),
        mock: api.getRewardNotificationImportsPaged,
        response: mockedNotificationReward,
        args: [
          mockedExportsPagedParam.id,
          mockedExportsPagedParam.page,
          mockedExportsPagedParam.sort,
        ],
      },
      {
        label: 'uploadAndUpdateLogo',
        invoke: () => uploadAndUpdateLogo(mockedInitiativeId, mockedFile),
        mock: api.uploadAndUpdateLogo,
        response: mockedFile,
        args: [mockedInitiativeId, mockedFile],
      },
      {
        label: 'getDispFileErrors',
        invoke: () => getDispFileErrors(mockedInitiativeId, mockedFilePath),
        mock: api.getDispFileErrors,
        response: mockedGetDispFileError,
        args: [mockedInitiativeId, mockedFilePath],
      },
      {
        label: 'getInitiativeOnboardingRankingStatusPaged',
        invoke: () =>
          getInitiativeOnboardingRankingStatusPaged(
            mockedRankingStatus.id,
            mockedRankingStatus.page,
            mockedRankingStatus.beneficiary,
            mockedRankingStatus.state
          ),
        mock: api.getInitiativeOnboardingRankingStatusPaged,
        response: mockedGetIniOnboardingRankingStatusPaged,
        args: [
          mockedRankingStatus.id,
          mockedRankingStatus.page,
          mockedRankingStatus.beneficiary,
          mockedRankingStatus.state,
        ],
      },
      {
        label: 'notifyCitizenRankings',
        invoke: () => notifyCitizenRankings(mockedInitiativeId),
        mock: api.notifyCitizenRankings,
        response: undefined,
        args: [mockedInitiativeId],
      },
      {
        label: 'getOrganizationsList',
        invoke: () => getOrganizationsList(),
        mock: api.getOrganizationsList,
        response: mockedOrganizationsList,
        args: [],
      },
      {
        label: 'getWalletDetail',
        invoke: () => getWalletDetail(mockedInitiativeId, mockedFiscalCode),
        mock: api.getWalletDetail,
        response: mockedWallet,
        args: [mockedInitiativeId, mockedFiscalCode],
      },
      {
        label: 'getInstrumentList',
        invoke: () => getInstrumentList(mockedInitiativeId, mockedFiscalCode),
        mock: api.getInstrumentList,
        response: mockedWalletInstrument,
        args: [mockedInitiativeId, mockedFiscalCode],
      },
      {
        label: 'getIban',
        invoke: () => getIban(mockedInitiativeId, mockedFiscalCode, mockedIbanInfo.iban),
        mock: api.getIban,
        response: mockedIbanInfo,
        args: [mockedInitiativeId, mockedFiscalCode, mockedIbanInfo.iban],
      },
      {
        label: 'getTimeLine',
        invoke: () =>
          getTimeLine(
            mockedFiscalCode,
            mockedInitiativeId,
            'PAID_REFUND',
            mockedOnBoardingStatusParam.dateFrom,
            mockedOnBoardingStatusParam.dateTo,
            mockedOnBoardingStatusParam.page
          ),
        mock: api.getTimeLine,
        response: mockedOperationList,
        args: [
          mockedFiscalCode,
          mockedInitiativeId,
          'PAID_REFUND',
          mockedOnBoardingStatusParam.dateFrom,
          mockedOnBoardingStatusParam.dateTo,
          mockedOnBoardingStatusParam.page,
        ],
      },
      {
        label: 'getTimelineDetail',
        invoke: () => getTimelineDetail(mockedFiscalCode, mockedInitiativeId, 'PAID_REFUND'),
        mock: api.getTimelineDetail,
        response: mockedOperationDetail,
        args: [mockedFiscalCode, mockedInitiativeId, 'PAID_REFUND'],
      },
      {
        label: 'getExportSummary',
        invoke: () => getExportSummary(mockedInitiativeId, 'export-id'),
        mock: api.getExportSummary,
        response: mockedRefundsDetailsSummary,
        args: [mockedInitiativeId, 'export-id'],
      },
      {
        label: 'getExportRefundsListPaged',
        invoke: () => getExportRefundsListPaged(mockedInitiativeId, 'export-id', 0, 'cro', 'DONE'),
        mock: api.getExportRefundsListPaged,
        response: mockedRefundsDetailsListItem,
        args: [mockedInitiativeId, 'export-id', 0, 'cro', 'DONE'],
      },
      {
        label: 'getRefundDetail',
        invoke: () => getRefundDetail(mockedInitiativeId, 'event-id'),
        mock: api.getRefundDetail,
        response: mockedRefundsDetailsByEventRes,
        args: [mockedInitiativeId, 'event-id'],
      },
      {
        label: 'getBeneficiaryOnboardingStatus',
        invoke: () => getBeneficiaryOnboardingStatus(mockedInitiativeId, mockedFiscalCode),
        mock: api.getBeneficiaryOnboardingStatus,
        response: mockedBeneficaryStatus,
        args: [mockedInitiativeId, mockedFiscalCode],
      },
      {
        label: 'getFamilyComposition',
        invoke: () => getFamilyComposition(mockedInitiativeId, mockedFiscalCode),
        mock: api.getFamilyComposition,
        response: mockedFamilyUnitComposition,
        args: [mockedInitiativeId, mockedFiscalCode],
      },
    ];

    for (const testCase of cases) {
      const mockedApiCall = testCase.mock as jest.Mock;
      mockedApiCall.mockResolvedValueOnce(testCase.response);
      const result = await testCase.invoke();

      if (testCase.response === undefined) {
        expect(result).toBeUndefined();
      } else {
        expect(result).toEqual(testCase.response);
      }

      expect(mockedApiCall).toHaveBeenCalledWith(...testCase.args);
    }
  });

  it('propagates rejections from the API client', async () => {
    const error = new Error('initiative unavailable');
    api.getInitativeSummary.mockRejectedValueOnce(error);

    await expect(getInitativeSummary()).rejects.toThrow('initiative unavailable');
  });

  it('transcodes reward groups and reward value rules through decode', () => {
    const rewardGroupsRule = {
      _type: 'rewardGroups',
      rewardGroups: [{ from: 0, to: 5, rewardValue: 10 }],
    } as InitiativeRewardAndTrxRulesDTORewardRule;
    const rewardGroupsDecoded = { kind: 'reward-groups' };
    decodeMock.mockReturnValueOnce(rewardGroupsDecoded as any);

    expect(trascodeRewardRule(rewardGroupsRule)).toBe(rewardGroupsDecoded);
    expect(decodeMock).toHaveBeenCalledWith(rewardGroupsRule, RewardGroupDTO);

    const rewardValueRule = {
      _type: 'rewardValue',
      rewardValue: 0.23,
    } as InitiativeRewardAndTrxRulesDTORewardRule;
    const rewardValueDecoded = { kind: 'reward-value' };
    decodeMock.mockReturnValueOnce(rewardValueDecoded as any);

    expect(trascodeRewardRule(rewardValueRule)).toBe(rewardValueDecoded);
    expect(decodeMock).toHaveBeenCalledWith(rewardValueRule, RewardValueDTO);
  });

  it('returns falsy reward rules unchanged and throws on unknown types', () => {
    expect(
      trascodeRewardRule(null as unknown as InitiativeRewardAndTrxRulesDTORewardRule)
    ).toBeNull();
    expect(decodeMock).not.toHaveBeenCalled();

    expect(
      trascodeRewardRule(undefined as unknown as InitiativeRewardAndTrxRulesDTORewardRule)
    ).toBeUndefined();
    expect(decodeMock).not.toHaveBeenCalled();

    expect(() =>
      trascodeRewardRule({
        _type: 'unknown',
      } as InitiativeRewardAndTrxRulesDTORewardRule)
    ).toThrow('Unknown type');

    expect(() =>
      trascodeRewardRule({} as InitiativeRewardAndTrxRulesDTORewardRule)
    ).toThrow('Unknown type');
  });

  it('routes suspend and readmit calls based on the reward type', async () => {
    api.suspendUserRefund.mockResolvedValueOnce(undefined);
    await expect(
      suspendUser(mockedInitiativeId, mockedFiscalCode, InitiativeRewardTypeEnum.REFUND)
    ).resolves.toBeUndefined();
    expect(api.suspendUserRefund).toHaveBeenCalledWith(mockedInitiativeId, mockedFiscalCode);
    expect(api.suspendUserDiscount).not.toHaveBeenCalled();

    api.suspendUserDiscount.mockResolvedValueOnce(undefined);
    await expect(
      suspendUser(mockedInitiativeId, mockedFiscalCode, InitiativeRewardTypeEnum.DISCOUNT)
    ).resolves.toBeUndefined();
    expect(api.suspendUserDiscount).toHaveBeenCalledWith(mockedInitiativeId, mockedFiscalCode);
    expect(api.suspendUserRefund).toHaveBeenCalledTimes(1);

    api.readmitUserRefund.mockResolvedValueOnce(undefined);
    await expect(
      readmitUser(mockedInitiativeId, mockedFiscalCode, InitiativeRewardTypeEnum.REFUND)
    ).resolves.toBeUndefined();
    expect(api.readmitUserRefund).toHaveBeenCalledWith(mockedInitiativeId, mockedFiscalCode);
    expect(api.readmitUserDiscount).not.toHaveBeenCalled();

    api.readmitUserDiscount.mockResolvedValueOnce(undefined);
    await expect(
      readmitUser(mockedInitiativeId, mockedFiscalCode, InitiativeRewardTypeEnum.DISCOUNT)
    ).resolves.toBeUndefined();
    expect(api.readmitUserDiscount).toHaveBeenCalledWith(mockedInitiativeId, mockedFiscalCode);
    expect(api.readmitUserRefund).toHaveBeenCalledTimes(1);
  });
});