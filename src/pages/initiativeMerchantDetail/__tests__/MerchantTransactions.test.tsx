import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithContext } from '../../../utils/test-utils';
import MerchantTransactions from '../MerchantTransactions';
import {
  MerchantTransactionDtoStatusEnum,
  MerchantTransactionsListDTO,
} from '../../../api/generated/merchants/apiClient';
import userEvent from '@testing-library/user-event';
import { getMerchantTransactions } from '../../../services/merchantsService';

jest.mock('../../../services/merchantsService', () => ({
  getMerchantTransactions: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  (getMerchantTransactions as jest.Mock).mockResolvedValue({
    content: [],
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  } as MerchantTransactionsListDTO);
});

describe('Test suite for MerchantTransactions component', () => {
  test('shows empty state when API returns no content (setRows([]) branch)', async () => {
    renderWithContext(
      <MerchantTransactions initiativeId={'initativeTestId321'} merchantId={'merchantTestId123'} />
    );

    const emptyDiscountList = await screen.findByText('pages.initiativeMerchantDetail.emptyList');
    expect(emptyDiscountList).toBeInTheDocument();
  });

  test('shows table and all transaction status chips when API returns rows', async () => {
    (getMerchantTransactions as jest.Mock).mockResolvedValueOnce({
      content: [
        {
          trxCode: 't1',
          trxId: '1',
          fiscalCode: 'CF_AUTH',
          effectiveAmountCents: 1000,
          rewardAmountCents: 100,
          updateDate: new Date().toISOString(),
          status: MerchantTransactionDtoStatusEnum.AUTHORIZED,
          trxDate: new Date().toISOString(),
        },
        {
          trxCode: 't2',
          trxId: '2',
          fiscalCode: 'CF_REQ',
          effectiveAmountCents: 900,
          rewardAmountCents: 90,
          updateDate: new Date().toISOString(),
          status: MerchantTransactionDtoStatusEnum.AUTHORIZATION_REQUESTED,
          trxDate: new Date().toISOString(),
        },
        {
          trxCode: 't3',
          trxId: '3',
          fiscalCode: 'CF_CRT',
          effectiveAmountCents: 800,
          rewardAmountCents: 80,
          updateDate: new Date().toISOString(),
          status: MerchantTransactionDtoStatusEnum.CREATED,
          trxDate: new Date().toISOString(),
        },
        {
          trxCode: 't4',
          trxId: '4',
          fiscalCode: 'CF_ID',
          effectiveAmountCents: 700,
          rewardAmountCents: 70,
          updateDate: new Date().toISOString(),
          status: MerchantTransactionDtoStatusEnum.IDENTIFIED,
          trxDate: new Date().toISOString(),
        },
        {
          trxCode: 't5',
          trxId: '5',
          fiscalCode: 'CF_REJ',
          effectiveAmountCents: 600,
          rewardAmountCents: 60,
          updateDate: new Date().toISOString(),
          status: MerchantTransactionDtoStatusEnum.REJECTED,
          trxDate: new Date().toISOString(),
        },
      ],
      pageNo: 0,
      pageSize: 10,
      totalElements: 5,
      totalPages: 1,
    } as MerchantTransactionsListDTO);

    renderWithContext(
      <MerchantTransactions initiativeId={'initativeTestId321'} merchantId={'merchantTestId123'} />
    );

    expect(
      await screen.findByText('pages.initiativeMerchantDetail.transactionStatusEnum.authorized')
    ).toBeInTheDocument();
    expect(
      screen.getByText('pages.initiativeMerchantDetail.transactionStatusEnum.authorizationRequested')
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('pages.initiativeMerchantDetail.transactionStatusEnum.identified').length
    ).toBeGreaterThanOrEqual(2);
    expect(
      screen.getByText('pages.initiativeMerchantDetail.transactionStatusEnum.invalidated')
    ).toBeInTheDocument();

    expect(screen.getByText('CF_AUTH')).toBeInTheDocument();
    expect(screen.queryByText('CF_REQ')).not.toBeInTheDocument();
  });

  test('applies empty filters as undefined values', async () => {
    renderWithContext(
      <MerchantTransactions initiativeId={'initativeTestId321'} merchantId={'merchantTestId123'} />
    );
    const user = userEvent.setup();
    await user.click(screen.getByTestId('apply-filters-btn-test'));

    await waitFor(() => {
      expect(getMerchantTransactions).toHaveBeenCalled();
    });

    const lastCall =
      (getMerchantTransactions as jest.Mock).mock.calls[
        (getMerchantTransactions as jest.Mock).mock.calls.length - 1
      ];
    expect(lastCall).toEqual(['merchantTestId123', 'initativeTestId321', 0, undefined, undefined]);
  });

  test('applies populated filters with fiscalCode and status', async () => {
    renderWithContext(
      <MerchantTransactions initiativeId={'initativeTestId321'} merchantId={'merchantTestId123'} />
    );
    const user = userEvent.setup();
    const filterByUser = screen.getByLabelText(
      'pages.initiativeMerchantDetail.searchByFiscalCode'
    ) as HTMLInputElement;

    await user.type(filterByUser, 'ABCDEF01H01H501Z');

    const filterStatusSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(filterStatusSelect);
    await user.click(
      await screen.findByRole('option', {
        name: 'pages.initiativeMerchantDetail.transactionStatusEnum.authorized',
      })
    );

    await user.click(screen.getByTestId('apply-filters-btn-test'));

    await waitFor(() => {
      expect(getMerchantTransactions).toHaveBeenCalled();
    });

    const lastCall =
      (getMerchantTransactions as jest.Mock).mock.calls[
        (getMerchantTransactions as jest.Mock).mock.calls.length - 1
      ];
    expect(lastCall).toEqual([
      'merchantTestId123',
      'initativeTestId321',
      0,
      'ABCDEF01H01H501Z',
      MerchantTransactionDtoStatusEnum.AUTHORIZED,
    ]);
  });

  test('shows empty state also when API rejects', async () => {
    (getMerchantTransactions as jest.Mock).mockRejectedValueOnce(
      'mocked error response for tests'
    );

    renderWithContext(
      <MerchantTransactions initiativeId={'initativeTestId321'} merchantId={'merchantTestId123'} />
    );
    expect(await screen.findByText('pages.initiativeMerchantDetail.emptyList')).toBeInTheDocument();
  });
});
