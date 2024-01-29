import { ConfigTrxRuleArrayDTO } from '../api/generated/initiative/ConfigTrxRuleArrayDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';

export const fetchTransactionRules = (): Promise<ConfigTrxRuleArrayDTO> =>  InitiativeApi.getTransactionConfigRules();
