/* eslint-disable @typescript-eslint/semi */

const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const testToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2OTcxMTQyMjksImV4cCI6MTY5NzE0MzAyOSwiYXVkIjoiaWRwYXkud2VsZmFyZS5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL2FwaS1pby5kZXYuY3N0YXIucGFnb3BhLml0IiwidWlkIjoiYjg5ODZiZjItMWY5My00ODI3LWFiMTYtYjIxZWI4YWVhZTJiIiwibmFtZSI6IlRlc3QiLCJmYW1pbHlfbmFtZSI6IklEUGF5IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwib3JnX2lkIjoiMmY2M2ExNTEtZGE0ZS00ZTFlLWFjZjktYWRlY2MwYzRkNzI3Iiwib3JnX3ZhdCI6IjExMTIyMjMzMzQ0Iiwib3JnX25hbWUiOiJFbnRlVGVzdCIsIm9yZ19wYXJ0eV9yb2xlIjoiQURNSU4iLCJvcmdfcm9sZSI6ImFkbWluIn0.kABnGd69lGEQQKSU2G9xykrlVZK1HiDKGuaPyT0FH9oMf8hDOiRcpSpegrtZ0Nls0opY6EyKxQchPCVOlc_wuqZUrelpgtzwN5jUnD1XAYW2F9EOfUNH8Lp8_-f3fuHDeo9t6YVIGlsS4Y5TP2YsBdiSz_Di__vip2IL07-jYKpWCYpKOBxI94yvZQYzUZvATUm3bWCHBGs_AIUjxP3BYQAXLKNxsaaKPyjJ79vt6uwsJEfk7IvN4T8fOBvB7t5XViTROgZBPd5U0NMZUqI06ABr4kComa5gjga6PMlzLXVT7Apf-lU2HiGZJAF2Rd161pkgFx65nLh2pe8iI7OTSg';

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
