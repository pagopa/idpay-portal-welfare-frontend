import { ConfigMccArrayDTO } from '../api/generated/initiative/ConfigMccArrayDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';

export const fetchMccCodes = (): Promise<ConfigMccArrayDTO> => InitiativeApi.getMccConfig();
