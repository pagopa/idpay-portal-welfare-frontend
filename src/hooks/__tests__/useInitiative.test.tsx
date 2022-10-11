import { InitiativeApi } from '../../api/InitiativeApiClient';
import { getInitiativeDetail } from '../../services/intitativeService';
import { mockedInitiativeId } from '../../services/__mocks__/initiativeService';

jest.mock('../../api/InitiativeApiClient');

beforeEach(() => {
  jest.spyOn(InitiativeApi, 'getInitiativeById');
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useInitiative: jest.fn(),
}));

test('test get initiative detail', async () => {
  await getInitiativeDetail(mockedInitiativeId);
  expect(InitiativeApi.getInitiativeById).toBeCalled();
});
