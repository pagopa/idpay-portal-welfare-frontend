import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
// import { StatusEnum as WalletStatusEnum } from '../../../api/generated/initiative/WalletDTO';
import { StatusEnum } from '../../../api/generated/initiative/InstrumentDTO';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import PaymentMethodsModal from '../PaymentMethodsModal';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(cleanup);

const walletInstrument = [
  {
    idWallet: '12345',
    instrumentId: '1122334455',
    maskedPan: '1111 2222 3333 4444',
    channel: 'channel',
    brandLog: undefined,
    status: StatusEnum.ACTIVE,
    activationDate: new Date('2023-01-04T16:38:43.590Z'),
  },
  {
    idWallet: '678910',
    instrumentId: '667788991010',
    maskedPan: '5555 6666 7777 8888',
    channel: 'channel',
    brandLog:
      'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
    status: StatusEnum.ACTIVE,
    activationDate: new Date('2023-01-04T16:38:43.590Z'),
  },
  {
    idWallet: '678910',
    instrumentId: '667788991010',
    maskedPan: '5555 6666 7777 8888',
    channel: 'channel',
    brandLog:
      'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
    status: StatusEnum.PENDING_DEACTIVATION_REQUEST,
    activationDate: new Date('2023-01-04T16:38:43.590Z'),
  },
  {
    idWallet: '678910',
    instrumentId: '667788991010',
    maskedPan: '5555 6666 7777 8888',
    channel: 'channel',
    brandLog:
      'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
    status: StatusEnum.PENDING_ENROLLMENT_REQUEST,
    activationDate: new Date('2023-01-04T16:38:43.590Z'),
  },
];

describe('test suite initiative user details', () => {
  test('test of component TransactionDetailModal open', async () => {
    window.scrollTo = jest.fn();
    renderWithHistoryAndStore(
      <PaymentMethodsModal
        openPaymentMethodModal={true}
        handleClosePaymentMethodModal={jest.fn()}
        paymentMethodList={walletInstrument}
      />
    );

    const closeModal = screen.getByTestId('close-modal-test');
    fireEvent.click(closeModal);
  });

  test('test of component TransactionDetailModal open', async () => {
    window.scrollTo = jest.fn();
    renderWithHistoryAndStore(
      <PaymentMethodsModal
        openPaymentMethodModal={false}
        handleClosePaymentMethodModal={jest.fn()}
        paymentMethodList={walletInstrument}
      />
    );
  });
});
