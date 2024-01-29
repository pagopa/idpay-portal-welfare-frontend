import { ConfigBeneficiaryRuleArrayDTO } from '../api/generated/initiative/ConfigBeneficiaryRuleArrayDTO';
import { CsvDTO } from '../api/generated/initiative/CsvDTO';
import { ExportListDTO } from '../api/generated/initiative/ExportListDTO';
import { ExportSummaryDTO } from '../api/generated/initiative/ExportSummaryDTO';
import { IbanDTO } from '../api/generated/initiative/IbanDTO';
import { InitiativeAdditionalDTO } from '../api/generated/initiative/InitiativeAdditionalDTO';
import { InitiativeBeneficiaryRuleDTO } from '../api/generated/initiative/InitiativeBeneficiaryRuleDTO';
import { InitiativeDTO, InitiativeRewardTypeEnum } from '../api/generated/initiative/InitiativeDTO';
import { InitiativeGeneralDTO } from '../api/generated/initiative/InitiativeGeneralDTO';
import { InitiativeRefundRuleDTO } from '../api/generated/initiative/InitiativeRefundRuleDTO';
import {
  InitiativeRewardAndTrxRulesDTO,
  InitiativeRewardAndTrxRulesDTORewardRule,
} from '../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { InitiativeStatisticsDTO } from '../api/generated/initiative/InitiativeStatisticsDTO';
import { InitiativeSummaryArrayDTO } from '../api/generated/initiative/InitiativeSummaryArrayDTO';
import { InstrumentListDTO } from '../api/generated/initiative/InstrumentListDTO';
import { LogoDTO } from '../api/generated/initiative/LogoDTO';
import { OnboardingDTO } from '../api/generated/initiative/OnboardingDTO';
import { OnboardingStatusDTO } from '../api/generated/initiative/OnboardingStatusDTO';
import { OperationDTO } from '../api/generated/initiative/OperationDTO';
import { OrganizationListDTO } from '../api/generated/initiative/OrganizationListDTO';
import { PageOnboardingRankingsDTO } from '../api/generated/initiative/PageOnboardingRankingsDTO';
import { PageRewardExportsDTO } from '../api/generated/initiative/PageRewardExportsDTO';
import { PageRewardImportsDTO } from '../api/generated/initiative/PageRewardImportsDTO';
import { RefundDetailDTO } from '../api/generated/initiative/RefundDetailDTO';
import { RewardGroupDTO } from '../api/generated/initiative/RewardGroupDTO';
import { RewardValueDTO } from '../api/generated/initiative/RewardValueDTO';
import { SasToken } from '../api/generated/initiative/SasToken';
import { TimelineDTO } from '../api/generated/initiative/TimelineDTO';
import { WalletDTO } from '../api/generated/initiative/WalletDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';
// import { InitiativeApiMocked } from '../api/__mocks__/InitiativeApiClient';
import { decode } from '../utils/io-utils';
import { FamilyUnitCompositionDTO } from '../api/generated/initiative/FamilyUnitCompositionDTO';
// import { ContentDTO } from '../api/generated/initiative/ContentDTO';
// import { mockedFile } from './__mocks__/groupService';
// import {
//   mockedExportsPagedParam,
//   // mockedFileName,
//   mockedFilePath,
//   mockedFiscalCode,
//   mockedIban,
//   // mockedFiscalCode,
//   mockedInitiativeBeneficiaryRuleBody,
//   mockedInitiativeGeneralBody,
//   mockedInitiativeId,
//   mockedOnBoardingStatusParam,
//   mockedRankingStatus,
//   mockedRefundRules,
//   mockedTrxAndRewardRules,
// } from './__mocks__/initiativeService';

export const getInitativeSummary = (): Promise<InitiativeSummaryArrayDTO> => InitiativeApi.getInitativeSummary().then((res) => res);

export const getInitiativeDetail = (id: string): Promise<InitiativeDTO> => InitiativeApi.getInitiativeById(id).then((res) => res);

export const createInitiativeServiceInfo = (
  data: InitiativeAdditionalDTO
): Promise<InitiativeDTO | void | undefined> => InitiativeApi.saveInitiativeServiceInfo(data).then((res) => res);

export const updateInitiativeServiceInfo = (
  id: string,
  data: InitiativeAdditionalDTO
): Promise<void> => InitiativeApi.updateInitiativeServiceInfo(id, data).then((res) => res);
  

