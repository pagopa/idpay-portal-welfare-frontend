import { PortalConsentDTO } from '../api/generated/role-permission/PortalConsentDTO';
import { UserPermissionDTO } from '../api/generated/role-permission/UserPermissionDTO';
import { RolePermissionApi } from '../api/rolePermissionApiClient';
import { RolePermissionApiMocked } from '../api/__mocks__/rolePermissionApiClient';

export const getUserPermission = (): Promise<UserPermissionDTO> =>
  RolePermissionApi.userPermission().then((res) => res);

export const getPortalConsent = (): Promise<PortalConsentDTO> => {
  if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
    return RolePermissionApiMocked.getPortalConsent();
  }
  return RolePermissionApi.getPortalConsent().then((res) => res);
};
export const savePortalConsent = (versionId: string | undefined): Promise<void> =>
  RolePermissionApi.savePortalConsent(versionId).then((res) => res);
