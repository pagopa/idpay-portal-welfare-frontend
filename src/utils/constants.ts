const IS_DEVELOP = process.env.NODE_ENV === 'development';

// export const testToken =
//   'eyJraWQiOiJqd3QtZXhjaGFuZ2VfZDQ6ZWY6NjQ6NzY6YWY6MjI6MWY6NDg6MTA6MDM6ZTQ6NjE6NmU6Y2M6Nzk6MmYiLCJhbGciOiJSUzI1NiJ9.eyJlbWFpbCI6ImRtYXJ0aW5vQGxpdmUuY29tIiwiZmFtaWx5X25hbWUiOiJMb25nbyIsImZpc2NhbF9udW1iZXIiOiJMTkdNTEU4NVAxOUM4MjZKIiwibmFtZSI6IkVtaWxpYSIsImZyb21fYWEiOmZhbHNlLCJ1aWQiOiJiOWI4OWVmOS00ZGNiLTRlMjctODE5Mi1kOTcyZWZlZjYxNGUiLCJsZXZlbCI6IkwyIiwiaWF0IjoxNjU1OTgyMjE0LCJleHAiOjE2NTU5ODIyMjksImF1ZCI6InBvcnRhbGUtcGEuY29sbC5wbi5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL3VhdC5zZWxmY2FyZS5wYWdvcGEuaXQiLCJqdGkiOiI5NWM3M2M0OS0xNTE3LTRlODAtYWNhNy1iZjE4NDZkOTJhNTMiLCJvcmdhbml6YXRpb24iOnsiaWQiOiJvbmJvYXJkZWQiLCJyb2xlcyI6W3sicGFydHlSb2xlIjoiTUFOQUdFUiIsInJvbGUiOiJyZWZlcmVudGUtbGVnYWxlIn1dLCJmaXNjYWxfY29kZSI6IjgwMDA4NTEwNzU0In0sImRlc2lyZWRfZXhwIjoxNjU2MDE0NjA0fQ==.VjoWV-iWxqGh2VwB82fTJT04VnY5cIEePMUCQBHVAt7GziuCg12XV8EKQa0cqVa25ggF6peReHicO_WEuhrXsFdLohYT5OCe1gA_65SGJp1bxvPL-0yOvrnEje7XE57nU3YzE6ssq9KDi4wdVr4_RC1JwliiAPq411j1-osyt9vtqQU_b-cfJxQ-v99dlq-TiRPCWX37h8Y-2q4zOF0RTw6McCP8_6j-iaq0tFOi5aq-NjssEvr_eYLLtQwBsBOX3OFysmmhq5dUPDov24WaPZcpbbzCEBPiqW6J69qSxyQUmztNjRfFYD5lsWKvThbmYWh0DSUbWuk8uahITriytw';

// Nuovo token
export const testToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NjE0OTkzNzMsImV4cCI6MTY2MTUyODE3MywiYXVkIjoiaWRwYXkud2VsZmFyZS5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL2FwaS1pby5kZXYuY3N0YXIucGFnb3BhLml0IiwidWlkIjoiOWFiY2JlMjUtOTlmNC00MGY5LWEwM2ItYWZlZDljZDliYjhhIiwibmFtZSI6Ik1hcmlvIiwiZmFtaWx5X25hbWUiOiJSb3NzaSIsImVtYWlsIjoidGVzdEB0b2tlbi5pdCIsIm9yZ19pZCI6IjJmNjNhMTUxLWRhNGUtNGUxZS1hY2Y5LWFkZWNjMGM0ZDcyNyIsIm9yZ192YXQiOiIxMTEyMjIzMzM0NCIsIm9yZ19wYXJ0eV9yb2xlIjoiQURNSU4iLCJvcmdfcm9sZSI6IkFQSSJ9.o1oWjvCbkvRWCpWDaJN8eAmtwaqNCbV09xIlyrHEG93aF1wGqqMrGnhgRUHsAs2P7TQum5xngvQT4dk9zHlslj5flzAcYgGcfR8pjiFV8lLWRO3QzeRMhAGp66jNPBifNJnUYSFsWkiL6phY5edcM7cuYqs_RqumBd0-Q22cdqzrMtWN0WkTOGAjbt2Cs5zW7WyEBEafeXjt56aD-e_Mm9o0etwVvwOj0SRpMUuPYAm0duypWkXI6R8aCNhOEw7okHu7OF0rtFN09qa1XQqwfAzKQ2g2PGbWSHsPgBzMoOJjxX0yxNOK4BGEf_eF0kHntn6mp1JVxjxl2Q2FyXZ7Mg';

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
  POSTAL_CODE = 'postal_code',
  CITY_COUNCIL = 'city_council',
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
