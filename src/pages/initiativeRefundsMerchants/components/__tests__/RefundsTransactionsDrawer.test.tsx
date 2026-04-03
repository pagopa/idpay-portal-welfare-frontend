import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RewardBatchTrxStatusEnum } from '../../../../api/generated/merchants/RewardBatchTrxStatus';
import RefundsTransactionsDrawer from '../RefundsTransactionsDrawer';

const mockOnClose = jest.fn();
const mockDownload = jest.fn();
const mockOnApprove = jest.fn();
const mockOnSuspend = jest.fn();
const mockOnReject = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@pagopa/mui-italia', () => ({
  ButtonNaked: (props: any) => (
    <button onClick={props.onClick} data-testid="button-naked-test">
      {props.children}
    </button>
  ),
  CopyToClipboardButton: (props: any) => <button data-testid="copy-btn">{props.value}</button>,
}));

jest.mock('../RefundActionButtons', () => ({
  RefundActionButtons: (props: any) => (
    <div>
      <button data-testid="drawer-approve" onClick={props.onApprove}>
        approve
      </button>
      <button data-testid="drawer-suspend" onClick={props.onSuspend}>
        suspend
      </button>
      <button data-testid="drawer-reject" onClick={props.onReject}>
        reject
      </button>
    </div>
  ),
}));

jest.mock('../RefundReasonModal', () => (props: any) => (
  props.open ? (
    <button
      data-testid="reason-modal-confirm"
      onClick={() => props.onConfirm('test reason', { genericError: true })}
    >
      reason-confirm
    </button>
  ) : null
));

jest.mock('../ApproveConfirmModal', () => (props: any) => (
  props.open ? (
    <button data-testid="approve-modal-confirm" onClick={props.onConfirm}>
      approve-confirm
    </button>
  ) : null
));

const baseData = {
  trxChargeDate: '2026-03-10T10:00:00.000Z',
  productName: 'Product',
  productGtin: 'GTIN-1',
  fiscalCode: 'RSSMRA80A01H501U',
  trxId: 'trx-1',
  trxCode: '12345',
  effectiveAmountCents: 1000,
  rewardAmountCents: 500,
  authorizedAmountCents: 600,
  invoiceDocNumber: 'INV-1',
  invoiceFileName: 'invoice.pdf',
  pointOfSaleId: 'pos-1',
  transactionId: 'trx-1',
  rewardBatchTrxStatus: RewardBatchTrxStatusEnum.SUSPENDED,
  checksError: { cfError: true, genericError: true },
  statusLabel: 'pages.initiativeMerchantsTransactions.table.toCheck',
  statusColor: 'default',
  rewardBatchRejectionReason: [
    { reason: 'Reason 1', date: new Date('2026-03-10T10:00:00.000Z') },
    { reason: '-', date: new Date('2026-03-10T10:00:00.000Z') },
    { reason: 'Reason 2', date: undefined },
  ],
};

