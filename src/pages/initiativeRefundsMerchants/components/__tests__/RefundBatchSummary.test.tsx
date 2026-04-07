import { render, screen } from '@testing-library/react';
import RefundBatchSummary from '../RefundBatchSummary';

jest.mock('../../model/formatters', () => ({
  formatCurrencyFromCents: (value: number) => `formatted-${value}`,
}));

const t = (key: string) => key;

const getStatusLabel = jest.fn((status: string) => `label-${status}`);
const getStatusColor = jest.fn(() => 'info' as const);
const buildStatusChipSx = jest.fn((status: string) => ({ borderColor: status }));

const baseBatch = {
  name: 'Batch reference',
  merchantSendDate: '2026-03-10T10:00:00.000Z',
  initialAmountCents: 1000,
  approvedAmountCents: 500,
  suspendedAmountCents: 250,
  assigneeLevel: 'L1' as const,
  status: 'EVALUATING',
  businessName: 'Merchant name',
};

describe('<RefundBatchSummary />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows the evaluating branch and the not refunded error message branch', () => {
    const { rerender } = render(
      <RefundBatchSummary
        t={t}
        batch={baseBatch}
        formattedPeriod="March 2026"
        iban="IT60X0542811101000000123456"
        checksPercentage="75%"
        refundRequestDate={(value?: string) => `date-${value}`}
        getStatusLabel={getStatusLabel}
        getStatusColor={getStatusColor}
        buildStatusChipSx={buildStatusChipSx}
      />
    );

    expect(screen.getByText('pages.initiativeMerchantsTransactions.batchDetail.checksCompleted')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('formatted-1000')).toBeInTheDocument();
    expect(screen.getByText('formatted-500')).toBeInTheDocument();
    expect(screen.getByText('formatted-250')).toBeInTheDocument();
    expect(getStatusLabel).toHaveBeenCalledWith('EVALUATING', 'L1', t);
    expect(getStatusColor).toHaveBeenCalledWith('EVALUATING', 'L1');
    expect(buildStatusChipSx).toHaveBeenCalledWith('EVALUATING');

    rerender(
      <RefundBatchSummary
        t={t}
        batch={{ ...baseBatch, status: 'NOT_REFUNDED', refundErrorMessage: 'Refund failed' }}
        formattedPeriod="March 2026"
        iban="IT60X0542811101000000123456"
        checksPercentage="75%"
        refundRequestDate={(value?: string) => `date-${value}`}
        getStatusLabel={getStatusLabel}
        getStatusColor={getStatusColor}
        buildStatusChipSx={buildStatusChipSx}
      />
    );

    expect(screen.queryByText('pages.initiativeMerchantsTransactions.batchDetail.checksCompleted')).not.toBeInTheDocument();
    expect(screen.getByText('pages.initiativeMerchantsTransactions.batchDetail.refundErrorMessage')).toBeInTheDocument();
    expect(screen.getByText('Refund failed')).toBeInTheDocument();
    expect(getStatusLabel).toHaveBeenCalledWith('NOT_REFUNDED', 'L1', t);
    expect(getStatusColor).toHaveBeenCalledWith('NOT_REFUNDED', 'L1');
    expect(buildStatusChipSx).toHaveBeenCalledWith('NOT_REFUNDED');
  });

  test('falls back to a dash when the refund error message is missing', () => {
    render(
      <RefundBatchSummary
        t={t}
        batch={{ ...baseBatch, status: 'NOT_REFUNDED', refundErrorMessage: undefined }}
        formattedPeriod="March 2026"
        iban="IT60X0542811101000000123456"
        checksPercentage="75%"
        refundRequestDate={(value?: string) => `date-${value}`}
        getStatusLabel={getStatusLabel}
        getStatusColor={getStatusColor}
        buildStatusChipSx={buildStatusChipSx}
      />
    );

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});