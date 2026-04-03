import { fireEvent, render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import RefundBatchesTable from '../RefundBatchesTable';
import { RefundItem } from '../../model/types';

jest.mock('../RefundRow', () => (props: any) => (
  <tr>
    <td>{props.row.businessName}</td>
    <td>
      <button data-testid={`open-${props.row.id}`} onClick={props.onClick}>
        open
      </button>
    </td>
  </tr>
));

jest.mock('../../model/constants', () => ({
  PAGE_SIZE_OPTIONS: [10, 25],
}));

const t = (key: string) => key;

const getBaseProps = (): ComponentProps<typeof RefundBatchesTable> => ({
  t,
  rows: [],
  totalElements: 0,
  dateSort: '' as '' | 'asc' | 'desc',
  toggleDateSort: jest.fn(),
  openBatchDetails: jest.fn(),
  pageSize: 10,
  setPageSize: jest.fn(),
  start: 1,
  end: 10,
  page: 0,
  setPage: jest.fn(),
  totalPages: 3,
});

const getRow = (overrides?: Partial<RefundItem>): RefundItem => ({
  id: 'row-1',
  merchantId: 'm-1',
  businessName: 'Biz 1',
  month: '03',
  posType: 'ONLINE',
  merchantSendDate: '2026-03-10T10:00:00.000Z',
  status: 'TO_WORK',
  partial: false,
  name: 'batch-name',
  startDate: '2026-03-01',
  endDate: '2026-03-31',
  totalAmountCents: 1000,
  approvedAmountCents: 500,
  initialAmountCents: 800,
  suspendedAmountCents: 100,
  numberOfTransactions: 10,
  numberOfTransactionsSuspended: 0,
  numberOfTransactionsRejected: 0,
  numberOfTransactionsElaborated: 5,
  assigneeLevel: 'L1',
  ...overrides,
});

describe('<RefundBatchesTable />', () => {
  test('renders empty state when there are no elements', () => {
    render(<RefundBatchesTable {...getBaseProps()} />);
    expect(screen.getByText('pages.initiativeMerchantsRefunds.emptyState')).toBeInTheDocument();
  });

  test('renders rows, sort and pagination actions', () => {
    const props = {
      ...getBaseProps(),
      totalElements: 2,
      rows: [getRow()],
      page: 1,
    };
    const { container } = render(<RefundBatchesTable {...props} />);

    fireEvent.click(screen.getByTestId('open-row-1'));
    expect(props.openBatchDetails).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'row-1' })
    );

    fireEvent.click(
      screen.getByText('pages.initiativeMerchantsRefunds.table.requestRefundDate')
    );
    expect(props.toggleDateSort).toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('25'));
    expect(props.setPageSize).toHaveBeenCalledWith(25);

    fireEvent.click(container.querySelector('[data-testid="ChevronLeftIcon"]') as Element);
    expect(props.setPage).toHaveBeenCalledWith(0);

    fireEvent.click(container.querySelector('[data-testid="ChevronRightIcon"]') as Element);
    expect(props.setPage).toHaveBeenCalledWith(2);
  });
});