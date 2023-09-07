/* eslint-disable @typescript-eslint/semi */

const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const testToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2OTQwODAxNDQsImV4cCI6MTY5NDEwODk0NCwiYXVkIjoiaWRwYXkud2VsZmFyZS5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL2FwaS1pby5kZXYuY3N0YXIucGFnb3BhLml0IiwidWlkIjoiODM4NDM4NjQtZjNjMC00ZGVmLWJhZGItN2YxOTc0NzFiNzJlIiwibmFtZSI6InBpcHBvIiwiZmFtaWx5X25hbWUiOiJxd2VydHkiLCJlbWFpbCI6InBpcHBvQHRlc3QuZW1haWwuaXQiLCJvcmdfaWQiOiIzOTBjZWEzOC1mMmRlLTRiY2ItYTE4MS1kNmVlZjk5ZmU1MjgiLCJvcmdfdmF0IjoiODAxMTcwODI3MjQiLCJvcmdfbmFtZSI6IkVudGUgZGkgdGVzdCBJZFBheSIsIm9yZ19wYXJ0eV9yb2xlIjoiU1VCX0RFTEVHQVRFIiwib3JnX3JvbGUiOiJhZG1pbiJ9.B9-JMAv2Ftusof60ShkcYTARTLG0SG9sab8u3g6BCyTWvygUMy6Zwu16m4PAuvmGmHGscD58hPiGBVE0VXQlLhFPBlunUX5nVbGtgabED05BPi00_KN63ZajSb26owcVo_MQT5W9LOjnp48BezZEqdVSHM0H0esRDF4Pwxcgy2-VI9M19Q1bRPG9VTPYU0bCcLKYX3XhdfpAMw92p_4uCZwQ67VMkmJjZB2qeRVjPquT9VmONTJFy1ePiodhRiFWrRIJ7zYuFrWsswpJawTooEGfx2NAGAzvvdox6hVDKIGhNh0Jq4dOpJ1EKsfgxkwGGb6xz5VoCYivZEr8I5XKjw';

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
