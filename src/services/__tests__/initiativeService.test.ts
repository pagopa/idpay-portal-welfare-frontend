import { InitiativeApi } from '../../api/__mocks__/InitiativeApiClient';
import {
  createInitiativeServiceInfo,
  getInitativeSummary,
  getInitiativeDetail,
  mockedInitiativeDetail,
  mockedInitiativeGeneralBody,
  mockedInitiativeId,
  mockedInitiativeSummary,
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
  expect(result).toBe(mockedInitiativeSummary);
});

test('test get initiative summary', async () => {
  const result = await getInitiativeDetail(mockedInitiativeId);
  expect(result).toBe(mockedInitiativeDetail);
});

test('test create Initiative Service Info', async () => {
  const result = await createInitiativeServiceInfo({});
  expect(result).toStrictEqual({});
});

test('update Initiative Service Info', async () => {
  const result = await updateInitiativeServiceInfo(mockedInitiativeId, mockedServiceInfoData);
  expect(result).toBe(void 0);
});

test('update initiative general info', async () => {
  const result = await InitiativeApi.updateInitiativeGeneralInfo(
    mockedInitiativeId,
    mockedInitiativeGeneralBody
  );
  expect(result).toBe(void 0);
});
