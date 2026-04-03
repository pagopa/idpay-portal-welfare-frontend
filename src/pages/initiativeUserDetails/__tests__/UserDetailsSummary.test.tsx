import { cleanup, fireEvent, screen } from '@testing-library/react';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { IbanDTO } from '../../../api/generated/initiative/IbanDTO';
import { InitiativeRewardTypeEnum } from '../../../api/generated/initiative/InitiativeDTO';
import { InstrumentListDTO } from '../../../api/generated/initiative/InstrumentListDTO';
import { StatusEnum as OnboardingStatusEnum } from '../../../api/generated/initiative/OnboardingStatusDTO';
import { StatusEnum as WalletStatusEnum, WalletDTO } from '../../../api/generated/initiative/WalletDTO';
import { setInitiativeRewardType } from '../../../redux/slices/initiativeSlice';
import { renderWithContext } from '../../../utils/test-utils';
import UserDetailsSummary from '../components/UserDetailsSummary';

jest.mock('../../../services/intitativeService');

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
  const setHolderBank = jest.fn();

  test('test render of component with UserDetailsSummary status ONBOARDING_OK', async () => {
    renderWithContext(
      <UserDetailsSummary
        id={'id2132121iniziativa'}
        cf={'fakecf12212'}
        statusOnb={OnboardingStatusEnum.ONBOARDING_OK}
        holderBank={'bank name'}
        setHolderBank={setHolderBank}
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
        setHolderBank={setHolderBank}
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
        setHolderBank={setHolderBank}
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
        setHolderBank={setHolderBank}
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
        setHolderBank={setHolderBank}
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
        setHolderBank={setHolderBank}
      />
    );
    store.dispatch(setInitiativeRewardType(InitiativeRewardTypeEnum.DISCOUNT));

    expect(() => screen.getByText('pages.initiativeUserDetails.balanceToBeRefunded')).toThrow(
      'Unable to find an element'
    );
  });

  test('shows refund fallbacks when the wallet is not refundable and payment methods are missing', async () => {
    InitiativeApiMocked.getWalletDetail = async (): Promise<WalletDTO> =>
      Promise.resolve({
        amountCents: 1250,
        accruedCents: 300,
        refundedCents: 150,
        iban: undefined,
        status: WalletStatusEnum.NOT_REFUNDABLE,
        lastCounterUpdate: undefined,
      } as WalletDTO);

    InitiativeApiMocked.getInstrumentList = async (): Promise<InstrumentListDTO> =>
      Promise.resolve({
        instrumentList: [],
      } as InstrumentListDTO);

    const { store } = renderWithContext(
      <UserDetailsSummary
        id={'id2132121iniziativa'}
        cf={'fakecf12212'}
        statusOnb={OnboardingStatusEnum.ONBOARDING_OK}
        holderBank={undefined}
        setHolderBank={setHolderBank}
      />
    );
    store.dispatch(setInitiativeRewardType(InitiativeRewardTypeEnum.REFUND));

    expect(await screen.findByText('pages.initiativeUserDetails.missingIban')).toBeInTheDocument();
    expect(screen.getByText('pages.initiativeUserDetails.missingPaymentMethod')).toBeInTheDocument();
  });

  test('does not show onboarding alerts when the status is undefined', () => {
    renderWithContext(
      <UserDetailsSummary
        id={'id2132121iniziativa'}
        cf={'fakecf12212'}
        statusOnb={undefined}
        holderBank={undefined}
        setHolderBank={setHolderBank}
      />
    );

    expect(screen.queryByTestId('onboarding-ko-snackbar-test')).not.toBeInTheDocument();
    expect(screen.queryByTestId('eligible-ko-snackbar-test')).not.toBeInTheDocument();
    expect(
      screen.queryByText('pages.initiativeUserDetails.onboardingSuspendedDescription')
    ).not.toBeInTheDocument();
  });

  test('test addError of getIban, getInstrumentList, getWalletDetail in case of error response', async () => {
    InitiativeApiMocked.getWalletDetail = async (_id: string, _cf: string): Promise<WalletDTO> =>
      await Promise.reject('test reject getWalletDetail addError');

    InitiativeApiMocked.getInstrumentList = async (
      _id: string,
      _cf: string
    ): Promise<InstrumentListDTO> => await Promise.reject('test reject getInstrumentList addError');

    InitiativeApiMocked.getIban = async (_iban: string): Promise<IbanDTO> =>
      await Promise.reject('test reject getIban addError');

    renderWithContext(
      <UserDetailsSummary
        id={'id2132121iniziativa'}
        cf={'fakecf12212'}
        statusOnb={OnboardingStatusEnum.ONBOARDING_OK}
        holderBank={'bank name'}
        setHolderBank={setHolderBank}
      />
    );
  });
});