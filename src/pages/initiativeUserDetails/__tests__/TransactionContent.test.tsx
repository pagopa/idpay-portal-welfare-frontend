import { cleanup, fireEvent, screen } from '@testing-library/react';
import TransactionContent from '../components/InitiativeWithDiscount/TransactionContent';
import { renderWithContext } from '../../../utils/test-utils';
import { copyTextToClipboard } from '../../../helpers';

jest.mock('../../../helpers', () => ({
  ...jest.requireActual('../../../helpers'),
  copyTextToClipboard: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(cleanup);

describe('test suite TransactionContent component', () => {
  test('Render component with channel: IDPAYCODE', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      businessName: 'TEST',
      amount: 100,
      accrued: 50,
      channel: 'IDPAYCODE',
      enentId: '123456',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);
  });
  test('Render component with channel: QRCODE', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      businessName: 'TEST',
      amount: 100,
      accrued: 50,
      channel: 'QRCODE',
      enentId: '123456',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);
  });

  test('Render component with channel: BARCODE', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      businessName: 'TEST',
      amount: 100,
      accrued: 50,
      channel: 'BARCODE',
      enentId: '123456',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);
  });

  test('Render component with channel: UNEXPECTED', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      businessName: 'TEST',
      amount: 100,
      accrued: 50,
      channel: 'UNEXPECTED',
      enentId: '123456',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);
  });

  test('Render component with channel: undefined', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      businessName: 'TEST',
      amount: 100,
      accrued: 50,
      channel: undefined,
      enentId: '123456',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);
  });

  test('Render component with status cancelled', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      businessName: 'TEST',
      amount: 100,
      accrued: 50,
      channel: undefined,
      enentId: '123456',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
      status: 'CANCELLED',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);
  });

  test('Render component with a rejected operation result', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      businessName: 'TEST',
      amount: 100,
      accrued: 50,
      channel: 'IDPAYCODE',
      enentId: '123456',
      operationType: 'REJECTED_ADD_INSTRUMENT',
      operationDate: '2023-09-29',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);

    expect(
      screen.getByText(
        (text) =>
          text === 'pages.initiativeUserDetails.transactionDetail.negativeResult' ||
          text === 'Fallito'
      )
    ).toBeInTheDocument();
  });

  test('renders positive result for non-rejected operations', () => {
    const transactionDetail = {
      operationId: 'positive-op',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
      businessName: 'TEST',
      amountCents: 100,
      accruedCents: 50,
      channel: 'IDPAYCODE',
      eventId: 'evt-positive',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);

    expect(screen.getByText('Eseguito')).toBeInTheDocument();
    expect(screen.queryByText('Fallito')).not.toBeInTheDocument();
  });

  test('renders cancelled alert branch', () => {
    const transactionDetail = {
      operationId: 'cancelled-op',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
      businessName: 'TEST',
      amountCents: 100,
      accruedCents: 50,
      channel: 'QRCODE',
      eventId: 'evt-cancelled',
      status: 'CANCELLED',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);

    expect(
      screen.getByText('pages.initiativeUserDetails.transactionDetail.discountCancelledAlertText')
    ).toBeInTheDocument();
  });

  test('uses fallback channel label for unknown channels', () => {
    const transactionDetail = {
      operationId: 'unknown-channel-op',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
      businessName: 'TEST',
      amountCents: 100,
      accruedCents: 50,
      channel: 'UNKNOWN',
      eventId: 'evt-channel',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('copies event id when clicking the copy icon', () => {
    const transactionDetail = {
      operationId: 'copy-op',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
      businessName: 'TEST',
      amountCents: 100,
      accruedCents: 50,
      channel: 'IDPAYCODE',
      eventId: 'evt-copy',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);
    fireEvent.click(screen.getByTestId('transaction-modal-copy'));

    expect(copyTextToClipboard as jest.Mock).toHaveBeenCalledWith('evt-copy');
  });
});