import {
  mockedMerchantDetail,
  mockedMerchantStatistics,
  mockedMerchantTransactionList,
  mockedMerchantTransactionProcessedList,
  mockedMerchantUdatedStatus,
  mockedMerchantsOnboardingList,
} from '../../services/__mocks__/merchantsService';
import { MerchantDetailDTO } from '../generated/merchants/MerchantDetailDTO';
import { MerchantListDTO } from '../generated/merchants/MerchantListDTO';
import { MerchantStatisticsDTO } from '../generated/merchants/MerchantStatisticsDTO';
import { MerchantTransactionsListDTO } from '../generated/merchants/MerchantTransactionsListDTO';
import { MerchantTransactionsProcessedListDTO } from '../generated/merchants/MerchantTransactionsProcessedListDTO';

import { MerchantUpdateDTO } from '../generated/merchants/MerchantUpdateDTO';

export const merchantsApiMocked = {
  uploadMerchantList: async (_id: string, _file: File): Promise<MerchantUpdateDTO> =>
    new Promise((resolve) => resolve(mockedMerchantUdatedStatus)),

  getMerchantList: async (_id: string, _page: number): Promise<MerchantListDTO> =>
    new Promise((resolve) => resolve(mockedMerchantsOnboardingList)),

  getMerchantDetail: async (
    _initiativeId: string,
    _merchantId: string
  ): Promise<MerchantDetailDTO> => new Promise((resolve) => resolve(mockedMerchantDetail)),

  getMerchantInitiativeStatistics: async (
    _initiativeId: string,
    _merchantId: string
  ): Promise<MerchantStatisticsDTO> => new Promise((resolve) => resolve(mockedMerchantStatistics)),

  getMerchantTransactions: async (
    _merchantId: string,
    _initiativeId: string,
    _page: number,
    _fiscalCode?: string,
    _status?: string
  ): Promise<MerchantTransactionsListDTO> =>
    new Promise((resolve) => resolve(mockedMerchantTransactionList)),

  getMerchantTransactionsProcessed: async (
    _merchantId: string,
    _initiativeId: string,
    _page: number,
    _fiscalCode?: string,
    _status?: string
  ): Promise<MerchantTransactionsProcessedListDTO> =>
    new Promise((resolve) => resolve(mockedMerchantTransactionProcessedList)),
};
