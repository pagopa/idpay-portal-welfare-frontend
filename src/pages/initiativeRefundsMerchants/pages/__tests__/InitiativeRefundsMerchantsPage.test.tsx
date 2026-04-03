import { render, screen } from '@testing-library/react';
import InitiativeRefundsMerchantsPage from '../InitiativeRefundsMerchantsPage';

const mockedUseRefundBatchesPage = jest.fn();
const mockedUseInitiative = jest.fn();
let mockedInitiativeName: string | undefined = 'initiative-x';

jest.mock('../../../../redux/hooks', () => ({
  useAppSelector: () => ({ initiativeName: mockedInitiativeName }),
}));

jest.mock('../../../../hooks/useInitiative', () => ({
  useInitiative: () => mockedUseInitiative(),
}));

jest.mock('../../hooks/useRefundBatchesPage', () => ({
  useRefundBatchesPage: (...args: Array<unknown>) => mockedUseRefundBatchesPage(...args),
}));

jest.mock('../../components/RefundBatchesPageHeader', () => ({
  __esModule: true,
  default: ({ initiativeName }: any) => <div data-testid="header">{initiativeName}</div>,
}));

jest.mock('../../components/RefundBatchesFiltersBar', () => ({
  __esModule: true,
  default: ({ hasAppliedFilters }: any) => (
    <div data-testid="filters">{hasAppliedFilters ? 'filters-on' : 'filters-off'}</div>
  ),
}));

jest.mock('../../components/RefundBatchesTable', () => ({
  __esModule: true,
  default: ({ totalElements, pageSize }: any) => (
    <div data-testid="table">{`${totalElements}-${pageSize}`}</div>
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

  test('renders the page bindings with the selected initiative name', () => {
    mockedUseRefundBatchesPage.mockReturnValue(baseVm);
    render(<InitiativeRefundsMerchantsPage />);

    expect(mockedUseInitiative).toHaveBeenCalled();
    expect(screen.getByTestId('header')).toHaveTextContent('initiative-x');
    expect(screen.getByTestId('filters')).toHaveTextContent('filters-off');
    expect(screen.getByTestId('table')).toHaveTextContent('0-10');
  });

  test('falls back to an empty initiative name when selector returns undefined', () => {
    mockedInitiativeName = undefined;
    mockedUseRefundBatchesPage.mockReturnValue({
      ...baseVm,
      statusFilter: 'APPROVED',
      totalElements: 25,
      pageSize: 25,
    });

    render(<InitiativeRefundsMerchantsPage />);

    expect(screen.getByTestId('header').textContent).toBe('');
    expect(screen.getByTestId('filters')).toHaveTextContent('filters-on');
    expect(screen.getByTestId('table')).toHaveTextContent('25-25');
  });
});
