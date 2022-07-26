import { addDays } from 'date-fns';
import { BeneficiaryTypeEnum } from '../../../../utils/constants';

export const peopleReached = (totalBudget: string, budgetPerPerson: string) => {
  const totalBudgetInt = parseInt(totalBudget, 10);
  const budgetPerPersonInt = parseInt(budgetPerPerson, 10);
  return Math.floor(totalBudgetInt / budgetPerPersonInt);
};

export const getMinDate = (date: Date | string | undefined) => {
  if (date !== undefined && date instanceof Date) {
    return addDays(date, 1);
  }
  return '';
};

export const parseValuesFormToInitiativeGeneralDTO = (values: any) => ({
  beneficiaryType:
    values.beneficiaryType === 'PF' ? BeneficiaryTypeEnum.PF : BeneficiaryTypeEnum.PG,
  beneficiaryKnown: values.beneficiaryKnown === 'true' ? true : false,
  budget: Number(values.budget),
  beneficiaryBudget: Number(values.beneficiaryBudget),
  rankingStartDate: new Date(values.rankingStartDate),
  rankingEndDate: new Date(values.rankingEndDate),
  startDate: new Date(values.startDate),
  endDate: new Date(values.endDate),
});
