import { InitiativeDTO } from '../api/generated/initiative/InitiativeDTO';
import { InitiativeGeneralDTO } from '../api/generated/initiative/InitiativeGeneralDTO';
import { InitiativeInfoDTO } from '../api/generated/initiative/InitiativeInfoDTO';
import { InitiativeBeneficiaryRuleDTO } from '../api/generated/initiative/InitiativeBeneficiaryRuleDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';
import { InitiativeSummaryArrayDTO } from '../api/generated/initiative/InitiativeSummaryArrayDTO';

export const saveGeneralInfoService = (
  generalInfo: InitiativeInfoDTO
): Promise<InitiativeDTO | void | undefined> =>
  InitiativeApi.initiativeGeneralPost(generalInfo).then((res) => res);

export const getInitativeSummary = (): Promise<InitiativeSummaryArrayDTO> =>
  // if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
  //   const initiatives = [
  //     { initiativeId: '62dbe27de0d7f80a80e6c01a', initiativeName: 'aaa', status: 'DRAFT' },
  //     { initiativeId: '62dbe9e8e0d7f80a80e6c01b', initiativeName: 'Table', status: 'DRAFT' },
  //   ];
  //   return new Promise((resolve) => resolve(initiatives));
  // }
  InitiativeApi.getInitativeSummary().then((res) => res);

export const getInitiativeDetail = (id: string): Promise<InitiativeDTO> =>
  InitiativeApi.getInitiativeById(id).then((res) => res);

export const putBeneficiaryRuleService = (
  id: string,
  data: InitiativeBeneficiaryRuleDTO
): Promise<void> => InitiativeApi.initiativeBeneficiaryRulePut(id, data).then((res) => res);

export const putGeneralInfo = (id: string, data: InitiativeGeneralDTO): Promise<void> =>
  InitiativeApi.initiativeGeneralPut(id, data).then((res) => res);
