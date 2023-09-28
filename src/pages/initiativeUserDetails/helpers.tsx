import { Box, Chip, Typography } from '@mui/material';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { OperationDTO } from '../../api/generated/initiative/OperationDTO';

export interface OperationProps {
  transactionDetail: OperationDTO;
}

export const transactionResult = (opeType: string | undefined) => {
  if (typeof opeType !== 'undefined') {
    if (opeType?.toUpperCase().includes('REJECTED') || opeType?.toUpperCase().includes('KO')) {
      return (
        <>
          <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
            <Typography variant="body2" color="text.secondary" textAlign="left">
              {i18n.t('pages.initiativeUserDetails.transactionDetail.result')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12', mt: 2 }}>
            <Chip
              sx={{ fontSize: '14px', variant: 'body2', fontWeight: 600 }}
              label={i18n.t('pages.initiativeUserDetails.transactionDetail.negativeResult')}
              color="error"
            />
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
            <Typography variant="body2" color="text.secondary" textAlign="left">
              {i18n.t('pages.initiativeUserDetails.transactionDetail.result')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12', mt: 2 }}>
            <Chip
              sx={{ fontSize: '14px', variant: 'body2', fontWeight: 600 }}
              label={i18n.t('pages.initiativeUserDetails.transactionDetail.positiveResult')}
              color="success"
            />
          </Box>
        </>
      );
    }
  } else {
    return;
  }
};

export const formatDate = (date: string | undefined) => {
  if (typeof date === 'string') {
    const newDate = new Date(date);
    if (newDate) {
      return newDate.toLocaleString('it-IT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Europe/Rome',
        hour: 'numeric',
        minute: 'numeric',
      });
    }
  }
  return '';
};