export const updateInitiativeGeneralInfo = (
  id: string,
  data: InitiativeGeneralDTO
): Promise<void> => InitiativeApi.updateInitiativeGeneralInfo(id, data).then((res) => res);
export const updateInitiativeGeneralInfoDraft = (
  id: string,
  data: InitiativeGeneralDTO
): Promise<void> => InitiativeApi.updateInitiativeGeneralInfoDraft(id, data).then((res) => res);

export const putBeneficiaryRuleService = async (
  id: string,
  data: InitiativeBeneficiaryRuleDTO
): Promise<void> => InitiativeApi.initiativeBeneficiaryRulePut(id, data);

export const putBeneficiaryRuleDraftService = (
  id: string,
  data: InitiativeBeneficiaryRuleDTO
): Promise<void> => InitiativeApi.initiativeBeneficiaryRulePutDraft(id, data).then((res) => res);

export const getEligibilityCriteriaForSidebar = (): Promise<ConfigBeneficiaryRuleArrayDTO> => InitiativeApi.getEligibilityCriteriaForSidebar().then((res) => res);

export const initiativeStatistics = (id: string): Promise<InitiativeStatisticsDTO> => InitiativeApi.initiativeStatistics(id).then((res) => res);

/** It will accept a {@link InitiativeRewardAndTrxRulesDTORewardRule} and it will transcode it into {@link RewardGroupDTO} or {@link RewardValueDTO} */
export const trascodeRewardRule = (rewardRule: InitiativeRewardAndTrxRulesDTORewardRule) => {
  if (rewardRule) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    switch ((rewardRule as any)['_type']) {
      case 'rewardGroups':
        return decode(rewardRule, RewardGroupDTO);
      case 'rewardValue':
        return decode(rewardRule, RewardValueDTO);
      default:
        throw new Error(`Unknown type: ${rewardRule}`);
    }
  }
  return rewardRule;
};

export const putTrxAndRewardRules = (
  id: string,
  data: InitiativeRewardAndTrxRulesDTO
): Promise<void> => InitiativeApi.initiativeTrxAndRewardRulesPut(id, data).then((res) => res);

export const putTrxAndRewardRulesDraft = (
  id: string,
  data: InitiativeRewardAndTrxRulesDTO
): Promise<void> =>InitiativeApi.initiativeTrxAndRewardRulesPutDraft(id, data).then((res) => res);

export const putRefundRule = (id: string, data: InitiativeRefundRuleDTO): Promise<void> => InitiativeApi.updateInitiativeRefundRulePut(id, data).then((res) => res);

export const putRefundRuleDraft = (id: string, data: InitiativeRefundRuleDTO): Promise<void> => InitiativeApi.updateInitiativeRefundRuleDraftPut(id, data).then((res) => res);

export const updateInitiativeApprovedStatus = (id: string): Promise<void> => InitiativeApi.updateInitiativeApprovedStatus(id).then((res) => res);

export const updateInitiativeToCheckStatus = (id: string): Promise<void> => InitiativeApi.updateInitiativeToCheckStatus(id).then((res) => res);

export const updateInitiativePublishedStatus = (id: string): Promise<void> => InitiativeApi.updateInitiativePublishedStatus(id).then((res) => res);

export const logicallyDeleteInitiative = (id: string): Promise<void> =>InitiativeApi.logicallyDeleteInitiative(id).then((res) => res);

export const getExportsPaged = (
  id: string,
  page: number,
  notificationDateFrom?: string,
  notificationDateTo?: string,
  status?: string,
  sort?: string
): Promise<PageRewardExportsDTO> => InitiativeApi.getExportsPaged(
    id,
    page,
    notificationDateFrom,
    notificationDateTo,
    status,
    sort
  ).then((res) => res);

export const getRewardFileDownload = (id: string, filePath: string): Promise<SasToken> => InitiativeApi.getRewardFileDownload(id, filePath).then((res) => res);

export const getOnboardingStatus = (
  id: string,
  page: number,
  beneficiary?: string,
  dateFrom?: string,
  dateTo?: string,
  state?: string
): Promise<OnboardingDTO> => InitiativeApi.getOnboardingStatus(id, page, beneficiary, dateFrom, dateTo, state).then((res) => res);


export const putDispFileUpload = (id: string, filename: string, file: File): Promise<void> => InitiativeApi.putDispFileUpload(id, filename, file).then((res) => res);

