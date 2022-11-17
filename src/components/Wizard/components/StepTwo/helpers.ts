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



export const parseDescriptionMap = (values: any) => {
  const descriptionMap = {
   /*
    it: '',
    en: '',
    fr: '',
    de: '',
    sl: '',
    */
  };

  if (typeof values.introductionTextIT !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    descriptionMap.it = values.introductionTextIT;
  }

  if (typeof values.introductionTextEN !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    descriptionMap.en = values.introductionTextEN;
  }

  if (typeof values.introductionTextFR !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    descriptionMap.fr = values.introductionTextFR;
  }

  if (typeof values.introductionTextDE !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    descriptionMap.de = values.introductionTextDE;
  }

  if (typeof values.introductionTextSL !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    descriptionMap.sl = values.introductionTextSL;
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
  rankingEndDate: parseDate(values.rankingEndDate),
  startDate: parseDate(values.startDate),
  endDate: parseDate(values.endDate),
  descriptionMap: parseDescriptionMap(values),
  rankingEnabled: false, // TEMP
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
