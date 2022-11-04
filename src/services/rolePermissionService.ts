import { UserPermissionDTO } from '../api/generated/role-permission/UserPermissionDTO';
import { RolePermissionApi } from '../api/rolePermissionApiClient';

export const getUserPermission = (): Promise<UserPermissionDTO> =>
  RolePermissionApi.userPermission().then((res) => res);
