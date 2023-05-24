import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { IbanDTO } from '../../../api/generated/initiative/IbanDTO';
import { InitiativeRewardTypeEnum } from '../../../api/generated/initiative/InitiativeDTO';
import { StatusEnum as InstrumentStatusEnum } from '../../../api/generated/initiative/InstrumentDTO';
import { InstrumentListDTO } from '../../../api/generated/initiative/InstrumentListDTO';
import { StatusEnum as OnboardingStatusEnum } from '../../../api/generated/initiative/OnboardingStatusDTO';
import { WalletDTO } from '../../../api/generated/initiative/WalletDTO';
import { setInitiativeRewardType } from '../../../redux/slices/initiativeSlice';
import { renderWithContext } from '../../../utils/test-utils';
import UserDetailsSummary from '../components/UserDetailsSummary';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(cleanup);

const oldWindowLocation = global.window.location;
const mockedLocation = {
  assign: jest.fn(),
  pathname: '/portale-enti/dettagli-utente/id2132121iniziativa/fakecf12212',
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

describe('test suite initiative user details', () => {
  window.scrollTo = jest.fn();

  const walletInstrument = [
    {
      idWallet: '12345',
      instrumentId: '1122334455',
      maskedPan: '1111 2222 3333 4444',
      channel: 'channel',
      brandLog: undefined,
      status: InstrumentStatusEnum.ACTIVE,
      activationDate: new Date('2023-01-04T16:38:43.590Z'),
    },
    {
      idWallet: '678910',
      instrumentId: '667788991010',
      maskedPan: '5555 6666 7777 8888',
      channel: 'channel',
      brandLog:
        'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
      status: InstrumentStatusEnum.ACTIVE,
      activationDate: new Date('2023-01-04T16:38:43.590Z'),
    },
    {
      idWallet: '678910',
      instrumentId: '667788991010',
      maskedPan: '5555 6666 7777 8888',
      channel: 'channel',
      brandLog:
        'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
      status: InstrumentStatusEnum.PENDING_DEACTIVATION_REQUEST,
      activationDate: new Date('2023-01-04T16:38:43.590Z'),
    },
    {
      idWallet: '678910',
      instrumentId: '667788991010',
      maskedPan: '5555 6666 7777 8888',
      channel: 'channel',
      brandLog:
        'https://1.bp.blogspot.com/-lDThkIcKtNo/YK0b3BnZXUI/AAAAAAAATd4/KEEdfYwFw1cuzSYfOyDBK9rUP0X0a5DjACLcBGAsYHQ/s0/Mastercard%2BMaestro%2BLogo%2B-%2BDownload%2BFree%2BPNG.png',
      status: InstrumentStatusEnum.PENDING_ENROLLMENT_REQUEST,
      activationDate: new Date('2023-01-04T16:38:43.590Z'),
    },
  ];

  test('test render of component with UserDetailsSummary status ONBOARDING_OK', async () => {
    renderWithContext(
      <UserDetailsSummary
        id={'id2132121iniziativa'}
        cf={'fakecf12212'}
        statusOnb={OnboardingStatusEnum.ONBOARDING_OK}
        holderBank={'bank name'}
        setHolderBank={function (value: React.SetStateAction<string | undefined>): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
  });

  test('test render of component UserDetailsSummary with status ELIGIBLE_KO', async () => {
    renderWithContext(
      <UserDetailsSummary
        id={'id2132121iniziativa'}
        cf={'fakecf12212'}
        statusOnb={OnboardingStatusEnum.ELIGIBLE_KO}
        holderBank={'bank name'}
        setHolderBank={function (value: React.SetStateAction<string | undefined>): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const suspendedAlert = await screen.findByText('pages.initiativeUserDetails.eligibleKo');

    fireEvent.keyDown(suspendedAlert, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
  });

  test('test render of component UserDetailsSummary with status ONBOARDING_KO', async () => {
    renderWithContext(
      <UserDetailsSummary
        id={'id2132121iniziativa'}
        cf={'fakecf12212'}
        statusOnb={OnboardingStatusEnum.ONBOARDING_KO}
        holderBank={undefined}
        setHolderBank={function (value: React.SetStateAction<string | undefined>): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const suspendedAlert = await screen.findByText('pages.initiativeUserDetails.onboardingKo');

    fireEvent.keyDown(suspendedAlert, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
  });

  test('test render of component UserDetailsSummary with status SUSPENDED', async () => {
    renderWithContext(
      <UserDetailsSummary
        id={'id2132121iniziativa'}
        cf={'fakecf12212'}
        statusOnb={OnboardingStatusEnum.SUSPENDED}
        holderBank={'bank name'}
        setHolderBank={function (value: React.SetStateAction<string | undefined>): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
  });

  test('test render with initiativeRewardType = Refund', async () => {
    const { store } = renderWithContext(
      <UserDetailsSummary
        id={'id2132121iniziativa'}
        cf={'fakecf12212'}
        statusOnb={OnboardingStatusEnum.ONBOARDING_OK}
        holderBank={'bank name'}
        setHolderBank={function (value: React.SetStateAction<string | undefined>): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    store.dispatch(setInitiativeRewardType(InitiativeRewardTypeEnum.REFUND));

    const toBeRefunded = await screen.findByText('pages.initiativeUserDetails.balanceToBeRefunded');

    expect(toBeRefunded).toBeInTheDocument();

    const paymentMethodListBtn = await screen.findByText(
      'pages.initiativeUserDetails.paymentMethod'
    );

    fireEvent.click(paymentMethodListBtn);
  });

  test('test render with initiativeRewardType = DISCOUNT', async () => {
    const { store } = renderWithContext(
      <UserDetailsSummary
        id={'id2132121iniziativa'}
        cf={'fakecf12212'}
        statusOnb={OnboardingStatusEnum.ONBOARDING_OK}
        holderBank={'bank name'}
        setHolderBank={function (value: React.SetStateAction<string | undefined>): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    store.dispatch(setInitiativeRewardType(InitiativeRewardTypeEnum.DISCOUNT));

    expect(() => screen.getByText('pages.initiativeUserDetails.balanceToBeRefunded')).toThrow(
      'Unable to find an element'
    );
  });

  test('test addError of getIban, getInstrumentList, getWalletDetail in case of error response', async () => {
    InitiativeApiMocked.getWalletDetail = async (_id: string, _cf: string): Promise<WalletDTO> =>
      await Promise.reject('test reject getWalletDetail addError');

    InitiativeApiMocked.getInstrumentList = async (
      _id: string,
      cf: string
    ): Promise<InstrumentListDTO> => await Promise.reject('test reject getInstrumentList addError');

    InitiativeApiMocked.getIban = async (_iban: string): Promise<IbanDTO> =>
      await Promise.reject('test reject getIban addError');

    renderWithContext(
      <UserDetailsSummary
        id={'id2132121iniziativa'}
        cf={'fakecf12212'}
        statusOnb={OnboardingStatusEnum.ONBOARDING_OK}
        holderBank={'bank name'}
        setHolderBank={function (value: React.SetStateAction<string | undefined>): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
  });
});
