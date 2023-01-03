import { addDays } from 'date-fns';
import { BeneficiaryTypeEnum } from '../../../../utils/constants';

export const getMinDate = (date: Date | string | undefined, offset: number) => {
  if (date !== undefined && date instanceof Date) {
    return addDays(date, offset);
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

export const parseEndDate = (d: string) => {
  if (d) {
    const dStr = new Date(d).toLocaleDateString('en-CA');
    const date = `${dStr} 23:59:59Z`;
    return new Date(date);
  } else {
    return undefined;
  }
};

export const parseDescriptionMap = (values: any) => {
  // eslint-disable-next-line functional/no-let
  let descriptionMap = {};

  if (typeof values.introductionTextIT === 'string' && values.introductionTextIT.length > 0) {
    descriptionMap = {
      ...descriptionMap,
      it: values.introductionTextIT,
    };
  }

  if (typeof values.introductionTextEN === 'string' && values.introductionTextEN.length > 0) {
    descriptionMap = {
      ...descriptionMap,
      en: values.introductionTextEN,
    };
  }

  if (typeof values.introductionTextFR === 'string' && values.introductionTextFR.length > 0) {
    descriptionMap = {
      ...descriptionMap,
      fr: values.introductionTextFR,
    };
  }

  if (typeof values.introductionTextDE === 'string' && values.introductionTextDE.length > 0) {
    descriptionMap = {
      ...descriptionMap,
      de: values.introductionTextDE,
    };
  }

  if (typeof values.introductionTextSL === 'string' && values.introductionTextSL.length > 0) {
    descriptionMap = {
      ...descriptionMap,
      sl: values.introductionTextSL,
    };
  }
  return descriptionMap;
};

export const parseValuesFormToInitiativeGeneralDTO = (values: any) => ({
  beneficiaryType:
    values.beneficiaryType === 'PF' ? BeneficiaryTypeEnum.PF : BeneficiaryTypeEnum.PG,
  beneficiaryKnown: values.beneficiaryKnown === 'true' ? true : false,
  budget: Number(values.budget),
  beneficiaryBudget: Number(values.beneficiaryBudget),
  rankingStartDate: parseDate(values.rankingStartDate),
  rankingEndDate: parseEndDate(values.rankingEndDate),
  startDate: parseDate(values.startDate),
  endDate: parseEndDate(values.endDate),
  descriptionMap: { ...parseDescriptionMap(values) },
  rankingEnabled: values.rankingEnabled === 'true' ? true : false,
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
