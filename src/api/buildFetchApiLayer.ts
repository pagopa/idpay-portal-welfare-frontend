import { buildFetchApi } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import { ENV } from '../utils/env';

export const buildFetchApiLayer = () => {
    const originalFetch = buildFetchApi(ENV.API_TIMEOUT_MS.MERCHANTS);

    return async (input: RequestInfo | URL, init?: RequestInit) => {
        const res = await originalFetch(input, init);
        if(res.status === 400 || res.status === 403) {
            // eslint-disable-next-line functional/no-let
            let errorBody: any = null;

            try {
                errorBody = await res.clone().json();
            // eslint-disable-next-line no-empty
            } catch {
            }

            // eslint-disable-next-line no-throw-literal
            throw {
                status: res.status,
                statusText: res.statusText,
                body: errorBody,
                rawResponse: res,
            };
        }
        return res;
    };
};
