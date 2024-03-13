// import { merchantsApiMocked } from '../api/__mocks__/merchantsApiClient';
import { MerchantDetailDTO } from '../api/generated/merchants/MerchantDetailDTO';
import { MerchantListDTO } from '../api/generated/merchants/MerchantListDTO';
import { MerchantStatisticsDTO } from '../api/generated/merchants/MerchantStatisticsDTO';
import { MerchantTransactionsListDTO } from '../api/generated/merchants/MerchantTransactionsListDTO';
import { MerchantTransactionsProcessedListDTO } from '../api/generated/merchants/MerchantTransactionsProcessedListDTO';

import { MerchantUpdateDTO } from '../api/generated/merchants/MerchantUpdateDTO';
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
  fiscalCode?: string,
  status?: string
): Promise<MerchantTransactionsProcessedListDTO> => 
   merchantsApi.getMerchantTransactionsProcessed(
    merchantId,
    initiativeId,
    page,
    fiscalCode,
    status
  );

