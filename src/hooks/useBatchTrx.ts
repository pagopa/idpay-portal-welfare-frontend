import { RefundItem } from "../pages/initiativeRefundsMerchants/model/types";
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
      id: match.id || "",
      merchantId: match.merchantId || "",
      businessName: match.businessName || "",
      month: match.month || "",
      posType: match.posType === "PHYSICAL" ? "FISICO" : "ONLINE",
      merchantSendDate: match.merchantSendDate || "",
      status: match.status || "",
      partial: match.partial || false,
      name: match.name || "",
      startDate: match.startDate || "",
      endDate: match.endDate || "",
      totalAmountCents: (match as any).totalAmountCents || 0,
      approvedAmountCents: match.approvedAmountCents || 0,
      suspendedAmountCents: (match as any).suspendedAmountCents || 0,
      initialAmountCents: match.initialAmountCents || 0,
      numberOfTransactions: match.numberOfTransactions || 0,
      numberOfTransactionsSuspended: match.numberOfTransactionsSuspended || 0,
      numberOfTransactionsRejected: match.numberOfTransactionsRejected || 0,
      numberOfTransactionsElaborated: match.numberOfTransactionsElaborated || 0,
      assigneeLevel: match.assigneeLevel || "L1",
    };

    setBatchTrx(restored);
    return true;

  } catch {
    return false;
  }
  
};