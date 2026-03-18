import { AxiosError } from 'axios';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { ENV } from '../utils/env';
import { store } from '../redux/store';
import {
  Api,
  HttpClient,
  RequestParams,
  RewardBatchStatus as SwaggerRewardBatchStatus,
  RewardBatchTrxStatus as SwaggerRewardBatchTrxStatus,
  ReportRequest as SwaggerReportRequest,
  TransactionActionRequest as SwaggerTransactionActionRequest,
  ReportTypeEnum,
  AssigneeLevelEnum,
} from './generated/merchants-swagger/apiClient';
import { DownloadInvoiceResponseDTO } from './generated/merchants-swagger/apiClient';
import { DownloadReportResponseDTO } from './generated/merchants-swagger/apiClient';
import { DownloadRewardBatchResponseDTO } from './generated/merchants-swagger/apiClient';
import { ListPointOfSaleDTO } from './generated/merchants-swagger/apiClient';
import { MerchantDetailDTO } from './generated/merchants-swagger/apiClient';
import { MerchantListDTO } from './generated/merchants-swagger/apiClient';
import { MerchantStatisticsDTO } from './generated/merchants-swagger/apiClient';
import { MerchantTransactionsListDTO } from './generated/merchants-swagger/apiClient';
import { MerchantTransactionsProcessedListDTO } from './generated/merchants-swagger/apiClient';
import { MerchantUpdateDTO } from './generated/merchants-swagger/apiClient';
import { ReportDTO } from './generated/merchants-swagger/apiClient';
import { ReportListDTO } from './generated/merchants-swagger/apiClient';
import { RewardBatchDTO } from './generated/merchants-swagger/apiClient';
import { RewardBatchListDTO } from './generated/merchants-swagger/apiClient';
import { RewardBatchTrxStatus } from './generated/merchants-swagger/apiClient';
import { TransactionActionRequest } from './generated/merchants-swagger/apiClient';
import { TransactionActionResponse } from './generated/merchants-swagger/apiClient';

const merchantsSwaggerHttpClient = new HttpClient<{ token: string }>({
  baseURL: ENV.URL_API.MERCHANTS,
  securityWorker: (securityData) => ({
    headers: {
      Authorization: `Bearer ${securityData?.token ?? ''}`,
    },
  }),
});

const api = new Api(merchantsSwaggerHttpClient);

const isUnauthorizedError = (error: unknown): boolean => {
  const axiosError = error as AxiosError | undefined;
  return axiosError?.response?.status === 401;
};

const onRedirectToLogin = () =>
  store.dispatch(
    appStateActions.addError({
      id: 'tokenNotValid',
      error: new Error(),
      techDescription: 'token expired or not valid',
      toNotify: false,
      blocking: false,
      displayableTitle: i18n.t('session.expired.title'),
      displayableDescription: i18n.t('session.expired.message'),
    })
  );

const withAuth = () =>
  merchantsSwaggerHttpClient.setSecurityData({
    token: storageTokenOps.read(),
  });

const execute = async <T>(operation: () => Promise<{ data: unknown }>): Promise<T> => {
  withAuth();
  try {
    const response = await operation();
    return response.data as T;
  } catch (error) {
    if (isUnauthorizedError(error)) {
      onRedirectToLogin();
    }
    throw error;
  }
};

const toSwaggerRewardBatchStatus = (
  status?: string
): SwaggerRewardBatchStatus | undefined =>
  status ? (status as unknown as SwaggerRewardBatchStatus) : undefined;

const toSwaggerRewardBatchTrxStatus = (
  status?: RewardBatchTrxStatus
): SwaggerRewardBatchTrxStatus | undefined =>
  status ? (status as unknown as SwaggerRewardBatchTrxStatus) : undefined;

const toSwaggerReportType = (
  reportType: ReportTypeEnum
): SwaggerReportRequest['reportType'] =>
  reportType as unknown as SwaggerReportRequest['reportType'];

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
        rewardBatchTrxStatus: toSwaggerRewardBatchTrxStatus(rewardBatchTrxStatus),
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
    status?: string,
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
        status: toSwaggerRewardBatchStatus(status),
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
    reportType: ReportTypeEnum,
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
          reportType: toSwaggerReportType(reportType),
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

export const mercahntsSwaggerApi = merchantsApi;
