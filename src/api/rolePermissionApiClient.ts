import { AxiosError } from 'axios';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import { t } from '../locale';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import {
  Api,
  HttpClient,
  PortalConsentDTO,
  UserPermissionDTO,
} from './generated/role-permission/apiClient';

const rolePermissionSwaggerHttpClient = new HttpClient<{ token: string }>({
  baseURL: ENV.URL_API.ROLE_PERMISSION,
  securityWorker: (securityData) => ({
    headers: {
      Authorization: `Bearer ${securityData?.token ?? ''}`,
    },
  }),
});

const api = new Api(rolePermissionSwaggerHttpClient);

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
  rolePermissionSwaggerHttpClient.setSecurityData({
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

export const RolePermissionApi = {
  userPermission: async (): Promise<UserPermissionDTO> =>
    execute(() => api.permissions.userPermission()),

  getPortalConsent: async (): Promise<PortalConsentDTO> =>
    execute(() => api.consent.getPortalConsent()),

  savePortalConsent: async (versionId: string | undefined): Promise<void> => {
    withAuth();
    try {
      await api.consent.savePortalConsent({ versionId });
    } catch (error) {
      if (isUnauthorizedError(error)) {
        onRedirectToLogin();
      }
      throw error;
    }
  },
};