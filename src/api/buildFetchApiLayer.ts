import { buildFetchApi } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import { ENV } from '../utils/env';

export const buildFetchApiLayer = () => {
    const originalFetch = buildFetchApi(ENV.API_TIMEOUT_MS.MERCHANTS);

    return async (input: RequestInfo | URL, init?: RequestInit) => {
        const res = await originalFetch(input, init);
        if (res.status === 400 || res.status === 403) { throw res; }
        return res;
    };
};
