import { render } from '@testing-library/react';
import useLoading from '@pagopa/selfcare-common-frontend/lib/hooks/useLoading';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { parseJwt } from '../../utils/jwt-utils';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchPartyDetails } from '../../services/partyService';
import { PLACEHOLDER_PARTY_LOGO, Party } from '../../model/Party';
import { retrieveSelectedPartyIdConfig, useSelectedParty } from '../useSelectedParty';

jest.mock('@pagopa/selfcare-common-frontend/lib/hooks/useLoading');
jest.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', () => ({
  storageTokenOps: { read: jest.fn() },
}));
jest.mock('@pagopa/selfcare-common-frontend/lib/services/analyticsService', () => ({
  trackEvent: jest.fn(),
}));
jest.mock('../../utils/jwt-utils', () => ({
  parseJwt: jest.fn(),
}));
jest.mock('../../redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));
jest.mock('../../services/partyService', () => ({
  fetchPartyDetails: jest.fn(),
}));

describe('useSelectedParty', () => {
  const mockedUseLoading = useLoading as jest.Mock;
  const mockedParseJwt = parseJwt as jest.Mock;
  const mockedReadToken = storageTokenOps.read as jest.Mock;
  const mockedTrackEvent = trackEvent as jest.Mock;
  const mockedUseAppDispatch = useAppDispatch as jest.Mock;
  const mockedUseAppSelector = useAppSelector as jest.Mock;
  const mockedFetchPartyDetails = fetchPartyDetails as jest.Mock;

  const setLoadingMock = jest.fn();
  const dispatchMock = jest.fn();
  const locationAssignMock = jest.fn();
  const originalLocation = window.location;

  let invokeSelectedParty: () => Promise<Party>;

  const HookHarness = () => {
    invokeSelectedParty = useSelectedParty();
    return null;
  };

  const jwtConfig = {
    org_id: 'party-1',
    org_name: 'Comune Test',
    org_vat: '12345678901',
    org_party_role: 'MANAGER',
    org_role: 'admin',
  };

  const selectedParty: Party = {
    partyId: 'party-1',
    externalId: 'ext',
    originId: 'orig',
    origin: 'origin',
    description: 'Party selected',
    digitalAddress: 'mail@test.it',
    status: 'ACTIVE',
    roles: [{ partyRole: 'MANAGER', roleKey: 'admin' }],
    urlLogo: 'logo',
    fiscalCode: '12345678901',
    registeredOffice: 'office',
    typology: 'typology',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLoading.mockReturnValue(setLoadingMock);
    mockedUseAppDispatch.mockReturnValue(dispatchMock);
    mockedReadToken.mockReturnValue('token');
    mockedParseJwt.mockReturnValue(jwtConfig);
    // JSDOM location.assign may trigger real navigation errors: override only for this suite.
    delete (window as any).location;
    (window as any).location = { ...originalLocation, assign: locationAssignMock };
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    delete (window as any).location;
    (window as any).location = originalLocation;
  });

  test('retrieveSelectedPartyIdConfig returns config from token', () => {
    const config = retrieveSelectedPartyIdConfig();
    expect(config).toEqual({
      partyId: 'party-1',
      partyName: 'Comune Test',
      partyVat: '12345678901',
      roles: [{ partyRole: 'MANAGER', roleKey: 'admin' }],
    });
  });

  test('retrieveSelectedPartyIdConfig returns null when token has missing fields', () => {
    mockedParseJwt.mockReturnValue({ org_id: 'party-1' });
    expect(retrieveSelectedPartyIdConfig()).toBeNull();
  });

  test('returns selected party from cache when same partyId is already selected', async () => {
    mockedUseAppSelector.mockReturnValueOnce(selectedParty).mockReturnValueOnce([selectedParty]);
    render(<HookHarness />);

    await expect(invokeSelectedParty()).resolves.toEqual(selectedParty);
    expect(mockedFetchPartyDetails).not.toHaveBeenCalled();
    expect(setLoadingMock).not.toHaveBeenCalled();
  });

  test('fetches and stores party when selected is missing', async () => {
    mockedUseAppSelector.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);
    mockedFetchPartyDetails.mockResolvedValueOnce({
      ...selectedParty,
      roles: [],
    });

    render(<HookHarness />);
    const result = await invokeSelectedParty();

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(setLoadingMock).toHaveBeenLastCalledWith(false);
    expect(mockedFetchPartyDetails).toHaveBeenCalledWith('party-1', undefined);
    expect(result.roles).toEqual([{ partyRole: 'MANAGER', roleKey: 'admin' }]);
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'parties/setPartySelected',
        payload: expect.objectContaining({ partyId: 'party-1' }),
      })
    );
  });

  test('tracks PARTY_ID_NOT_FOUND and stores placeholder when party is not returned', async () => {
    mockedUseAppSelector.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);
    mockedFetchPartyDetails.mockResolvedValueOnce(undefined);

    render(<HookHarness />);
    const result = await invokeSelectedParty();

    expect(mockedTrackEvent).toHaveBeenCalledWith('PARTY_ID_NOT_FOUND', { partyId: 'party-1' });
    expect(result.urlLogo).toBe(PLACEHOLDER_PARTY_LOGO);
    expect(result.fiscalCode).toBe('12345678901');
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'parties/setPartySelected',
        payload: expect.objectContaining({ partyId: 'party-1' }),
      })
    );
  });

  test('tracks PARTY_ID_NOT_IN_TOKEN, redirects and rejects when party config is missing', async () => {
    mockedParseJwt.mockReturnValue({});
    mockedUseAppSelector.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);
    render(<HookHarness />);

    await expect(invokeSelectedParty()).rejects.toBeUndefined();
    expect(mockedTrackEvent).toHaveBeenCalledWith('PARTY_ID_NOT_IN_TOKEN');
    expect(locationAssignMock).toHaveBeenCalled();
  });

  test('clears selected party and rethrows when fetch fails', async () => {
    mockedUseAppSelector.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);
    mockedFetchPartyDetails.mockRejectedValueOnce(new Error('boom'));
    render(<HookHarness />);

    await expect(invokeSelectedParty()).rejects.toThrow('boom');
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'parties/setPartySelected',
        payload: undefined,
      })
    );
    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(setLoadingMock).toHaveBeenLastCalledWith(false);
  });
});
