import {
  InitiativeSummaryArrayDTO,
  InitiativeDTO,
  InitiativeAdditionalDTO,
  InitiativeGeneralDTO,
  InitiativeBeneficiaryRuleDTO,
  ConfigBeneficiaryRuleArrayDTO,
  InitiativeStatisticsDTO,
  InitiativeRewardAndTrxRulesDTO,
  InitiativeRefundRuleDTO,
  PageRewardExportsDTO,
  SasToken,
  OnboardingDTO,
  PageRewardImportsDTO,
  LogoDTO,
  CsvDTO,
  PageOnboardingRankingsDTO,
  OrganizationListDTO,
  GetWalletDetailData as WalletDTO,
  GetInstrumentListData as InstrumentListDTO,
  GetIbanData as IbanDTO,
  GetTimelineData as TimelineDTO,
  GetTimelineDetailData as OperationDTO,
  ExportSummaryDTO,
  ExportListDTO,
  RefundDetailDTO,
  GetBeneficiaryOnboardingStatusData as OnboardingStatusDTO,
  GetFamilyCompositionData as FamilyUnitCompositionDTO,
  RewardGroupsDTO,
  RewardValueDTO,
} from '../api/generated/initiative/apiClient';
import { InitiativeApi } from '../api/InitiativeApiClient';

export enum InitiativeRewardTypeEnum {
  REFUND = 'REFUND',
  DISCOUNT = 'DISCOUNT',
}

/**
 * Accepts a reward rule and decodes it into RewardGroupsDTO or RewardValueDTO.
 * Using unknown here is safer because the old generated union type name no longer exists.
 */
export const trascodeRewardRule = (
  rewardRule: unknown
): RewardGroupsDTO | RewardValueDTO | undefined => {
  if (!rewardRule || typeof rewardRule !== 'object') {
    return undefined;
  }

  const rewardRuleType = Reflect.get(rewardRule, '_type');

  switch (rewardRuleType) {
    case 'rewardGroups':
      return rewardRule as RewardGroupsDTO;

    case 'rewardValue':
      return rewardRule as RewardValueDTO;

    default:
      throw new Error(`Unknown type: ${String(rewardRuleType)}`);
  }
};

export const getInitativeSummary = (): Promise<InitiativeSummaryArrayDTO> =>
  InitiativeApi.getInitativeSummary();

export const getInitiativeDetail = (id: string): Promise<InitiativeDTO> =>
  InitiativeApi.getInitiativeById(id);

export const createInitiativeServiceInfo = (
  data: InitiativeAdditionalDTO
): Promise<InitiativeDTO> => InitiativeApi.saveInitiativeServiceInfo(data);

export const updateInitiativeServiceInfo = (
  id: string,
  data: InitiativeAdditionalDTO
): Promise<void> => InitiativeApi.updateInitiativeServiceInfo(id, data);

export const updateInitiativeGeneralInfo = (
  id: string,
  data: InitiativeGeneralDTO
): Promise<void> => InitiativeApi.updateInitiativeGeneralInfo(id, data);

export const updateInitiativeGeneralInfoDraft = (
  id: string,
  data: InitiativeGeneralDTO
): Promise<void> => InitiativeApi.updateInitiativeGeneralInfoDraft(id, data);

export const putBeneficiaryRuleService = (
  id: string,
  data: InitiativeBeneficiaryRuleDTO
): Promise<void> => InitiativeApi.initiativeBeneficiaryRulePut(id, data);

export const putBeneficiaryRuleDraftService = (
  id: string,
  data: InitiativeBeneficiaryRuleDTO
): Promise<void> => InitiativeApi.initiativeBeneficiaryRulePutDraft(id, data);

export const getEligibilityCriteriaForSidebar = (): Promise<ConfigBeneficiaryRuleArrayDTO> =>
  InitiativeApi.getEligibilityCriteriaForSidebar();

export const initiativeStatistics = (id: string): Promise<InitiativeStatisticsDTO> =>
  InitiativeApi.initiativeStatistics(id);

export const putTrxAndRewardRules = (
  id: string,
  data: InitiativeRewardAndTrxRulesDTO
): Promise<void> => InitiativeApi.initiativeTrxAndRewardRulesPut(id, data);

export const putTrxAndRewardRulesDraft = (
  id: string,
  data: InitiativeRewardAndTrxRulesDTO
): Promise<void> => InitiativeApi.initiativeTrxAndRewardRulesPutDraft(id, data);

export const putRefundRule = (
  id: string,
  data: InitiativeRefundRuleDTO
): Promise<void> => InitiativeApi.updateInitiativeRefundRulePut(id, data);

export const putRefundRuleDraft = (
  id: string,
  data: InitiativeRefundRuleDTO
): Promise<void> => InitiativeApi.updateInitiativeRefundRuleDraftPut(id, data);

export const updateInitiativeApprovedStatus = (id: string): Promise<void> =>
  InitiativeApi.updateInitiativeApprovedStatus(id);

