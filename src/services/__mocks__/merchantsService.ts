import { merchantsApiMocked } from '../../api/__mocks__/merchantsApiClient';
import { MerchantUpdateDTO, MerchantListDTO, MerchantTransactionsListDTO, MerchantTransactionsProcessedListDTO, MerchantDtoMerchantStatusEnum, MerchantTransactionDtoStatusEnum, MerchantTransactionProcessedDtoStatusEnum, MerchantDetailDtoStatusEnum } from '../../api/generated/merchants/apiClient';

export const mockedInitiativeId = '62e29002aac2e94cfa3763dd';
export const mockedMerchantId = '1234';

export const mockedPage = 0;

export const mockedFile = new File([''], 'filename', { type: 'text/html' });

export const mockedMerchantUdatedStatus: MerchantUpdateDTO = {
  elabTimeStamp: new Date().toDateString(),
  status: 'VALIDATED',
};

export const mockedMerchantsOnboardingList: MerchantListDTO = {
  content: [
    {
      merchantId: 'aaaa',
      businessName: 'aaaa',
      merchantStatus: MerchantDtoMerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date().toDateString(),
    },
    {
      merchantId: 'bbbb',
      businessName: 'bbbb',
      merchantStatus: MerchantDtoMerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date().toDateString(),
    },
    {
      merchantId: 'cccc',
      businessName: 'cccc',
      merchantStatus: MerchantDtoMerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date().toDateString(),
    },
    {
      merchantId: 'dddd',
      businessName: 'dddd',
      merchantStatus: MerchantDtoMerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date().toDateString(),
    },
    {
      merchantId: 'eeee',
      businessName: 'eeee',
      merchantStatus: MerchantDtoMerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date().toDateString(),
    },
    {
      merchantId: 'ffff',
      businessName: 'ffff',
      merchantStatus: MerchantDtoMerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date().toDateString(),
    },
    {
      merchantId: 'gggg',
      businessName: 'gggg',
      merchantStatus: MerchantDtoMerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date().toDateString(),
    },
    {
      merchantId: 'hhhh',
      businessName: 'hhhh',
      merchantStatus: MerchantDtoMerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date().toDateString(),
    },
    {
      merchantId: 'iiii',
      businessName: 'iiii',
      merchantStatus: MerchantDtoMerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date().toDateString(),
    },
    {
      merchantId: 'llll',
      businessName: 'llll',
      merchantStatus: MerchantDtoMerchantStatusEnum.UPLOADED,
      fiscalCode: '12345678901',
      updateStatusDate: new Date().toDateString(),
    },
    {
      merchantId: 'llll',
      businessName: 'llll',
      merchantStatus: undefined,
      fiscalCode: '12345678901',
      updateStatusDate: new Date().toDateString(),
    },
  ],
  pageNo: 0,
  pageSize: 10,
  totalElements: 10,
  totalPages: 1,
};

const startDate = new Date().toDateString();
const endDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toDateString();

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
  status: MerchantDetailDtoStatusEnum.UPLOADED,
  updateDate: endDate,
  vatNumber: '123456787',
};

export const mockedMerchantStatistics = {
  accruedCents: 100,
  amountCents: 10,
};

export const mockedMerchantTransactionList = {
  content: [
    {
      trxCode: 'string',
      trxId: '123456789',
      fiscalCode: 'string',
      effectiveAmountCents: 1000,
      updateDate: startDate,
      status: MerchantTransactionDtoStatusEnum.CREATED,
      trxDate: new Date().toDateString(),
      trxExpirationSeconds: 300,
      qrcodePngUrl: 'example.com/image',
      qrcodeTxtUrl: 'example.com/image',
    },
    {
      trxCode: 'string',
      trxId: 'asdfggfhjkl',
      fiscalCode: 'string',
      effectiveAmountCents: 1303,
      updateDate: startDate,
      status: MerchantTransactionDtoStatusEnum.AUTHORIZED,
      trxDate: new Date().toDateString(),
      trxExpirationSeconds: 300,
      qrcodePngUrl: 'example.com/image',
      qrcodeTxtUrl: 'example.com/image',
    },
    {
      trxCode: 'string',
      trxId: 'zxcvbnmzxmv',
      fiscalCode: 'string',
      effectiveAmountCents: 2372,
      updateDate: startDate,
      status: MerchantTransactionDtoStatusEnum.AUTHORIZATION_REQUESTED,
      trxDate: new Date().toDateString(),
      trxExpirationSeconds: 300,
      qrcodePngUrl: 'example.com/image',
      qrcodeTxtUrl: 'example.com/image',
    },
    {
      trxCode: 'string',
      trxId: 'zxcvbnmzxcv',
      fiscalCode: 'string',
      effectiveAmountCents: 2322,
      updateDate: startDate,
      status: MerchantTransactionDtoStatusEnum.IDENTIFIED,
      trxDate: new Date().toDateString(),
      trxExpirationSeconds: 300,
      qrcodePngUrl: 'example.com/image',
      qrcodeTxtUrl: 'example.com/image',
    },
    {
      trxCode: 'string',
      trxId: '12345asdfgf',
      fiscalCode: 'string',
      effectiveAmountCents: 5000,
      updateDate: startDate,
      status: MerchantTransactionDtoStatusEnum.REJECTED,
      trxDate: new Date().toDateString(),
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
      effectiveAmountCents: Number(5000),
      updateDate: startDate,
      status: MerchantTransactionProcessedDtoStatusEnum.REWARDED,
      trxDate: new Date().toDateString(),
      trxExpirationMinutes: 4320,
      qrcodePngUrl: 'example.com/image',
      qrcodeTxtUrl: 'example.com/image',
    },
    {
      trxCode: 'string',
      trxId: '12345asdfgf',
      fiscalCode: 'string',
      effectiveAmountCents: Number(5000),
      updateDate: startDate,
      status: MerchantTransactionProcessedDtoStatusEnum.CANCELLED,
      trxDate: new Date().toDateString(),
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
