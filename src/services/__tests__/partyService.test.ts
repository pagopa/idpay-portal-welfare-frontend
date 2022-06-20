import { fetchParties, fetchPartyDetails } from '../partyService';
import { institutionResource2Party, Party } from '../../model/Party';
import { DashboardApi } from '../../api/DashboardApiClient';
import { mockedInstitutionResources } from '../../api/__mocks__/DashboardApiClient';

jest.mock('../../api/DashboardApiClient');

let dashboardApiGetInstitutionSpy;
let dashboardApiGetInstitutionsSpy;

beforeEach(() => {
  dashboardApiGetInstitutionSpy = jest.spyOn(DashboardApi, 'getInstitution');
  dashboardApiGetInstitutionsSpy = jest.spyOn(DashboardApi, 'getInstitutions');
});

test('Test fetchParties', async () => {
  const parties = await fetchParties();

  expect(parties).toMatchObject(mockedInstitutionResources.map(institutionResource2Party));

  parties.forEach((p) =>
    expect(p.urlLogo).toBe(`http://checkout.selfcare/institutions/${p.partyId}/logo.png`)
  );

  expect(dashboardApiGetInstitutionsSpy).toBeCalledTimes(1);
});

describe('Test fetchPartyDetails', () => {
  const expectedPartyId: string = '1';

  const checkSelectedParty = (party: Party) => {
    expect(party).toMatchObject(institutionResource2Party(mockedInstitutionResources[0]));

    expect(party.urlLogo).toBe(`http://checkout.selfcare/institutions/${expectedPartyId}/logo.png`);
  };

  const checkDashboardInvocation = (expectedCallsNumber: number) => {
    expect(DashboardApi.getInstitution).toBeCalledTimes(expectedCallsNumber);
    if (expectedCallsNumber > 0) {
      expect(DashboardApi.getInstitution).toBeCalledWith(expectedPartyId);
    }
  };

  test('Test no parties as cache', async () => {
    const party = await fetchPartyDetails(expectedPartyId);
    checkSelectedParty(party);

    checkDashboardInvocation(1);
  });

  test('Test parties as cache', async () => {
    const parties = mockedInstitutionResources.map(institutionResource2Party);
    const party = await fetchPartyDetails(expectedPartyId, parties);
    checkSelectedParty(party);

    checkDashboardInvocation(0);

    const partialParties = parties.filter((p) => p.partyId !== expectedPartyId);
    const party2 = await fetchPartyDetails(expectedPartyId, partialParties);
    expect(party2).toStrictEqual(party);

    checkDashboardInvocation(1);
  });
});
