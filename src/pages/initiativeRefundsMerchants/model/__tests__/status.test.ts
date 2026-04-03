import {
  buildStatusChipSx,
  formatAmount,
  getChecksPercentage,
  getPosTypeLabel,
  getStatusChipData,
  getStatusColor,
  getStatusLabel,
  getStatusStyle,
  isBatchRowDisabled,
  refundRequestDate,
} from '../status';
import { RefundItem } from '../types';

const t = (key: string) => key;

const baseRow: RefundItem = {
  id: '1',
  merchantId: 'm',
  businessName: 'Biz',
  month: '2026-03',
  posType: 'ONLINE',
  merchantSendDate: '2026-03-27',
  status: 'EVALUATING',
  partial: false,
  name: 'batch-1',
  startDate: '2026-03-01',
  endDate: '2026-03-31',
  totalAmountCents: 1000,
  approvedAmountCents: 500,
  initialAmountCents: 1000,
  suspendedAmountCents: 0,
  numberOfTransactions: 10,
  numberOfTransactionsSuspended: 0,
  numberOfTransactionsRejected: 0,
  numberOfTransactionsElaborated: 5,
  assigneeLevel: 'L1',
};

describe('refund merchants status utils', () => {
  test('maps chip data and labels', () => {
    expect(getStatusLabel('APPROVED', 'L1', t)).toBe('chip.batch.approved');
    expect(getStatusColor('APPROVED', 'L1')).toBe('success');
    expect(getStatusChipData('EVALUATING', 'L3', t).label).toBe('chip.batch.toApprove');
  });

  test('covers fallback chip data and style variants', () => {
    expect(getStatusLabel('EVALUATING', 'L1', t)).toBe('chip.batch.evaluating');
    expect(getStatusColor('EVALUATING', 'L1')).toBe('primary');
    expect(getStatusChipData('UNKNOWN', 'L1', t)).toEqual({
      label: '-',
      color: 'default',
      sx: expect.any(Object),
    });
    expect(getStatusStyle('REFUNDED')).toMatchObject({
      backgroundColor: '#DBF9FA',
      color: '#17324D',
    });
    expect(getStatusStyle('NOPE' as any)).toBeUndefined();
    expect((buildStatusChipSx('REFUNDED') as any)['&&']).toMatchObject({
      backgroundColor: '#DBF9FA',
      color: '#17324D',
    });
  });

  test('covers the remaining status style branches and refunded chip data', () => {
    expect(getStatusChipData('REFUNDED', 'L1', t)).toEqual({
      label: 'chip.batch.refunded',
      color: 'default',
      sx: expect.objectContaining({
        '&&': expect.objectContaining({
          backgroundColor: '#DBF9FA',
          color: '#17324D',
        }),
      }),
    });
    expect(getStatusStyle('PENDING_REFUND')).toMatchObject({
      backgroundColor: '#E7ECFC',
      color: '#17324D',
    });
    expect(getStatusStyle('NOT_REFUNDED')).toMatchObject({
      backgroundColor: '#FFE0E0',
      color: '#761F1F',
    });
    expect((buildStatusChipSx('PENDING_REFUND') as any)['&&']).toMatchObject({
      backgroundColor: '#E7ECFC',
      color: '#17324D',
    });
    expect((buildStatusChipSx('NOT_REFUNDED') as any)['&&']).toMatchObject({
      backgroundColor: '#FFE0E0',
      color: '#761F1F',
    });
  });

  test('handles remaining statuses, lowercase inputs and undefined fallback', () => {
    expect(getStatusLabel('approving', 'L1', t)).toBe('chip.batch.approving');
    expect(getStatusColor('sent', 'L1')).toBe('default');
    expect(getStatusChipData('to_work', 'L1', t)).toEqual({
      label: 'chip.batch.evaluating',
      color: 'primary',
      sx: expect.any(Object),
    });
    expect(getStatusChipData('to_approve', 'L3', t)).toEqual({
      label: 'chip.batch.toApprove',
      color: 'warning',
      sx: expect.any(Object),
    });
    expect(getStatusChipData('approving', 'L1', t)).toEqual({
      label: 'chip.batch.approving',
      color: 'info',
      sx: expect.any(Object),
    });
    expect(getStatusLabel(undefined as any, 'L1', t)).toBe('-');
    expect(getStatusColor(undefined as any, 'L1')).toBe('default');
    expect(getStatusChipData(undefined as any, 'L1', t)).toEqual({
      label: '-',
      color: 'default',
      sx: expect.any(Object),
    });
    expect(getStatusStyle('pending_refund')).toMatchObject({
      backgroundColor: '#E7ECFC',
      color: '#17324D',
    });
    expect((buildStatusChipSx('not_refunded') as any)['&&']).toMatchObject({
      backgroundColor: '#FFE0E0',
      color: '#761F1F',
    });
  });

  test('formats pos and dates', () => {
    expect(getPosTypeLabel('ONLINE')).toBe('Online');
    expect(getPosTypeLabel('FISICO')).toBe('Fisico');
    expect(getPosTypeLabel('' as any)).toBe('-');
    expect(refundRequestDate('2026-03-01')).toContain('2026');
    expect(refundRequestDate()).toBe('-');
    expect(formatAmount(undefined)).toBe('-');
  });

  test('calculates checks percentage and disabled states', () => {
    expect(getChecksPercentage(baseRow)).toBe('50% / 100%');
    expect(getChecksPercentage({ ...baseRow, status: 'SENT' })).toBe('0% / 100%');
    expect(getChecksPercentage({ ...baseRow, status: 'APPROVED' })).toBe('100% / 100%');
    expect(
      getChecksPercentage({
        ...baseRow,
        numberOfTransactions: 10,
        numberOfTransactionsElaborated: 12,
      })
    ).toBe('100% / 100%');
    expect(isBatchRowDisabled('SENT')).toBeTruthy();
    expect(isBatchRowDisabled('CREATED')).toBeTruthy();
    expect(isBatchRowDisabled('EVALUATING')).toBeFalsy();
  });
});
