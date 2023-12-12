import { InitiativeApiMocked } from '../../api/__mocks__/InitiativeApiClient';
import { fetchTransactionRules } from '../__mocks__/transactionRuleService';

jest.mock('../../api/__mocks__/InitiativeApiClient.ts');

beforeEach(() => {
  jest.spyOn(InitiativeApiMocked, 'getTransactionConfigRules');
});

test(' get transaction config rules', async () => {
  await fetchTransactionRules();
  expect(InitiativeApiMocked.getTransactionConfigRules).toBeCalled();
});
