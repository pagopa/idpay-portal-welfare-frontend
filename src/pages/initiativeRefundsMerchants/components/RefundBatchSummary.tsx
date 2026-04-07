import { Box, Chip, Paper, Tooltip, Typography } from '@mui/material';
import { formatCurrencyFromCents } from '../model/formatters';

type Props = {
  t: (key: string) => string;
  batch: {
    name: string;
    merchantSendDate: string;
    initialAmountCents: number;
    approvedAmountCents: number;
    suspendedAmountCents: number;
    assigneeLevel: 'L1' | 'L2' | 'L3';
    status: string;
    businessName: string;
    refundErrorMessage?: string;
  };
  formattedPeriod: string;
  iban: string;
  checksPercentage: string;
  refundRequestDate: (value?: string) => string;
  getStatusLabel: (status: string, role: string, t: (key: string) => string) => string;
  getStatusColor: (status: string, role: string) => 'default' | 'primary' | 'warning' | 'info' | 'success';
  buildStatusChipSx: (status: string) => object;
};

const EllipsisValue = ({ value }: { value: string }) => (
  <Tooltip title={value || '-'}>
    <Box component="span" sx={{ display: 'inline-block', maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
      {value || '-'}
    </Box>
  </Tooltip>
);

const RefundBatchSummary = ({
  t,
  batch,
  formattedPeriod,
  iban,
  checksPercentage,
  refundRequestDate,
  getStatusLabel,
  getStatusColor,
  buildStatusChipSx,
}: Props) => (
  <Paper sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', width: '100%', mb: 3, p: 3, gap: 3 }}>
    <Box sx={{ display: 'grid', gridColumn: 'span 6', gridTemplateColumns: 'repeat(12,1fr)', gap: 1.5 }}>
      <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
        {t('pages.initiativeMerchantsTransactions.batchDetail.batchRef')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        <EllipsisValue value={batch.name} />
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
        {t('pages.initiativeMerchantsTransactions.batchDetail.period')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        <EllipsisValue value={formattedPeriod} />
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
        {t('pages.initiativeMerchantsRefunds.table.requestRefundDate')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        <EllipsisValue value={refundRequestDate(batch.merchantSendDate)} />
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
        {t('pages.initiativeMerchantsTransactions.batchDetail.requestedRefund')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        <EllipsisValue value={formatCurrencyFromCents(batch.initialAmountCents)} />
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
        {t('pages.initiativeMerchantsTransactions.batchDetail.approvedRefund')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        <EllipsisValue value={formatCurrencyFromCents(batch.approvedAmountCents)} />
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
        {t('pages.initiativeMerchantsTransactions.batchDetail.suspendedRefund')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        <EllipsisValue value={formatCurrencyFromCents(batch.suspendedAmountCents)} />
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
        {t('pages.initiativeMerchantsTransactions.batchDetail.assignedTo')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        <EllipsisValue value={batch.assigneeLevel} />
      </Typography>
    </Box>

    <Box sx={{ display: 'grid', gridColumn: 'span 6', gridTemplateColumns: 'repeat(12,1fr)', gap: 1.5 }}>
      <Typography variant="subtitle2" sx={{ gridColumn: 'span 12', fontWeight: 600 }}>
        {t('pages.initiativeMerchantsTransactions.batchDetail.refundData')}
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
        {t('pages.initiativeMerchantsTransactions.batchDetail.beneficiary')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        <EllipsisValue value={batch.businessName} />
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
        {t('pages.initiativeMerchantsTransactions.batchDetail.iban')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        <EllipsisValue value={iban} />
      </Typography>

      {batch.status === 'EVALUATING' && (
        <>
          <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
            {t('pages.initiativeMerchantsTransactions.batchDetail.checksCompleted')}
          </Typography>
          <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
            <EllipsisValue value={checksPercentage} />
          </Typography>
        </>
      )}

      <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
        {t('pages.initiativeMerchantsRefunds.table.status')}
      </Typography>
      <Box sx={{ gridColumn: 'span 7' }}>
        <Chip
          label={getStatusLabel(batch.status, batch.assigneeLevel, t)}
          color={getStatusColor(batch.status, batch.assigneeLevel)}
          size="small"
          sx={buildStatusChipSx(batch.status)}
        />
      </Box>

      {batch.status === 'NOT_REFUNDED' && (
        <>
          <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
            {t('pages.initiativeMerchantsTransactions.batchDetail.refundErrorMessage')}
          </Typography>
          <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
            <EllipsisValue value={batch.refundErrorMessage || '-'} />
          </Typography>
        </>
      )}
    </Box>
  </Paper>
);

export default RefundBatchSummary;