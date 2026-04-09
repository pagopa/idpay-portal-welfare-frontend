import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { ENV } from '../utils/env';
import {
  Api,
  HttpClient,
  GroupUpdateDTO,
  StatusGroupDTO,
} from './generated/groups/apiClient';
import { handleUnauthorizedError } from './swaggerApiClientUtils';

const groupsSwaggerHttpClient = new HttpClient<{ token: string }>({
  baseURL: ENV.URL_API.GROUPS,
  timeout: ENV.API_TIMEOUT_MS.GROUPS,
  securityWorker: (securityData) => ({
    headers: {
      Authorization: `Bearer ${securityData?.token ?? ''}`,
    },
  }),
});

const api = new Api(groupsSwaggerHttpClient);

const withAuth = () =>
  groupsSwaggerHttpClient.setSecurityData({
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

export const groupsApi = {
  getGroupOfBeneficiaryStatusAndDetails: async (id: string): Promise<StatusGroupDTO> =>
    execute(() =>
      api.initiative.getGroupOfBeneficiaryStatusAndDetails({
        initiativeId: id,
      })
    ),

  uploadGroupOfBeneficiary: async (id: string, file: File): Promise<GroupUpdateDTO> =>
    execute(() =>
      api.initiative.uploadGroupOfBeneficiary(
        {
          initiativeId: id,
        },
        { file }
      )
    ),
};