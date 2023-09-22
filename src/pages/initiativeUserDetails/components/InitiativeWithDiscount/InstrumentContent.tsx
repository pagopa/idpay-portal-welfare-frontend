import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { OperationProps, formatDate, transactionResult } from '../../helpers';

const InstrumentContent = ({ transactionDetail }: OperationProps) => {
  const { t } = useTranslation();
  // TODO CHECK LABEL VALUE FOR instrumentType
  return (
    <>
      <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          TODO
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 12' }}>
        <Typography variant="body2" fontWeight={600}>
          {transactionDetail?.instrumentType}
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