export const updateInitiativeToCheckStatus = (id: string): Promise<void> =>
  InitiativeApi.updateInitiativeToCheckStatus(id);

export const updateInitiativePublishedStatus = (id: string): Promise<void> =>
  InitiativeApi.updateInitiativePublishedStatus(id);

export const logicallyDeleteInitiative = (id: string): Promise<void> =>
  InitiativeApi.logicallyDeleteInitiative(id);

export const getExportsPaged = (
  id: string,
  page: number,
  notificationDateFrom?: string,
  notificationDateTo?: string,
  status?: string,
  sort?: string
): Promise<PageRewardExportsDTO> =>
  InitiativeApi.getExportsPaged(
    id,
    page,
    notificationDateFrom,
    notificationDateTo,
    status,
    sort
  );

export const getRewardFileDownload = (
  id: string,
  filePath: string
): Promise<SasToken> => InitiativeApi.getRewardFileDownload(id, filePath);

export const getOnboardingStatus = (
  id: string,
  page: number,
  beneficiary?: string,
  dateFrom?: string,
  dateTo?: string,
  state?: string
): Promise<OnboardingDTO> =>
  InitiativeApi.getOnboardingStatus(id, page, beneficiary, dateFrom, dateTo, state);

export const putDispFileUpload = (
  id: string,
  filename: string,
  file: File
): Promise<void> => InitiativeApi.putDispFileUpload(id, filename, file);

export const getRewardNotificationImportsPaged = (
  id: string,
  page: number,
  sort: string
): Promise<PageRewardImportsDTO> =>
  InitiativeApi.getRewardNotificationImportsPaged(id, page, sort);

export const uploadAndUpdateLogo = (
  id: string,
  file: File
): Promise<LogoDTO> => InitiativeApi.uploadAndUpdateLogo(id, file);

export const getDispFileErrors = (id: string, name: string): Promise<CsvDTO> =>
  InitiativeApi.getDispFileErrors(id, name);

export const getInitiativeOnboardingRankingStatusPaged = (
  id: string,
  page: number,
  beneficiary?: string,
  state?: string
): Promise<PageOnboardingRankingsDTO> =>
  InitiativeApi.getInitiativeOnboardingRankingStatusPaged(id, page, beneficiary, state);

export const notifyCitizenRankings = (id: string): Promise<void> =>
  InitiativeApi.notifyCitizenRankings(id);

export const getOrganizationsList = (): Promise<OrganizationListDTO> =>
  InitiativeApi.getOrganizationsList();

export const getWalletDetail = (id: string, cf: string): Promise<WalletDTO> =>
  InitiativeApi.getWalletDetail(id, cf);

export const getInstrumentList = (
  id: string,
  cf: string
): Promise<InstrumentListDTO> => InitiativeApi.getInstrumentList(id, cf);

export const getIban = (
  id: string,
  cf: string,
  iban: string
): Promise<IbanDTO> => InitiativeApi.getIban(id, cf, iban);

export const getTimeLine = (
  cf: string,
  id: string,
  opeType?: string,
  dateFrom?: string,
  dateTo?: string,
  page?: number
): Promise<TimelineDTO> =>
  InitiativeApi.getTimeLine(cf, id, opeType, dateFrom, dateTo, page);

export const getTimelineDetail = (
  cf: string,
  id: string,
  opeId: string
): Promise<OperationDTO> => InitiativeApi.getTimelineDetail(cf, id, opeId);

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
): Promise<ExportListDTO> =>
  InitiativeApi.getExportRefundsListPaged(initiativeId, exportId, page, cro, status);

export const getRefundDetail = (
  initiativeId: string,
  eventId: string
): Promise<RefundDetailDTO> => InitiativeApi.getRefundDetail(initiativeId, eventId);

export const getBeneficiaryOnboardingStatus = (
  initiativeId: string,
  fiscalCode: string
): Promise<OnboardingStatusDTO> =>
  InitiativeApi.getBeneficiaryOnboardingStatus(initiativeId, fiscalCode);

export const suspendUser = (
  initiativeId: string,
  fiscalCode: string,
  rewardType: InitiativeRewardTypeEnum
): Promise<void> => {
  if (rewardType === InitiativeRewardTypeEnum.REFUND) {
    return InitiativeApi.suspendUserRefund(initiativeId, fiscalCode);
  }

  return InitiativeApi.suspendUserDiscount(initiativeId, fiscalCode);
};

export const readmitUser = (
  initiativeId: string,
  fiscalCode: string,
  rewardType: InitiativeRewardTypeEnum
): Promise<void> => {
  if (rewardType === InitiativeRewardTypeEnum.REFUND) {
    return InitiativeApi.readmitUserRefund(initiativeId, fiscalCode);
  }

  return InitiativeApi.readmitUserDiscount(initiativeId, fiscalCode);
};

export const getFamilyComposition = (
  initiativeId: string,
  fiscalCode: string
): Promise<FamilyUnitCompositionDTO> =>
  InitiativeApi.getFamilyComposition(initiativeId, fiscalCode);