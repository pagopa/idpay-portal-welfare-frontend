import { fireEvent, render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { PointOfSaleDTO, TypeEnum } from '../../../../api/generated/merchants/PointOfSaleDTO';
import { RewardBatchTrxStatusEnum } from '../../../../api/generated/merchants/RewardBatchTrxStatus';
import RefundTransactionsTable from '../RefundTransactionsTable';

jest.mock('../../model/constants', () => ({
  PAGE_SIZE_OPTIONS: [10, 25],
}));

const t = (key: string) => key;

const getBaseProps = (): ComponentProps<typeof RefundTransactionsTable> => ({
  t,
  rows: [] as Array<any>,
  totalElements: 0,
  lockedStatus: null as RewardBatchTrxStatusEnum | null,
  sameStatusRowsLength: 0,
  disabled: false,
  allSameStatusSelected: false,
  handleHeaderCheckbox: jest.fn(),
  dateSort: '' as '' | 'asc' | 'desc',
  toggleDateSort: jest.fn(),
  selectedRows: new Set<string>(),
  handleRowCheckbox: jest.fn(),
  downloadInvoice: jest.fn(),
  posList: [] as Array<PointOfSaleDTO>,
  handleOpenDrawer: jest.fn(),
  pageSize: 10,
  setPageSize: jest.fn(),
  start: 1,
  end: 10,
  page: 0,
  setPage: jest.fn(),
  totalPages: 3,
});

const getRow = (overrides?: Record<string, any>) => ({
  id: 'trx-1',
  date: '10/03/2026',
  shop: 'Shop 1',
  amountCents: 1000,
  statusLabel: 'ok',
  statusColor: 'default',
  invoiceFileName: 'invoice.pdf',
  pointOfSaleId: 'pos-1',
  transactionId: 't-1',
  status: RewardBatchTrxStatusEnum.TO_CHECK,
  raw: {} as any,
  ...overrides,
});

describe('<RefundTransactionsTable />', () => {
  test('renders empty state when rows are missing', () => {
    render(<RefundTransactionsTable {...getBaseProps()} />);
    expect(screen.getByText('pages.initiativeMerchantsRefunds.emptyState')).toBeInTheDocument();
  });

  test('renders table and handles actions for row and controls', () => {
    const props = {
      ...getBaseProps(),
      totalElements: 1,
      rows: [getRow()],
      selectedRows: new Set(['trx-1']),
      lockedStatus: RewardBatchTrxStatusEnum.TO_CHECK,
      sameStatusRowsLength: 1,
      allSameStatusSelected: true,
      posList: [{ id: 'pos-1', type: TypeEnum.ONLINE, website: 'shop.example.com' }],
      page: 1,
      totalPages: 3,
    };
    const { container } = render(<RefundTransactionsTable {...props} />);

    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(props.handleHeaderCheckbox).toHaveBeenCalled();

    fireEvent.click(screen.getByText('invoice.pdf'));
    expect(props.downloadInvoice).toHaveBeenCalledWith('pos-1', 't-1', 'invoice.pdf');

    fireEvent.click(screen.getAllByTestId('ChevronRightIcon')[0]);
    expect(props.handleOpenDrawer).toHaveBeenCalledWith(expect.objectContaining({ id: 'trx-1' }));

    fireEvent.click(screen.getByText('pages.initiativeMerchantsTransactions.table.dateTime'));
    expect(props.toggleDateSort).toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('25'));
    expect(props.setPageSize).toHaveBeenCalledWith(25);

    fireEvent.click(container.querySelectorAll('[data-testid="ChevronLeftIcon"]')[0] as Element);
    expect(props.setPage).toHaveBeenCalledWith(0);

    fireEvent.click(container.querySelectorAll('[data-testid="ChevronRightIcon"]')[1] as Element);
    expect(props.setPage).toHaveBeenCalledWith(2);
  });

  test('covers address fallback branches and checkbox disabled branch', () => {
    const props = {
      ...getBaseProps(),
      totalElements: 4,
      lockedStatus: RewardBatchTrxStatusEnum.APPROVED,
      sameStatusRowsLength: 0,
      rows: [
        getRow({ id: 'a', pointOfSaleId: undefined, status: RewardBatchTrxStatusEnum.REJECTED }),
        getRow({ id: 'b', pointOfSaleId: 'missing', status: RewardBatchTrxStatusEnum.REJECTED }),
        getRow({
          id: 'c',
          pointOfSaleId: 'online-no-website',
          status: RewardBatchTrxStatusEnum.REJECTED,
        }),
        getRow({
          id: 'd',
          pointOfSaleId: 'physical',
          status: RewardBatchTrxStatusEnum.REJECTED,
        }),
      ],
      posList: [
        { id: 'online-no-website', type: TypeEnum.ONLINE, website: '' },
        { id: 'physical', type: TypeEnum.PHYSICAL, address: 'Via Libertà', province: 'PA' },
      ],
      disabled: true,
    };
    render(<RefundTransactionsTable {...props} />);

    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
    expect(screen.getByText('Via Libertà PA')).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeDisabled();
  });
});