import { Box, Chip, Typography } from '@mui/material';
import { t } from '../../locale';
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
              {t('pages.initiativeUserDetails.transactionDetail.result')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12', mt: 2 }}>
            <Chip
              sx={{ fontSize: '14px', variant: 'body2', fontWeight: 600 }}
              label={t('pages.initiativeUserDetails.transactionDetail.negativeResult')}
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
              {t('pages.initiativeUserDetails.transactionDetail.result')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12', mt: 2 }}>
            <Chip
              sx={{ fontSize: '14px', variant: 'body2', fontWeight: 600 }}
              label={t('pages.initiativeUserDetails.transactionDetail.positiveResult')}
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

export const formatChannel = (channel: string | undefined) => {
  if (typeof channel === 'string') {
    switch (channel) {
      case 'IDPAYCODE':
        return t('pages.initiativeUserDetails.transactionDetail.cie');
      case 'QRCODE':
      case 'BARCODE':
        return t('pages.initiativeUserDetails.appIo');
      default:
        return '-';
    }
  }
  return '-';
};
