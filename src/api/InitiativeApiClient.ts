import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { store } from '../redux/store';
import { ENV } from '../utils/env';
import { SaveInitiativeGeneralDTO } from '../model/saveInitiativeGeneralDTO';
import { createClient, WithDefaultsT } from './generated/initiative/client';
import { InitiativeSummaryDTO } from './generated/initiative/InitiativeSummaryDTO';
import { InitiativeDTO } from './generated/initiative/InitiativeDTO';

const withBearerAndPartyId: WithDefaultsT<'Bearer'> = (wrappedOperation) => (params: any) => {
  const token = storageTokenOps.read();
  return wrappedOperation({
    ...params,
    Bearer: `Bearer ${token}`,
  });
};

const apiClient = createClient({
  baseUrl: ENV.URL_API.INITIATIVE,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.INITIATIVE),
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

export const InitiativeApi = {
  getInitativeSummary: async (): Promise<Array<InitiativeSummaryDTO>> => {
    const result = await apiClient.getInitativeSummary({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  initiativeGeneralPost: async (data: SaveInitiativeGeneralDTO): Promise<InitiativeDTO> => {
    const result = await apiClient.saveInitiativeGeneralInfo({
      body: {
        general: {
          ...data,
        },
      },
    });
    console.log('API_CLIENT', result);
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
