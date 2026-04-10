import { Download, Sync } from '@mui/icons-material';
import { Alert, Box, Button, Typography } from '@mui/material';
import { RewardBatchTrxStatus } from '../../../api/generated/merchants/apiClient';
import { RefundActionButtons } from './RefundActionButtons';
import { RoleActionButton } from './RoleActionButton';

type Props = {
  t: (key: string) => string;
  batch: {
    businessName: string;
    status: string;
    assigneeLevel: 'L1' | 'L2' | 'L3';
  };
  role: string;
  selectedRowsSize: number;
  lockedStatus: RewardBatchTrxStatus | null;
  onOpenApproveModal: () => void;
  onOpenSuspendModal: () => void;
  onOpenRejectModal: () => void;
  onOpenBatchModal: () => void;
  onGetCsv: () => void;
};

const RefundTransactionsHeader = ({
  t,
  batch,
  role,
  selectedRowsSize,
  lockedStatus,
  onOpenApproveModal,
  onOpenSuspendModal,
  onOpenRejectModal,
  onOpenBatchModal,
  onGetCsv,
}: Props) => {
  const showRoleAction =
    batch.status === 'EVALUATING' &&
    selectedRowsSize === 0 &&
    role.replace('operator', 'L').toUpperCase() === batch.assigneeLevel.toUpperCase();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 3 }}>
        <Box sx={{ flex: 1, width: 0, minWidth: 0 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-word',
            }}
          >
            {batch.businessName}
          </Typography>
        </Box>

        {batch.status === 'EVALUATING' ? (
          selectedRowsSize > 0 ? (
            <Box sx={{ width: '50%' }}>
              <RefundActionButtons
                direction="row"
                status={lockedStatus as RewardBatchTrxStatus}
                onApprove={onOpenApproveModal}
                onSuspend={onOpenSuspendModal}
                onReject={onOpenRejectModal}
                size={selectedRowsSize}
              />
            </Box>
          ) : showRoleAction ? (
            <RoleActionButton onClick={onOpenBatchModal} role={batch.assigneeLevel} />
          ) : null
        ) : (
          <Box sx={{ width: '25%', justifyContent: 'flex-end', display: 'flex' }}>
            <Button
              onClick={onGetCsv}
              variant="contained"
              disabled={batch.status === 'APPROVING'}
              startIcon={<Download />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {t('pages.initiativeMerchantsTransactions.csv.button')}
            </Button>
          </Box>
        )}
      </Box>

      {batch.status === 'APPROVING' && (
        <Alert sx={{ mb: 3 }} variant="outlined" color="info" icon={<Sync sx={{ color: '#6BCFFB' }} />}>
          {t('pages.initiativeMerchantsTransactions.csv.alert')}
        </Alert>
      )}
    </>
  );
};

export default RefundTransactionsHeader;