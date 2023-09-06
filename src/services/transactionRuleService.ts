import { ConfigTrxRuleArrayDTO } from '../api/generated/initiative/ConfigTrxRuleArrayDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';
import { InitiativeApiMocked } from '../api/__mocks__/InitiativeApiClient';

export const fetchTransactionRules = (): Promise<ConfigTrxRuleArrayDTO> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return InitiativeApiMocked.getTransactionConfigRules();
  }
  return InitiativeApi.getTransactionConfigRules();
};
