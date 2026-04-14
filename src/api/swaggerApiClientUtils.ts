import axios from 'axios';
import { CONFIG } from '@pagopa/selfcare-common-frontend/lib/config/env';
import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import { t } from '../locale';
import { store } from '../redux/store';

const TOKEN_NOT_VALID_ERROR_ID = 'tokenNotValid';
const REDIRECT_DELAY_MS = 2000;

let isUnauthorizedRedirectScheduled = false;


const notifyUnauthorizedSession = () =>
    store.dispatch(
        appStateActions.addError({
            id: TOKEN_NOT_VALID_ERROR_ID,
            error: new Error(),
            techDescription: 'token expired or not valid',
            toNotify: false,
            blocking: false,
            displayableTitle: t('session.expired.title'),
            displayableDescription: t('session.expired.message'),
        })
    );

export const isUnauthorizedError = (error: unknown): boolean =>
    axios.isAxiosError(error) && error.response?.status === 401;

const pendingPromise = <T>(): Promise<T> => new Promise<T>(() => undefined);

export const handleUnauthorizedError = <T>(error: unknown): Promise<T> => {
    if (!isUnauthorizedError(error)) {
        return Promise.reject(error);
    }

    notifyUnauthorizedSession();

    if (!isUnauthorizedRedirectScheduled) {
        isUnauthorizedRedirectScheduled = true;
        window.setTimeout(() => {
            window.location.assign(CONFIG.URL_FE.LOGOUT);
        }, REDIRECT_DELAY_MS);
    }

    return pendingPromise<T>();
};