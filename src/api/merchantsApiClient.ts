import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { ENV } from '../utils/env';
import { store } from '../redux/store';
import { createClient, WithDefaultsT } from './generated/merchants/client';
import { MerchantUpdateDTO } from './generated/merchants/MerchantUpdateDTO';
import { MerchantListDTO } from './generated/merchants/MerchantListDTO';
import { MerchantDetailDTO } from './generated/merchants/MerchantDetailDTO';
import { MerchantStatisticsDTO } from './generated/merchants/MerchantStatisticsDTO';
import { MerchantTransactionsProcessedListDTO } from './generated/merchants/MerchantTransactionsProcessedListDTO';
import { MerchantTransactionsListDTO } from './generated/merchants/MerchantTransactionsListDTO';
import { RewardBatchListDTO } from './generated/merchants/RewardBatchListDTO';
import { RewardBatchTrxStatusEnum } from './generated/merchants/RewardBatchTrxStatus';
import { DownloadInvoiceResponseDTO } from './generated/merchants/DownloadInvoiceResponseDTO';
import { TransactionActionRequest } from './generated/merchants/TransactionActionRequest';
import { TransactionActionResponse } from './generated/merchants/TransactionActionResponse';
import { ListPointOfSaleDTO } from './generated/merchants/ListPointOfSaleDTO';
import { buildFetchApiLayer } from './buildFetchApiLayer';
import { RewardBatchDTO } from './generated/merchants/RewardBatchDTO';
import { DownloadRewardBatchResponseDTO } from './generated/merchants/DownloadRewardBatchResponseDTO';

const withBearerAndPartyId: WithDefaultsT<'Bearer'> = (wrappedOperation) => (params: any) => {
  const token = storageTokenOps.read();
  return wrappedOperation({
    ...params,
    Bearer: `Bearer ${token}`,
  });
};

const merchantsApiClient = createClient({
  baseUrl: ENV.URL_API.MERCHANTS,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.MERCHANTS),
  withDefaults: withBearerAndPartyId,
});

const merchantsApiClientFetchLayer = createClient({
  baseUrl: ENV.URL_API.MERCHANTS,
  basePath: '',
  fetchApi: buildFetchApiLayer(),
  withDefaults: withBearerAndPartyId,
});

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

export const merchantsApi = {
  uploadMerchantList: async (id: string, file: File): Promise<MerchantUpdateDTO> => {
    const result = await merchantsApiClient.uploadMerchantList({ initiativeId: id, file });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getMerchantList: async (
    id: string,
    page: number,
    fiscalCode?: string
  ): Promise<MerchantListDTO> => {
    const result = await merchantsApiClient.getMerchantList({
      initiativeId: id,
      page,
      fiscalCode,
      size: 10,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getMerchantDetail: async (
    initiativeId: string,
    merchantId: string
  ): Promise<MerchantDetailDTO> => {
    const result = await merchantsApiClient.getMerchantDetail({ initiativeId, merchantId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getMerchantInitiativeStatistics: async (
    initiativeId: string,
    merchantId: string
  ): Promise<MerchantStatisticsDTO> => {
    const result = await merchantsApiClient.getMerchantInitiativeStatistics({
      initiativeId,
      merchantId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getMerchantTransactions: async (
    merchantId: string,
    initiativeId: string,
    page: number,
    fiscalCode?: string,
    status?: string
  ): Promise<MerchantTransactionsListDTO> => {
    const result = await merchantsApiClient.getMerchantTransactions({
      merchantId,
      initiativeId,
      page,
      size: 10,
      fiscalCode,
      status,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getMerchantTransactionsProcessed: async (
    merchantId: string,
    initiativeId: string,
    page: number,
    size: number,
    sort?: string,
    fiscalCode?: string,
    status?: string,
    rewardBatchId?: string,
    rewardBatchTrxStatus?: RewardBatchTrxStatusEnum,
    pointOfSaleId?: string
  ): Promise<MerchantTransactionsProcessedListDTO> => {
    const result = await merchantsApiClient.getMerchantTransactionsProcessed({
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
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getRewardBatches: async (
    initiativeId: string,
    page: number,
    size: number,
    assigneeLevel?: string
  ): Promise<RewardBatchListDTO> => {
    const result = await merchantsApiClient.getRewardBatches({
      initiativeId,
      page,
      size,
      assigneeLevel
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getDownloadInvoice: async (
    pointOfSaleId: string, transactionId: string, xMerchantId: string): Promise<DownloadInvoiceResponseDTO> => {
    const result = await merchantsApiClient.downloadInvoiceFile({
      pointOfSaleId,
      transactionId,
      'x-merchant-id': xMerchantId
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  approveTrx: async (
    initiativeId: string, rewardBatchId: string, body: TransactionActionRequest): Promise<TransactionActionResponse> => {
    const result = await merchantsApiClient.approveTransactions({
      initiativeId,
      rewardBatchId,
      body
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  suspendTrx: async (
    initiativeId: string, rewardBatchId: string, body: TransactionActionRequest): Promise<TransactionActionResponse> => {
    const result = await merchantsApiClient.suspendTransactions({
      initiativeId,
      rewardBatchId,
      body
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  rejectTrx: async (
    initiativeId: string, rewardBatchId: string, body: TransactionActionRequest): Promise<TransactionActionResponse> => {
    const result = await merchantsApiClient.rejectTransactions({
      initiativeId,
      rewardBatchId,
      body
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getPos: async (
    merchantId: string,
    size: number | undefined
  ): Promise<ListPointOfSaleDTO> => {
    const result = await merchantsApiClient.getPointOfSales({
      merchantId,
      size,
      "sort": "franchiseName,asc"
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  validateBatch: async (
    initiativeId: string, rewardBatchId: string): Promise<RewardBatchDTO> => {
    const result = await merchantsApiClientFetchLayer.validateRewardBatch({
      initiativeId,
      rewardBatchId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  approveBatch: async (
    initiativeId: string, rewardBatchId: string): Promise<RewardBatchDTO> => {
    const result = await merchantsApiClientFetchLayer.approveRewardBatch({
      initiativeId,
      rewardBatchId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getDownloadCsv: async (
    initiativeId: string, rewardBatchId: string, xMerchantId: string): Promise<DownloadRewardBatchResponseDTO> => {
    const result = await merchantsApiClient.approveDownloadRewardBatch({
      initiativeId,
      rewardBatchId,
      'x-merchant-id': xMerchantId
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
