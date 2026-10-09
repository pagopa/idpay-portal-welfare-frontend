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

const twoLineValueSx = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  whiteSpace: 'normal',
  maxWidth: '100%',
} as const;

const singleLineValueSx = {
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
} as const;

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
            sx={twoLineValueSx}
          >
            {row.businessName}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Tooltip title={row.name}>
          <Box sx={twoLineValueSx}>
            {row.name}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Tooltip title={formatRefundDate}>
          <Box sx={singleLineValueSx}>
            {formatRefundDate}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Tooltip title={requestedRefund}>
          <Box sx={singleLineValueSx}>
            {requestedRefund}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Tooltip title={approvedRefund}>
          <Box sx={singleLineValueSx}>
            {approvedRefund}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Tooltip title={suspendedRefund}>
          <Box sx={singleLineValueSx}>
            {suspendedRefund}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Tooltip title={checksPercentage}>
          <Box sx={singleLineValueSx}>
            {checksPercentage}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Tooltip title={row.assigneeLevel}>
          <Box sx={singleLineValueSx}>
            {row.assigneeLevel}
          </Box>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Tooltip title={statusChipData.label}>
            <Chip
              label={statusChipData.label}
              color={statusChipData.color}
              size="small"
              sx={{ ...statusChipData.sx, minWidth: 0, maxWidth: 'calc(100% - 32px)', '& .MuiChip-label': singleLineValueSx }}
            />
          </Tooltip>
          <ButtonNaked disabled={isDisabled} onClick={handleClick} sx={{ ml: 'auto', flexShrink: 0, minWidth: 0, p: 0 }}>
            <ChevronRightIcon color={isDisabled ? 'disabled' : 'primary'} />
          </ButtonNaked>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default RefundRow;
