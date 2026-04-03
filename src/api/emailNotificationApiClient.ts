import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import { t } from '../locale';
import { ENV } from '../utils/env';
import { store } from '../redux/store';
import { createClient, WithDefaultsT } from './generated/email-notification/client';
import { UserInstitutionInfoDTO } from './generated/email-notification/UserInstitutionInfoDTO';
import { EmailMessageDTO } from './generated/email-notification/EmailMessageDTO';

const withBearerAndPartyId: WithDefaultsT<'Bearer'> = (wrappedOperation) => (params: any) => {
  const token = storageTokenOps.read();
  return wrappedOperation({
    ...params,
    Bearer: `Bearer ${token}`,
  });
};

const apiClient = createClient({
  baseUrl: ENV.URL_API.EMAIL_NOTIFICATION,
  basePath: '',
  fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.EMAIL_NOTIFICATION),
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
      displayableTitle: t('session.expired.title'),
      displayableDescription: t('session.expired.message'),
    })
  );

export const EmailNotificationApi = {
  getInstitutionProductUserInfo: async (): Promise<UserInstitutionInfoDTO> => {
    const result = await apiClient.getInstitutionProductUserInfo({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  sendEmail: async (data: EmailMessageDTO): Promise<void> => {
    const result = await apiClient.sendEmail({ body: { ...data } });
    return extractResponse(result, 204, onRedirectToLogin);
  },
};
