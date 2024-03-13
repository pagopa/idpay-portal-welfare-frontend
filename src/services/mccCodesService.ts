import { ConfigMccArrayDTO } from '../api/generated/initiative/ConfigMccArrayDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';
// import { InitiativeApiMocked } from '../api/__mocks__/InitiativeApiClient';

export const fetchMccCodes = (): Promise<ConfigMccArrayDTO> => InitiativeApi.getMccConfig();
