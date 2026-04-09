import { InitiativeApiMocked } from '../../api/__mocks__/InitiativeApiClient';
import { ConfigTrxRuleArrayDTO } from '../../api/generated/initiative/apiClient';

export const mockedTransactionRules = [
  {
    checked: false,
    code: 'THRESHOLD',
    description: 'description',
    enabled: true,
    title: 'Limite di spesa',
    subtitle: 'Definisci importo minimo o massimo',
  },
  {
    checked: false,
    code: 'MCC',
    description: 'description',
    enabled: true,
    title: 'Merchant Category Code',
    subtitle: 'Ammetti o escludi categorie',
  },
  {
    checked: false,
    code: 'ATECO',
    description: 'description',
    enabled: false,
    title: 'Codice Adeco',
    subtitle: 'Ammetti o escludi categorie',
  },
  {
    checked: false,
    code: 'TRXCOUNT',
    description: 'description',
    enabled: true,
    title: 'Numero di transazioni',
    subtitle: 'Definisci un minimo o massimo',
  },
  {
    checked: false,
    code: 'REWARDLIMIT',
    description: 'description',
    enabled: true,
    title: 'Limite temporale',
    subtitle: 'Definisci un massimale ricorrente',
  },
  {
    checked: false,
    code: 'DAYHOURSWEEK',
    description: 'description',
    title: 'Orario della transazione',
    subtitle: 'Definisci una fascia oraria di validità',
    enabled: true,
  },
  {
    checked: false,
    code: 'GIS',
    description: 'description',
    enabled: false,
    title: 'Area geografica',
    subtitle: 'Scegli la zona di operativà',
  },
];

export const verifyFetchShopRulesMockExecution = (
transactionRules: Array<ConfigTrxRuleArrayDTO>
) => {
  if (JSON.stringify(transactionRules) !== JSON.stringify(mockedTransactionRules)) {
    throw new Error('transactionRules mock verification failed');
  }
};

export const fetchTransactionRules = (): Promise<ConfigTrxRuleArrayDTO> =>
  InitiativeApiMocked.getTransactionConfigRules();
