/* eslint-disable @typescript-eslint/semi */

const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const testToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3Mzk1NDAyNDYsImV4cCI6MTczOTU2OTA0NiwiYXVkIjoiaWRwYXkud2VsZmFyZS5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL2FwaS1pby5kZXYuY3N0YXIucGFnb3BhLml0IiwidWlkIjoiODM4NDM4NjQtZjNjMC00ZGVmLWJhZGItN2YxOTc0NzFiNzJlIiwibmFtZSI6InBpcHBvIiwiZmFtaWx5X25hbWUiOiJxd2VydHkiLCJlbWFpbCI6InBpcHBvQHRlc3RpZHBheWVtYWlsLml0Iiwib3JnX2lkIjoiMzkwY2VhMzgtZjJkZS00YmNiLWExODEtZDZlZWY5OWZlNTI4Iiwib3JnX3ZhdCI6IjgwMTE3MDgyNzI0Iiwib3JnX25hbWUiOiJFbnRlIGRpIHRlc3QgSWRQYXkiLCJvcmdfcGFydHlfcm9sZSI6IlNVQl9ERUxFR0FURSIsIm9yZ19yb2xlIjoiYWRtaW4ifQ.wydVN5bYtnNwlMSX91VnYKQ0Qq-VzqgXFzhaTqtJLMy7JFLIQ9UhL3dZfxuiw6gjDzLLpAX-9zCJOjf34vC-VsWx1x18VmRlylkA3yKF8475bNDrSxPxcxkHCnO-M4C7NjlQuAReiq6vEzG2v8VgDzemoB8dH07VFlITM5KcleEldJfCyTu5RDdOFmi3_nENVTCgIDcelkKm8iEo2xQCDYsp13Z1u2IivsFJM4aRuIp8Yqipn0An2-wkjayFuoDGS_H9Q6xXBv9JjnWtYllgJwYZDsg-klfN0oKWn995EjSpF6K8FLonb0mY2Lca6lrDH9WHS31dfedvnqbUnWnseQ';

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
  TEXT = 'text',
}

export const PAGOPA_ADMIN_ROLE = 'pagopa_admin';
