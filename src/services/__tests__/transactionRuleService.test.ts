import { InitiativeApi } from '../../api/InitiativeApiClient';
import { fetchTransactionRules } from '../transactionRuleService';

jest.mock('../../services/transactionRuleService.ts');

beforeEach(() => {
  jest.spyOn(InitiativeApi, 'getTransactionConfigRules');
});

test(' get transaction config rules', async () => {
  await fetchTransactionRules();
  expect(InitiativeApi.getTransactionConfigRules).not.toBeCalled();
});
