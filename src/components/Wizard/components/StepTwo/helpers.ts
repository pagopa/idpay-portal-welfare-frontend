import { addDays } from 'date-fns';
import { BeneficiaryTypeEnum } from '../../../../utils/constants';

export const getMinDate = (date: Date | string | undefined) => {
  if (date !== undefined && date instanceof Date) {
    return addDays(date, 1);
  }
  return new Date();
};

export const parseDate = (d: string) => {
  if (d) {
    const date = new Date(d).toLocaleDateString('en-CA');
    return new Date(date);
  } else {
    return undefined;
  }
};

export const parseValuesFormToInitiativeGeneralDTO = (values: any) => ({
  beneficiaryType:
    values.beneficiaryType === 'PF' ? BeneficiaryTypeEnum.PF : BeneficiaryTypeEnum.PG,
  beneficiaryKnown: values.beneficiaryKnown === 'true' ? true : false,
  budget: Number(values.budget),
  beneficiaryBudget: Number(values.beneficiaryBudget),
  rankingStartDate: parseDate(values.rankingStartDate),
  rankingEndDate: parseDate(values.rankingEndDate),
  startDate: parseDate(values.startDate),
  endDate: parseDate(values.endDate),
  descriptionMap: {
    it: values.introductionTextIT,
    en: values.introductionTextEN,
    fr: values.introductionTextEN,
    de: values.introductionTextDE,
    sl: values.introductionTextSL,
  },
});

export const setError = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && Boolean(errorText);

export const setErrorText = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && errorText;

export const getYesterday = (dateOnly = false) => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateOnly ? new Date(d.toDateString()) : d;
};
