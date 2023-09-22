import { Alert, Box, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslation } from 'react-i18next';
import { copyTextToClipboard, formatedCurrency } from '../../../../helpers';
import { OperationProps, formatDate, transactionResult } from '../../helpers';

const TransactionContent = ({ transactionDetail }: OperationProps) => {
  const { t } = useTranslation();

  return (
    <>
      {transactionDetail?.status === 'CANCELLED' && (
        <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
          <Alert severity="info">
            <Typography variant="body2">
              {t('pages.initiativeUserDetails.transactionDetail.discountCancelledAlertText')}
            </Typography>
          </Alert>
        </Box>
      )}
      <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          {t('pages.initiativeUserDetails.transactionDetail.merchant')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 12' }}>
        <Typography variant="body2" fontWeight={600}>
          {transactionDetail?.businessName}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          {t('pages.initiativeUserDetails.transactionDetail.expenseAmount')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 12' }}>
        <Typography variant="body2" fontWeight={600}>
          {formatedCurrency(transactionDetail?.amount)}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          {t('pages.initiativeUserDetails.transactionDetail.discountApplied')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 12' }}>
        <Typography variant="body2" fontWeight={600}>
          {formatedCurrency(transactionDetail?.accrued)}
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
      <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          {t('pages.initiativeUserDetails.transactionDetail.transactionId')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 10' }}>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            width: '260px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {transactionDetail?.eventId}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 2' }}>
        <ContentCopyIcon
          onClick={() => copyTextToClipboard(transactionDetail?.eventId)}
          color="primary"
          sx={{ cursor: 'pointer', transform: 'scale(-1) rotate(270deg)' }}
          data-testid="transaction-modal-copy"
        />
      </Box>
      {transactionResult(transactionDetail?.operationType)}
    </>
  );
};

export default TransactionContent;
