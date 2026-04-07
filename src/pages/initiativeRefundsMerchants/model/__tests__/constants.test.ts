import {
  BATCH_STATUS_FILTER_OPTIONS,
  MERCHANT_ASSIGNEE_OPTIONS,
  MERCHANT_REFUND_PERIOD_OPTIONS,
  PAGE_SIZE_OPTIONS,
  TRANSACTION_SEARCH_TYPE_OPTIONS,
  TRANSACTION_STATUS_FILTER_OPTIONS,
} from '../constants';
import { RewardBatchTrxStatusEnum } from '../../../../api/generated/merchants/RewardBatchTrxStatus';

describe('merchant refund constants', () => {
  test('exposes the expected refund filters and pagination options', () => {
    expect(MERCHANT_REFUND_PERIOD_OPTIONS).toEqual([
      { value: '2025-11', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.november' },
      { value: '2025-12', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.december' },
      { value: '2026-01', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.january' },
      { value: '2026-02', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.february' },
      { value: '2026-03', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.march' },
      { value: '2026-04', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.april' },
      { value: '2026-05', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.may' },
    ]);
    expect(MERCHANT_ASSIGNEE_OPTIONS).toEqual(['L1', 'L2', 'L3']);
    expect(BATCH_STATUS_FILTER_OPTIONS).toEqual([
      { value: 'SENT' },
      { value: 'REFUNDED' },
      { value: 'PENDING_REFUND' },
      { value: 'NOT_REFUNDED' },
      { value: 'TO_WORK' },
      { value: 'TO_APPROVE', role: 'L3' },
      { value: 'APPROVING' },
      { value: 'APPROVED' },
    ]);
    expect(TRANSACTION_STATUS_FILTER_OPTIONS).toEqual([
      RewardBatchTrxStatusEnum.TO_CHECK,
      RewardBatchTrxStatusEnum.CONSULTABLE,
      RewardBatchTrxStatusEnum.SUSPENDED,
      RewardBatchTrxStatusEnum.APPROVED,
      RewardBatchTrxStatusEnum.REJECTED,
    ]);
    expect(TRANSACTION_SEARCH_TYPE_OPTIONS).toEqual([
      { value: 'fiscalCode', labelKey: 'pages.initiativeMerchantsTransactions.table.fiscalCode' },
      { value: 'trxCode', labelKey: 'pages.initiativeMerchantsTransactions.table.trxCode' },
    ]);
    expect(PAGE_SIZE_OPTIONS).toEqual([10, 25, 50, 100]);
  });
});