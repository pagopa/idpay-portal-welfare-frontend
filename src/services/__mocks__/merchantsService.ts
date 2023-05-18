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
      businessName: 'aaaa',
      merchantStatus: MerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'bbbb',
      businessName: 'bbbb',
      merchantStatus: MerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'cccc',
      businessName: 'cccc',
      merchantStatus: MerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'dddd',
      businessName: 'dddd',
      merchantStatus: MerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'eeee',
      businessName: 'eeee',
      merchantStatus: MerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'ffff',
      businessName: 'ffff',
      merchantStatus: MerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'gggg',
      businessName: 'gggg',
      merchantStatus: MerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'hhhh',
      businessName: 'hhhh',
      merchantStatus: MerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'iiii',
      businessName: 'iiii',
      merchantStatus: MerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'llll',
      businessName: 'llll',
      merchantStatus: MerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date(),
    },
    {
      merchantId: 'llll',
      businessName: 'llll',
      merchantStatus: undefined,
      fiscalCode: '12345678901',
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
