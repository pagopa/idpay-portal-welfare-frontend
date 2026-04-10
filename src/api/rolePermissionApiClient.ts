import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { ENV } from '../utils/env';
import {
  Api,
  HttpClient,
  PortalConsentDTO,
  UserPermissionDTO,
} from './generated/role-permission/apiClient';
import { handleUnauthorizedError } from './swaggerApiClientUtils';

const rolePermissionSwaggerHttpClient = new HttpClient<{ token: string }>({
  baseURL: ENV.URL_API.ROLE_PERMISSION,
  timeout: ENV.API_TIMEOUT_MS.ROLE_PERMISSION,
  securityWorker: (securityData) => ({
    headers: {
      Authorization: `Bearer ${securityData?.token ?? ''}`,
    },
  }),
});

const api = new Api(rolePermissionSwaggerHttpClient);

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
    return handleUnauthorizedError<T>(error);
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
      return handleUnauthorizedError<void>(error);
    }
  },
};