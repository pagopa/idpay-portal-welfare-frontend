import { act, render, waitFor } from '@testing-library/react';
import React from 'react';
import { RewardBatchTrxStatus as RewardBatchTrxStatusEnum } from '../../../../api/generated/merchants/apiClient';
import { useRefundTransactionsPage } from '../useRefundTransactionsPage';

const mockReplace = jest.fn();
const mockSetAlert = jest.fn();
const mockSetLoading = jest.fn();
const mockUseInitiative = jest.fn();
const mockGetBatchTrx = jest.fn();
const mockRehydrateBatchTrx = jest.fn();
const mockSetBatchTrx = jest.fn();
const mockGetPOS = jest.fn();
const mockGetMerchantTransactionsProcessed = jest.fn();
const mockGetMerchantDetail = jest.fn();
const mockValidateBatch = jest.fn();
const mockApproveBatch = jest.fn();
const mockApproveTrx = jest.fn();
const mockSuspendTrx = jest.fn();
const mockRejectTrx = jest.fn();
const mockGetDownloadCsv = jest.fn();
const mockGetDownloadInvoice = jest.fn();
const mockDownloadCsv = jest.fn();
const mockOpenInvoiceInNewTab = jest.fn();
const mockParseJwt = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ replace: mockReplace }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../../../hooks/useAlert', () => ({
  useAlert: () => ({ setAlert: mockSetAlert }),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib', () => ({
  useLoading: () => mockSetLoading,
}));

jest.mock('../../../../hooks/useInitiative', () => ({
  useInitiative: () => mockUseInitiative(),
}));

jest.mock('../../../../hooks/useBatchTrx', () => ({
  getBatchTrx: () => mockGetBatchTrx(),
  rehydrateBatchTrx: (...args: Array<any>) => mockRehydrateBatchTrx(...args),
  setBatchTrx: (...args: Array<any>) => mockSetBatchTrx(...args),
}));

jest.mock('../../../../services/merchantsService', () => ({
  approveBatch: (...args: Array<any>) => mockApproveBatch(...args),
  approveTrx: (...args: Array<any>) => mockApproveTrx(...args),
  getDownloadCsv: (...args: Array<any>) => mockGetDownloadCsv(...args),
  getDownloadInvoice: (...args: Array<any>) => mockGetDownloadInvoice(...args),
  getMerchantDetail: (...args: Array<any>) => mockGetMerchantDetail(...args),
  getMerchantTransactionsProcessed: (...args: Array<any>) => mockGetMerchantTransactionsProcessed(...args),
  getPOS: (...args: Array<any>) => mockGetPOS(...args),
  rejectTrx: (...args: Array<any>) => mockRejectTrx(...args),
  suspendTrx: (...args: Array<any>) => mockSuspendTrx(...args),
  validateBatch: (...args: Array<any>) => mockValidateBatch(...args),
}));

jest.mock('../../../../utils/fileViewer-utils', () => ({
  downloadCsv: (...args: Array<any>) => mockDownloadCsv(...args),
  openInvoiceInNewTab: (...args: Array<any>) => mockOpenInvoiceInNewTab(...args),
}));

jest.mock('../../../../utils/jwt-utils', () => ({
  parseJwt: (...args: Array<any>) => mockParseJwt(...args),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', () => ({
  storageTokenOps: {
    read: () => 'token',
  },
}));

const hookResult: Record<string, any> = {};

const HookWrapper = () => {
  Object.assign(hookResult, useRefundTransactionsPage());
  return null;
};

const batchMock = {
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
  initialAmountCents: 10000,
  suspendedAmountCents: 500,
  numberOfTransactions: 10,
  numberOfTransactionsSuspended: 1,
  numberOfTransactionsRejected: 1,
  numberOfTransactionsElaborated: 8,
  assigneeLevel: 'L1' as const,
};

