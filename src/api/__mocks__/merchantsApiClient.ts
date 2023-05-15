import {
  mockedMerchantUdatedStatus,
  mockedMerchantsOnboardingList,
} from '../../services/__mocks__/merchantsService';
import { MerchantOnboardingDTO } from '../generated/merchants/MerchantOnboardingDTO';
import { MerchantUpdateDTO } from '../generated/merchants/MerchantUpdateDTO';

export const merchantsApiMocked = {
  uploadMerchantList: async (_id: string, _file: File): Promise<MerchantUpdateDTO> =>
    new Promise((resolve) => resolve(mockedMerchantUdatedStatus)),

  getMerchantsOnboardingList: async (_id: string, _page: number): Promise<MerchantOnboardingDTO> =>
    new Promise((resolve) => resolve(mockedMerchantsOnboardingList)),
};
