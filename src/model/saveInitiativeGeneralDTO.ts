import { BeneficiaryTypeEnum } from '../utils/constants';

export type SaveInitiativeGeneralDTO = {
  beneficiaryBudget: number;
  beneficiaryKnown: boolean;
  beneficiaryType: BeneficiaryTypeEnum;
  budget: number;
  endDate: Date;
  name: string;
  rankingEndDate: Date;
  rankingStartDate: Date;
  startDate: Date;
};
