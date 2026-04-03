import {
  buildRefundBatchesBindings,
  buildRefundTransactionsBindings,
} from '../viewModel';

const t = (key: string) => key;

const getBatchesVm = (overrides?: Record<string, unknown>) => ({
  draftName: '',
  setDraftName: jest.fn(),
  draftPeriod: '',
  setDraftPeriod: jest.fn(),
  draftStatus: '',
  setDraftStatus: jest.fn(),
  draftAssignee: '',
  setDraftAssignee: jest.fn(),
  businessNameList: [],
  isFilterDisabled: false,
  applyFilters: jest.fn(),
  clearFilters: jest.fn(),
  assigneeFilter: '',
  nameFilter: '',
  periodFilter: '',
  statusFilter: '',
  rows: [],
  totalElements: 0,
  dateSort: '',
  toggleDateSort: jest.fn(),
  openBatchDetails: jest.fn(),
  pageSize: 10,
  setPageSize: jest.fn(),
  start: 1,
  end: 1,
  page: 0,
  setPage: jest.fn(),
  totalPages: 1,
  ...overrides,
});

const getTransactionsVm = (overrides?: Record<string, unknown>) => ({
  t,
  id: 'initiative-id',
  batch: {
    id: 'batch-id',
    businessName: 'Biz',
    assigneeLevel: 'L2',
  },
  role: 'operator_l2',
  selectedRows: new Set<string>(['trx-1']),
  lockedStatus: null,
  setApproveModal: jest.fn(),
  setReasonModal: jest.fn(),
  setBatchModalOpen: jest.fn(),
  getCsv: jest.fn(),
  formattedPeriod: 'period',
  iban: 'IT00',
  checksPercentage: '10% / 100%',
  refundRequestDate: jest.fn(() => 'date'),
  getStatusLabel: jest.fn(() => 'label'),
  getStatusColor: jest.fn(() => 'default'),
  buildStatusChipSx: jest.fn(() => ({})),
  posList: [],
  draftPosFilter: '',
  setDraftPosFilter: jest.fn(),
  draftStatusFilter: '',
  setDraftStatusFilter: jest.fn(),
  mapTransactionStatus: jest.fn(() => ({ label: 'toCheck', color: 'default' })),
  draftSearchType: '',
  setDraftSearchType: jest.fn(),
  setDraftSearchValue: jest.fn(),
  draftSearchValue: '',
  handleSearchValueChange: jest.fn(),
  isFilterDisabled: false,
  handleFilterClick: jest.fn(),
  posFilter: '',
  statusFilter: '',
  searchValue: '',
  searchType: '',
  handleRemoveFilters: jest.fn(),
  rows: [],
  totalElements: 0,
  disabled: false,
  sameStatusRows: [],
  allSameStatusSelected: false,
  handleHeaderCheckbox: jest.fn(),
  dateSort: '',
  toggleDateSort: jest.fn(),
  handleRowCheckbox: jest.fn(),
  downloadInvoice: jest.fn(),
  handleOpenDrawer: jest.fn(),
  pageSize: 10,
  setPageSize: jest.fn(),
  start: 1,
  end: 1,
  page: 0,
  setPage: jest.fn(),
  totalPages: 1,
  openDrawer: false,
  handleCloseDrawer: jest.fn(),
  selectedTransaction: null,
  formatDate: jest.fn((d?: string) => d || '-'),
  closeAfter: jest.fn((p: Promise<unknown>) => p),
  handleRefundAction: jest.fn(() => Promise.resolve()),
  reasonModal: { open: false, type: null as 'reject' | 'suspend' | null },
  approveModal: false,
  approve: jest.fn(() => Promise.resolve()),
  batchModalOpen: false,
  handleBatchStatus: jest.fn(),
  batchErrorOpen: false,
  setBatchErrorOpen: jest.fn(),
  restored: true,
  ...overrides,
});

describe('viewModel bindings', () => {
  test('buildRefundBatchesBindings maps fields and computes hasAppliedFilters false', () => {
    const vm = getBatchesVm();
    const result = buildRefundBatchesBindings(vm as any, t);

    expect(result.filtersBarProps.t).toBe(t);
    expect(result.filtersBarProps.hasAppliedFilters).toBe(false);
    expect(result.filtersBarProps.applyFilters).toBe(vm.applyFilters);
    expect(result.tableProps.openBatchDetails).toBe(vm.openBatchDetails);
    expect(result.tableProps.totalPages).toBe(1);
  });

  test('buildRefundBatchesBindings computes hasAppliedFilters true', () => {
    const vm = getBatchesVm({ statusFilter: 'APPROVED' });
    const result = buildRefundBatchesBindings(vm as any, t);

    expect(result.filtersBarProps.hasAppliedFilters).toBe(true);
  });

  test('buildRefundTransactionsBindings maps props and computes hasAppliedFilters false', () => {
    const vm = getTransactionsVm();
    const result = buildRefundTransactionsBindings(vm as any, 'initiative-name');

    expect(result.breadcrumbsProps.initiativeName).toBe('initiative-name');
    expect(result.breadcrumbsProps.initiativeId).toBe('initiative-id');
    expect(result.headerProps.selectedRowsSize).toBe(1);
    expect(result.filtersBarProps.hasAppliedFilters).toBe(false);
    expect(result.tableProps.sameStatusRowsLength).toBe(0);
    expect(result.overlaysProps.batchAssigneeLevel).toBe('L2');
  });

  test('buildRefundTransactionsBindings callbacks and hasAppliedFilters true', () => {
    const vm = getTransactionsVm({
      posFilter: 'pos-1',
      draftSearchType: 'trxCode',
      sameStatusRows: [{ id: 'r1' }, { id: 'r2' }],
    });
    const result = buildRefundTransactionsBindings(vm as any, 'initiative-name');

    expect(result.filtersBarProps.hasAppliedFilters).toBe(true);
    expect(result.tableProps.sameStatusRowsLength).toBe(2);

    result.headerProps.onOpenApproveModal();
    result.headerProps.onOpenSuspendModal();
    result.headerProps.onOpenRejectModal();
    result.headerProps.onOpenBatchModal();

    expect(vm.setApproveModal).toHaveBeenCalledWith(true);
    expect(vm.setReasonModal).toHaveBeenCalledWith({ open: true, type: 'suspend' });
    expect(vm.setReasonModal).toHaveBeenCalledWith({ open: true, type: 'reject' });
    expect(vm.setBatchModalOpen).toHaveBeenCalledWith(true);
  });
});