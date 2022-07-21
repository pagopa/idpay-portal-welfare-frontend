const IS_DEVELOP = process.env.NODE_ENV === 'development';

// export const testToken =
//   'eyJraWQiOiJqd3QtZXhjaGFuZ2VfZDQ6ZWY6NjQ6NzY6YWY6MjI6MWY6NDg6MTA6MDM6ZTQ6NjE6NmU6Y2M6Nzk6MmYiLCJhbGciOiJSUzI1NiJ9.eyJlbWFpbCI6ImRtYXJ0aW5vQGxpdmUuY29tIiwiZmFtaWx5X25hbWUiOiJMb25nbyIsImZpc2NhbF9udW1iZXIiOiJMTkdNTEU4NVAxOUM4MjZKIiwibmFtZSI6IkVtaWxpYSIsImZyb21fYWEiOmZhbHNlLCJ1aWQiOiJiOWI4OWVmOS00ZGNiLTRlMjctODE5Mi1kOTcyZWZlZjYxNGUiLCJsZXZlbCI6IkwyIiwiaWF0IjoxNjU1OTgyMjE0LCJleHAiOjE2NTU5ODIyMjksImF1ZCI6InBvcnRhbGUtcGEuY29sbC5wbi5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL3VhdC5zZWxmY2FyZS5wYWdvcGEuaXQiLCJqdGkiOiI5NWM3M2M0OS0xNTE3LTRlODAtYWNhNy1iZjE4NDZkOTJhNTMiLCJvcmdhbml6YXRpb24iOnsiaWQiOiJvbmJvYXJkZWQiLCJyb2xlcyI6W3sicGFydHlSb2xlIjoiTUFOQUdFUiIsInJvbGUiOiJyZWZlcmVudGUtbGVnYWxlIn1dLCJmaXNjYWxfY29kZSI6IjgwMDA4NTEwNzU0In0sImRlc2lyZWRfZXhwIjoxNjU2MDE0NjA0fQ==.VjoWV-iWxqGh2VwB82fTJT04VnY5cIEePMUCQBHVAt7GziuCg12XV8EKQa0cqVa25ggF6peReHicO_WEuhrXsFdLohYT5OCe1gA_65SGJp1bxvPL-0yOvrnEje7XE57nU3YzE6ssq9KDi4wdVr4_RC1JwliiAPq411j1-osyt9vtqQU_b-cfJxQ-v99dlq-TiRPCWX37h8Y-2q4zOF0RTw6McCP8_6j-iaq0tFOi5aq-NjssEvr_eYLLtQwBsBOX3OFysmmhq5dUPDov24WaPZcpbbzCEBPiqW6J69qSxyQUmztNjRfFYD5lsWKvThbmYWh0DSUbWuk8uahITriytw';

// Nuovo token
export const testToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NTgzMjkzNDAsImV4cCI6MTY1ODM1ODE0MCwiYXVkIjoiaWRwYXkud2VsZmFyZS5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL2FwaS1pby5kZXYuY3N0YXIucGFnb3BhLml0IiwidWlkIjoiYjg5ODZiZjItMWY5My00ODI3LWFiMTYtYjIxZWI4YWVhZTJiIiwibmFtZSI6IlRlc3QiLCJmYW1pbHlfbmFtZSI6IklEUGF5IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwib3JnX2lkIjoiMmY2M2ExNTEtZGE0ZS00ZTFlLWFjZjktYWRlY2MwYzRkNzI3Iiwib3JnX3ZhdCI6IjAwNjA4NzIwMjcyIiwib3JnX3BhcnR5X3JvbGUiOiJNQU5BR0VSIiwib3JnX3JvbGUiOiJhZG1pbiJ9.ugArrKYIKEoIRhzt4yZjbMSjXzoPjRO32wFyK8fEImlkyV8YuoZv5TtXxOWujpHF0WrOxdXYr59UPwwialfuFaG1QZ5l4o6tWNnEqk1RCKSycPyZ4tWugwBMRWA5h8AR7jouML65fl2kWyzkQGejH5SF8Y8NpiY7o48bi3sn-d9R0t7TSqRT77JjqTc2XOoiUpcJFHuLgra9RUHbd7A8-Zxwa2b__MYqfYq5I0ZBmHzea_Fgujw7AgWgjUiae6fWt8-F-TtBG0cEih-6e9tW4TBJsI5Cee3cVvy5TMKpsKMXVO_BzkOcOROIpafuDDZBYUXOhJJ0aju8W8DsDvA1lA';

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const LOADING_TASK_LOGIN_CHECK = 'LOGIN_CHECK';
export const LOADING_TASK_SEARCH_PARTIES = 'SEARCH_PARTIES';
export const LOADING_TASK_SEARCH_PARTY = 'SEARCH_PARTY';
export const LOADING_TASK_SEARCH_PRODUCTS = 'SEARCH_PRODUCTS';

export enum WIZARD_ACTIONS {
  SUBMIT = 'SUBMIT',
  DRAFT = 'DRAFT',
  BACK = 'BACK',
}

export enum BeneficiaryTypeEnum {
  PF = 'PF',
  PG = 'PG',
}

export enum DateOfBirthOptions {
  YEAR = 'year',
  AGE = 'age',
}

export enum ResidencyOptions {
  POSTAL_CODE = 'postalCode',
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
  INSTANCE_OF = 'INSTANCE_OF',
  IN = 'IN',
}

export enum ManualCriteriaOptions {
  BOOLEAN = 'boolean',
  MULTI = 'multi',
}
