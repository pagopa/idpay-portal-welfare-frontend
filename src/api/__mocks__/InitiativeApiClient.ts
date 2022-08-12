import { InitiativeDTO } from '../generated/initiative/InitiativeDTO';
import { InitiativeSummaryArrayDTO } from '../generated/initiative/InitiativeSummaryArrayDTO';
import { InitiativeInfoDTO } from '../generated/initiative/InitiativeInfoDTO';
import { InitiativeBeneficiaryRuleDTO } from '../generated/initiative/InitiativeBeneficiaryRuleDTO';
import {
  mockedInitiativeDetail,
  mockedInitiativeSummary,
} from '../../services/__mocks__/initiativeService';
import { AdmissionCriteriaModel } from '../../model/AdmissionCriteria';
import { mockedAdmissionCriteria } from '../../services/__mocks__/admissionCriteriaService';

export const InitiativeApi = {
  getInitativeSummary: async (): Promise<InitiativeSummaryArrayDTO> =>
    new Promise((resolve) => resolve(mockedInitiativeSummary)),

  getInitiativeById: async (_id: string): Promise<InitiativeDTO> =>
    new Promise((resolve) => resolve(mockedInitiativeDetail)),

  initiativeGeneralPost: async (_data: InitiativeInfoDTO): Promise<InitiativeDTO> =>
    new Promise((resolve) => resolve({})),

  initiativeGeneralPut: async (_id: string, _data: InitiativeInfoDTO): Promise<void> =>
    new Promise((resolve) => resolve()),

  initiativeBeneficiaryRulePut: async (
    _id: string,
    _data: InitiativeBeneficiaryRuleDTO
  ): Promise<void> => new Promise((resolve) => resolve()),

  initiativeBeneficiaryRulePutDraft: async (
    _id: string,
    _data: InitiativeBeneficiaryRuleDTO
  ): Promise<void> => new Promise((resolve) => resolve()),

  getEligibilityCriteriaForSidebar: async (
    _initiativeId: string
  ): Promise<Array<AdmissionCriteriaModel>> =>
    new Promise((resolve) => resolve(mockedAdmissionCriteria)),
};
