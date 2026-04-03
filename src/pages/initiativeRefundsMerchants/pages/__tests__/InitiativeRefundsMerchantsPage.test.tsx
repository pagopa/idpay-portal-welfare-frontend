import { render, screen, fireEvent } from '@testing-library/react';
import InitiativeRefundsMerchantsPage from '../InitiativeRefundsMerchantsPage';

const mockedUseRefundBatchesPage = jest.fn();
let mockedInitiativeName: string | undefined = 'initiative-x';

jest.mock('../../../../redux/hooks', () => ({
  useAppSelector: () => ({ initiativeName: mockedInitiativeName }),
}));

jest.mock('../../../../hooks/useInitiative', () => ({
  useInitiative: jest.fn(),
}));

jest.mock('../../hooks/useRefundBatchesPage', () => ({
  useRefundBatchesPage: (...args: Array<unknown>) => mockedUseRefundBatchesPage(...args),
}));

jest.mock('../../components/RefundRow', () => ({
  __esModule: true,
  default: ({ row, onClick }: any) => (
    <tr>
      <td>{row.businessName}</td>
      <td>
        <button onClick={onClick}>open-row</button>
      </td>
    </tr>
  ),
}));

const baseVm = {
  draftName: '',
  setDraftName: jest.fn(),
  draftPeriod: '',
  setDraftPeriod: jest.fn(),
  draftStatus: '',
  setDraftStatus: jest.fn(),
  draftAssignee: '',
  setDraftAssignee: jest.fn(),
  isFilterDisabled: false,
  applyFilters: jest.fn(),
  clearFilters: jest.fn(),
  assigneeFilter: '',
  nameFilter: '',
  periodFilter: '',
  statusFilter: '',
  totalElements: 0,
  rows: [],
  businessNameList: [{ merchantId: 'm1', businessName: 'Business 1' }],
  dateSort: '' as '' | 'asc' | 'desc',
  toggleDateSort: jest.fn(),
  openBatchDetails: jest.fn(),
  pageSize: 10,
  setPageSize: jest.fn(),
  start: 1,
  end: 1,
  page: 0,
  setPage: jest.fn(),
  totalPages: 1,
};

describe('InitiativeRefundsMerchantsPage', () => {
  beforeEach(() => {
    mockedInitiativeName = 'initiative-x';
    jest.clearAllMocks();
  });

  test('renders empty state', () => {
    mockedUseRefundBatchesPage.mockReturnValue(baseVm);
    render(<InitiativeRefundsMerchantsPage />);
    expect(screen.getByText('pages.initiativeMerchantsRefunds.emptyState')).toBeInTheDocument();
  });

  test('renders rows and triggers row/open actions', () => {
    mockedUseRefundBatchesPage.mockReturnValue({
      ...baseVm,
      totalElements: 1,
      rows: [{ id: 'r1', businessName: 'Biz', name: 'n' }],
    });

    render(<InitiativeRefundsMerchantsPage />);
    fireEvent.click(screen.getByText('open-row'));

    expect(baseVm.openBatchDetails).toHaveBeenCalled();
  });

  test('falls back to an empty initiative name when selector returns undefined', () => {
    mockedInitiativeName = undefined;
    mockedUseRefundBatchesPage.mockReturnValue(baseVm);

    render(<InitiativeRefundsMerchantsPage />);

    expect(screen.getByText('pages.initiativeMerchantsRefunds.emptyState')).toBeInTheDocument();
  });
});
