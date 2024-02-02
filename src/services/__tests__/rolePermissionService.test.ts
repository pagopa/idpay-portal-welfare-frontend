import { RolePermissionApi } from "../../api/rolePermissionApiClient";
import { getPortalConsent, getUserPermission, savePortalConsent } from "../rolePermissionService";
import {mockedVersionId} from "../__mocks__/rolePermissionService"

jest.mock('../../services/rolePermissionService');

beforeEach(() => {
  jest.spyOn(RolePermissionApi, 'userPermission');
  jest.spyOn(RolePermissionApi, 'getPortalConsent');
  jest.spyOn(RolePermissionApi, 'savePortalConsent');

});

test('test get user permission', async () => {
  await getUserPermission();
  expect(RolePermissionApi.userPermission).not.toBeCalled();
});

test('test get Portal consent', async () => {
  await getPortalConsent();
  expect(RolePermissionApi.getPortalConsent).not.toBeCalled();
});

test('test save Portal Consent', async () => {
  await savePortalConsent(mockedVersionId);
  expect(RolePermissionApi.savePortalConsent).not.toBeCalled();
});