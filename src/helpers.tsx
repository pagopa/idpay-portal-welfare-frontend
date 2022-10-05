import { Chip } from '@mui/material';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';

export const renderInitiativeStatus = (status: string | undefined) => {
  switch (status) {
    case 'DRAFT':
      return <Chip label={i18n.t('pages.initiativeList.status.draft')} color="default" />;
    case 'IN_REVISION':
      return <Chip label={i18n.t('pages.initiativeList.status.inRevision')} color="warning" />;
    case 'TO_CHECK':
      return <Chip label={i18n.t('pages.initiativeList.status.toCheck')} color="error" />;
    case 'APPROVED':
      return <Chip label={i18n.t('pages.initiativeList.status.approved')} color="success" />;
    case 'PUBLISHED':
      return <Chip label={i18n.t('pages.initiativeList.status.published')} color="indigo" />;
    case 'CLOSED':
      return <Chip label={i18n.t('pages.initiativeList.status.closed')} color="default" />;
    case 'SUSPENDED':
      return <Chip label={i18n.t('pages.initiativeList.status.suspended')} color="error" />;
    default:
      return null;
  }
};

export const peopleReached = (totalBudget: string, budgetPerPerson: string): any => {
  const totalBudgetInt = parseInt(totalBudget, 10);
  const budgetPerPersonInt = parseInt(budgetPerPerson, 10);
  return Math.floor(totalBudgetInt / budgetPerPersonInt);
};
