import React from 'react';
import { RolePermissionApiMocked } from '../../api/__mocks__/rolePermissionApiClient';
import { renderWithHistoryAndStore } from '../../utils/test-utils';
import useTCAgreement from '../useTCAgreement';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

const returnVal = {};
const HookWrapper = () => {
  Object.assign(returnVal, useTCAgreement());
  // result = useTCAgreement();
  return null;
};

describe('test suite for usTCAgreement hook', () => {
  test('test call of useTCAgreement hook', () => {
    renderWithHistoryAndStore(<HookWrapper />);
  });

  test('test catch case of RolePermissionApiMocked.getPortalConsent api call', async () => {
    RolePermissionApiMocked.getPortalConsent = async (): Promise<any> =>
      Promise.reject('mocked error response for tests');

    renderWithHistoryAndStore(<HookWrapper />);
  });

  test('test catch case of getFamilyComposition api call', async () => {
    RolePermissionApiMocked.getPortalConsent = async (): Promise<any> =>
      Promise.reject('mocked error response for tests');

    renderWithHistoryAndStore(<HookWrapper />);
  });
});
