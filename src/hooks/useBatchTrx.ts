import { RefundItem } from "../pages/initiativeRefundsMerchants/initiativeRefundsMerchants";
import { getRewardBatches } from "../services/merchantsService";

// eslint-disable-next-line functional/no-let
let batch: RefundItem | null = null;

export const setBatchTrx = (_batch: RefundItem) => {
  batch = { ..._batch };
};

export const getBatchTrx = (): RefundItem | null =>
  batch ? { ...batch } : null;

export const clearBatchTrx = () => {
  batch = null;
};

export const rehydrateBatchTrx = async (
  initiativeId: string,
  batchId: string,
  page: number = 0,
  pageSize: number = 200
): Promise<boolean> => {
  try {
    const res = await getRewardBatches(initiativeId, page, pageSize);

    if (!Array.isArray(res.content)) {return false;}

    const match = res.content.find((x: any) => x.id === batchId);
    if (!match) {return false;}

    const restored: RefundItem = {
      id: match.id,
      merchantId: match.merchantId,
      businessName: match.businessName,
      month: match.month,
      posType: match.posType,
      status: match.status,
      partial: match.partial,
      name: match.name,
      startDate: match.startDate,
      endDate: match.endDate,
      totalAmountCents: match.totalAmountCents,
      approvedAmountCents: match.approvedAmountCents,
      suspendedAmountCents : match.suspendedAmountCents,
      initialAmountCents: match.initialAmountCents,
      numberOfTransactions: match.numberOfTransactions,
      numberOfTransactionsSuspended: match.numberOfTransactionsSuspended,
      numberOfTransactionsRejected: match.numberOfTransactionsRejected,
      numberOfTransactionsElaborated: match.numberOfTransactionsElaborated,
      assigneeLevel: match.assigneeLevel,
    };

    setBatchTrx(restored);
    return true;

  } catch {
    return false;
  }
  
};