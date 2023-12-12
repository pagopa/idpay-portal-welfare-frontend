import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import { createClient, WithDefaultsT } from './generated/groups/client';
import { StatusGroupDTO } from './generated/groups/StatusGroupDTO';
import { GroupUpdateDTO } from './generated/groups/GroupUpdateDTO';

const withBearerAndPartyId: WithDefaultsT<'Bearer'> = (wrappedOperation) => (params: any) => {
  const token = storageTokenOps.read();
  return wrappedOperation({
    ...params,
    Bearer: `Bearer ${token}`,
  });
};

const groupsApiClient = createClient({
  baseUrl: ENV.URL_API.GROUPS,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.GROUPS),
  withDefaults: withBearerAndPartyId,
});

const onRedirectToLogin = () =>
  store.dispatch(
    appStateActions.addError({
      id: 'tokenNotValid',
      error: new Error(),
      techDescription: 'token expired or not valid',
      toNotify: false,
      blocking: false,
      displayableTitle: i18n.t('session.expired.title'),
      displayableDescription: i18n.t('session.expired.message'),
    })
  );

export const groupsApi = {
  getGroupOfBeneficiaryStatusAndDetails: async (id: string): Promise<StatusGroupDTO> => {
    const result = await groupsApiClient.getGroupOfBeneficiaryStatusAndDetails({
      initiativeId: id,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  uploadGroupOfBeneficiary: async (id: string, file: File): Promise<GroupUpdateDTO> => {
    const result = await groupsApiClient.uploadGroupOfBeneficiary({
      initiativeId: id,
      file,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
