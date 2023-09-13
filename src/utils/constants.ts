/* eslint-disable @typescript-eslint/semi */

const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const testToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2OTQ1OTc3OTAsImV4cCI6MTY5NDYyNjU5MCwiYXVkIjoiaWRwYXkud2VsZmFyZS5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL2FwaS1pby5kZXYuY3N0YXIucGFnb3BhLml0IiwidWlkIjoiNGJhMjgzMmQtOWM0Yy00MGYzLTkxMjYtZTFjNzI5MDVlZjE0IiwibmFtZSI6IlJvY2t5IiwiZmFtaWx5X25hbWUiOiJCYWxib2EiLCJlbWFpbCI6InIuYmFsYm9hQHRlc3QuZW1haWwuaXQiLCJvcmdfaWQiOiIzOTBjZWEzOC1mMmRlLTRiY2ItYTE4MS1kNmVlZjk5ZmU1MjgiLCJvcmdfdmF0IjoiODAxMTcwODI3MjQiLCJvcmdfbmFtZSI6IkVudGUgZGkgdGVzdCBJZFBheSIsIm9yZ19wYXJ0eV9yb2xlIjoiTUFOQUdFUiIsIm9yZ19yb2xlIjoiYWRtaW4ifQ.EViuomoGPSITvsWcQdZlhrX6K-lq13qM1ALIK8EmJx8FLxH7pP-8j931gl8M8wXC2uRYwEbIkFgy68JNK54jNYNo9BRHIbdCIYyk0TVHAvAHcbeqCiPvtdH_Vd_cubVu20sAHJFZVEgmdzknW6CjWLLX-64fX5wq2PcZJz4bTyQveZc02oOzWDmunDXc-NSgGQ0CDvy43tilSj6R9n-NwyPBDSCBjCjuvfYxpAa2Z7p38IxEchT6E6G9LOdf_-EDBPT3Oi-6DUNJkqerf41B0WYw551UKh0aBDMSXzKzE1J_K3XDEaxz2ikdeO8A_Dt4LFUKqIc3w1s0yAxz-SyaMg';

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const LOADING_TASK_LOGIN_CHECK = 'LOGIN_CHECK';
export const LOADING_TASK_SEARCH_PARTIES = 'SEARCH_PARTIES';
export const LOADING_TASK_SEARCH_PARTY = 'SEARCH_PARTY';
export const LOADING_TASK_SEARCH_PRODUCTS = 'SEARCH_PRODUCTS';

export enum USER_PERMISSIONS {
  READ_INITIATIVE_LIST = 'readIntitativeList',
  CREATE_INITIATIVE = 'createInitiative',
  UPDATE_INITIATIVE = 'updateInitiative',
  PUBLISH_INITIATIVE = 'publishInitiative',
  DRAFT_INITIATIVE = 'draftInitiative',
  SUSPEND_INITIATIVE = 'suspendInitiative',
  DELETE_INITIATIVE = 'deleteInitiative',
  READ_TRANSACTIONS_LIST = 'readTransactionsList',
  DOWNLOAD_REWARD_FILE = 'downloadRewardFile',
  DOWNLOAD_PAID_REWARD_FILE = 'downloadPaidRewardFile',
  REVIEW_INITIATIVE = 'reviewInitiative',
}

export enum WIZARD_ACTIONS {
  SUBMIT = 'SUBMIT',
  DRAFT = 'DRAFT',
  BACK = 'BACK',
}

export enum DateOfBirthOptions {
  YEAR = 'year',
  AGE = 'age',
}

export enum ResidencyOptions {
  POSTAL_CODE = 'postalCode',
  CITY_COUNCIL = 'cityCouncil',
  PROVINCE = 'province',
  CITY = 'city',
  REGION = 'region',
  NATION = 'nation',
}

export enum FilterOperator {
  EQ = 'EQ',
  NOT_EQ = 'NOT_EQ',
  LT = 'LT',
  LE = 'LE',
  GT = 'GT',
  GE = 'GE',
  BTW_CLOSED = 'BTW_CLOSED',
  BTW_OPEN = 'BTW_OPEN',
}

export enum ManualCriteriaOptions {
  BOOLEAN = 'boolean',
  MULTI = 'multi',
}

export const PAGOPA_ADMIN_ROLE = 'pagopa_admin';
