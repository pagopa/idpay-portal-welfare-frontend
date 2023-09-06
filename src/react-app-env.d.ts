/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'uat' | 'production';

    REACT_APP_API_MOCK_PARTIES: string;
    REACT_APP_API_MOCK_PRODUCTS: string;
    REACT_APP_API_MOCK_INITIATIVE: string;
    REACT_APP_API_MOCK_ADMISSION_CRITERIA: string;
  }
}
interface Window {
  Stripe: any;
}
