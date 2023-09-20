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
    fiscalCode?: string,
    status?: string
  ): Promise<MerchantTransactionsProcessedListDTO> => {
    const result = await merchantsApiClient.getMerchantTransactionsProcessed({
      merchantId,
      initiativeId,
      page,
      size: 10,
      fiscalCode,
      status,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
