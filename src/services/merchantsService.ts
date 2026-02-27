// import { merchantsApiMocked } from '../api/__mocks__/merchantsApiClient';
import { DownloadInvoiceResponseDTO } from '../api/generated/merchants/DownloadInvoiceResponseDTO';
import { DownloadReportResponseDTO } from '../api/generated/merchants/DownloadReportResponseDTO';
import { DownloadRewardBatchResponseDTO } from '../api/generated/merchants/DownloadRewardBatchResponseDTO';
import { ListPointOfSaleDTO } from '../api/generated/merchants/ListPointOfSaleDTO';
import { MerchantDetailDTO } from '../api/generated/merchants/MerchantDetailDTO';
import { MerchantListDTO } from '../api/generated/merchants/MerchantListDTO';
import { MerchantStatisticsDTO } from '../api/generated/merchants/MerchantStatisticsDTO';
import { MerchantTransactionsListDTO } from '../api/generated/merchants/MerchantTransactionsListDTO';
import { MerchantTransactionsProcessedListDTO } from '../api/generated/merchants/MerchantTransactionsProcessedListDTO';

import { MerchantUpdateDTO } from '../api/generated/merchants/MerchantUpdateDTO';
import { ReportDTO, ReportTypeEnum } from '../api/generated/merchants/ReportDTO';
import { ReportListDTO } from '../api/generated/merchants/ReportListDTO';
import { RewardBatchDTO } from '../api/generated/merchants/RewardBatchDTO';
import { RewardBatchListDTO } from '../api/generated/merchants/RewardBatchListDTO';
import { RewardBatchTrxStatusEnum } from '../api/generated/merchants/RewardBatchTrxStatus';
import { TransactionActionRequest } from '../api/generated/merchants/TransactionActionRequest';
import { TransactionActionResponse } from '../api/generated/merchants/TransactionActionResponse';
import { merchantsApi } from '../api/merchantsApiClient';

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
  rewardBatchTrxStatus?: RewardBatchTrxStatusEnum,
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
  assigneeLevel?: string,
  merchantId?: string,
  month?: string,
  status?: string,
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
  startPeriod: Date,
  endPeriod: Date,
  reportType: ReportTypeEnum,
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
