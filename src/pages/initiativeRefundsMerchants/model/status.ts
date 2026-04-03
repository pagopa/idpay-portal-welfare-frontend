import { RefundItem, RefundStatus, StatusChipColor } from './types';

type StatusChipConfig = {
  labelKey: string;
  color: StatusChipColor;
  styleStatus?: string;
};

const chipRectSx = {
  borderRadius: '4px',
  height: '24px',
  fontWeight: 600,
  width: 'max-content',
  minWidth: 'max-content',
  display: 'inline-flex',
  flexShrink: 0,
  '& .MuiChip-label': {
    px: 1,
    whiteSpace: 'nowrap',
  },
};

const STATUS_CHIP_CONFIG: Record<Exclude<RefundStatus, 'EVALUATING'>, StatusChipConfig> = {
  APPROVED: {
    labelKey: 'chip.batch.approved',
    color: 'success',
  },
  SENT: {
    labelKey: 'chip.batch.sent',
    color: 'default',
  },
  REFUNDED: {
    labelKey: 'chip.batch.refunded',
    color: 'default',
    styleStatus: 'REFUNDED',
  },
  PENDING_REFUND: {
    labelKey: 'chip.batch.pendingRefund',
    color: 'default',
    styleStatus: 'PENDING_REFUND',
  },
  NOT_REFUNDED: {
    labelKey: 'chip.batch.notRefunded',
    color: 'default',
    styleStatus: 'NOT_REFUNDED',
  },
  APPROVING: {
    labelKey: 'chip.batch.approving',
    color: 'info',
  },
  TO_WORK: {
    labelKey: 'chip.batch.evaluating',
    color: 'primary',
  },
  TO_APPROVE: {
    labelKey: 'chip.batch.toApprove',
    color: 'warning',
  },
};

const getStatusChipConfig = (status: string, role?: string): StatusChipConfig | undefined => {
  const normalizedStatus = status?.toUpperCase?.() as RefundStatus;
  if (normalizedStatus === 'EVALUATING') {
    return role === 'L3'
      ? {
          labelKey: 'chip.batch.toApprove',
          color: 'warning',
        }
      : {
          labelKey: 'chip.batch.evaluating',
          color: 'primary',
        };
  }
  return STATUS_CHIP_CONFIG[normalizedStatus];
};

export const getStatusStyle = (status: string) => {
  const normalizedStatus = status?.toUpperCase?.() ?? '';
  switch (normalizedStatus) {
    case 'REFUNDED':
      return {
        backgroundColor: '#DBF9FA',
        color: '#17324D',
      };
    case 'PENDING_REFUND':
      return {
        backgroundColor: '#E7ECFC',
        color: '#17324D',
      };
    case 'NOT_REFUNDED':
      return {
        backgroundColor: '#FFE0E0',
        color: '#761F1F',
      };
    default:
      return undefined;
  }
};

export const buildStatusChipSx = (status: string) => {
  const statusStyle = getStatusStyle(status);
  if (!statusStyle) {
    return chipRectSx;
  }
  return {
    ...chipRectSx,
    '&&': statusStyle,
  };
};

export const getStatusColor = (status: string, role: string): StatusChipColor =>
  getStatusChipConfig(status, role)?.color ?? 'default';

export const getStatusLabel = (status: string, role: string, t: (key: string) => string) => {
  const config = getStatusChipConfig(status, role);
  return config ? t(config.labelKey) : '-';
};

export const getStatusChipData = (
  status: string,
  role: string | undefined,
  t: (key: string) => string
) => {
  const config = getStatusChipConfig(status, role);
  if (!config) {
    return {
      label: '-',
      color: 'default' as StatusChipColor,
      sx: chipRectSx,
    };
  }
  return {
    label: t(config.labelKey),
    color: config.color,
    sx: buildStatusChipSx(config.styleStatus ?? status),
  };
};

export const getPosTypeLabel = (posType: 'ONLINE' | 'FISICO') =>
  posType ? (posType === 'ONLINE' ? 'Online' : 'Fisico') : '-';

export const formatAmount = (amountCents?: number) => {
  if (amountCents === undefined || amountCents === null) {
    return '-';
  }
  return (amountCents / 100).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
};

export const refundRequestDate = (date?: string) => {
  if (!date) {
    return '-';
  }
  return new Date(date).toLocaleDateString('it-IT');
};

export const getChecksPercentage = (row: RefundItem) => {
  if (row.status === 'SENT') {
    return '0% / 100%';
  }
  if (row.status !== 'EVALUATING') {
    return '100% / 100%';
  }
  if (row.numberOfTransactions > 0 && row.numberOfTransactionsElaborated > 0) {
    const percentage = (row.numberOfTransactionsElaborated / row.numberOfTransactions) * 100;
    return percentage > 100 ? '100% / 100%' : `${Math.floor(percentage)}% / 100%`;
  }
  return '0% / 100%';
};

export const isBatchRowDisabled = (status: string) => {
  const normalizedStatus = status?.toUpperCase?.() ?? '';
  return normalizedStatus === 'SENT' || normalizedStatus === 'CREATED';
};
