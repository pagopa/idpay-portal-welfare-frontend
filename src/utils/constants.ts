/* eslint-disable @typescript-eslint/semi */

const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const testToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQxNDY3ODYsImV4cCI6MTc2NDE3NTU4NiwiYXVkIjoiaWRwYXkud2VsZmFyZS5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL2FwaS1pby5kZXYuY3N0YXIucGFnb3BhLml0IiwidWlkIjoiMjcwMTJmNWYtYzY1MS00ZjIzLTljMzktZmFjYWU5NTAzZTUwIiwibmFtZSI6IkRpc25leSIsImZhbWlseV9uYW1lIjoiQnV0Y2giLCJlbWFpbCI6ImQuYnV0Y2hAdGVzdC5lbWFpbC5pdCIsIm9yZ19pZCI6ImI1YWUwYjQxLWI4NTQtNDE0ZS04Mjk1LTA3ODU5NWVlMWRhMSIsIm9yZ192YXQiOiIwNTY3ODcyMTAwMSIsIm9yZ19uYW1lIjoiQWcuTmF6LkF0dHJhemlvbmUgSW52ZXN0aW1lbnRpIFN2aWx1cHBvIEltcHJlc2EgU3BhIiwib3JnX3BhcnR5X3JvbGUiOiJPUEVSQVRPUiIsIm9yZ19yb2xlIjoib3BlcmF0b3IxIn0.Cln01TmL2Wlb_tpcZvfNd090afRY1cjI2mmrG5ZHWmcS4rqyDsB26aUAJl3Mdew3h3MMuyilDEtZN3DeVZRDKZjWWt8hb0TCnhy_wnv4opdATR-XOoG5KGCArqWSYyha64p4t8sNhmcFXQBiFiIyWeXBZLjbBgEp5HJBvQdtZB-_1CVT8TyLMn2LjKHxTu92jhNhfCQEFm0erZBqULPCfL8BUMkGXBMbIv9RNlPSkqkxzTZvCZSLfqArwLWwQ_Iqzbf9jAmmUjpExYeLL4va22T5GjkJOJulvQUgzQ72aM16Sviukx6vRgZJIzgYnEJ-8IsSgsd5GItOi87gTgmWhw';

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const LOADING_TASK_LOGIN_CHECK = 'LOGIN_CHECK';
export const LOADING_TASK_SEARCH_PARTIES = 'SEARCH_PARTIES';
export const LOADING_TASK_SEARCH_PARTY = 'SEARCH_PARTY';
export const LOADING_TASK_SEARCH_PRODUCTS = 'SEARCH_PRODUCTS';
export const LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS = 'INITIATIVE_REFUNDS_MERCHANT';

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
  TEXT = 'text',
}

export const PAGOPA_ADMIN_ROLE = 'pagopa_admin';
