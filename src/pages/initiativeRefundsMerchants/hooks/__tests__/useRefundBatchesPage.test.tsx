import { act, render, waitFor } from '@testing-library/react';
import { useRefundBatchesPage } from '../useRefundBatchesPage';

const mockReplace = jest.fn();
const mockSetAlert = jest.fn();
const mockSetLoading = jest.fn();
const mockSetBatchTrx = jest.fn();
const mockSetMerchantsFilters = jest.fn();
const mockResetMerchantsFilters = jest.fn();
const mockGetMerchantsFilters = jest.fn();
const mockGetMerchantList = jest.fn();
const mockGetRewardBatches = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ replace: mockReplace }),
}));

jest.mock('../../../../hooks/useAlert', () => ({
  useAlert: () => ({ setAlert: mockSetAlert }),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib', () => ({
  useLoading: () => mockSetLoading,
}));

jest.mock('../../../../hooks/useBatchTrx', () => ({
  setBatchTrx: (...args: Array<any>) => mockSetBatchTrx(...args),
}));

jest.mock('../../../../hooks/useMerchantsFilters', () => ({
  getMerchantsFilters: () => mockGetMerchantsFilters(),
  resetMerchantsFilters: () => mockResetMerchantsFilters(),
  setMerchantsFilters: (...args: Array<any>) => mockSetMerchantsFilters(...args),
}));

jest.mock('../../../../services/merchantsService', () => ({
  getMerchantList: (...args: Array<any>) => mockGetMerchantList(...args),
  getRewardBatches: (...args: Array<any>) => mockGetRewardBatches(...args),
}));

const hookResult: Record<string, any> = {};

const HookWrapper = () => {
  Object.assign(hookResult, useRefundBatchesPage({ t: (key: string) => key }));
  return null;
};

