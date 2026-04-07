import { Chip } from '@mui/material';
import { t } from '../../locale';

export const getRefundStatus = (status: string | undefined) => {
  switch (status) {
    case 'COMPLETED_OK':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={t('pages.initiativeRefundsDetails.status.done')}
          color="success"
        />
      );
    case 'COMPLETED_KO':
    case 'RECOVERED':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={t('pages.initiativeRefundsDetails.status.failed')}
          color="error"
        />
      );
    case 'EXPORTED':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={t('pages.initiativeRefundsDetails.status.onEvaluation')}
          color="default"
        />
      );
    default:
      return null;
  }
};
