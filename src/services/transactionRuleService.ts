import { ConfigTrxRuleArrayDTO } from '../api/generated/initiative/apiClient';
import { InitiativeApi } from '../api/InitiativeApiClient';

export const fetchTransactionRules = (): Promise<ConfigTrxRuleArrayDTO> =>  InitiativeApi.getTransactionConfigRules();
