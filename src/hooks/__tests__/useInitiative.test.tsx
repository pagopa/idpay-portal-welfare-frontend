import { InitiativeApi } from '../../api/InitiativeApiClient';
import { getInitiativeDetail } from '../../services/intitativeService';
import { mockedInitiativeId } from '../../services/__mocks__/initiativeService';

jest.mock('../../api/InitiativeApiClient');

beforeEach(() => {
  jest.spyOn(InitiativeApi, 'getInitiativeById');
});

test('test get initiative detail', async () => {
  await getInitiativeDetail(mockedInitiativeId);
  expect(InitiativeApi.getInitiativeById).toBeCalled();
});
