import { groupsApi } from '../../api/groupsApiClient';
import { mockedFile, mockedInitiativeId } from '../__mocks__/groupService';

import {
  getGroupOfBeneficiaryStatusAndDetail,
  uploadGroupOfBeneficiaryPut,
} from '../groupsService';

jest.mock('../../api/groupsApiClient');

beforeEach(() => {
  jest.spyOn(groupsApi, 'getGroupOfBeneficiaryStatusAndDetails');
  jest.spyOn(groupsApi, 'uploadGroupOfBeneficiary');
});

test('test get group of beneficiary status and detail', async () => {
  await getGroupOfBeneficiaryStatusAndDetail(mockedInitiativeId);
  expect(groupsApi.getGroupOfBeneficiaryStatusAndDetails).toBeCalledWith(mockedInitiativeId);
});

test('test upload group of beneficiary', async () => {
  await uploadGroupOfBeneficiaryPut(mockedInitiativeId, mockedFile);
  expect(groupsApi.uploadGroupOfBeneficiary).toBeCalledWith(mockedInitiativeId, mockedFile);
});
