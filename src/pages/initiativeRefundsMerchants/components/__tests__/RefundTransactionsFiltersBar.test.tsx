import { fireEvent, render, screen } from '@testing-library/react';
import RefundTransactionsFiltersBar from '../RefundTransactionsFiltersBar';

jest.mock('../../model/constants', () => ({
  TRANSACTION_SEARCH_TYPE_OPTIONS: [
    { value: 'fiscalCode', labelKey: 'fiscalCode' },
    { value: 'trxCode', labelKey: 'trxCode' },
  ],
  TRANSACTION_STATUS_FILTER_OPTIONS: ['TO_CHECK', 'APPROVED'],
}));

const t = (key: string) => key;

const getBaseProps = () => ({
  t,
  posList: [
    {
      id: 'pos-online',
      type: 'ONLINE',
      franchiseName: 'Shop Online',
      website: 'shop.example.com',
    },
    {
      id: 'pos-physical',
      type: 'FISICO',
      franchiseName: 'Shop Physical',
      province: 'RM',
      address: 'Via Roma 1',
    },
  ] as Array<any>,
  draftPosFilter: '',
  setDraftPosFilter: jest.fn(),
  draftStatusFilter: '',
  setDraftStatusFilter: jest.fn(),
  mapTransactionStatus: jest.fn((status?: string) => ({
    label:
      status === 'TO_CHECK'
        ? 'pages.initiativeMerchantsTransactions.table.toCheck'
        : 'status.label',
    color: 'default',
  })),
  draftSearchType: '' as '' | 'fiscalCode' | 'trxCode',
  setDraftSearchType: jest.fn(),
  setDraftSearchValue: jest.fn(),
  draftSearchValue: '',
  handleSearchValueChange: jest.fn(),
  isFilterDisabled: false,
  handleFilterClick: jest.fn(),
  handleRemoveFilters: jest.fn(),
  hasAppliedFilters: false,
});

describe('<RefundTransactionsFiltersBar />', () => {
  test('renders controls and handles filter/remove actions', () => {
    const props = getBaseProps();
    render(<RefundTransactionsFiltersBar {...props} />);

    const filterBtn = screen.getByRole('button', {
      name: 'pages.initiativeMerchantDetail.filterBtn',
    });
    fireEvent.click(filterBtn);
    expect(props.handleFilterClick).toHaveBeenCalled();

    const removeBtn = screen.getByRole('button', {
      name: 'pages.initiativeMerchant.form.removeFiltersBtn',
    });
    expect(removeBtn).toBeDisabled();
  });

  test('supports online and physical selected POS render values', () => {
    const onlineProps = {
      ...getBaseProps(),
      draftPosFilter: 'pos-online',
      hasAppliedFilters: true,
    };
    const { rerender } = render(<RefundTransactionsFiltersBar {...onlineProps} />);
    expect(screen.getByText('Shop Online - shop.example.com')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'pages.initiativeMerchant.form.removeFiltersBtn' })
    ).not.toBeDisabled();

    const physicalProps = {
      ...getBaseProps(),
      draftPosFilter: 'pos-physical',
    };
    rerender(<RefundTransactionsFiltersBar {...physicalProps} />);
    expect(screen.getByText('Shop Physical - RM - Via Roma 1')).toBeInTheDocument();
  });

  test('disables POS select and search input when expected', () => {
    const props = {
      ...getBaseProps(),
      posList: [],
      isFilterDisabled: true,
      draftSearchType: '' as '' | 'fiscalCode' | 'trxCode',
    };
    render(<RefundTransactionsFiltersBar {...props} />);

    const combos = screen.getAllByRole('combobox');
    expect(combos[0]).toHaveAttribute('aria-disabled', 'true');

    const searchInput = screen.getByLabelText(
      'pages.initiativeMerchantsTransactions.table.insertTrxCode'
    );
    expect(searchInput).toBeDisabled();

    expect(
      screen.getByRole('button', { name: 'pages.initiativeMerchantDetail.filterBtn' })
    ).toBeDisabled();
  });

  test('changes search type and resets search value', () => {
    const props = {
      ...getBaseProps(),
      draftSearchType: 'fiscalCode' as const,
      draftSearchValue: 'ABC',
    };
    render(<RefundTransactionsFiltersBar {...props} />);

    const combos = screen.getAllByRole('combobox');
    fireEvent.mouseDown(combos[2]);
    fireEvent.click(screen.getByText('trxCode'));

    expect(props.setDraftSearchType).toHaveBeenCalledWith('trxCode');
    expect(props.setDraftSearchValue).toHaveBeenCalledWith('');
  });

  test('disables POS selection when no POS are available and clears applied filters', () => {
    const props = {
      ...getBaseProps(),
      posList: [],
      hasAppliedFilters: true,
      draftSearchType: 'trxCode' as const,
    };
    render(<RefundTransactionsFiltersBar {...props} />);

    expect(screen.getAllByRole('combobox')[0]).toHaveAttribute('aria-disabled', 'true');

    const removeBtn = screen.getByRole('button', {
      name: 'pages.initiativeMerchant.form.removeFiltersBtn',
    });
    expect(removeBtn).toBeEnabled();
    fireEvent.click(removeBtn);
    expect(props.handleRemoveFilters).toHaveBeenCalled();
  });
});