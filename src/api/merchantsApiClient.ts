import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { ENV } from '../utils/env';
import {
  Api,
  HttpClient,
  RequestParams,
  TransactionActionRequest as SwaggerTransactionActionRequest,
  ReportTypeEnum,
  AssigneeLevelEnum,
  DownloadInvoiceResponseDTO,
  DownloadReportResponseDTO,
  DownloadRewardBatchResponseDTO,
  ListPointOfSaleDTO,
  MerchantDetailDTO,
  MerchantListDTO,
  MerchantStatisticsDTO,
  MerchantTransactionsListDTO,
  MerchantTransactionsProcessedListDTO,
  MerchantUpdateDTO,
  ReportDTO,
  ReportListDTO,
  RewardBatchDTO,
  RewardBatchListDTO,
  RewardBatchTrxStatus,
  TransactionActionRequest,
  TransactionActionResponse,
  RewardBatchStatus,
  ReportRequestReportTypeEnum,
} from './generated/merchants/apiClient';
import { handleUnauthorizedError } from './swaggerApiClientUtils';

const merchantsSwaggerHttpClient = new HttpClient<{ token: string }>({
  baseURL: ENV.URL_API.MERCHANTS,
  timeout: ENV.API_TIMEOUT_MS.MERCHANTS,
  securityWorker: (securityData) => ({
    headers: {
      Authorization: `Bearer ${securityData?.token ?? ''}`,
    },
  }),
});

const api = new Api(merchantsSwaggerHttpClient);

const withAuth = () =>
  merchantsSwaggerHttpClient.setSecurityData({
    token: storageTokenOps.read(),
  });

const execute = async <T>(operation: () => Promise<{ data: T }>): Promise<T> => {
  withAuth();
  try {
    const response = await operation();
    return response.data;
  } catch (error) {
    return handleUnauthorizedError<T>(error);
  }
};

const toSwaggerTransactionActionRequest = (
  body: TransactionActionRequest
): SwaggerTransactionActionRequest => ({
  ...body,
  transactionIds: [...body.transactionIds],
});

