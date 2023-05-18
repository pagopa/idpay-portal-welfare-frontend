import { merchantsApiMocked } from '../api/__mocks__/merchantsApiClient';
import { MerchantOnboardingDTO } from '../api/generated/merchants/MerchantOnboardingDTO';
import { MerchantUpdateDTO } from '../api/generated/merchants/MerchantUpdateDTO';
import { merchantsApi } from '../api/merchantsApiClient';

export const uploadMerchantList = async (id: string, file: File): Promise<MerchantUpdateDTO> => {
  if (process.env.REACT_APP_API_MOCK_MERCHANTS === 'true') {
    return merchantsApiMocked.uploadMerchantList(id, file);
  }
  return merchantsApi.uploadMerchantList(id, file);
};

export const getMerchantsOnboardingList = async (
  id: string,
  page: number,
  fiscalCode?: string
): Promise<MerchantOnboardingDTO> => {
  if (process.env.REACT_APP_API_MOCK_MERCHANTS === 'true') {
    return merchantsApiMocked.getMerchantsOnboardingList(id, page);
  }
  return merchantsApi.getMerchantsOnboardingList(id, page, fiscalCode);
};
