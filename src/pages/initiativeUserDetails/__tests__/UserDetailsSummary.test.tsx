import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { MockedStatusInstrument, MockedStatusWallet } from '../../../model/Initiative';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import UserDetailsSummary from '../components/UserDetailsSummary';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(cleanup);

describe('test suite initiative user details', () => {
  const walletInstrument = [
    {
      idWallet: '12345',
      instrumentId: '1122334455',
      maskedPan: '1111 2222 3333 4444',
      channel: 'channel',
      brandLog: undefined,
      status: MockedStatusInstrument.ACTIVE,
      activationDate: new Date('2023-01-04T16:38:43.590Z'),
    },
    {
      idWallet: '678910',
      instrumentId: '667788991010',
      maskedPan: '5555 6666 7777 8888',
      channel: 'channel',
      brandLog:
        'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
      status: MockedStatusInstrument.ACTIVE,
      activationDate: new Date('2023-01-04T16:38:43.590Z'),
    },
    {
      idWallet: '678910',
      instrumentId: '667788991010',
      maskedPan: '5555 6666 7777 8888',
      channel: 'channel',
      brandLog:
        'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
      status: MockedStatusInstrument.PENDING_DEACTIVATION_REQUEST,
      activationDate: new Date('2023-01-04T16:38:43.590Z'),
    },
    {
      idWallet: '678910',
      instrumentId: '667788991010',
      maskedPan: '5555 6666 7777 8888',
      channel: 'channel',
      brandLog:
        'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
      status: MockedStatusInstrument.PENDING_ENROLLMENT_REQUEST,
      activationDate: new Date('2023-01-04T16:38:43.590Z'),
    },
  ];
  test('test of component TransactionDetailModal open', async () => {
    window.scrollTo = jest.fn();
    renderWithHistoryAndStore(
      <UserDetailsSummary
        amount={10}
        refunded={10}
        accrued={10}
        walletStatus={MockedStatusWallet.REFUNDABLE}
        paymentMethodList={walletInstrument}
        iban={''}
        holderBank={''}
        checkIbanResponseDate={new Date()}
        channel={''}
      />
    );

    const event = screen.getByText('pages.initiativeUserDetails.paymentMethod');
    fireEvent.click(event);
  });

  test('test of component TransactionDetailModal open', async () => {
    window.scrollTo = jest.fn();
    renderWithHistoryAndStore(
      <UserDetailsSummary
        amount={10}
        refunded={10}
        accrued={10}
        walletStatus={MockedStatusWallet.REFUNDABLE}
        paymentMethodList={[]}
        iban={''}
        holderBank={''}
        checkIbanResponseDate={new Date()}
        channel={''}
      />
    );

    const event = screen.getByText('pages.initiativeUserDetails.missingPaymentMethod');
    fireEvent.click(event);
  });
});
