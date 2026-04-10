import { InitiativeGeneralDtoBeneficiaryTypeEnum } from "../api/generated/initiative/apiClient";

export type SaveInitiativeGeneralDTO = {
  beneficiaryBudget: number;
  beneficiaryKnown: boolean;
  beneficiaryType: InitiativeGeneralDtoBeneficiaryTypeEnum;
  budget: number;
  endDate: Date;
  name: string;
  rankingEndDate: Date;
  rankingStartDate: Date;
  startDate: Date;
};

export const saveInitiativeGeneral2SaveInitiativeGeneralDTO = (
  resources: SaveInitiativeGeneralDTO
) => ({
  beneficiaryBudget: resources.beneficiaryBudget,
  beneficiaryKnown: resources.beneficiaryKnown,
  beneficiaryType: resources.beneficiaryType,
  budget: resources.budget,
  endDate: resources.endDate,
  name: resources.name,
  rankingEndDate: resources.rankingEndDate,
  rankingStartDate: resources.rankingStartDate,
  startDate: resources.startDate,
});
