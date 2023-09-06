const IS_DEVELOP = process.env.NODE_ENV === 'development';

// export const testToken =
//   'eyJraWQiOiJqd3QtZXhjaGFuZ2VfZDQ6ZWY6NjQ6NzY6YWY6MjI6MWY6NDg6MTA6MDM6ZTQ6NjE6NmU6Y2M6Nzk6MmYiLCJhbGciOiJSUzI1NiJ9.eyJlbWFpbCI6ImRtYXJ0aW5vQGxpdmUuY29tIiwiZmFtaWx5X25hbWUiOiJMb25nbyIsImZpc2NhbF9udW1iZXIiOiJMTkdNTEU4NVAxOUM4MjZKIiwibmFtZSI6IkVtaWxpYSIsImZyb21fYWEiOmZhbHNlLCJ1aWQiOiJiOWI4OWVmOS00ZGNiLTRlMjctODE5Mi1kOTcyZWZlZjYxNGUiLCJsZXZlbCI6IkwyIiwiaWF0IjoxNjU1OTgyMjE0LCJleHAiOjE2NTU5ODIyMjksImF1ZCI6InBvcnRhbGUtcGEuY29sbC5wbi5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL3VhdC5zZWxmY2FyZS5wYWdvcGEuaXQiLCJqdGkiOiI5NWM3M2M0OS0xNTE3LTRlODAtYWNhNy1iZjE4NDZkOTJhNTMiLCJvcmdhbml6YXRpb24iOnsiaWQiOiJvbmJvYXJkZWQiLCJyb2xlcyI6W3sicGFydHlSb2xlIjoiTUFOQUdFUiIsInJvbGUiOiJyZWZlcmVudGUtbGVnYWxlIn1dLCJmaXNjYWxfY29kZSI6IjgwMDA4NTEwNzU0In0sImRlc2lyZWRfZXhwIjoxNjU2MDE0NjA0fQ==.VjoWV-iWxqGh2VwB82fTJT04VnY5cIEePMUCQBHVAt7GziuCg12XV8EKQa0cqVa25ggF6peReHicO_WEuhrXsFdLohYT5OCe1gA_65SGJp1bxvPL-0yOvrnEje7XE57nU3YzE6ssq9KDi4wdVr4_RC1JwliiAPq411j1-osyt9vtqQU_b-cfJxQ-v99dlq-TiRPCWX37h8Y-2q4zOF0RTw6McCP8_6j-iaq0tFOi5aq-NjssEvr_eYLLtQwBsBOX3OFysmmhq5dUPDov24WaPZcpbbzCEBPiqW6J69qSxyQUmztNjRfFYD5lsWKvThbmYWh0DSUbWuk8uahITriytw';

// Nuovo token

export const testToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2OTM5ODk4MDQsImV4cCI6MTY5NDAxODYwNCwiYXVkIjoiaWRwYXkud2VsZmFyZS5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL2FwaS1pby5kZXYuY3N0YXIucGFnb3BhLml0IiwidWlkIjoiODM4NDM4NjQtZjNjMC00ZGVmLWJhZGItN2YxOTc0NzFiNzJlIiwibmFtZSI6InBpcHBvIiwiZmFtaWx5X25hbWUiOiJxd2VydHkiLCJlbWFpbCI6InBpcHBvQHRlc3QuZW1haWwuaXQiLCJvcmdfaWQiOiIzOTBjZWEzOC1mMmRlLTRiY2ItYTE4MS1kNmVlZjk5ZmU1MjgiLCJvcmdfdmF0IjoiODAxMTcwODI3MjQiLCJvcmdfbmFtZSI6IkVudGUgZGkgdGVzdCBJZFBheSIsIm9yZ19wYXJ0eV9yb2xlIjoiU1VCX0RFTEVHQVRFIiwib3JnX3JvbGUiOiJhZG1pbiJ9.tHVxQPnLMpB7bB9JYX7ZEp8eVAn5-FH1jkE8PwgQQguU9R2dwxLocDkYRGB6v55m31v6vodqaUuk3GCOoU_YkBtZF3r16BpgCnE2F6LT6PVwgRc9eJc31EGPW2HxyP9jQPSEgLknJcyGpCX8ADN2pSkRINL4_ywtrrK6yJicUL2gtfB047lya0DuADfjyAgFu_Hjk6bdCT7ixNd4XS-5BVp26ZpQWuDh6LVVI21ivYwrzUtnMwIUz5BY7P8zWRo9T4_ullHKHVSUoFOfcEKZAm-mOD2WxTkvZ8yrICE0WHUxRZ5oFuYYrr7A2E5QjCSgnWR7CqMUY-W9vlXDSzoIXQ';
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
