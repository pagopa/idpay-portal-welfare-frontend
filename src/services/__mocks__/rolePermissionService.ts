import { RolePermissionApiMocked } from '../../api/__mocks__/rolePermissionApiClient';

export const mockedPermission = 
  {
    role: '',
    permissions: [{
      id: '',
      name: '',
      mode: '',
    },]
  };

export const mockedPortalConsent = {
  firstAcceptance: true,
  versionId: '23456',
};

export const mockedVersionId = "234d31";

export const getUserPermission = () => RolePermissionApiMocked.userPermission();
export const getPortalConsent = () => RolePermissionApiMocked.getPortalConsent();
export const savePortalConsent = () => RolePermissionApiMocked.savePortalConsent(mockedVersionId);

