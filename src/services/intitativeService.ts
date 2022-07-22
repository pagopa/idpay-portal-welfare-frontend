import { InitiativeDTO } from '../api/generated/initiative/InitiativeDTO';
import { InitiativeGeneralDTO } from '../api/generated/initiative/InitiativeGeneralDTO';
import { InitiativeInfoDTO } from '../api/generated/initiative/InitiativeInfoDTO';
import { InitiativeBeneficiaryRuleDTO } from '../api/generated/initiative/InitiativeBeneficiaryRuleDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';

export const saveGeneralInfoService = (
  generalInfo: InitiativeInfoDTO
): Promise<InitiativeDTO | void | undefined> =>
  InitiativeApi.initiativeGeneralPost(generalInfo).then((res) => res);

export const getInitativeSummary = (): Promise<InitiativeGeneralDTO> =>
  InitiativeApi.getInitativeSummary();

export const patchBeneficiaryRuleService = (
  id: string,
  data: InitiativeBeneficiaryRuleDTO
): Promise<void> => InitiativeApi.initiativeBeneficiaryRulePatch(id, data).then((res) => res);

export const patchGeneralInfo = (id: string, data: InitiativeGeneralDTO): Promise<void> =>
  InitiativeApi.initiativeGeneralPatch(id, data).then((res) => res);
