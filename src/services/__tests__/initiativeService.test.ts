import { InitiativeApiMocked } from '../../api/__mocks__/InitiativeApiClient';
import {
  getInitativeSummary,
  mockedInitiativeGeneralBody,
  mockedInitiativeId,
  mockedServiceInfoData,
  updateInitiativeServiceInfo,
  getInitiativeDetail,
  updateInitiativeGeneralInfo,
  updateInitiativeGeneralInfoDraft,
} from '../__mocks__/initiativeService';

jest.mock('../../api/__mocks__/InitiativeApiClient.ts');

beforeEach(() => {
  jest.spyOn(InitiativeApiMocked, 'getInitativeSummary');
  jest.spyOn(InitiativeApiMocked, 'getInitiativeById');
  jest.spyOn(InitiativeApiMocked, 'saveInitiativeServiceInfo');
  jest.spyOn(InitiativeApiMocked, 'updateInitiativeServiceInfo');
  jest.spyOn(InitiativeApiMocked, 'updateInitiativeGeneralInfo');
  jest.spyOn(InitiativeApiMocked, 'updateInitiativeGeneralInfoDraft');
});

test('test get initiative summary', async () => {
  await getInitativeSummary();
  expect(InitiativeApiMocked.getInitativeSummary).toBeCalled();
});

test('test get initiative by id', async () => {
  await getInitiativeDetail(mockedInitiativeId);
  expect(InitiativeApiMocked.getInitiativeById).toHaveBeenCalledWith(mockedInitiativeId);
});

test('test create Initiative Service Info', async () => {
  await InitiativeApiMocked.saveInitiativeServiceInfo({});
  expect(InitiativeApiMocked.saveInitiativeServiceInfo).toBeCalled();
});

test('update Initiative Service Info', async () => {
  await updateInitiativeServiceInfo(mockedInitiativeId, mockedServiceInfoData);
  expect(InitiativeApiMocked.updateInitiativeServiceInfo).toBeCalledWith(
    mockedInitiativeId,
    mockedServiceInfoData
  );
});

test('update initiative general info', async () => {
  await updateInitiativeGeneralInfo(mockedInitiativeId, mockedInitiativeGeneralBody);
  expect(InitiativeApiMocked.updateInitiativeGeneralInfo).toBeCalledWith(
    mockedInitiativeId,
    mockedInitiativeGeneralBody
  );
});

test('updated initiative general info draft', async () => {
  await updateInitiativeGeneralInfoDraft(mockedInitiativeId, mockedInitiativeGeneralBody);
  expect(InitiativeApiMocked.updateInitiativeGeneralInfoDraft).toBeCalledWith(
    mockedInitiativeId,
    mockedInitiativeGeneralBody
  );
});
