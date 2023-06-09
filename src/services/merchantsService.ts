import { merchantsApiMocked } from '../api/__mocks__/merchantsApiClient';
import { MerchantListDTO } from '../api/generated/merchants/MerchantListDTO';

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
