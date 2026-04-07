import { ChecksErrorDTO } from '../../../api/generated/merchants/ChecksErrorDTO';

import { RefundsDrawerData } from '../model/types';

import ApproveConfirmModal from './ApproveConfirmModal';
import RefundReasonModal from './RefundReasonModal';
import RefundsTransactionsDrawer from './RefundsTransactionsDrawer';
import { RoleConfirmModal } from './RoleConfirmModal';
import { RoleErrorModal } from './RoleErrorModal';

type Props = {
  openDrawer: boolean;
  handleCloseDrawer: () => void;
  selectedTransaction: RefundsDrawerData | null;
  downloadInvoice: (
    pointOfSaleId: string | any,
    transactionId: string | any,
    invoiceFileName: string | any,
    isDownload?: boolean
  ) => void;
  formatDate: (d?: string) => string;
  closeAfter: (fn: Promise<any>) => Promise<any>;
  handleRefundAction: (
    action: 'approve' | 'suspend' | 'reject',
    trxIds: Array<string>,
    reason?: string,
    checksError?: ChecksErrorDTO
  ) => Promise<any>;
  disabled: boolean;
  reasonModal: { open: boolean; type: 'reject' | 'suspend' | null };
  setReasonModal: (value: { open: boolean; type: 'reject' | 'suspend' | null }) => void;
  selectedRowsSize: number;
  selectedRows: Set<string>;
  approveModal: boolean;
  setApproveModal: (value: boolean) => void;
  approve: () => Promise<any>;
  batchModalOpen: boolean;
  batchAssigneeLevel: 'L1' | 'L2' | 'L3';
  setBatchModalOpen: (value: boolean) => void;
  handleBatchStatus: () => void;
  batchErrorOpen: boolean;
  setBatchErrorOpen: (value: boolean) => void;
};

const RefundTransactionsOverlays = ({
  openDrawer,
  handleCloseDrawer,
  selectedTransaction,
  downloadInvoice,
  formatDate,
  closeAfter,
  handleRefundAction,
  disabled,
  reasonModal,
  setReasonModal,
  selectedRowsSize,
  selectedRows,
  approveModal,
  setApproveModal,
  approve,
  batchModalOpen,
  batchAssigneeLevel,
  setBatchModalOpen,
  handleBatchStatus,
  batchErrorOpen,
  setBatchErrorOpen,
}: Props) => (
  <>
    <RefundsTransactionsDrawer
      open={openDrawer}
      onClose={handleCloseDrawer}
      data={selectedTransaction}
      download={downloadInvoice}
      formatDate={formatDate}
      onApprove={(trxId) => closeAfter(handleRefundAction('approve', [trxId]))}
      onSuspend={(trxId, reason, checksError) => closeAfter(handleRefundAction('suspend', [trxId], reason, checksError))}
      onReject={(trxId, reason, checksError) => closeAfter(handleRefundAction('reject', [trxId], reason, checksError))}
      disabled={disabled}
    />

    <RefundReasonModal
      open={reasonModal.open}
      type={(reasonModal.type ?? 'reject') as 'reject' | 'suspend'}
      count={selectedRowsSize}
      onClose={() => setReasonModal({ open: false, type: null })}
      onConfirm={async (reason, checksError) => {
        if (!reasonModal.type) {
          return;
        }
        await handleRefundAction(reasonModal.type, [...selectedRows], reason, checksError);
        setReasonModal({ open: false, type: null });
      }}
    />

    <ApproveConfirmModal
      open={approveModal}
      count={selectedRowsSize}
      onClose={() => setApproveModal(false)}
      onConfirm={() => {
        void approve();
        setApproveModal(false);
      }}
    />

    <RoleConfirmModal
      open={batchModalOpen}
      role={batchAssigneeLevel}
      onClose={() => setBatchModalOpen(false)}
      onConfirm={handleBatchStatus}
    />

    <RoleErrorModal open={batchErrorOpen} onClose={() => setBatchErrorOpen(false)} />
  </>
);

export default RefundTransactionsOverlays;