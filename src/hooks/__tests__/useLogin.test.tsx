import { RolePermissionApi } from '../../api/rolePermissionApiClient';
import { getUserPermission } from '../../services/rolePermissionService';

jest.mock('../../api/rolePermissionApiClient');

beforeEach(() => {
  jest.spyOn(RolePermissionApi, 'userPermission');
});

test('test get group of beneficiary status and detail', async () => {
  await getUserPermission();
  expect(RolePermissionApi.userPermission).toBeCalled();
});
