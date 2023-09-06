import { merchantsApiMocked } from '../api/__mocks__/merchantsApiClient';
import { MerchantDetailDTO } from '../api/generated/merchants/MerchantDetailDTO';
import { MerchantListDTO } from '../api/generated/merchants/MerchantListDTO';
import { MerchantStatisticsDTO } from '../api/generated/merchants/MerchantStatisticsDTO';
import { MerchantTransactionsListDTO } from '../api/generated/merchants/MerchantTransactionsListDTO';
import { MerchantTransactionsProcessedListDTO } from '../api/generated/merchants/MerchantTransactionsProcessedListDTO';

import { MerchantUpdateDTO } from '../api/generated/merchants/MerchantUpdateDTO';
import { merchantsApi } from '../api/merchantsApiClient';

export const uploadMerchantList = async (id: string, file: File): Promise<MerchantUpdateDTO> => {
  if (process.env.REACT_APP_API_MOCK_MERCHANTS === 'true') {
    return merchantsApiMocked.uploadMerchantList(id, file);
  }
  return merchantsApi.uploadMerchantList(id, file);
};

export const getMerchantList = async (
  id: string,
  page: number,
  fiscalCode?: string
): Promise<MerchantListDTO> => {
  if (process.env.REACT_APP_API_MOCK_MERCHANTS === 'true') {
    return merchantsApiMocked.getMerchantList(id, page);
  }
  return merchantsApi.getMerchantList(id, page, fiscalCode);
};

export const getMerchantDetail = async (
  initiativeId: string,
  merchantId: string
): Promise<MerchantDetailDTO> => {
  if (process.env.REACT_APP_API_MOCK_MERCHANTS === 'true') {
    return merchantsApiMocked.getMerchantDetail(initiativeId, merchantId);
  }
  return merchantsApi.getMerchantDetail(initiativeId, merchantId);
};

export const getMerchantInitiativeStatistics = (
  initiativeId: string,
  merchantId: string
): Promise<MerchantStatisticsDTO> => {
  if (process.env.REACT_APP_API_MOCK_MERCHANTS === 'true') {
    return merchantsApiMocked.getMerchantInitiativeStatistics(initiativeId, merchantId);
  }
  return merchantsApi.getMerchantInitiativeStatistics(initiativeId, merchantId);
};

export const getMerchantTransactions = (
  merchantId: string,
  initiativeId: string,
  page: number,
  fiscalCode?: string,
  status?: string
): Promise<MerchantTransactionsListDTO> => {
  if (process.env.REACT_APP_API_MOCK_MERCHANTS === 'true') {
    return merchantsApiMocked.getMerchantTransactions(
      merchantId,
      initiativeId,
      page,
      fiscalCode,
      status
    );
  }
  return merchantsApi.getMerchantTransactions(merchantId, initiativeId, page, fiscalCode, status);
};

export const getMerchantTransactionsProcessed = (
  merchantId: string,
  initiativeId: string,
  page: number,
  fiscalCode?: string,
  status?: string
): Promise<MerchantTransactionsProcessedListDTO> => {
  if (process.env.REACT_APP_API_MOCK_MERCHANTS === 'true') {
    return merchantsApiMocked.getMerchantTransactionsProcessed(
      merchantId,
      initiativeId,
      page,
      fiscalCode,
      status
    );
  }
  return merchantsApi.getMerchantTransactionsProcessed(
    merchantId,
    initiativeId,
    page,
    fiscalCode,
    status
  );
};
