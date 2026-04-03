import { render, screen, fireEvent } from '@testing-library/react';
import InitiativeRefundsTransactionsPage from '../InitiativeRefundsTransactionsPage';

const mockedUseRefundTransactionsPage = jest.fn();
let mockedInitiativeName: string | undefined = 'initiative-x';

jest.mock('../../../../redux/hooks', () => ({
  useAppSelector: () => ({ initiativeName: mockedInitiativeName }),
}));

jest.mock('../../hooks/useRefundTransactionsPage', () => ({
  useRefundTransactionsPage: () => mockedUseRefundTransactionsPage(),
}));

jest.mock('../../model/constants', () => ({
  PAGE_SIZE_OPTIONS: [10, 25],
  TRANSACTION_SEARCH_TYPE_OPTIONS: [{ value: 'fiscalCode', labelKey: 'fiscalCode' }],
  TRANSACTION_STATUS_FILTER_OPTIONS: ['TO_CHECK'],
}));

jest.mock('../../components/RefundsTransactionsDrawer', () => ({
  __esModule: true,
  default: () => <div>drawer</div>,
}));

jest.mock('../../components/RefundReasonModal', () => ({
  __esModule: true,
  default: () => <div>reason-modal</div>,
}));

jest.mock('../../components/ApproveConfirmModal', () => ({
  __esModule: true,
  default: () => <div>approve-modal</div>,
}));

jest.mock('../../components/RoleConfirmModal', () => ({
  RoleConfirmModal: () => <div>role-confirm</div>,
}));

jest.mock('../../components/RoleErrorModal', () => ({
  RoleErrorModal: () => <div>role-error</div>,
}));

const createVm = () => ({
  t: (k: string) => k,
  id: '123',
  batch: {
    businessName: 'Business Name',
    status: 'EVALUATING',
    assigneeLevel: 'L1',
    name: 'batch-ref',
    merchantSendDate: '2026-03-01',
    initialAmountCents: 1000,
    approvedAmountCents: 200,
    suspendedAmountCents: 100,
    refundErrorMessage: 'err',
  },
  role: 'operator_l1',
  restored: true,
  disabled: false,
  selectedRows: new Set<string>(),
  lockedStatus: null,
  setApproveModal: jest.fn(),
  setReasonModal: jest.fn(),
  getCsv: jest.fn(),
  ibAN: '',
  formattedPeriod: 'period',
  refundRequestDate: jest.fn(() => 'date'),
  checksPercentage: '10% / 100%',
  getStatusLabel: jest.fn(() => 'label'),
  getStatusColor: jest.fn(() => 'default'),
  buildStatusChipSx: jest.fn(() => ({})),
  iban: 'IT00',
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
  totalElements: 0,
  rows: [],
  pageSize: 10,
  setPageSize: jest.fn(),
  start: 1,
  end: 1,
  page: 0,
  setPage: jest.fn(),
  totalPages: 1,
  dateSort: '',
  toggleDateSort: jest.fn(),
  sameStatusRows: [],
  allSameStatusSelected: false,
  handleHeaderCheckbox: jest.fn(),
  renderAddress: jest.fn(() => 'address'),
  handleRowCheckbox: jest.fn(),
  downloadInvoice: jest.fn(),
  handleOpenDrawer: jest.fn(),
  openDrawer: false,
  handleCloseDrawer: jest.fn(),
  selectedTransaction: null,
  formatDate: jest.fn((d?: string) => d || '-'),
  closeAfter: jest.fn((p: Promise<any>) => p),
  handleRefundAction: jest.fn(() => Promise.resolve()),
  reasonModal: { open: false, type: null as 'reject' | 'suspend' | null },
  approveModal: false,
  approve: jest.fn(() => Promise.resolve()),
  batchModalOpen: false,
  setBatchModalOpen: jest.fn(),
  handleBatchStatus: jest.fn(),
  batchErrorOpen: false,
  setBatchErrorOpen: jest.fn(),
});

describe('InitiativeRefundsTransactionsPage', () => {
  beforeEach(() => {
    mockedInitiativeName = 'initiative-x';
    jest.clearAllMocks();
  });

  test('returns null when batch missing', () => {
    const refundTransactionsPageMock = createVm();
    mockedUseRefundTransactionsPage.mockReturnValue({
      ...refundTransactionsPageMock,
      batch: null,
    });
    const { container } = render(<InitiativeRefundsTransactionsPage />);
    expect(container.firstChild).toBeNull();
  });

  test('returns null when restoration is not complete yet', () => {
    const refundTransactionsPageMock = createVm();
    mockedUseRefundTransactionsPage.mockReturnValue({
      ...refundTransactionsPageMock,
      restored: false,
    });

    const { container } = render(<InitiativeRefundsTransactionsPage />);
    expect(container.firstChild).toBeNull();
  });

  test('renders page with empty table state', () => {
    const refundTransactionsPageMock = createVm();
    mockedUseRefundTransactionsPage.mockReturnValue(refundTransactionsPageMock);
    render(<InitiativeRefundsTransactionsPage />);

    expect(screen.getAllByText('Business Name').length).toBeGreaterThan(0);
    expect(screen.getByText('pages.initiativeMerchantsRefunds.emptyState')).toBeInTheDocument();
  });

  test('handles csv action for non evaluating status', () => {
    const refundTransactionsPageMock = createVm();
    mockedUseRefundTransactionsPage.mockReturnValue({
      ...refundTransactionsPageMock,
      batch: { ...refundTransactionsPageMock.batch, status: 'REFUNDED' },
    });

    render(<InitiativeRefundsTransactionsPage />);
    fireEvent.click(screen.getByRole('button', { name: 'pages.initiativeMerchantsTransactions.csv.button' }));
    expect(refundTransactionsPageMock.getCsv).toHaveBeenCalled();
  });

  test('falls back to an empty initiative name when selector returns undefined', () => {
    mockedInitiativeName = undefined;
    const refundTransactionsPageMock = createVm();
    mockedUseRefundTransactionsPage.mockReturnValue(refundTransactionsPageMock);

    render(<InitiativeRefundsTransactionsPage />);

    expect(screen.getAllByText('Business Name').length).toBeGreaterThan(0);
  });
});
