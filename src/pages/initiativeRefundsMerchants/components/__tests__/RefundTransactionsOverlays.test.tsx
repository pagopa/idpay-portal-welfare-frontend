import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RefundTransactionsOverlays from '../RefundTransactionsOverlays';

jest.mock('../RefundsTransactionsDrawer', () => (props: any) => (
  <div>
    <button data-testid="drawer-approve" onClick={() => props.onApprove('trx-1')}>
      drawer-approve
    </button>
    <button
      data-testid="drawer-suspend"
      onClick={() => props.onSuspend('trx-1', 'reason-suspend', { genericError: true })}
    >
      drawer-suspend
    </button>
    <button
      data-testid="drawer-reject"
      onClick={() => props.onReject('trx-1', 'reason-reject', { genericError: true })}
    >
      drawer-reject
    </button>
    <button data-testid="drawer-close" onClick={props.onClose}>
      drawer-close
    </button>
  </div>
));

jest.mock('../RefundReasonModal', () => (props: any) =>
  props.open ? (
    <div>
      <button data-testid="reason-close" onClick={props.onClose}>
        reason-close
      </button>
      <button
        data-testid="reason-confirm"
        onClick={() => props.onConfirm('bulk-reason', { genericError: true })}
      >
        reason-confirm
      </button>
    </div>
  ) : null
);

jest.mock('../ApproveConfirmModal', () => (props: any) =>
  props.open ? (
    <div>
      <button data-testid="approve-close" onClick={props.onClose}>
        approve-close
      </button>
      <button data-testid="approve-confirm" onClick={props.onConfirm}>
        approve-confirm
      </button>
    </div>
  ) : null
);

jest.mock('../RoleConfirmModal', () => ({
  RoleConfirmModal: (props: any) =>
    props.open ? (
      <div>
        <button data-testid="role-confirm-close" onClick={props.onClose}>
          role-close
        </button>
        <button data-testid="role-confirm-confirm" onClick={props.onConfirm}>
          role-confirm
        </button>
      </div>
    ) : null,
}));

jest.mock('../RoleErrorModal', () => ({
  RoleErrorModal: (props: any) =>
    props.open ? (
      <button data-testid="role-error-close" onClick={props.onClose}>
        role-error-close
      </button>
    ) : null,
}));

const getBaseProps = () => ({
  openDrawer: true,
  handleCloseDrawer: jest.fn(),
  selectedTransaction: { trxId: 'trx-1' } as any,
  downloadInvoice: jest.fn(),
  formatDate: jest.fn((d?: string) => d ?? '-'),
  closeAfter: jest.fn((p: Promise<any>) => p),
  handleRefundAction: jest.fn(() => Promise.resolve()),
  disabled: false,
  reasonModal: { open: true, type: 'suspend' as 'reject' | 'suspend' | null },
  setReasonModal: jest.fn(),
  selectedRowsSize: 2,
  selectedRows: new Set(['trx-1', 'trx-2']),
  approveModal: true,
  setApproveModal: jest.fn(),
  approve: jest.fn(() => Promise.resolve()),
  batchModalOpen: true,
  batchAssigneeLevel: 'L1' as 'L1' | 'L2' | 'L3',
  setBatchModalOpen: jest.fn(),
  handleBatchStatus: jest.fn(),
  batchErrorOpen: true,
  setBatchErrorOpen: jest.fn(),
});

describe('<RefundTransactionsOverlays />', () => {
  test('routes drawer actions through closeAfter and handleRefundAction', () => {
    const props = getBaseProps();
    render(<RefundTransactionsOverlays {...props} />);

    fireEvent.click(screen.getByTestId('drawer-approve'));
    fireEvent.click(screen.getByTestId('drawer-suspend'));
    fireEvent.click(screen.getByTestId('drawer-reject'));
    fireEvent.click(screen.getByTestId('drawer-close'));

    expect(props.handleRefundAction).toHaveBeenCalledWith('approve', ['trx-1']);
    expect(props.handleRefundAction).toHaveBeenCalledWith(
      'suspend',
      ['trx-1'],
      'reason-suspend',
      { genericError: true }
    );
    expect(props.handleRefundAction).toHaveBeenCalledWith(
      'reject',
      ['trx-1'],
      'reason-reject',
      { genericError: true }
    );
    expect(props.closeAfter).toHaveBeenCalledTimes(3);
    expect(props.handleCloseDrawer).toHaveBeenCalled();
  });

  test('handles reason modal confirm/close and null reason type branch', async () => {
    const props = getBaseProps();
    const { rerender } = render(<RefundTransactionsOverlays {...props} />);

    fireEvent.click(screen.getByTestId('reason-close'));
    expect(props.setReasonModal).toHaveBeenCalledWith({ open: false, type: null });

    fireEvent.click(screen.getByTestId('reason-confirm'));
    await waitFor(() =>
      expect(props.handleRefundAction).toHaveBeenCalledWith(
        'suspend',
        ['trx-1', 'trx-2'],
        'bulk-reason',
        { genericError: true }
      )
    );

    const nullTypeProps = {
      ...props,
      reasonModal: { open: true, type: null },
    };
    rerender(<RefundTransactionsOverlays {...nullTypeProps} />);
    fireEvent.click(screen.getByTestId('reason-confirm'));

    expect(props.handleRefundAction).toHaveBeenCalledTimes(1);
  });

  test('handles approve and role overlays', () => {
    const props = getBaseProps();
    render(<RefundTransactionsOverlays {...props} />);

    fireEvent.click(screen.getByTestId('approve-close'));
    expect(props.setApproveModal).toHaveBeenCalledWith(false);

    fireEvent.click(screen.getByTestId('approve-confirm'));
    expect(props.approve).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('role-confirm-close'));
    expect(props.setBatchModalOpen).toHaveBeenCalledWith(false);

    fireEvent.click(screen.getByTestId('role-confirm-confirm'));
    expect(props.handleBatchStatus).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('role-error-close'));
    expect(props.setBatchErrorOpen).toHaveBeenCalledWith(false);
  });
});