import { Chip } from '@mui/material';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';

export const renderInitiativeStatus = (status: string | undefined) => {
  switch (status) {
    case 'DRAFT':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeList.status.draft')}
          color="default"
        />
      );
    case 'IN_REVISION':
      return (
        <Chip
          label={i18n.t('pages.initiativeList.status.inRevision')}
          sx={{ fontSize: '14px' }}
          color="warning"
        />
      );
    case 'TO_CHECK':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeList.status.toCheck')}
          color="error"
        />
      );
    case 'APPROVED':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeList.status.approved')}
          color="success"
        />
      );
    case 'PUBLISHED':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeList.status.published')}
          color="indigo"
        />
      );
    case 'CLOSED':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeList.status.closed')}
          color="default"
        />
      );
    case 'SUSPENDED':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeList.status.suspended')}
          color="error"
        />
      );
    default:
      return null;
  }
};

export const peopleReached = (totalBudget: string, budgetPerPerson: string): any => {
  const totalBudgetInt = parseFloat(totalBudget);
  const budgetPerPersonInt = parseFloat(budgetPerPerson);
  return Math.floor(totalBudgetInt / budgetPerPersonInt);
};

export const formatFileName = (name: string | undefined): string => {
  if (typeof name === 'string' && name.length > 15) {
    const nameArr = name.split('.');
    const fileExtension = nameArr[nameArr.length - 1];
    const truncatedName = name.substring(0, 10);
    return `${truncatedName}... .${fileExtension}`;
  } else if (typeof name === 'string' && name.length <= 15) {
    return name;
  }
  return '';
};

export const numberWithCommas = (x: number | string | undefined) => {
  if (typeof x === 'string' && x.length > 0) {
    const xFormatted = x.replace(/\./g, '').replace(/,/g, '.');
    const xFloat = parseFloat(xFormatted);
    return xFloat.toLocaleString('de-DE');
  }
  if (typeof x === 'number') {
    return x.toLocaleString('de-DE');
  }
  return '0';
};

export const formatIban = (iban: string | undefined) => {
  if (iban) {
    return `${iban.slice(0, 2)} ${iban.slice(2, 4)} ${iban.slice(4, 5)} ${iban.slice(
      5,
      10
    )} ${iban.slice(10, 15)} ${iban.slice(15, 32)}`;
  }
  // eslint-disable-next-line sonarjs/no-redundant-jump
  return;
};

export const formatedCurrency = (number: number | undefined, symbol: string = '-') => {
  if (number) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(number);
  }
  return symbol;
};
