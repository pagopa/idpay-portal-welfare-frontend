import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { Party } from '../model/Party';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchParties } from '../services/partyService';

export const useParties = (): (() => Promise<Array<Party>>) =>
  useReduxCachedValue(
    'PARTIES',
    fetchParties,
    partiesSelectors.selectPartiesList,
    partiesActions.setPartiesList
  );
