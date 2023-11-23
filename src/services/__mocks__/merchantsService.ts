import { merchantsApiMocked } from '../../api/__mocks__/merchantsApiClient';
import { MerchantUpdateDTO } from '../../api/generated/merchants/MerchantUpdateDTO';
import { MerchantListDTO } from '../../api/generated/merchants/MerchantListDTO';
import { MerchantStatusEnum } from '../../api/generated/merchants/MerchantDTO';
import { StatusEnum } from '../../api/generated/merchants/MerchantDetailDTO';
import { StatusEnum as TransactionStatusEnum } from '../../api/generated/merchants/MerchantTransactionDTO';
import { StatusEnum as TransactionProcessedStatusEnum } from '../../api/generated/merchants/MerchantTransactionProcessedDTO';
import { MerchantTransactionsListDTO } from '../../api/generated/merchants/MerchantTransactionsListDTO';
import { MerchantTransactionsProcessedListDTO } from '../../api/generated/merchants/MerchantTransactionsProcessedListDTO';

export const mockedInitiativeId = '62e29002aac2e94cfa3763dd';
export const mockedMerchantId = '1234';

export const mockedPage = 0;

export const mockedFile = new File([''], 'filename', { type: 'text/html' });

export const mockedMerchantUdatedStatus: MerchantUpdateDTO = {
  elabTimeStamp: new Date(),
  status: 'VALIDATED',
};

export const mockedMerchantsOnboardingList: MerchantListDTO = {
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

const startDate = new Date();
const endDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

export const mockedMerchantDetail = {
  businessName: 'Aaronne Travel',
  certifiedEmail: 'mail@aaronnetravel.com',
  creationDate: startDate,
  fiscalCode: '12345678',
  iban: 'IT12345678901111',
  initiativeId: '1234',
  legalOfficeAddress: 'Via roma 23',
  legalOfficeMunicipality: 'Roma',
  legalOfficeProvince: 'Lazio',
  legalOfficeZipCode: '123456',
  status: StatusEnum.UPLOADED,
  updateDate: endDate,
  vatNumber: '123456787',
};

export const mockedMerchantStatistics = {
  accrued: 100,
  amount: 10,
};

export const mockedMerchantTransactionList = {
  content: [
    {
      trxCode: 'string',
      trxId: '123456789',
      fiscalCode: 'string',
      effectiveAmount: 1000,
      updateDate: startDate,
      status: TransactionStatusEnum.CREATED,
      trxDate: new Date(),
      trxExpirationSeconds: 300,
      qrcodePngUrl: 'example.com/image',
      qrcodeTxtUrl: 'example.com/image',
    },
    {
      trxCode: 'string',
      trxId: 'asdfggfhjkl',
      fiscalCode: 'string',
      effectiveAmount: 1303,
      updateDate: startDate,
      status: TransactionStatusEnum.AUTHORIZED,
      trxDate: new Date(),
      trxExpirationSeconds: 300,
      qrcodePngUrl: 'example.com/image',
      qrcodeTxtUrl: 'example.com/image',
    },
    {
      trxCode: 'string',
      trxId: 'zxcvbnmzxcv',
      fiscalCode: 'string',
      effectiveAmount: 2322,
      updateDate: startDate,
      status: TransactionStatusEnum.IDENTIFIED,
      trxDate: new Date(),
      trxExpirationSeconds: 300,
      qrcodePngUrl: 'example.com/image',
      qrcodeTxtUrl: 'example.com/image',
    },
    {
      trxCode: 'string',
      trxId: '12345asdfgf',
      fiscalCode: 'string',
      effectiveAmount: 5000,
      updateDate: startDate,
      status: TransactionStatusEnum.REJECTED,
      trxDate: new Date(),
      trxExpirationSeconds: 300,
      qrcodePngUrl: 'example.com/image',
      qrcodeTxtUrl: 'example.com/image',
    },
  ],
  pageNo: 0,
  pageSize: 10,
  totalElements: 4,
  totalPages: 1,
};

export const mockedMerchantTransactionProcessedList = {
  content: [
    {
      trxCode: 'string',
      trxId: '12345asdfgf',
      fiscalCode: 'string',
      effectiveAmount: 5000,
      updateDate: startDate,
      status: TransactionProcessedStatusEnum.REWARDED,
      trxDate: new Date(),
      trxExpirationMinutes: 4320,
      qrcodePngUrl: 'example.com/image',
      qrcodeTxtUrl: 'example.com/image',
    },
    {
      trxCode: 'string',
      trxId: '12345asdfgf',
      fiscalCode: 'string',
      effectiveAmount: 5000,
      updateDate: startDate,
      status: TransactionProcessedStatusEnum.CANCELLED,
      trxDate: new Date(),
      trxExpirationMinutes: 4320,
      qrcodePngUrl: 'example.com/image',
      qrcodeTxtUrl: 'example.com/image',
    },
  ],
  pageNo: 0,
  pageSize: 10,
  totalElements: 4,
  totalPages: 1,
};

export const uploadMerchantList = (mockedInitiativeId: string, mockedFile: File) =>
  merchantsApiMocked.uploadMerchantList(mockedInitiativeId, mockedFile);

export const getMerchantList = (mockedInitiativeId: string, mockedPage: number) =>
  merchantsApiMocked.getMerchantList(mockedInitiativeId, mockedPage);

export const getMerchantDetail = (mockedInitiativeId: string, mockedMerchantId: string) =>
  merchantsApiMocked.getMerchantDetail(mockedInitiativeId, mockedMerchantId);

export const getMerchantInitiativeStatistics = (
  mockedInitiativeId: string,
  mockedMerchantId: string
) => merchantsApiMocked.getMerchantInitiativeStatistics(mockedInitiativeId, mockedMerchantId);

export const getMerchantTransactions = (
  merchantId: string,
  initiativeId: string,
  page: number,
  fiscalCode?: string,
  status?: string
): Promise<MerchantTransactionsListDTO> =>
  merchantsApiMocked.getMerchantTransactions(merchantId, initiativeId, page, fiscalCode, status);

export const getMerchantTransactionsProcessed = (
  merchantId: string,
  initiativeId: string,
  page: number,
  fiscalCode?: string,
  status?: string
): Promise<MerchantTransactionsProcessedListDTO> =>
  merchantsApiMocked.getMerchantTransactionsProcessed(
    merchantId,
    initiativeId,
    page,
    fiscalCode,
    status
  );