export const getRewardNotificationImportsPaged = (
  id: string,
  page: number,
  sort: string
): Promise<PageRewardImportsDTO> => InitiativeApi.getRewardNotificationImportsPaged(id, page, sort).then((res) => res);

export const uploadAndUpdateLogo = (id: string, file: File): Promise<LogoDTO> =>  InitiativeApi.uploadAndUpdateLogo(id, file).then((res) => res);

export const getDispFileErrors = (id: string, name: string): Promise<CsvDTO> => InitiativeApi.getDispFileErrors(id, name).then((res) => res);

export const getInitiativeOnboardingRankingStatusPaged = (
  id: string,
  page: number,
  beneficiary?: string | undefined,
  state?: string | undefined
): Promise<PageOnboardingRankingsDTO> => InitiativeApi.getInitiativeOnboardingRankingStatusPaged(id, page, beneficiary, state).then((res) => res);

// export const getRankingFileDownload = (id: string, filename: string): Promise<any> => {
//   // if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
//   //   return InitiativeApiMocked.getRankingFileDownload(mockedInitiativeId, mockedFileName);
//   // }
//   const res = InitiativeApi.getRankingFileDownload(id, filename).then((res) => res);
//   console.log(res);
//   return res;
// };

export const notifyCitizenRankings = (id: string): Promise<void> => InitiativeApi.notifyCitizenRankings(id).then((res) => res);

export const getOrganizationsList = (): Promise<OrganizationListDTO> => InitiativeApi.getOrganizationsList().then((res) => res);

export const getWalletDetail = (id: string, cf: string): Promise<WalletDTO> => InitiativeApi.getWalletDetail(id, cf).then((res) => res);

export const getInstrumentList = (id: string, cf: string): Promise<InstrumentListDTO> =>InitiativeApi.getInstrumentList(id, cf).then((res) => res);
export const getIban = (id: string, cf: string, iban: string): Promise<IbanDTO> => InitiativeApi.getIban(id, cf, iban).then((res) => res);

export const getTimeLine = (
  cf: string,
  id: string,
  opeType?: string,
  dateFrom?: string,
  dateTo?: string,
  page?: number
): Promise<TimelineDTO> => InitiativeApi.getTimeLine(cf, id, opeType, dateFrom, dateTo, page).then((res) => res);

export const getTimelineDetail = (
  cf: string,
  id: string,
  opeType: string
): Promise<OperationDTO> => InitiativeApi.getTimelineDetail(cf, id, opeType);

export const getExportSummary = (
  initiativeId: string,
  exportId: string
): Promise<ExportSummaryDTO> => InitiativeApi.getExportSummary(initiativeId, exportId);

export const getExportRefundsListPaged = (
  initiativeId: string,
  exportId: string,
  page: number,
  cro?: string,
  status?: string
): Promise<ExportListDTO> => InitiativeApi.getExportRefundsListPaged(initiativeId, exportId, page, cro, status);

export const getRefundDetail = (
  initiativeId: string,
  eventId: string
): Promise<RefundDetailDTO> => InitiativeApi.getRefundDetail(initiativeId, eventId);

export const getBeneficiaryOnboardingStatus = (
  initiativeId: string,
  fiscalCode: string
): Promise<OnboardingStatusDTO> => InitiativeApi.getBeneficiaryOnboardingStatus(initiativeId, fiscalCode);

export const suspendUser = (
  initiativeId: string,
  fiscalCode: string,
  rewardType: InitiativeRewardTypeEnum
): Promise<void> => {
    if (rewardType === InitiativeRewardTypeEnum.REFUND) {
      return InitiativeApi.suspendUserRefund(initiativeId, fiscalCode);
    } else {
      return InitiativeApi.suspendUserDiscount(initiativeId, fiscalCode);
    }
};

export const readmitUser = (
  initiativeId: string,
  fiscalCode: string,
  rewardType: InitiativeRewardTypeEnum
): Promise<void> => {
    if (rewardType === InitiativeRewardTypeEnum.REFUND) {
      return InitiativeApi.readmitUserRefund(initiativeId, fiscalCode);
    } else {
      return InitiativeApi.readmitUserDiscount(initiativeId, fiscalCode);
    }
};

export const getFamilyComposition = (
  initiativeId: string,
  fiscalCode: string
): Promise<FamilyUnitCompositionDTO> => InitiativeApi.getFamilyComposition(initiativeId, fiscalCode);
