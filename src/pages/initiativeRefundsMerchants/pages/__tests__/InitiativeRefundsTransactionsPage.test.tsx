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

jest.mock('../../components/RefundTransactionsBreadcrumbs', () => ({
  __esModule: true,
  default: ({ initiativeName, businessName }: any) => (
    <div data-testid="breadcrumbs">{`${initiativeName}|${businessName}`}</div>
  ),
}));

jest.mock('../../components/RefundTransactionsHeader', () => ({
  __esModule: true,
  default: ({ role, selectedRowsSize, onOpenApproveModal }: any) => (
    <button data-testid="header" onClick={onOpenApproveModal}>
      {`${role}|${selectedRowsSize}`}
    </button>
  ),
}));

jest.mock('../../components/RefundBatchSummary', () => ({
  __esModule: true,
  default: ({ checksPercentage, formattedPeriod }: any) => (
    <div data-testid="summary">{`${checksPercentage}|${formattedPeriod}`}</div>
  ),
}));

jest.mock('../../components/RefundTransactionsFiltersBar', () => ({
  __esModule: true,
  default: ({ hasAppliedFilters }: any) => (
    <div data-testid="filters">{hasAppliedFilters ? 'filters-on' : 'filters-off'}</div>
  ),
}));

jest.mock('../../components/RefundTransactionsTable', () => ({
  __esModule: true,
  default: ({ totalElements, selectedRows, handleHeaderCheckbox }: any) => (
    <button data-testid="table" onClick={handleHeaderCheckbox}>
      {`${totalElements}|${selectedRows.size}`}
    </button>
  ),
}));

jest.mock('../../components/RefundTransactionsOverlays', () => ({
  __esModule: true,
  default: ({ approveModal, batchModalOpen, batchErrorOpen }: any) => (
    <div data-testid="overlays">{`${approveModal}|${batchModalOpen}|${batchErrorOpen}`}</div>
  ),
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
  setBatchModalOpen: jest.fn(),
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

    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('initiative-x|Business Name');
    expect(screen.getByTestId('header')).toHaveTextContent('operator_l1|0');
    expect(screen.getByTestId('summary')).toHaveTextContent('10% / 100%|period');
    expect(screen.getByTestId('filters')).toHaveTextContent('filters-off');
    expect(screen.getByTestId('table')).toHaveTextContent('0|0');
    expect(screen.getByTestId('overlays')).toHaveTextContent('false|false|false');

    fireEvent.click(screen.getByTestId('header'));
    expect(refundTransactionsPageMock.setApproveModal).toHaveBeenCalledWith(true);
  });

  test('computes applied filters and handles an empty initiative name', () => {
    const refundTransactionsPageMock = createVm();
    mockedInitiativeName = undefined;
    mockedUseRefundTransactionsPage.mockReturnValue({
      ...refundTransactionsPageMock,
      draftSearchType: 'trxCode',
      posFilter: 'pos-1',
    });

    render(<InitiativeRefundsTransactionsPage />);

    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('|Business Name');
    expect(screen.getByTestId('filters')).toHaveTextContent('filters-on');
  });
});
