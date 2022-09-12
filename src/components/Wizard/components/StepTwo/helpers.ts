import { addDays } from 'date-fns';
import { TypeEnum } from '../../../../api/generated/initiative/ChannelDTO';
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

export const parseValuesFormToInitiativeGeneralDTO = (values: any) => {
  const channels: Array<{ type: TypeEnum; contact: string }> = [];
  values.channels.forEach((v: { type: TypeEnum; contact: string }) => {
    if (v.type.length > 0 && v.contact.length > 0) {
      // eslint-disable-next-line functional/immutable-data
      channels.push({
        type: v.type,
        contact: v.contact,
      });
    }
  });
  return {
    general: {
      beneficiaryType:
        values.beneficiaryType === 'PF' ? BeneficiaryTypeEnum.PF : BeneficiaryTypeEnum.PG,
      beneficiaryKnown: values.beneficiaryKnown === 'true' ? true : false,
      budget: Number(values.budget),
      beneficiaryBudget: Number(values.beneficiaryBudget),
      rankingStartDate: parseDate(values.rankingStartDate),
      rankingEndDate: parseDate(values.rankingEndDate),
      startDate: parseDate(values.startDate),
      endDate: parseDate(values.endDate),
    },
    additionalInfo: {
      serviceId: values.serviceId,
      serviceName: values.serviceName,
      argument: values.argument,
      description: values.description,
      channels: [...channels],
    },
  };
};

export const serviceOptions = [
  {
    value: '7e789128-b99d-4428-83ba-db8a3e8ad4d0',
    name: 'Carta Della Cultura',
  },
  {
    value: '0c9f02da-0392-40d4-a8ab-e356e9b3c688',
    name: 'Carta Giovani Nazionale',
  },
  {
    value: '50ef8992-c59b-4f2b-866e-6e352bf971cb',
    name: 'Bonus anziani',
  },
  {
    value: '98892675-e5d6-49f1-92aa-556c97906f20',
    name: 'Bonus monopattino',
  },
];

export const contacts = [
  {
    id: 1,
    value: 'web',
    name: 'Web URL',
  },
  {
    id: 2,
    value: 'email',
    name: 'Email',
  },
  {
    id: 3,
    value: 'mobile',
    name: 'Numero di telefono',
  },
];

export const setError = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && Boolean(errorText);

export const setErrorText = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && errorText;

export const getYesterday = (dateOnly = false) => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateOnly ? new Date(d.toDateString()) : d;
};
