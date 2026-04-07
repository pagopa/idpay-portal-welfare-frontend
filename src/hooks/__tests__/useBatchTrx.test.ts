import { clearBatchTrx, getBatchTrx, rehydrateBatchTrx, setBatchTrx } from '../useBatchTrx';

const mockGetRewardBatches = jest.fn();

jest.mock('../../services/merchantsService', () => ({
  getRewardBatches: (...args: Array<any>) => mockGetRewardBatches(...args),
}));

describe('useBatchTrx', () => {
  const batch = {
    id: 'batch-1',
    merchantId: 'merchant-1',
    businessName: 'Esercente 1',
    month: '2026-03',
    posType: 'ONLINE' as const,
    merchantSendDate: '2026-03-20',
    status: 'EVALUATING',
    partial: false,
    name: 'Batch March',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    totalAmountCents: 10000,
    approvedAmountCents: 2000,
    suspendedAmountCents: 500,
    initialAmountCents: 10000,
    numberOfTransactions: 10,
    numberOfTransactionsSuspended: 1,
    numberOfTransactionsRejected: 1,
    numberOfTransactionsElaborated: 8,
    assigneeLevel: 'L1' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    clearBatchTrx();
  });

  test('stores, clones, and clears the batch in memory', () => {
    setBatchTrx(batch);

    const firstRead = getBatchTrx();
    expect(firstRead).toEqual(batch);
    expect(firstRead).not.toBe(batch);

    if (firstRead) {
      firstRead.businessName = 'Changed locally';
    }

    expect(getBatchTrx()).toEqual(batch);

    clearBatchTrx();
    expect(getBatchTrx()).toBeNull();
  });

  test('rehydrates a batch when the response contains a matching item', async () => {
    mockGetRewardBatches.mockResolvedValueOnce({
      content: [
        {
          ...batch,
          businessName: 'Rehydrated Esercente',
          status: 'APPROVED',
        },
      ],
    });

    await expect(rehydrateBatchTrx('initiative-1', 'batch-1', 2, 50)).resolves.toBe(true);

    expect(mockGetRewardBatches).toHaveBeenCalledWith('initiative-1', 2, 50);
    expect(getBatchTrx()).toEqual({
      ...batch,
      businessName: 'Rehydrated Esercente',
      status: 'APPROVED',
    });
  });

  test('returns false when the response content is not an array', async () => {
    mockGetRewardBatches.mockResolvedValueOnce({ content: undefined });

    await expect(rehydrateBatchTrx('initiative-1', 'batch-1')).resolves.toBe(false);
    expect(getBatchTrx()).toBeNull();
  });

  test('returns false when the batch is not found', async () => {
    mockGetRewardBatches.mockResolvedValueOnce({
      content: [{ ...batch, id: 'other-batch' }],
    });

    await expect(rehydrateBatchTrx('initiative-1', 'batch-1')).resolves.toBe(false);
    expect(getBatchTrx()).toBeNull();
  });

  test('returns false when the service rejects', async () => {
    mockGetRewardBatches.mockRejectedValueOnce(new Error('boom'));

    await expect(rehydrateBatchTrx('initiative-1', 'batch-1')).resolves.toBe(false);
    expect(getBatchTrx()).toBeNull();
  });
});

