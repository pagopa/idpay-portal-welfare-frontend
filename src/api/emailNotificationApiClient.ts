import { AxiosError } from 'axios';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import { t } from '../locale';
import { ENV } from '../utils/env';
import { store } from '../redux/store';
import {
  Api,
  HttpClient,
  UserInstitutionInfoDTO,
  EmailMessageDTO,
} from './generated/email-notification/apiClient';

const emailNotificationSwaggerHttpClient = new HttpClient<{ token: string }>({
  baseURL: ENV.URL_API.EMAIL_NOTIFICATION,
  securityWorker: (securityData) => ({
    headers: {
      Authorization: `Bearer ${securityData?.token ?? ''}`,
    },
  }),
});

const api = new Api(emailNotificationSwaggerHttpClient);

const isUnauthorizedError = (error: unknown): boolean => {
  const axiosError = error as AxiosError | undefined;
  return axiosError?.response?.status === 401;
};

const onRedirectToLogin = () =>
  store.dispatch(
    appStateActions.addError({
      id: 'tokenNotValid',
      error: new Error(),
      techDescription: 'token expired or not valid',
      toNotify: false,
      blocking: false,
      displayableTitle: t('session.expired.title'),
      displayableDescription: t('session.expired.message'),
    })
  );

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
    if (isUnauthorizedError(error)) {
      onRedirectToLogin();
    }
    throw error;
  }
};

export const EmailNotificationApi = {
  getInstitutionProductUserInfo: async (): Promise<UserInstitutionInfoDTO> =>
    execute(() => api.users.getInstitutionProductUserInfo()),

  sendEmail: async (data: EmailMessageDTO): Promise<void> =>
    execute(() => api.notify.sendEmail(data)),
};