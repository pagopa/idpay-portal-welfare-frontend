import { DownloadInvoiceResponseDTO, DownloadReportResponseDTO, DownloadRewardBatchResponseDTO, ListPointOfSaleDTO, MerchantDetailDTO, MerchantListDTO, MerchantStatisticsDTO, MerchantTransactionsListDTO, MerchantTransactionsProcessedListDTO, MerchantUpdateDTO, ReportDTO, ReportListDTO, RewardBatchDTO, RewardBatchListDTO, RewardBatchTrxStatus, TransactionActionRequest, TransactionActionResponse, AssigneeLevelEnum, ReportTypeEnum, RewardBatchStatus, ReportRequestReportTypeEnum } from "../api/generated/merchants/apiClient";
import { merchantsApi } from "../api/merchantsApiClient";

export const uploadMerchantList = async (id: string, file: File): Promise<MerchantUpdateDTO> => merchantsApi.uploadMerchantList(id, file);

export const getMerchantList = async (
  id: string,
  page: number,
  fiscalCode?: string
): Promise<MerchantListDTO> => merchantsApi.getMerchantList(id, page, fiscalCode);

export const getMerchantDetail = async (
  initiativeId: string,
  merchantId: string
): Promise<MerchantDetailDTO> => merchantsApi.getMerchantDetail(initiativeId, merchantId);

export const getMerchantInitiativeStatistics = (
  initiativeId: string,
  merchantId: string
): Promise<MerchantStatisticsDTO> => merchantsApi.getMerchantInitiativeStatistics(initiativeId, merchantId);

export const getMerchantTransactions = (
  merchantId: string,
  initiativeId: string,
  page: number,
  fiscalCode?: string,
  status?: string
): Promise<MerchantTransactionsListDTO> => merchantsApi.getMerchantTransactions(merchantId, initiativeId, page, fiscalCode, status);

export const getMerchantTransactionsProcessed = (
  merchantId: string,
  initiativeId: string,
  page: number,
  size: number,
  sort?: string,
  fiscalCode?: string,
  status?: string,
  rewardBatchId?: string,
  rewardBatchTrxStatus?: RewardBatchTrxStatus,
  pointOfSaleId?: string,
  trxCode?: string

): Promise<MerchantTransactionsProcessedListDTO> =>
  merchantsApi.getMerchantTransactionsProcessed(
    merchantId,
    initiativeId,
    page,
    size,
    sort,
    fiscalCode,
    status,
    rewardBatchId,
    rewardBatchTrxStatus,
    pointOfSaleId,
    trxCode
  );

export const getRewardBatches = (
  initiativeId: string,
  page: number,
  size: number,
  assigneeLevel?: AssigneeLevelEnum,
  merchantId?: string,
  month?: string,
  status?: RewardBatchStatus,
  sort?: string
): Promise<RewardBatchListDTO> =>
  merchantsApi.getRewardBatches(
    initiativeId,
    page,
    size,
    assigneeLevel,
    merchantId,
    month,
    status,
    sort
  );

export const getDownloadInvoice = (
  pointOfSaleId: string,
  transactionId: string,
  xMerchantId: string
): Promise<DownloadInvoiceResponseDTO> =>
  merchantsApi.getDownloadInvoice(
    pointOfSaleId,
    transactionId,
    xMerchantId
  );

export const approveTrx = (
  initiativeId: string,
  rewardBatchId: string,
  trxs: TransactionActionRequest,
): Promise<TransactionActionResponse> =>
  merchantsApi.approveTrx(
    initiativeId,
    rewardBatchId,
    trxs
  );

export const suspendTrx = (
  initiativeId: string,
  rewardBatchId: string,
  trxs: TransactionActionRequest,
): Promise<TransactionActionResponse> =>
  merchantsApi.suspendTrx(
    initiativeId,
    rewardBatchId,
    trxs
  );

export const rejectTrx = (
  initiativeId: string,
  rewardBatchId: string,
  trxs: TransactionActionRequest,
): Promise<TransactionActionResponse> =>
  merchantsApi.rejectTrx(
    initiativeId,
    rewardBatchId,
    trxs
  );

export const getPOS = (
  merchantId: string,
  size: number | undefined
): Promise<ListPointOfSaleDTO> =>
  merchantsApi.getPos(
    merchantId,
    size
  );

export const validateBatch = (
  initiativeId: string,
  rewardBatchId: string,
): Promise<RewardBatchDTO> =>
  merchantsApi.validateBatch(
    initiativeId,
    rewardBatchId,
  );

export const approveBatch = (
  initiativeId: string,
  rewardBatchId: string,
): Promise<RewardBatchDTO> =>
  merchantsApi.approveBatch(
    initiativeId,
    rewardBatchId,
  );

export const getDownloadCsv = (
  initiativeId: string,
  rewardBatchId: string
): Promise<DownloadRewardBatchResponseDTO> =>
  merchantsApi.getDownloadCsv(
    initiativeId,
    rewardBatchId
  );

export const generateReport = (
  initiativeId: string,
  startPeriod: string,
  endPeriod: string,
  reportType: ReportRequestReportTypeEnum,
  merchantId?: string,
): Promise<ReportDTO> =>
  merchantsApi.generateReport(
    initiativeId,
    startPeriod,
    endPeriod,
    reportType,
    merchantId,
  );

export const getReportList = (
  initiativeId: string,
  page: number,
  size: number,
  reportType: ReportTypeEnum
): Promise<ReportListDTO> =>
  merchantsApi.getReportList(
    initiativeId,
    page,
    size,
    reportType
  );

export const getDownloadReport = (
  initiativeId: string,
  reportId: string
): Promise<DownloadReportResponseDTO> =>
  merchantsApi.getDownloadReport(
    initiativeId,
    reportId
  );