describe('useRefundTransactionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(hookResult).forEach((key) => delete hookResult[key]);
    window.scrollTo = jest.fn();

    window.history.pushState(
      {},
      'Test',
      '/portale-enti/rimborsi-iniziativa/initiative-1/batch-1'
    );

    mockGetBatchTrx.mockReturnValue(batchMock);
    mockRehydrateBatchTrx.mockResolvedValue(true);
    mockParseJwt.mockReturnValue({ org_role: 'operator_l1' });
    mockGetPOS.mockResolvedValue({ content: [{ id: 'pos-1', address: 'Street 1', city: 'Rome' }] });
    mockGetMerchantTransactionsProcessed.mockResolvedValue({
      totalElements: 1,
      totalPages: 1,
      content: [
        {
          trxId: 'trx-1',
          trxChargeDate: '2026-03-20T10:00:00.000Z',
          rewardAmountCents: 500,
          rewardBatchTrxStatus: RewardBatchTrxStatusEnum.TO_CHECK,
          pointOfSaleId: 'pos-1',
          franchiseName: 'Esercente 1',
        },
      ],
    });
    mockGetMerchantDetail.mockResolvedValue({ iban: 'IT60X0542811101000000123456' });
    mockValidateBatch.mockResolvedValue({ ...batchMock, status: 'APPROVING' });
    mockApproveBatch.mockResolvedValue({ ...batchMock, status: 'APPROVED' });
    mockApproveTrx.mockResolvedValue(batchMock);
    mockSuspendTrx.mockResolvedValue(batchMock);
    mockRejectTrx.mockResolvedValue(batchMock);
    mockGetDownloadCsv.mockResolvedValue({ approvedBatchUrl: 'https://test/file.csv' });
    mockGetDownloadInvoice.mockResolvedValue({ invoiceUrl: 'https://test/invoice.pdf' });
  });

  test('loads pos list and transactions on mount', async () => {
    render(<HookWrapper />);

    await waitFor(() => {
      expect(mockGetPOS).toHaveBeenCalledWith('merchant-1', 200);
      expect(mockGetMerchantTransactionsProcessed).toHaveBeenCalled();
      expect(mockGetMerchantDetail).toHaveBeenCalledWith('initiative-1', 'merchant-1');
    });

    expect(hookResult.restored).toBe(true);
    expect(hookResult.rows).toHaveLength(1);
    expect(hookResult.iban).toBe('IT60X0542811101000000123456');
  });

  test('sanitizes search value based on selected search type', async () => {
    render(<HookWrapper />);
    await waitFor(() => expect(mockGetMerchantTransactionsProcessed).toHaveBeenCalled());

    act(() => {
      hookResult.setDraftSearchType('fiscalCode');
    });
    await waitFor(() => expect(hookResult.draftSearchType).toBe('fiscalCode'));

    act(() => {
      hookResult.handleSearchValueChange({
        target: { value: 'ab$12#cd' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(hookResult.draftSearchValue).toBe('AB12CD');

    act(() => {
      hookResult.setDraftSearchType('trxCode');
    });
    await waitFor(() => expect(hookResult.draftSearchType).toBe('trxCode'));

    act(() => {
      hookResult.handleSearchValueChange({
        target: { value: '12a34b56' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(hookResult.draftSearchValue).toBe('12a34b56');
  });

  test('calls validateBatch for L1 and approveBatch for L3', async () => {
    render(<HookWrapper />);
    await waitFor(() => expect(mockGetMerchantTransactionsProcessed).toHaveBeenCalled());

    act(() => {
      hookResult.handleBatchStatus();
    });

    await waitFor(() => {
      expect(mockValidateBatch).toHaveBeenCalledWith('initiative-1', 'batch-1');
      expect(mockApproveBatch).not.toHaveBeenCalled();
    });

    mockGetBatchTrx.mockReturnValue({ ...batchMock, assigneeLevel: 'L3' });
    render(<HookWrapper />);

    act(() => {
      hookResult.handleBatchStatus();
    });

    await waitFor(() => {
      expect(mockApproveBatch).toHaveBeenCalledWith('initiative-1', 'batch-1');
    });
  });

  test('skips batch status action when the batch id is missing', async () => {
    mockGetBatchTrx.mockReturnValue({ ...batchMock, id: undefined } as any);

    render(<HookWrapper />);

    await waitFor(() => {
      expect(hookResult.restored).toBe(true);
    });

    act(() => {
      hookResult.handleBatchStatus();
    });

    expect(mockValidateBatch).not.toHaveBeenCalled();
    expect(mockApproveBatch).not.toHaveBeenCalled();
  });

  test('redirects to batches list when rehydrate fails', async () => {
    mockGetBatchTrx.mockReturnValueOnce(null).mockReturnValueOnce(null);
    mockRehydrateBatchTrx.mockResolvedValue(false);

    render(<HookWrapper />);

    await waitFor(() => {
      expect(mockRehydrateBatchTrx).toHaveBeenCalledWith('initiative-1', 'batch-1');
      expect(mockReplace).toHaveBeenCalledWith('/portale-enti/rimborsi-iniziativa/initiative-1');
    });
  });

  test('handles date sort toggle and filters apply/reset', async () => {
    render(<HookWrapper />);
    await waitFor(() => expect(hookResult.rows).toHaveLength(1));

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
      hookResult.setDraftStatusFilter('TO_CHECK');
      hookResult.setDraftPosFilter('pos-1');
      hookResult.setDraftSearchType('trxCode');
      hookResult.setDraftSearchValue('123');
    });
    await waitFor(() => expect(hookResult.draftStatusFilter).toBe('TO_CHECK'));

    act(() => {
      hookResult.handleFilterClick();
    });
    expect(hookResult.statusFilter).toBe('TO_CHECK');
    expect(hookResult.posFilter).toBe('pos-1');
    expect(hookResult.searchType).toBe('trxCode');
    expect(hookResult.searchValue).toBe('123');

    act(() => {
      hookResult.handleRemoveFilters();
    });
    expect(hookResult.statusFilter).toBe('');
    expect(hookResult.posFilter).toBe('');
    expect(hookResult.searchType).toBe('');
    expect(hookResult.searchValue).toBe('');
  });

  test('handles checkbox selection and drawer open/close', async () => {
    render(<HookWrapper />);
    await waitFor(() => expect(hookResult.rows).toHaveLength(1));

    act(() => {
      hookResult.handleRowCheckbox('trx-1', RewardBatchTrxStatusEnum.TO_CHECK);
    });
    expect(hookResult.selectedRows.has('trx-1')).toBe(true);
    expect(hookResult.lockedStatus).toBe(RewardBatchTrxStatusEnum.TO_CHECK);

    act(() => {
      hookResult.handleHeaderCheckbox();
    });
    expect(hookResult.selectedRows.size).toBe(0);

    act(() => {
      hookResult.handleOpenDrawer(hookResult.rows[0]);
    });
    expect(hookResult.openDrawer).toBe(true);
    expect(hookResult.selectedTransaction?.transactionId).toBe('trx-1');

    act(() => {
      hookResult.handleCloseDrawer();
    });
    expect(hookResult.openDrawer).toBe(false);
    expect(hookResult.selectedTransaction).toBeNull();
  });

  test('keeps selection empty when the header checkbox is used without a locked status', async () => {
    render(<HookWrapper />);
    await waitFor(() => expect(hookResult.rows).toHaveLength(1));

    act(() => {
      hookResult.handleHeaderCheckbox();
    });

    expect(hookResult.selectedRows.size).toBe(0);
    expect(hookResult.lockedStatus).toBeNull();
  });

  test('ignores row selection when the row status is missing', async () => {
    render(<HookWrapper />);
    await waitFor(() => expect(hookResult.rows).toHaveLength(1));

    act(() => {
      hookResult.handleRowCheckbox('trx-1');
    });

    expect(hookResult.selectedRows.size).toBe(0);
    expect(hookResult.lockedStatus).toBeNull();
  });

  test('clears the locked status when the last selected row is unchecked', async () => {
    render(<HookWrapper />);
    await waitFor(() => expect(hookResult.rows).toHaveLength(1));

    act(() => {
      hookResult.handleRowCheckbox('trx-1', RewardBatchTrxStatusEnum.TO_CHECK);
    });

    expect(hookResult.selectedRows.has('trx-1')).toBe(true);
    expect(hookResult.lockedStatus).toBe(RewardBatchTrxStatusEnum.TO_CHECK);

    act(() => {
      hookResult.handleRowCheckbox('trx-1', RewardBatchTrxStatusEnum.TO_CHECK);
    });

    expect(hookResult.selectedRows.size).toBe(0);
    expect(hookResult.lockedStatus).toBeNull();
  });

  test('selects all same-status rows from the header checkbox and ignores unsupported search typing', async () => {
    mockGetMerchantTransactionsProcessed.mockResolvedValue({
      totalElements: 2,
      totalPages: 1,
      content: [
        {
          trxId: 'trx-1',
          trxChargeDate: '2026-03-20T10:00:00.000Z',
          rewardAmountCents: 500,
          rewardBatchTrxStatus: RewardBatchTrxStatusEnum.TO_CHECK,
          pointOfSaleId: 'pos-1',
          franchiseName: 'Esercente 1',
        },
        {
          trxId: 'trx-2',
          trxChargeDate: '2026-03-21T10:00:00.000Z',
          rewardAmountCents: 750,
          rewardBatchTrxStatus: RewardBatchTrxStatusEnum.TO_CHECK,
          pointOfSaleId: 'pos-2',
          franchiseName: 'Esercente 2',
        },
      ],
    });

    render(<HookWrapper />);

    await waitFor(() => expect(hookResult.rows).toHaveLength(2));

    act(() => {
      hookResult.handleRowCheckbox('trx-1', RewardBatchTrxStatusEnum.TO_CHECK);
    });

    expect(hookResult.selectedRows.has('trx-1')).toBe(true);
    expect(hookResult.lockedStatus).toBe(RewardBatchTrxStatusEnum.TO_CHECK);

    act(() => {
      hookResult.setDraftSearchValue('keep');
      hookResult.handleSearchValueChange({
        target: { value: 'ignored-value' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(hookResult.draftSearchValue).toBe('keep');

    act(() => {
      hookResult.handleHeaderCheckbox();
    });

    expect(hookResult.selectedRows.size).toBe(2);
    expect(hookResult.selectedRows.has('trx-1')).toBe(true);
    expect(hookResult.selectedRows.has('trx-2')).toBe(true);
  });

  test('handles approve/suspend/reject actions and resets selection', async () => {
    render(<HookWrapper />);

    await hookResult.handleRefundAction('approve', ['trx-1']);
    expect(mockApproveTrx).toHaveBeenCalled();

    await hookResult.handleRefundAction('suspend', ['trx-1'], 'reason');
    expect(mockSuspendTrx).toHaveBeenCalled();

    await hookResult.handleRefundAction('reject', ['trx-1'], 'reason');
    expect(mockRejectTrx).toHaveBeenCalled();
  });

  test('handles api errors for refund actions', async () => {
    render(<HookWrapper />);

    mockApproveTrx.mockRejectedValueOnce({
      status: 400,
      body: { code: 'REWARD_BATCH_INVALID_REQUEST' },
    });
    await hookResult.handleRefundAction('approve', ['trx-1']);
    expect(mockSetAlert).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'errors.batchInvalidRequest', severity: 'error' })
    );

    mockApproveTrx.mockRejectedValueOnce({
      status: 400,
      body: { code: 'BATCH_NOT_ELABORATED_15_PERCENT' },
    });
    await hookResult.handleRefundAction('approve', ['trx-1']);
    await waitFor(() => expect(hookResult.batchErrorOpen).toBe(true));
  });

  test('shows a generic alert when batch validation fails with an unexpected error', async () => {
    mockValidateBatch.mockRejectedValueOnce({ status: 500 });

    render(<HookWrapper />);
    await waitFor(() => expect(mockGetMerchantTransactionsProcessed).toHaveBeenCalled());

    act(() => {
      hookResult.handleBatchStatus();
    });

    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'errors.getDataDescription',
          severity: 'error',
        })
      );
    });
  });

  test('logs and recovers when fetching transactions fails', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    mockGetMerchantTransactionsProcessed.mockRejectedValueOnce(new Error('transactions fail'));

    render(<HookWrapper />);

    await waitFor(() => {
      expect(mockGetMerchantTransactionsProcessed).toHaveBeenCalledWith(
        'merchant-1',
        'initiative-1',
        0,
        10,
        undefined,
        undefined,
        undefined,
        'batch-1',
        undefined,
        undefined,
        undefined
      );
    });

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleLogSpy.mockRestore();
  });

  test('downloads csv and invoice, and handles generic download errors', async () => {
    render(<HookWrapper />);
    await waitFor(() => expect(hookResult.rows).toHaveLength(1));

    act(() => {
      hookResult.getCsv();
    });
    await waitFor(() => {
      expect(mockGetDownloadCsv).toHaveBeenCalledWith('initiative-1', 'batch-1');
      expect(mockDownloadCsv).toHaveBeenCalledWith('https://test/file.csv', 'transactions.csv');
    });

    mockGetDownloadCsv.mockRejectedValueOnce(new Error('fail'));
    act(() => {
      hookResult.getCsv();
    });
    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith(
        expect.objectContaining({ text: 'errors.getDataDescription', severity: 'error' })
      );
    });

    act(() => {
      hookResult.downloadInvoice('pos-1', 'trx-1', 'invoice.pdf', true);
    });
    await waitFor(() => {
      expect(mockGetDownloadInvoice).toHaveBeenCalledWith('pos-1', 'trx-1', 'merchant-1');
      expect(mockDownloadCsv).toHaveBeenCalledWith('https://test/invoice.pdf', 'invoice.pdf');
    });

    act(() => {
      hookResult.downloadInvoice('pos-1', 'trx-1', 'invoice.pdf');
    });
    await waitFor(() => {
      expect(mockOpenInvoiceInNewTab).toHaveBeenCalledWith('https://test/invoice.pdf', 'invoice.pdf');
    });
  });

  test('uses the parsed azure filename when downloading csv', async () => {
    mockGetDownloadCsv.mockResolvedValueOnce({
      approvedBatchUrl: 'https://test/file-name.csv?sv=2026-04-01&sig=abc',
    });

    render(<HookWrapper />);
    await waitFor(() => expect(hookResult.rows).toHaveLength(1));

    act(() => {
      hookResult.getCsv();
    });

    await waitFor(() => {
      expect(mockDownloadCsv).toHaveBeenCalledWith(
        'https://test/file-name.csv?sv=2026-04-01&sig=abc',
        'file-name.csv'
      );
    });
  });

  test('does nothing when invoice download API returns no url', async () => {
    render(<HookWrapper />);
    await waitFor(() => expect(hookResult.rows).toHaveLength(1));

    mockGetDownloadInvoice.mockResolvedValueOnce({});

    act(() => {
      hookResult.downloadInvoice('pos-1', 'trx-1', 'invoice.pdf');
    });

    await waitFor(() => {
      expect(mockGetDownloadInvoice).toHaveBeenCalledWith('pos-1', 'trx-1', 'merchant-1');
    });

    expect(mockDownloadCsv).not.toHaveBeenCalled();
    expect(mockOpenInvoiceInNewTab).not.toHaveBeenCalled();
  });

  test('covers guards and utility helpers', async () => {
    render(<HookWrapper />);

    expect(hookResult.mapTransactionStatus(undefined)).toEqual({ label: '-', color: 'default' });

    await hookResult.closeAfter(Promise.resolve('ok'));
    expect(hookResult.openDrawer).toBe(false);

    act(() => {
      hookResult.downloadInvoice('', 'trx-1', 'invoice.pdf');
    });
    expect(mockGetDownloadInvoice).not.toHaveBeenCalled();
  });

  test('runs closeAfter cleanup when the wrapped promise rejects', async () => {
    render(<HookWrapper />);
    await waitFor(() => expect(hookResult.rows).toHaveLength(1));

    act(() => {
      hookResult.handleOpenDrawer(hookResult.rows[0]);
    });

    await expect(hookResult.closeAfter(Promise.reject(new Error('boom')))).rejects.toThrow('boom');

    await waitFor(() => {
      expect(hookResult.openDrawer).toBe(false);
      expect(hookResult.selectedTransaction).toBeNull();
    });
  });

  test('maps partial batch responses using the current batch as fallback', async () => {
    render(<HookWrapper />);
    await waitFor(() => expect(hookResult.rows).toHaveLength(1));

    mockApproveTrx.mockResolvedValueOnce({
      id: 'batch-1',
      posType: 'ONLINE',
      merchantSendDate: new Date('2026-03-20T10:00:00.000Z'),
    } as any);

    await hookResult.handleRefundAction('approve', ['trx-1']);

    expect(mockSetBatchTrx).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'batch-1',
        merchantId: 'merchant-1',
        businessName: 'Esercente 1',
        month: '2026-03',
        posType: 'ONLINE',
        status: '',
        partial: false,
        initialAmountCents: 10000,
        approvedAmountCents: 2000,
        suspendedAmountCents: 500,
        numberOfTransactions: 10,
        numberOfTransactionsElaborated: 8,
        assigneeLevel: 'L1',
      })
    );
  });

  test('returns early when batch cannot be restored and keeps no-op handlers quiet', async () => {
    mockGetBatchTrx.mockReturnValue(null);
    mockRehydrateBatchTrx.mockResolvedValue(false);

    render(<HookWrapper />);

    await waitFor(() => {
      expect(hookResult.restored).toBe(true);
      expect(hookResult.batch).toBeNull();
    });

    await expect(hookResult.handleRefundAction('approve', ['trx-1'])).resolves.toBeUndefined();

    act(() => {
      hookResult.handleBatchStatus();
      hookResult.getCsv();
      hookResult.downloadInvoice('pos-1', 'trx-1', 'invoice.pdf');
      hookResult.handleRowCheckbox('trx-1');
      hookResult.handleSearchValueChange({
        target: { value: 'ignored' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(mockValidateBatch).not.toHaveBeenCalled();
    expect(mockApproveBatch).not.toHaveBeenCalled();
    expect(mockApproveTrx).not.toHaveBeenCalled();
    expect(mockSuspendTrx).not.toHaveBeenCalled();
    expect(mockRejectTrx).not.toHaveBeenCalled();
    expect(mockGetDownloadCsv).not.toHaveBeenCalled();
    expect(mockGetDownloadInvoice).not.toHaveBeenCalled();
    expect(hookResult.selectedRows.size).toBe(0);
    expect(hookResult.draftSearchValue).toBe('');
  });

  test('covers status variants, percentage clamp and generic api error handling', async () => {
    mockGetBatchTrx.mockReturnValue({
      ...batchMock,
      numberOfTransactions: 5,
      numberOfTransactionsElaborated: 7,
    });
    mockApproveTrx.mockResolvedValueOnce({
      id: 'batch-1',
      posType: 'PHYSICAL',
      merchantSendDate: new Date('2026-03-20T10:00:00.000Z'),
      startDate: new Date('2026-03-01T00:00:00.000Z'),
      endDate: new Date('2026-03-31T00:00:00.000Z'),
    } as any);

    render(<HookWrapper />);

    await waitFor(() => {
      expect(hookResult.restored).toBe(true);
    });

    expect(hookResult.checksPercentage).toBe('100% / 100%');
    expect(hookResult.formattedPeriod).toContain('2026');
    expect(hookResult.mapTransactionStatus(RewardBatchTrxStatusEnum.TO_CHECK)).toEqual({
      label: 'pages.initiativeMerchantsTransactions.table.toCheck',
      color: 'indigo',
    });
    expect(hookResult.mapTransactionStatus(RewardBatchTrxStatusEnum.CONSULTABLE)).toEqual({
      label: 'pages.initiativeMerchantsTransactions.table.consultable',
      color: 'default',
    });
    expect(hookResult.mapTransactionStatus(RewardBatchTrxStatusEnum.SUSPENDED)).toEqual({
      label: 'pages.initiativeMerchantsTransactions.table.suspended',
      color: 'warning',
    });
    expect(hookResult.mapTransactionStatus(RewardBatchTrxStatusEnum.APPROVED)).toEqual({
      label: 'pages.initiativeMerchantsTransactions.table.approved',
      color: 'info',
    });
    expect(hookResult.mapTransactionStatus(RewardBatchTrxStatusEnum.REJECTED)).toEqual({
      label: 'pages.initiativeMerchantsTransactions.table.rejected',
      color: 'error',
    });

    await hookResult.handleRefundAction('approve', ['trx-1']);

    expect(mockSetBatchTrx).toHaveBeenCalledWith(
      expect.objectContaining({
        merchantId: 'merchant-1',
        businessName: 'Esercente 1',
        month: '2026-03',
        posType: 'FISICO',
        merchantSendDate: expect.any(String),
        startDate: expect.any(String),
        endDate: expect.any(String),
      })
    );

    mockApproveTrx.mockRejectedValueOnce({ status: 500 });

    await hookResult.handleRefundAction('approve', ['trx-1']);

    expect(mockSetAlert).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'errors.getDataDescription', severity: 'error' })
    );
  });

  test('falls back to default period and zero percentage when batch counters are empty', async () => {
    mockGetBatchTrx.mockReturnValue({
      ...batchMock,
      numberOfTransactions: 0,
      numberOfTransactionsElaborated: 0,
      startDate: undefined,
      endDate: undefined,
    });

    render(<HookWrapper />);

    await waitFor(() => {
      expect(hookResult.restored).toBe(true);
    });

    expect(hookResult.checksPercentage).toBe('0% / 100%');
    expect(hookResult.formattedPeriod).toBe('-');
  });
});