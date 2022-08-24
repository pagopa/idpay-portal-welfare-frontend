import { ConfigTrxRuleArrayDTO } from '../../api/generated/initiative/ConfigTrxRuleArrayDTO';

export const mockecdTransactionRules = [
  {
    checked: false,
    code: 'THRESHOLD',
    description: 'Limite di spesa',
    enabled: true,
  },
  {
    checked: false,
    code: 'MCC',
    description: 'Merchant Category Code',
    enabled: true,
  },
  {
    checked: false,
    code: 'ATECO',
    description: 'Codice Adeco',
    enabled: true,
  },
  {
    checked: false,
    code: 'TRXCOUNT',
    description: 'Numero di Transazioni',
    enabled: true,
  },
  {
    checked: false,
    code: 'REWARDLIMIT',
    description: 'Limite temporale',
    enabled: true,
  },
  {
    checked: false,
    code: 'DAYHOURSWEEK',
    description: 'Orari della transazione',
    enabled: true,
  },
  {
    checked: false,
    code: 'GIS',
    description: 'Area geografica',
    enabled: false,
  },
];

export const verifyFetchAdmissionCriteriasMockExecution = (
  transactionRules: Array<ConfigTrxRuleArrayDTO>
) => {
  expect(transactionRules).toStrictEqual(mockecdTransactionRules);
};

export const fetchTransactionRules = () =>
  new Promise((resolve) => resolve(mockecdTransactionRules));
