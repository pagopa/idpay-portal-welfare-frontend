import { fireEvent, render, screen } from '@testing-library/react';
import RefundRow from '../RefundRow';

const t = (key: string) => key;

const getBaseRow = () => ({
  id: 'row-1',
  merchantId: 'm-1',
  businessName: 'Business Name',
  month: '03',
  posType: 'ONLINE',
  merchantSendDate: '2026-03-10T10:00:00.000Z',
  status: 'TO_WORK',
  partial: false,
  name: 'batch-name',
  startDate: '2026-03-01',
  endDate: '2026-03-31',
  totalAmountCents: 1000,
  approvedAmountCents: 500,
  initialAmountCents: 800,
  suspendedAmountCents: 100,
  numberOfTransactions: 10,
  numberOfTransactionsSuspended: 0,
  numberOfTransactionsRejected: 0,
  numberOfTransactionsElaborated: 5,
  assigneeLevel: 'L1',
});

describe('<RefundRow />', () => {
  test('triggers onClick when row is enabled', () => {
    const onClick = jest.fn();
    render(<RefundRow row={getBaseRow() as any} t={t} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  test('does not trigger onClick when row is disabled by status', () => {
    const onClick = jest.fn();
    render(
      <RefundRow
        row={{
          ...getBaseRow(),
          status: 'SENT',
        } as any}
        t={t}
        onClick={onClick}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('renders a fallback status chip and still allows the row click when status is missing', () => {
    const onClick = jest.fn();
    render(
      <RefundRow
        row={{
          ...getBaseRow(),
          status: undefined,
        } as any}
        t={t}
        onClick={onClick}
      />
    );

    expect(screen.getByText('-')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  test('keeps the chevron disabled for CREATED rows too', () => {
    const onClick = jest.fn();
    render(
      <RefundRow
        row={{
          ...getBaseRow(),
          status: 'CREATED',
        } as any}
        t={t}
        onClick={onClick}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});