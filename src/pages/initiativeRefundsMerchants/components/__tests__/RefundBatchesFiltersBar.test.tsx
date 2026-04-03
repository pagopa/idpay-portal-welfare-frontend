import { fireEvent, render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import RefundBatchesFiltersBar from '../RefundBatchesFiltersBar';

jest.mock('../../model/constants', () => ({
  BATCH_STATUS_FILTER_OPTIONS: [
    { value: 'TO_WORK', role: 'L1' },
    { value: 'APPROVED', role: 'L3' },
  ],
  MERCHANT_ASSIGNEE_OPTIONS: ['L1', 'L2'],
  MERCHANT_REFUND_PERIOD_OPTIONS: [{ value: '2026-03', labelKey: 'period.march' }],
}));

jest.mock('../../model/status', () => ({
  getStatusChipData: (value: string, role: string | undefined) => ({
    label: `chip-${value}-${role ?? 'none'}`,
    color: 'default',
    sx: {},
  }),
}));

const t = (key: string) => key;

const getBaseProps = (): ComponentProps<typeof RefundBatchesFiltersBar> => ({
  t,
  draftName: '',
  setDraftName: jest.fn(),
  draftPeriod: '',
  setDraftPeriod: jest.fn(),
  draftStatus: '',
  setDraftStatus: jest.fn(),
  draftAssignee: '',
  setDraftAssignee: jest.fn(),
  businessNameList: [
    {
      merchantId: 'm1',
      businessName: 'Merchant One',
      fiscalCode: 'AAAAAA00A00A000A',
      merchantStatus: 'ACTIVE',
      updateStatusState: 'UPDATED',
    },
    {
      merchantId: 'm2',
      businessName: 'Merchant Two',
      fiscalCode: 'BBBBBB00B00B000B',
      merchantStatus: 'ACTIVE',
      updateStatusState: 'UPDATED',
    },
  ],
  isFilterDisabled: false,
  applyFilters: jest.fn(),
  clearFilters: jest.fn(),
  hasAppliedFilters: false,
});

describe('<RefundBatchesFiltersBar />', () => {
  test('renders controls and button states', () => {
    const props = { ...getBaseProps(), isFilterDisabled: true, hasAppliedFilters: false };
    render(<RefundBatchesFiltersBar {...props} />);

    expect(
      screen.getByRole('button', { name: 'pages.initiativeMerchantDetail.filterBtn' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'pages.initiativeMerchant.form.removeFiltersBtn' })
    ).toBeDisabled();
  });

  test('handles filter and clear actions', () => {
    const props = { ...getBaseProps(), hasAppliedFilters: true };
    render(<RefundBatchesFiltersBar {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'pages.initiativeMerchantDetail.filterBtn' }));
    expect(props.applyFilters).toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole('button', { name: 'pages.initiativeMerchant.form.removeFiltersBtn' })
    );
    expect(props.clearFilters).toHaveBeenCalled();
  });

  test('changes all select filters and calls setters with expected values', () => {
    const props = getBaseProps();
    render(<RefundBatchesFiltersBar {...props} />);

    const combos = screen.getAllByRole('combobox');

    fireEvent.mouseDown(combos[0]);
    fireEvent.click(screen.getByText('Merchant Two'));
    expect(props.setDraftName).toHaveBeenCalledWith('m2');

    fireEvent.mouseDown(combos[1]);
    fireEvent.click(screen.getByText('period.march'));
    expect(props.setDraftPeriod).toHaveBeenCalledWith('2026-03');

    fireEvent.mouseDown(combos[2]);
    fireEvent.click(screen.getByText('chip-APPROVED-L3'));
    expect(props.setDraftStatus).toHaveBeenCalledWith('APPROVED');

    fireEvent.mouseDown(combos[3]);
    fireEvent.click(screen.getByText('pages.initiativeMerchantsRefunds.L2'));
    expect(props.setDraftAssignee).toHaveBeenCalledWith('pages.initiativeMerchantsRefunds.L2');
  });
});