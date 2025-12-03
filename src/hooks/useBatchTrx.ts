import { RefundItem } from "../pages/initiativeRefundsMerchants/initiativeRefundsMerchants";

// eslint-disable-next-line functional/no-let
let batch: RefundItem | null = null;

export const setBatchTrx = (_batch: RefundItem) => {
  batch = { ..._batch };
};

export const getBatchTrx = (): RefundItem | null => batch ? { ...batch } : null;

export const clearBatchTrx = () => {
  batch = null;
};