import { InitiativeGeneralDTO } from '../api/generated/initiative/InitiativeGeneralDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';
import { SaveInitiativeGeneralDTO } from '../model/saveInitiativeGeneralDTO';

export const saveInitiative = (
  saveInitiativeGeneralDTO: SaveInitiativeGeneralDTO
): Promise<InitiativeGeneralDTO> =>
  InitiativeApi.initiativeGeneralPost(saveInitiativeGeneralDTO).then(
    () => saveInitiativeGeneralDTO
  );

export const getInitativeSummary = (): Promise<InitiativeGeneralDTO> =>
  InitiativeApi.getInitativeSummary();

/* istanbul ignore if */
/* if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
      // return updatePartyGroupMocked(party, product, group); TODO
    } else {
      return InitiativeApi.initativeGeneralPost(saveInitiativeGeneralDTO).then((_) => true);
    } */
