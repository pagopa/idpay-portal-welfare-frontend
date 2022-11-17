import { InitiativeApi } from '../../api/__mocks__/InitiativeApiClient';
import {
  createInitiativeServiceInfo,
  getInitativeSummary,
  getInitiativeDetail,
  mockedInitiativeId,
  mockedServiceInfoData,
  updateInitiativeServiceInfo,
} from '../__mocks__/initiativeService';

beforeEach(() => {
  jest.spyOn(InitiativeApi, 'getInitativeSummary');
  jest.spyOn(InitiativeApi, 'getInitiativeById');
  jest.spyOn(InitiativeApi, 'saveInitiativeServiceInfo');
});

test('test get initiative summary', async () => {
  const result = await getInitativeSummary();
  expect(result).not.toBeUndefined();
});

test('test get initiative summary', async () => {
  const result = await getInitiativeDetail(mockedInitiativeId);
  expect(result).not.toBeUndefined();
});

test('test create Initiative Service Info', async () => {
  const result = await createInitiativeServiceInfo({});
  expect(result).not.toBeUndefined();
});

test('update Initiative Service Info', async () => {
  const result = await updateInitiativeServiceInfo(mockedInitiativeId, mockedServiceInfoData);
  expect(result).toBeUndefined();
});