export const merchantsApi = {
  uploadMerchantList: async (id: string, file: File): Promise<MerchantUpdateDTO> =>
    execute(() => api.initiative.uploadMerchantList({ initiativeId: id }, { file })),

  getMerchantList: async (
    id: string,
    page: number,
    fiscalCode?: string
  ): Promise<MerchantListDTO> =>
    execute(() =>
      api.initiative.getMerchantList({
        initiativeId: id,
        page,
        fiscalCode,
        size: 2500,
        sort: 'businessName,asc',
      })
    ),

  getMerchantDetail: async (
    initiativeId: string,
    merchantId: string
  ): Promise<MerchantDetailDTO> =>
    execute(() =>
      api.merchantId.getMerchantDetail({
        initiativeId,
        merchantId,
      })
    ),

  getMerchantInitiativeStatistics: async (
    initiativeId: string,
    merchantId: string
  ): Promise<MerchantStatisticsDTO> =>
    execute(() =>
      api.merchantId.getMerchantInitiativeStatistics({
        initiativeId,
        merchantId,
      })
    ),

  getMerchantTransactions: async (
    merchantId: string,
    initiativeId: string,
    page: number,
    fiscalCode?: string,
    status?: string
  ): Promise<MerchantTransactionsListDTO> =>
    execute(() =>
      api.merchantId.getMerchantTransactions({
        merchantId,
        initiativeId,
        page,
        size: 10,
        fiscalCode,
        status: status as unknown as
          | 'CREATED'
          | 'IDENTIFIED'
          | 'AUTHORIZATION_REQUESTED'
          | 'AUTHORIZED'
          | 'REJECTED'
          | undefined,
      })
    ),

  getMerchantTransactionsProcessed: async (
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
    execute(() =>
      api.merchantId.getMerchantTransactionsProcessed({
        merchantId,
        initiativeId,
        page,
        size,
        sort,
        fiscalCode,
        status: status as unknown as 'REWARDED' | 'CANCELLED' | undefined,
        rewardBatchId,
        rewardBatchTrxStatus,
        pointOfSaleId,
        trxCode,
      })
    ),

  getRewardBatches: async (
    initiativeId: string,
    page: number,
    size: number,
    assigneeLevel?: AssigneeLevelEnum,
    merchantId?: string,
    month?: string,
    status?: RewardBatchStatus,
    sort?: any
  ): Promise<RewardBatchListDTO> =>
    execute(() =>
      api.initiatives.getRewardBatches({
        initiativeId,
        page,
        size,
        assigneeLevel,
        merchantId,
        month,
        status,
        sort,
      })
    ),

  getDownloadInvoice: async (
    pointOfSaleId: string,
    transactionId: string,
    xMerchantId: string
  ): Promise<DownloadInvoiceResponseDTO> => {
    const requestParams: RequestParams = {
      headers: {
        'x-merchant-id': xMerchantId,
      },
    };

    return execute(() =>
      api.pointOfSaleId.downloadInvoiceFile(
        {
          pointOfSaleId,
          transactionId,
        },
        requestParams
      )
    );
  },

  approveTrx: async (
    initiativeId: string,
    rewardBatchId: string,
    body: TransactionActionRequest
  ): Promise<TransactionActionResponse> =>
    execute(() =>
      api.initiatives.approveTransactions(
        {
          initiativeId,
          rewardBatchId,
        },
        toSwaggerTransactionActionRequest(body)
      )
    ),

  suspendTrx: async (
    initiativeId: string,
    rewardBatchId: string,
    body: TransactionActionRequest
  ): Promise<TransactionActionResponse> =>
    execute(() =>
      api.initiatives.suspendTransactions(
        {
          initiativeId,
          rewardBatchId,
        },
        toSwaggerTransactionActionRequest(body)
      )
    ),

  rejectTrx: async (
    initiativeId: string,
    rewardBatchId: string,
    body: TransactionActionRequest
  ): Promise<TransactionActionResponse> =>
    execute(() =>
      api.initiatives.rejectTransactions(
        {
          initiativeId,
          rewardBatchId,
        },
        toSwaggerTransactionActionRequest(body)
      )
    ),

  getPos: async (
    merchantId: string,
    size: number | undefined
  ): Promise<ListPointOfSaleDTO> =>
    execute(() =>
      api.merchantId.getPointOfSales({
        merchantId,
        size,
        sort: 'franchiseName,asc',
      })
    ),

  validateBatch: async (
    initiativeId: string,
    rewardBatchId: string
  ): Promise<RewardBatchDTO> =>
    execute(() =>
      api.initiatives.validateRewardBatch({
        initiativeId,
        rewardBatchId,
      })
    ),

  approveBatch: async (
    initiativeId: string,
    rewardBatchId: string
  ): Promise<RewardBatchDTO> =>
    execute(() =>
      api.initiatives.approveRewardBatch({
        initiativeId,
        rewardBatchId,
      })
    ),

  getDownloadCsv: async (
    initiativeId: string,
    rewardBatchId: string
  ): Promise<DownloadRewardBatchResponseDTO> =>
    execute(() =>
      api.initiatives.approveDownloadRewardBatch({
        initiativeId,
        rewardBatchId,
      })
    ),

  generateReport: async (
    initiativeId: string,
    startPeriod: string,
    endPeriod: string,
    reportType: ReportRequestReportTypeEnum,
    merchantId?: string
  ): Promise<ReportDTO> =>
    execute(() =>
      api.initiative.generateReport(
        {
          initiativeId,
          merchantId,
        },
        {
          startPeriod,
          endPeriod,
          reportType,
        }
      )
    ),

  getReportList: async (
    initiativeId: string,
    page: number,
    size: number,
    reportType: ReportTypeEnum
  ): Promise<ReportListDTO> =>
    execute(() =>
      api.initiative.getReports({
        initiativeId,
        page,
        size,
        reportType,
      })
    ),

  getDownloadReport: async (
    initiativeId: string,
    reportId: string
  ): Promise<DownloadReportResponseDTO> =>
    execute(() =>
      api.initiative.downloadReport({
        initiativeId,
        reportId,
      })
    ),
};