describe('<RefundsTransactionsDrawer />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders details and handles close/download actions', () => {
    render(
      <RefundsTransactionsDrawer
        open={true}
        onClose={mockOnClose}
        data={baseData as any}
        download={mockDownload}
        formatDate={(d?: string) => d ?? '-'}
        onApprove={mockOnApprove}
        onSuspend={mockOnSuspend}
        onReject={mockOnReject}
        disabled={false}
      />
    );

    expect(screen.getByText('pages.initiativeMerchantsTransactions.drawer.trxDetail')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByTestId('CloseIcon'));
    expect(mockOnClose).toHaveBeenCalled();

    fireEvent.click(screen.getByText('invoice.pdf'));
    expect(mockDownload).toHaveBeenCalledWith('pos-1', 'trx-1', 'invoice.pdf');

    fireEvent.click(screen.getByTestId('DownloadIcon'));
    expect(mockDownload).toHaveBeenCalledWith('pos-1', 'trx-1', 'invoice.pdf', true);
  });

  test('handles reason modal and approve modal flows', async () => {
    render(
      <RefundsTransactionsDrawer
        open={true}
        onClose={mockOnClose}
        data={baseData as any}
        download={mockDownload}
        formatDate={() => '10/03/2026'}
        onApprove={mockOnApprove}
        onSuspend={mockOnSuspend}
        onReject={mockOnReject}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByText('pages.initiativeMerchantsTransactions.drawer.editChecks'));
    fireEvent.click(screen.getByTestId('reason-modal-confirm'));
    expect(mockOnSuspend).toHaveBeenCalledWith('trx-1', 'test reason', { genericError: true });
    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());

    fireEvent.click(screen.getByTestId('drawer-approve'));
    fireEvent.click(screen.getByTestId('approve-modal-confirm'));
    expect(mockOnApprove).toHaveBeenCalledWith('trx-1');
  });

  test('routes the reason modal confirm to reject when reject is selected', async () => {
    render(
      <RefundsTransactionsDrawer
        open={true}
        onClose={mockOnClose}
        data={baseData as any}
        download={mockDownload}
        formatDate={() => '10/03/2026'}
        onApprove={mockOnApprove}
        onSuspend={mockOnSuspend}
        onReject={mockOnReject}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByTestId('drawer-reject'));
    fireEvent.click(screen.getByTestId('reason-modal-confirm'));

    expect(mockOnReject).toHaveBeenCalledWith('trx-1', 'test reason', { genericError: true });
    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });

  test('hides action sections when there are no active errors and the batch is approved', () => {
    render(
      <RefundsTransactionsDrawer
        open={true}
        onClose={mockOnClose}
        data={
          {
            ...baseData,
            rewardBatchTrxStatus: RewardBatchTrxStatusEnum.APPROVED,
            checksError: undefined,
          } as any
        }
        download={mockDownload}
        formatDate={() => '10/03/2026'}
        onApprove={mockOnApprove}
        onSuspend={mockOnSuspend}
        onReject={mockOnReject}
        disabled={false}
      />
    );

    expect(screen.queryByText('pages.initiativeMerchantsTransactions.drawer.criticity')).not.toBeInTheDocument();
    expect(screen.queryByText('pages.initiativeMerchantsTransactions.drawer.note')).not.toBeInTheDocument();
    expect(screen.queryByText('pages.initiativeMerchantsTransactions.drawer.editChecks')).not.toBeInTheDocument();
  });

  test('renders missing amounts as hyphens and keeps edit checks hidden for approved batches with active errors', () => {
    render(
      <RefundsTransactionsDrawer
        open={true}
        onClose={mockOnClose}
        data={
          {
            ...baseData,
            rewardBatchTrxStatus: RewardBatchTrxStatusEnum.APPROVED,
            checksError: { genericError: true },
            rewardAmountCents: undefined,
          } as any
        }
        download={mockDownload}
        formatDate={() => '10/03/2026'}
        onApprove={mockOnApprove}
        onSuspend={mockOnSuspend}
        onReject={mockOnReject}
        disabled={false}
      />
    );

    expect(screen.getByText('pages.initiativeMerchantsTransactions.drawer.criticity')).toBeInTheDocument();
    expect(screen.queryByText('pages.initiativeMerchantsTransactions.drawer.editChecks')).not.toBeInTheDocument();
    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
  });

  test('does not trigger approve, suspend or reject when trxId is missing', () => {
    render(
      <RefundsTransactionsDrawer
        open={true}
        onClose={mockOnClose}
        data={
          {
            ...baseData,
            trxId: undefined,
          } as any
        }
        download={mockDownload}
        formatDate={() => '10/03/2026'}
        onApprove={mockOnApprove}
        onSuspend={mockOnSuspend}
        onReject={mockOnReject}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByTestId('drawer-approve'));
    fireEvent.click(screen.getByTestId('drawer-suspend'));
    fireEvent.click(screen.getByTestId('drawer-reject'));

    expect(mockOnApprove).not.toHaveBeenCalled();
    expect(mockOnSuspend).not.toHaveBeenCalled();
    expect(mockOnReject).not.toHaveBeenCalled();
  });

  test('does not render action buttons when disabled', () => {
    render(
      <RefundsTransactionsDrawer
        open={false}
        onClose={mockOnClose}
        data={baseData as any}
        download={mockDownload}
        formatDate={() => '10/03/2026'}
        onApprove={mockOnApprove}
        onSuspend={mockOnSuspend}
        onReject={mockOnReject}
        disabled={true}
      />
    );

    expect(screen.queryByTestId('drawer-approve')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('auto');
  });

  test('renders fallback values when drawer data is null', () => {
    render(
      <RefundsTransactionsDrawer
        open={true}
        onClose={mockOnClose}
        data={null}
        download={mockDownload}
        formatDate={() => '-'}
        onApprove={mockOnApprove}
        onSuspend={mockOnSuspend}
        onReject={mockOnReject}
        disabled={false}
      />
    );

    expect(screen.getByText('pages.initiativeMerchantsTransactions.drawer.trxDetail')).toBeInTheDocument();
    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
    expect(screen.queryByText('pages.initiativeMerchantsTransactions.drawer.criticity')).not.toBeInTheDocument();
    expect(screen.queryByText('pages.initiativeMerchantsTransactions.drawer.note')).not.toBeInTheDocument();
  });

  test('skips invalid rejection reasons and keeps note section visible for valid ones', () => {
    render(
      <RefundsTransactionsDrawer
        open={true}
        onClose={mockOnClose}
        data={
          {
            ...baseData,
            rewardBatchTrxStatus: RewardBatchTrxStatusEnum.REJECTED,
            rewardBatchRejectionReason: [
              { reason: 'Valid reason', date: new Date('2026-03-10T10:00:00.000Z') },
              { reason: 123 as any, date: new Date('2026-03-10T10:00:00.000Z') },
              { reason: '-', date: new Date('2026-03-10T10:00:00.000Z') },
            ],
          } as any
        }
        download={mockDownload}
        formatDate={() => '10/03/2026'}
        onApprove={mockOnApprove}
        onSuspend={mockOnSuspend}
        onReject={mockOnReject}
        disabled={false}
      />
    );

    expect(screen.getByText('pages.initiativeMerchantsTransactions.drawer.note')).toBeInTheDocument();
    expect(screen.getAllByText('Valid reason').length).toBeGreaterThan(0);
    expect(screen.queryByText('123')).not.toBeInTheDocument();
  });

  test('formats zero-valued amounts instead of falling back to hyphens', () => {
    render(
      <RefundsTransactionsDrawer
        open={true}
        onClose={mockOnClose}
        data={
          {
            ...baseData,
            effectiveAmountCents: 0,
            rewardAmountCents: 0,
            authorizedAmountCents: 0,
          } as any
        }
        download={mockDownload}
        formatDate={() => '10/03/2026'}
        onApprove={mockOnApprove}
        onSuspend={mockOnSuspend}
        onReject={mockOnReject}
        disabled={false}
      />
    );

    expect(screen.getAllByText((content) => content.includes('0,00')).length).toBeGreaterThan(0);
  });
});