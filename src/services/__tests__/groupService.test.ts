import { groupsApi } from '../../api/groupsApiClient';
import { mockedFile, mockedInitiativeId } from '../__mocks__/groupsService';
import {
  getGroupOfBeneficiaryStatusAndDetail,
  uploadGroupOfBeneficiaryPut,
} from '../groupsService';
import { createStore } from '../../redux/store';

jest.mock('../../services/groupsService.ts');

beforeEach(() => {
  jest.spyOn(groupsApi, 'getGroupOfBeneficiaryStatusAndDetails');
  jest.spyOn(groupsApi, 'uploadGroupOfBeneficiary');
});

describe('Group Service', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  test('test get group of beneficiary status and detail', async () => {
    await getGroupOfBeneficiaryStatusAndDetail(mockedInitiativeId);
    expect(groupsApi.getGroupOfBeneficiaryStatusAndDetails).not.toBeCalledWith(mockedInitiativeId);
  });

  test('test upload group of beneficiary', async () => {
    await uploadGroupOfBeneficiaryPut(mockedInitiativeId, mockedFile);
    expect(groupsApi.uploadGroupOfBeneficiary).not.toBeCalledWith(mockedInitiativeId, mockedFile);
  });

});
