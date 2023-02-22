import { Chip } from '@mui/material';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';

export const getRefundStatus = (status: string | undefined) => {
  switch (status) {
    case 'COMPLETED_OK':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeRefundsDetails.status.done')}
          color="success"
        />
      );
    case 'COMPLETED_KO':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeRefundsDetails.status.failed')}
          color="error"
        />
      );
    case 'EXPORTED':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeRefundsDetails.status.onEvaluation')}
          color="default"
        />
      );
    default:
      return null;
  }
};
