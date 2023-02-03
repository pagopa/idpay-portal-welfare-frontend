import { RolePermissionApiMocked } from '../../api/__mocks__/rolePermissionApiClient';

export const mockedPermission = [
  {
    permission: {
      name: '',
      description: '',
      mode: '',
    },
    role: '',
  },
  {
    permission: {
      name: '',
      description: '',
      mode: '',
    },
    role: '',
  },
];

export const mockedPortalConsent = {
  firstAcceptance: true,
  versionId: '23456',
};

export const getUserPermission = () => RolePermissionApiMocked.userPermission();
