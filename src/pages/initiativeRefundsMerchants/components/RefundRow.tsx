import { Box, Chip, TableCell, TableRow, Tooltip } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { RefundItem } from '../model/types';
import {
  formatAmount,
  getChecksPercentage,
  getStatusChipData,
  isBatchRowDisabled,
  refundRequestDate,
} from '../model/status';

type RefundRowProps = {
  row: RefundItem;
  t: (key: string) => string;
  onClick: () => void;
};

const RefundRow = ({ row, t, onClick }: RefundRowProps) => {
  const status = row.status?.toUpperCase?.() ?? '';
  const isDisabled = isBatchRowDisabled(status);
  const checksPercentage = getChecksPercentage(row);
  const requestedRefund = formatAmount(row.initialAmountCents);
  const approvedRefund = formatAmount(row.approvedAmountCents);
  const suspendedRefund = formatAmount(row.suspendedAmountCents);
  const formatRefundDate = refundRequestDate(row.merchantSendDate);
  const statusChipData = getStatusChipData(row.status, row.assigneeLevel, t);

  const handleClick = () => {
    if (!isDisabled) {
      onClick();
    }
  };

  return (
    <TableRow hover>
      <TableCell>
        <Tooltip title={row.businessName}>
          <Box
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 300,
            }}
          >
            {row.businessName}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Tooltip title={row.name}>
          <Box sx={{ display: 'inline-flex', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.name}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Tooltip title={formatRefundDate}>
          <Box sx={{ display: 'inline-flex', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {formatRefundDate}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Tooltip title={requestedRefund}>
          <Box sx={{ display: 'inline-flex', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {requestedRefund}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Tooltip title={approvedRefund}>
          <Box sx={{ display: 'inline-flex', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {approvedRefund}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Tooltip title={suspendedRefund}>
          <Box sx={{ display: 'inline-flex', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {suspendedRefund}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Tooltip title={checksPercentage}>
          <Box sx={{ display: 'inline-flex', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {checksPercentage}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell sx={{ pr: 0 }}>
        <Tooltip title={row.assigneeLevel}>
          <Box sx={{ display: 'inline-flex', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.assigneeLevel}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Chip label={statusChipData.label} color={statusChipData.color} size="small" sx={statusChipData.sx} />
      </TableCell>

      <TableCell sx={{ textAlign: 'right' }}>
        <ButtonNaked disabled={isDisabled} onClick={handleClick}>
          <ChevronRightIcon color={isDisabled ? 'disabled' : 'primary'} />
        </ButtonNaked>
      </TableCell>
    </TableRow>
  );
};

export default RefundRow;