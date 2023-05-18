import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { ENV } from '../utils/env';
import { store } from '../redux/store';
import { createClient, WithDefaultsT } from './generated/merchants/client';
import { MerchantUpdateDTO } from './generated/merchants/MerchantUpdateDTO';
import { MerchantOnboardingDTO } from './generated/merchants/MerchantOnboardingDTO';

const withBearerAndPartyId: WithDefaultsT<'Bearer'> = (wrappedOperation) => (params: any) => {
  const token = storageTokenOps.read();
  return wrappedOperation({
    ...params,
    Bearer: `Bearer ${token}`,
  });
};

const merchantsApiClient = createClient({
  baseUrl: ENV.URL_API.MERCHANTS,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.MERCHANTS),
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

export const merchantsApi = {
  uploadMerchantList: async (id: string, file: File): Promise<MerchantUpdateDTO> => {
    const result = await merchantsApiClient.uploadMerchantList({ initiativeId: id, file });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getMerchantsOnboardingList: async (
    id: string,
    page: number,
    fiscalCode?: string
  ): Promise<MerchantOnboardingDTO> => {
    const result = await merchantsApiClient.getMerchantsOnboardingList({
      initiativeId: id,
      page,
      fiscalCode,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
