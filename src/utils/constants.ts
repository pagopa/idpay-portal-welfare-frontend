/* eslint-disable @typescript-eslint/semi */

const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const testToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NzM4MjQ2MzYsImV4cCI6MTc3Mzg1MzQzNiwiYXVkIjoiaWRwYXkud2VsZmFyZS5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL2FwaS1pby5kZXYuY3N0YXIucGFnb3BhLml0IiwidWlkIjoiOGRjZmNhOTYtMmZkZi00ZjMzLTllODMtM2FkNTI4ZDBkYTM1IiwibmFtZSI6IkRpc25leSIsImZhbWlseV9uYW1lIjoiUm9jayIsImVtYWlsIjoiZC5yb2NrQHRlc3QuZW1haWwuaXQiLCJvcmdfaWQiOiJiNWFlMGI0MS1iODU0LTQxNGUtODI5NS0wNzg1OTVlZTFkYTEiLCJvcmdfdmF0IjoiMDU2Nzg3MjEwMDEiLCJvcmdfbmFtZSI6IkFnLk5hei5BdHRyYXppb25lIEludmVzdGltZW50aSBTdmlsdXBwbyBJbXByZXNhIFNwYSIsIm9yZ19wYXJ0eV9yb2xlIjoiT1BFUkFUT1IiLCJvcmdfcm9sZSI6Im9wZXJhdG9yMiJ9.Oc-ln7V1T5rFOuIETw3HyRSCy7JQJpZdttbF-rH8B6CZSHd_FXdLDL6CaKWSCWfLN5NipGJ5qOBUhoqM7bhP9pIgrFvx-YbgD8-uNH5nCjf3QJ4Us-Nhcjs1KZmb14404trsoPGQOqXSEdMa6_pwI52pkP0nR6QFQMCabdG6tUYhTTqI3D9pY1ghZvtlqC9OBSeoLm22xkRbtuIwSQK2t0uHdCuqDF5Lh7CxKSn5FxxEWkjzmobuVY_ZGiAWVzNO_vlYmmxuT0GqBAoY09u0zOMZedvRu3hmHZvAZlTq80NEOqyoBJKb4Y61zsIJGIyxq6npgadajve5n854FSj41Q';

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const LOADING_TASK_LOGIN_CHECK = 'LOGIN_CHECK';
export const LOADING_TASK_SEARCH_PARTIES = 'SEARCH_PARTIES';
export const LOADING_TASK_SEARCH_PARTY = 'SEARCH_PARTY';
export const LOADING_TASK_SEARCH_PRODUCTS = 'SEARCH_PRODUCTS';
export const LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS = 'INITIATIVE_REFUNDS_MERCHANT';
export const LOADING_TASK_INITIATIVE_EXPORT_REPORT = 'INITIATIVE_EXPORT_REPORT';
export const LOADING_TASK_INITIATIVE_EXPORT_REPORT_USERS = 'INITIATIVE_EXPORT_REPORT_USERS';

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
