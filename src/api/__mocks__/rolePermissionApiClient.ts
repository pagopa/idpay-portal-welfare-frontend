import { mockedPermission } from '../../services/__mocks__/rolePermissionService';
import { UserPermissionDTO } from '../generated/role-permission/UserPermissionDTO';

export const RolePermissionApi = {
  userPermission: async (): Promise<UserPermissionDTO> =>
    new Promise((resolve) => resolve(mockedPermission)),
};
