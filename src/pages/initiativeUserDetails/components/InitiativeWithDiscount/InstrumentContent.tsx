import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { OperationProps, formatDate, transactionResult } from '../../helpers';

const InstrumentContent = ({ transactionDetail }: OperationProps) => {
  const { t } = useTranslation();

  const getInstrumentTypeLabel = (instrumentType: string | undefined) => {
    if (typeof instrumentType === 'string') {
      switch (instrumentType) {
        case 'CARD':
          return t('pages.initiativeUserDetails.transactionDetail.card');
        case 'IDPAYCODE':
          return t('pages.initiativeUserDetails.transactionDetail.idPayCode');
        default:
          return '-';
      }
    }
    return '-';
  };

  return (
    <>
      <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          {t('pages.initiativeUserDetails.transactionDetail.paymentMethod')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 12' }}>
        <Typography variant="body2" fontWeight={600}>
          {getInstrumentTypeLabel(transactionDetail?.instrumentType)}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          {t('pages.initiativeUserDetails.transactionDetail.date')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 12' }}>
        <Typography variant="body2" fontWeight={600}>
          {formatDate(transactionDetail?.operationDate)}
        </Typography>
      </Box>
      {transactionResult(transactionDetail?.operationType)}
    </>
  );
};

export default InstrumentContent;
