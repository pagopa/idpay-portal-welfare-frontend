import { fireEvent, render, screen } from '@testing-library/react';
import RefundTransactionsHeader from '../RefundTransactionsHeader';
import { RewardBatchTrxStatus as RewardBatchTrxStatusEnum } from '../../../../api/generated/merchants/apiClient';

jest.mock('../RefundActionButtons', () => ({
  RefundActionButtons: (props: any) => (
    <div data-testid="refund-action-buttons" data-status={props.status} data-size={props.size}>
      <button data-testid="approve-action" onClick={props.onApprove}>
        approve
      </button>
      <button data-testid="suspend-action" onClick={props.onSuspend}>
        suspend
      </button>
      <button data-testid="reject-action" onClick={props.onReject}>
        reject
      </button>
    </div>
  ),
}));

jest.mock('../RoleActionButton', () => ({
  RoleActionButton: (props: any) => (
    <button data-testid="role-action-button" onClick={props.onClick}>
      {props.role}
    </button>
  ),
}));

const t = (key: string) => key;

const baseBatch = {
  businessName: 'Merchant one',
  status: 'EVALUATING',
  assigneeLevel: 'L1' as const,
};

describe('<RefundTransactionsHeader />', () => {
  test('renders row action buttons when rows are selected', () => {
    const onOpenApproveModal = jest.fn();
    const onOpenSuspendModal = jest.fn();
    const onOpenRejectModal = jest.fn();

    render(
      <RefundTransactionsHeader
        t={t}
        batch={baseBatch}
        role="operator1"
        selectedRowsSize={2}
        lockedStatus={RewardBatchTrxStatusEnum.SUSPENDED}
        onOpenApproveModal={onOpenApproveModal}
        onOpenSuspendModal={onOpenSuspendModal}
        onOpenRejectModal={onOpenRejectModal}
        onOpenBatchModal={jest.fn()}
        onGetCsv={jest.fn()}
      />
    );

    expect(screen.getByText('Merchant one')).toBeInTheDocument();
    expect(screen.getByTestId('refund-action-buttons')).toHaveAttribute('data-status', RewardBatchTrxStatusEnum.SUSPENDED);
    expect(screen.getByTestId('refund-action-buttons')).toHaveAttribute('data-size', '2');

    fireEvent.click(screen.getByTestId('approve-action'));
    fireEvent.click(screen.getByTestId('suspend-action'));
    fireEvent.click(screen.getByTestId('reject-action'));

    expect(onOpenApproveModal).toHaveBeenCalledTimes(1);
    expect(onOpenSuspendModal).toHaveBeenCalledTimes(1);
    expect(onOpenRejectModal).toHaveBeenCalledTimes(1);
  });

  test('renders role action button for the matching assignee level', () => {
    const onOpenBatchModal = jest.fn();

    render(
      <RefundTransactionsHeader
        t={t}
        batch={baseBatch}
        role="operator1"
        selectedRowsSize={0}
        lockedStatus={null}
        onOpenApproveModal={jest.fn()}
        onOpenSuspendModal={jest.fn()}
        onOpenRejectModal={jest.fn()}
        onOpenBatchModal={onOpenBatchModal}
        onGetCsv={jest.fn()}
      />
    );

    expect(screen.getByTestId('role-action-button')).toHaveTextContent('L1');
    fireEvent.click(screen.getByTestId('role-action-button'));
    expect(onOpenBatchModal).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('refund-action-buttons')).not.toBeInTheDocument();
  });

  test('renders no contextual action when the role does not match and no rows are selected', () => {
    render(
      <RefundTransactionsHeader
        t={t}
        batch={baseBatch}
        role="operator2"
        selectedRowsSize={0}
        lockedStatus={null}
        onOpenApproveModal={jest.fn()}
        onOpenSuspendModal={jest.fn()}
        onOpenRejectModal={jest.fn()}
        onOpenBatchModal={jest.fn()}
        onGetCsv={jest.fn()}
      />
    );

    expect(screen.queryByTestId('role-action-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('refund-action-buttons')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'pages.initiativeMerchantsTransactions.csv.button' })).not.toBeInTheDocument();
  });

  test('renders the csv action and approval alert for non-evaluating batches', () => {
    const onGetCsv = jest.fn();
    const { rerender } = render(
      <RefundTransactionsHeader
        t={t}
        batch={{ ...baseBatch, status: 'APPROVED' }}
        role="operator1"
        selectedRowsSize={0}
        lockedStatus={null}
        onOpenApproveModal={jest.fn()}
        onOpenSuspendModal={jest.fn()}
        onOpenRejectModal={jest.fn()}
        onOpenBatchModal={jest.fn()}
        onGetCsv={onGetCsv}
      />
    );

    const csvButton = screen.getByRole('button', { name: 'pages.initiativeMerchantsTransactions.csv.button' });
    expect(csvButton).toBeEnabled();

    fireEvent.click(csvButton);
    expect(onGetCsv).toHaveBeenCalledTimes(1);

    rerender(
      <RefundTransactionsHeader
        t={t}
        batch={{ ...baseBatch, status: 'APPROVING' }}
        role="operator1"
        selectedRowsSize={0}
        lockedStatus={null}
        onOpenApproveModal={jest.fn()}
        onOpenSuspendModal={jest.fn()}
        onOpenRejectModal={jest.fn()}
        onOpenBatchModal={jest.fn()}
        onGetCsv={onGetCsv}
      />
    );

    expect(screen.getByRole('button', { name: 'pages.initiativeMerchantsTransactions.csv.button' })).toBeDisabled();
    expect(screen.getByText('pages.initiativeMerchantsTransactions.csv.alert')).toBeInTheDocument();
  });
});
