import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { ENV } from '../utils/env';
import {
  Api,
  HttpClient,
  UserInstitutionInfoDTO,
  EmailMessageDTO,
} from './generated/email-notification/apiClient';
import { handleUnauthorizedError } from './swaggerApiClientUtils';

const emailNotificationSwaggerHttpClient = new HttpClient<{ token: string }>({
  baseURL: ENV.URL_API.EMAIL_NOTIFICATION,
  timeout: ENV.API_TIMEOUT_MS.EMAIL_NOTIFICATION,
  securityWorker: (securityData) => ({
    headers: {
      Authorization: `Bearer ${securityData?.token ?? ''}`,
    },
  }),
});

const api = new Api(emailNotificationSwaggerHttpClient);

const withAuth = () =>
  emailNotificationSwaggerHttpClient.setSecurityData({
    token: storageTokenOps.read(),
  });

const execute = async <T>(operation: () => Promise<{ data: T }>): Promise<T> => {
  withAuth();

  try {
    const response = await operation();
    return response.data;
  } catch (error) {
    return handleUnauthorizedError<T>(error);
  }
};

export const EmailNotificationApi = {
  getInstitutionProductUserInfo: async (): Promise<UserInstitutionInfoDTO> =>
    execute(() => api.users.getInstitutionProductUserInfo()),

  sendEmail: async (data: EmailMessageDTO): Promise<void> =>
    execute(() => api.notify.sendEmail(data)),
};