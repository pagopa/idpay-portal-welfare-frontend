import { RewardBatchTrxStatusEnum } from '../../../api/generated/merchants/RewardBatchTrxStatus';
import { RefundStatus } from './types';

export const MERCHANT_REFUND_PERIOD_OPTIONS = [
  { value: '2025-11', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.november' },
  { value: '2025-12', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.december' },
  { value: '2026-01', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.january' },
  { value: '2026-02', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.february' },
  { value: '2026-03', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.march' },
  { value: '2026-04', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.april' },
  { value: '2026-05', labelKey: 'pages.initiativeMerchantsRefunds.perdiod.may' },
] as const;

export const MERCHANT_ASSIGNEE_OPTIONS = ['L1', 'L2', 'L3'] as const;

export const BATCH_STATUS_FILTER_OPTIONS: Array<{ value: RefundStatus; role?: string }> = [
  { value: 'SENT' },
  { value: 'REFUNDED' },
  { value: 'PENDING_REFUND' },
  { value: 'NOT_REFUNDED' },
  { value: 'TO_WORK' },
  { value: 'TO_APPROVE', role: 'L3' },
  { value: 'APPROVING' },
  { value: 'APPROVED' },
];

export const TRANSACTION_STATUS_FILTER_OPTIONS = [
  RewardBatchTrxStatusEnum.TO_CHECK,
  RewardBatchTrxStatusEnum.CONSULTABLE,
  RewardBatchTrxStatusEnum.SUSPENDED,
  RewardBatchTrxStatusEnum.APPROVED,
  RewardBatchTrxStatusEnum.REJECTED,
] as const;

export const TRANSACTION_SEARCH_TYPE_OPTIONS = [
  { value: 'fiscalCode', labelKey: 'pages.initiativeMerchantsTransactions.table.fiscalCode' },
  { value: 'trxCode', labelKey: 'pages.initiativeMerchantsTransactions.table.trxCode' },
] as const;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export type SortDirection = '' | 'asc' | 'desc';
export type RefundSearchType = 'fiscalCode' | 'trxCode' | '';
