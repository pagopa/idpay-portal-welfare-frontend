import {
  mockedMerchantUdatedStatus,
  mockedMerchantsOnboardingList,
} from '../../services/__mocks__/merchantsService';
import { MerchantListDTO } from '../generated/merchants/MerchantListDTO';

import { MerchantUpdateDTO } from '../generated/merchants/MerchantUpdateDTO';

export const merchantsApiMocked = {
  uploadMerchantList: async (_id: string, _file: File): Promise<MerchantUpdateDTO> =>
    new Promise((resolve) => resolve(mockedMerchantUdatedStatus)),

  getMerchantList: async (_id: string, _page: number): Promise<MerchantListDTO> =>
    new Promise((resolve) => resolve(mockedMerchantsOnboardingList)),
};
