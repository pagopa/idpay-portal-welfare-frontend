import { MerchantTransactionProcessedDTO, ReasonDTO, RewardBatchTrxStatus } from "../../../api/generated/merchants/apiClient";

export interface RefundItem {
  id: string;
  merchantId: string;
  businessName: string;
  month: string;
  posType: 'ONLINE' | 'FISICO';
  merchantSendDate: string;
  status: string;
  partial: boolean;
  name: string;
  startDate: string;
  endDate: string;
  totalAmountCents: number;
  approvedAmountCents: number;
  initialAmountCents: number;
  suspendedAmountCents: number;
  numberOfTransactions: number;
  numberOfTransactionsSuspended: number;
  numberOfTransactionsRejected: number;
  numberOfTransactionsElaborated: number;
  assigneeLevel: 'L1' | 'L2' | 'L3';
  refundErrorMessage?: string;
}

export interface RefundsPage {
  content: Array<RefundItem>;
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface MerchantItem {
  merchantId: string;
  businessName: string;
  fiscalCode: string;
  merchantStatus: string;
  updateStatusState: string;
}

export type StatusChipColor = 'default' | 'primary' | 'warning' | 'info' | 'success';
export type RefundStatus =
  | 'APPROVED'
  | 'EVALUATING'
  | 'SENT'
  | 'REFUNDED'
  | 'PENDING_REFUND'
  | 'NOT_REFUNDED'
  | 'APPROVING'
  | 'TO_WORK'
  | 'TO_APPROVE';

export interface TrxItem {
  raw: MerchantTransactionProcessedDTO;
  id: string;
  date: string;
  shop: string;
  amountCents: number;
  checksError?: object;
  statusLabel: string;
  statusColor: string;
  invoiceFileName?: string;
  pointOfSaleId?: string;
  transactionId?: string;
  status?: RewardBatchTrxStatus;
}

export interface RefundsDrawerData {
  trxChargeDate: string;
  productName?: string;
  productGtin?: string;
  fiscalCode?: string;
  trxId: string;
  trxCode?: string;
  effectiveAmountCents?: number;
  rewardAmountCents?: number;
  authorizedAmountCents?: number;
  checksError?: object;
  invoiceDocNumber?: string;
  invoiceFileName?: string;
  rewardBatchTrxStatus?: string;
  statusLabel?: string;
  statusColor?: string;
  pointOfSaleId?: string;
  transactionId?: string;
  rewardBatchRejectionReason?: Array<ReasonDTO>;
}
