import { groupsApi } from '../../api/groupsApiClient';
import { mockedInitiativeId } from '../__mocks__/groupService';

import { getGroupOfBeneficiaryStatusAndDetail } from '../groupsService';

jest.mock('../../api/groupsApiClient');

beforeEach(() => {
  jest.spyOn(groupsApi, 'getGroupOfBeneficiaryStatusAndDetails');
});

test('test get group of beneficiary status and detail', async () => {
  await getGroupOfBeneficiaryStatusAndDetail(mockedInitiativeId);
  expect(groupsApi.getGroupOfBeneficiaryStatusAndDetails).toBeCalledWith(mockedInitiativeId);
});
