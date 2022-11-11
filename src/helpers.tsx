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
  const totalBudgetInt = parseInt(totalBudget, 10);
  const budgetPerPersonInt = parseInt(budgetPerPerson, 10);
  return Math.floor(totalBudgetInt / budgetPerPersonInt);
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
