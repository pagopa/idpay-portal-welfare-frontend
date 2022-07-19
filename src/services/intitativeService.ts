import { InitiativeGeneralDTO } from '../api/generated/initiative/InitiativeGeneralDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';
import { SaveInitiativeGeneralDTO } from '../model/saveInitiativeGeneralDTO';

export const saveGeneralInfoService = (generalInfo: SaveInitiativeGeneralDTO): Promise<any> =>
  InitiativeApi.initiativeGeneralPost(generalInfo).then((res) => console.log(res));

export const getInitativeSummary = (): Promise<InitiativeGeneralDTO> =>
  InitiativeApi.getInitativeSummary();
