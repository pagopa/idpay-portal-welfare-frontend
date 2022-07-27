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
      rankingStartDate: new Date(values.rankingStartDate),
      rankingEndDate: new Date(values.rankingEndDate),
      startDate: new Date(values.startDate),
      endDate: new Date(values.endDate),
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
    value: 'cartaCult',
    name: 'Carta Della Cultura',
  },
  {
    value: 'cartaGio',
    name: 'Carta Giovani Nazionale',
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
