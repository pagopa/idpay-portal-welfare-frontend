import { merchantsApiMocked } from '../../api/__mocks__/merchantsApiClient';
import { MerchantOnboardingDTO } from '../../api/generated/merchants/MerchantOnboardingDTO';
import { MerchantStatusEnum } from '../../api/generated/merchants/MerchantOnboardingStatusDTO';
import { MerchantUpdateDTO } from '../../api/generated/merchants/MerchantUpdateDTO';

export const mockedInitiativeId = '62e29002aac2e94cfa3763dd';

export const mockedPage = 0;

export const mockedFile = new File([''], 'filename', { type: 'text/html' });

export const mockedMerchantUdatedStatus: MerchantUpdateDTO = {
  elabTimeStamp: new Date(),
  status: 'OK',
};

export const mockedMerchantsOnboardingList: MerchantOnboardingDTO = {
  content: [
    {
      merchantId: 'aaaa',
      merchantName: 'aaaa',
      merchantStatus: MerchantStatusEnum.INVITED,
      merchantVat: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'bbbb',
      merchantName: 'bbbb',
      merchantStatus: MerchantStatusEnum.ONBOARDING_OK,
      merchantVat: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'cccc',
      merchantName: 'cccc',
      merchantStatus: MerchantStatusEnum.INVITED,
      merchantVat: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'dddd',
      merchantName: 'dddd',
      merchantStatus: MerchantStatusEnum.INVITED,
      merchantVat: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'eeee',
      merchantName: 'eeee',
      merchantStatus: MerchantStatusEnum.ONBOARDING_OK,
      merchantVat: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'ffff',
      merchantName: 'ffff',
      merchantStatus: MerchantStatusEnum.INVITED,
      merchantVat: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'gggg',
      merchantName: 'gggg',
      merchantStatus: MerchantStatusEnum.ONBOARDING_OK,
      merchantVat: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'hhhh',
      merchantName: 'hhhh',
      merchantStatus: MerchantStatusEnum.INVITED,
      merchantVat: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'iiii',
      merchantName: 'iiii',
      merchantStatus: MerchantStatusEnum.ONBOARDING_OK,
      merchantVat: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'llll',
      merchantName: 'llll',
      merchantStatus: MerchantStatusEnum.ONBOARDING_OK,
      merchantVat: '12345678901',
      updateStatusDate: new Date(),
    },
  ],
  pageNo: 0,
  pageSize: 10,
  totalElements: 10,
  totalPages: 1,
};

export const uploadMerchantList = (mockedInitiativeId: string, mockedFile: File) =>
  merchantsApiMocked.uploadMerchantList(mockedInitiativeId, mockedFile);

export const getMerchantsOnboardingList = (mockedInitiativeId: string, mockedPage: number) =>
  merchantsApiMocked.getMerchantsOnboardingList(mockedInitiativeId, mockedPage);
