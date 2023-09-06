import { ConfigMccArrayDTO } from '../api/generated/initiative/ConfigMccArrayDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';
import { InitiativeApiMocked } from '../api/__mocks__/InitiativeApiClient';

export const fetchMccCodes = (): Promise<ConfigMccArrayDTO> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return InitiativeApiMocked.getMccConfig();
  }
  return InitiativeApi.getMccConfig();
};
