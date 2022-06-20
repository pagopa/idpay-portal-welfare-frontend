import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { Party, PartyRole } from '../model/Party';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchPartyDetails } from '../services/partyService';
import { LOADING_TASK_SEARCH_PARTY } from '../utils/constants';
import { parseJwt } from '../utils/jwt-utils';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { ENV } from '../utils/env';
import { JWTParty } from '../model/JwtParty';

export type PartyJwtConfig = {
  partyId: string;
  roles: Array<{
    partyRole: PartyRole;
    roleKey: string;
  }>
};

export const retrieveSelectedPartyIdConfig = (): PartyJwtConfig | null =>
  {
    const organization = (parseJwt(storageTokenOps.read()) as JWTParty)?.organization;
    if(organization && organization.id && organization.roles && organization.roles.length && organization.roles.length > 0) {
      return {
        partyId: organization.id,
        roles: organization.roles.map(r => ({
          partyRole: r.partyRole,
          roleKey: r.role
        }))
      };
    } else {
      return null;
    }
  };

export const useSelectedParty = (): {
  fetchSelectedParty: () => Promise<Party | null>;
} => {
  const dispatch = useAppDispatch();
  const partyId = retrieveSelectedPartyIdConfig()
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const parties = useAppSelector(partiesSelectors.selectPartiesList);
  const setParty = (party?: Party) => dispatch(partiesActions.setPartySelected(party));
  const setLoadingDetails = useLoading(LOADING_TASK_SEARCH_PARTY);

  const fetchParty = (partyId: string): Promise<Party | null> =>
    fetchPartyDetails(partyId, parties).then((party) => {
      if (party) {
        if (party.status !== 'ACTIVE') {
          throw new Error(`INVALID_PARTY_STATE_${party.status}`);
        }
        party.userRole = 
        setParty(party);
        return party;
      } else {
        throw new Error(`Cannot find partyId ${partyId}`);
      }
    });

  const fetchSelectedParty = () => {
    if(partyId==null){
      trackEvent("PARTY_ID_NOT_IN_TOKEN")
      window.location.assign(ENV.URL_FE.LOGOUT)
      return new Promise<Party | null>((resolve) => resolve(null))
    } else if (!selectedParty || selectedParty.partyId !== partyId) {
      setLoadingDetails(true);

      return fetchParty(partyId).finally(() =>
        setLoadingDetails(false)
      ).catch((e) => {
        setParty(undefined);
        throw e;
      });
    } else {
      return new Promise<Party | null>((resolve) => resolve(selectedParty))
    }
  };

  return { fetchSelectedParty };
};