describe('useRefundBatchesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(hookResult).forEach((key) => delete hookResult[key]);
    window.scrollTo = jest.fn();

    window.history.pushState({}, 'Test', '/portale-enti/rimborsi-iniziativa/initiative-1');

    mockGetMerchantsFilters.mockReturnValue({
      assigneeFilter: null,
      nameFilter: null,
      periodFilter: null,
      statusFilter: null,
      page: 0,
      pageSize: 10,
      dateSort: '',
    });

    mockGetMerchantList.mockResolvedValue({
      content: [{ merchantId: 'm1', businessName: 'Esercente 1' }],
    });

    mockGetRewardBatches.mockResolvedValue({
      totalElements: 1,
      totalPages: 1,
      content: [
        {
          id: 'batch-1',
          merchantId: 'm1',
          businessName: 'Esercente 1',
          month: '2026-03',
          posType: 'ONLINE',
          merchantSendDate: '2026-03-20',
          status: 'EVALUATING',
          partial: false,
          name: 'Batch March',
          startDate: '2026-03-01',
          endDate: '2026-03-31',
          totalAmountCents: 10000,
          approvedAmountCents: 0,
          initialAmountCents: 10000,
          suspendedAmountCents: 0,
          numberOfTransactions: 10,
          numberOfTransactionsSuspended: 0,
          numberOfTransactionsRejected: 0,
          numberOfTransactionsElaborated: 10,
          assigneeLevel: 'L1',
        },
      ],
    });
  });

  test('loads merchant list and batches on mount', async () => {
    render(<HookWrapper />);

    await waitFor(() => {
      expect(mockGetMerchantList).toHaveBeenCalledWith('initiative-1', 0);
      expect(mockGetRewardBatches).toHaveBeenCalledWith(
        'initiative-1',
        0,
        10,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });

    expect(hookResult.rows).toHaveLength(1);
    expect(hookResult.businessNameList).toHaveLength(1);
    expect(mockSetLoading).toHaveBeenCalled();
    expect(mockResetMerchantsFilters).toHaveBeenCalled();
  });

  test('applies draft filters and requests filtered data', async () => {
    render(<HookWrapper />);

    await waitFor(() => expect(mockGetRewardBatches).toHaveBeenCalled());
    mockGetRewardBatches.mockClear();

    act(() => {
      hookResult.setDraftAssignee('L1');
      hookResult.setDraftName('Esercente 1');
      hookResult.setDraftPeriod('2026-03');
      hookResult.setDraftStatus('EVALUATING');
    });

    act(() => {
      hookResult.applyFilters();
    });

    await waitFor(() => {
      expect(mockGetRewardBatches).toHaveBeenCalledWith(
        'initiative-1',
        0,
        10,
        'L1',
        'Esercente 1',
        '2026-03',
        'EVALUATING',
        undefined
      );
    });
  });

  test('opens batch details and stores current filters', async () => {
    render(<HookWrapper />);

    await waitFor(() => expect(mockGetRewardBatches).toHaveBeenCalled());

    act(() => {
      hookResult.openBatchDetails({
        id: 'batch-1',
        merchantId: 'm1',
        businessName: 'Esercente 1',
        month: '2026-03',
        posType: 'ONLINE',
        merchantSendDate: '2026-03-20',
        status: 'EVALUATING',
        partial: false,
        name: 'Batch March',
        startDate: '2026-03-01',
        endDate: '2026-03-31',
        totalAmountCents: 10000,
        approvedAmountCents: 0,
        initialAmountCents: 10000,
        suspendedAmountCents: 0,
        numberOfTransactions: 10,
        numberOfTransactionsSuspended: 0,
        numberOfTransactionsRejected: 0,
        numberOfTransactionsElaborated: 10,
        assigneeLevel: 'L1',
      });
    });

    expect(mockSetBatchTrx).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'batch-1', merchantId: 'm1' })
    );
    expect(mockSetMerchantsFilters).toHaveBeenCalledWith(
      expect.objectContaining({ page: 0, pageSize: 10, dateSort: '' })
    );
    expect(mockReplace).toHaveBeenCalledWith('/portale-enti/rimborsi-iniziativa/initiative-1/batch-1');
  });

  test('toggles date sort and clears filters', async () => {
    render(<HookWrapper />);
    await waitFor(() => expect(mockGetRewardBatches).toHaveBeenCalled());

    act(() => {
      hookResult.toggleDateSort();
    });
    expect(hookResult.dateSort).toBe('asc');

    act(() => {
      hookResult.toggleDateSort();
    });
    expect(hookResult.dateSort).toBe('desc');

    act(() => {
      hookResult.toggleDateSort();
    });
    expect(hookResult.dateSort).toBe('');

    act(() => {
      hookResult.setDraftAssignee('L1');
      hookResult.setDraftName('Esercente 1');
      hookResult.setDraftPeriod('2026-03');
      hookResult.setDraftStatus('EVALUATING');
    });
    await waitFor(() => expect(hookResult.draftAssignee).toBe('L1'));

    act(() => {
      hookResult.applyFilters();
    });
    expect(hookResult.assigneeFilter).toBe('L1');
    expect(hookResult.nameFilter).toBe('Esercente 1');
    expect(hookResult.periodFilter).toBe('2026-03');
    expect(hookResult.statusFilter).toBe('EVALUATING');

    act(() => {
      hookResult.clearFilters();
    });
    expect(hookResult.assigneeFilter).toBe('');
    expect(hookResult.nameFilter).toBe('');
    expect(hookResult.periodFilter).toBe('');
    expect(hookResult.statusFilter).toBe('');
  });

  test('shows alert on merchant list and batches fetch error', async () => {
    mockGetMerchantList.mockRejectedValueOnce(new Error('merchant fail'));
    mockGetRewardBatches.mockRejectedValueOnce(new Error('batches fail'));

    render(<HookWrapper />);

    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith(
        expect.objectContaining({ text: 'errors.getDataDescription', severity: 'error' })
      );
    });
  });

  test('does not navigate when id is missing', async () => {
    window.history.pushState({}, 'Test', '/portale-enti/rimborsi-iniziativa');
    render(<HookWrapper />);
    await waitFor(() => expect(hookResult.id).toBeUndefined());

    act(() => {
      hookResult.openBatchDetails({
        id: 'batch-1',
        merchantId: 'm1',
        businessName: 'Esercente 1',
        month: '2026-03',
        posType: 'ONLINE',
        merchantSendDate: '2026-03-20',
        status: 'EVALUATING',
        partial: false,
        name: 'Batch March',
        startDate: '2026-03-01',
        endDate: '2026-03-31',
        totalAmountCents: 10000,
        approvedAmountCents: 0,
        initialAmountCents: 10000,
        suspendedAmountCents: 0,
        numberOfTransactions: 10,
        numberOfTransactionsSuspended: 0,
        numberOfTransactionsRejected: 0,
        numberOfTransactionsElaborated: 10,
        assigneeLevel: 'L1',
      });
    });

    expect(mockSetBatchTrx).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('restores saved filters from storage and applies saved sort/pageSize', async () => {
    mockGetMerchantsFilters.mockReturnValue({
      assigneeFilter: 'L2',
      nameFilter: 'Saved Esercente',
      periodFilter: '2026-02',
      statusFilter: 'TO_CHECK',
      page: 2,
      pageSize: 25,
      dateSort: 'desc',
    });

    render(<HookWrapper />);

    await waitFor(() => {
      expect(hookResult.assigneeFilter).toBe('L2');
      expect(hookResult.nameFilter).toBe('Saved Esercente');
      expect(hookResult.periodFilter).toBe('2026-02');
      expect(hookResult.statusFilter).toBe('TO_CHECK');
      expect(hookResult.page).toBe(2);
      expect(hookResult.pageSize).toBe(25);
      expect(hookResult.dateSort).toBe('desc');
    });
  });
});

