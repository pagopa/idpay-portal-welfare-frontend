import { InitiativeDTO } from '../api/generated/initiative/InitiativeDTO';
import { InitiativeGeneralDTO } from '../api/generated/initiative/InitiativeGeneralDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';

export const saveGeneralInfoService = (
  generalInfo: InitiativeGeneralDTO
): Promise<InitiativeDTO | void | undefined> =>
  /* istanbul ignore if */
  InitiativeApi.initiativeGeneralPost(generalInfo).then((res) => res.initiativeId);

export const getInitativeSummary = (): Promise<InitiativeGeneralDTO> =>
  InitiativeApi.getInitativeSummary();
