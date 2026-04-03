import { cleanup, fireEvent, screen } from '@testing-library/react';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { IbanDTO } from '../../../api/generated/initiative/IbanDTO';
import { InitiativeRewardTypeEnum } from '../../../api/generated/initiative/InitiativeDTO';
import {
  OnboardingStatusDTO,
  StatusEnum as OnboardingStatusEnum,
} from '../../../api/generated/initiative/OnboardingStatusDTO';
import { WalletDTO } from '../../../api/generated/initiative/WalletDTO';
import { setInitiativeRewardType } from '../../../redux/slices/initiativeSlice';
import { store } from '../../../redux/store';
import { BASE_ROUTE } from '../../../routes';
import { mockedIbanInfo, mockedWallet } from '../../../services/__mocks__/intitativeService';
import { renderWithContext } from '../../../utils/test-utils';
import InitiativeUserDetails from '../initiativeUserDetails';

jest.mock('../../../services/intitativeService');

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

const oldWindowLocation = global.window.location;
const mockedLocation = {
  assign: jest.fn(),
  pathname: `${BASE_ROUTE}/dettagli-utente/2333333/55fiscal`,
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

afterEach(cleanup);

const buildInstrumentOperation = (
  operationId: string,
  operationType: 'ADD_INSTRUMENT' | 'DELETE_INSTRUMENT',
  maskedPan: string
) => ({
  operationId,
  operationType,
  operationDate: '2026-03-01T10:00:00.000Z',
  amountCents: 100,
  accruedCents: 10,
  maskedPan,
});

const buildTransactionOperation = (operationId: string, status: string) => ({
  operationId,
  operationType: 'TRANSACTION',
  operationDate: '2026-03-01T10:00:00.000Z',
  amountCents: 345,
  accruedCents: 10,
  brand: 'brandName',
  iban: '',
  channel: 'App IO',
  idTrxAcquirer: '349589304999',
  idTrxIssuer: '0001923192038',
  businessName: 'FakeBusinessName',
  status,
});

const openFilterEventSelect = () => {
  fireEvent.mouseDown(screen.getByRole('combobox'));
};

describe('test suite initiative user details', () => {
  window.scrollTo = jest.fn();

  test('test of render InitiativeUserDetails and filter button', async () => {
    const { history } = renderWithContext(<InitiativeUserDetails />);

    // on click of back btn location has changed
    const oldLocPathname = history.location.pathname;
    const breadcrumbsBackBtn = screen.getByText('breadcrumbs.back') as HTMLButtonElement;
    fireEvent.click(breadcrumbsBackBtn);
    expect(oldLocPathname !== history.location.pathname).toBeTruthy();

    // test the select to filter events
    const eventsFilterSelect = screen.getByTestId('filterEvent-select');
    fireEvent.change(eventsFilterSelect, { target: { value: 'ONBOARDING' } });
    expect(eventsFilterSelect).toBeInTheDocument();

    // test sumbit filter btn
    const filterBtn = screen.getByText('pages.initiativeUsers.form.filterBtn') as HTMLButtonElement;
    fireEvent.click(filterBtn);
  });

  test('Test of reset filter button', async () => {
    InitiativeApiMocked.getBeneficiaryOnboardingStatus('id', 'fiscal');
    renderWithContext(<InitiativeUserDetails />);

    // test the select to filter events
    const eventsFilterSelect = screen.getByTestId('filterEvent-select');
    fireEvent.change(eventsFilterSelect, { target: { value: 'ONBOARDING' } });
    expect(eventsFilterSelect).toBeInTheDocument();

    // test reset form btn
    const resetFilterBtn = (await screen.findByText(
      'pages.initiativeUsers.form.resetFiltersBtn'
    )) as HTMLButtonElement;
    fireEvent.click(resetFilterBtn);
  });

  test('test of getTimeLine with list empty', async () => {
    const mockedTimeLine = {
      lastUpdate: new Date('2023-01-05T10:22:28.012Z'),
      operationList: [],
      pageNo: 0,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
    };
    InitiativeApiMocked.getTimeLine = async (
      _cf: string,
      _id: string,
      _opeType?: string,
      _dateFrom?: string,
      _dateTo?: string,
      _page?: number,
      _size?: number
    ): Promise<any> => new Promise((resolve) => resolve(mockedTimeLine));

    renderWithContext(<InitiativeUserDetails />);
  });

  test('test of getTimeLine with wrong data', async () => {
    const mockedTimeLine = {
      lastUpdate: new Date('2023-01-05T10:22:28.012Z'),
      operationList: [],
    };
    InitiativeApiMocked.getTimeLine = async (
      _cf: string,
      _id: string,
      _opeType?: string,
      _dateFrom?: string,
      _dateTo?: string,
      _page?: number,
      _size?: number
    ): Promise<any> => new Promise((resolve) => resolve(mockedTimeLine));

    renderWithContext(<InitiativeUserDetails />);
  });

  test('test of render TransactionDetailModal with different type of opeType', async () => {
    store.dispatch(setInitiativeRewardType(InitiativeRewardTypeEnum.REFUND));
    const operationTypes = [
      'ADD_IBAN',
      'ADD_INSTRUMENT',
      'DELETE_INSTRUMENT',
      'ONBOARDING',
      'PAID_REFUND',
      'REJECTED_ADD_INSTRUMENT',
      'REJECTED_DELETE_INSTRUMENT',
      'DELETE_INSTRUMENT_KO',
      'REJECTED_REFUND',
      'REVERSAL',
      'TRANSACTION',
      'SUSPENDED',
      'READMITTED',
      'UNSUBSCRIBED',
      undefined,
    ];
    const fullTimeline: any = [];
    operationTypes.forEach((operation) => {
      fullTimeline.push({
        operationId: `op-${operation ?? 'unknown'}`,
        operationType: operation,
        operationDate: '2023-02-05T10:22:28.012Z',
        maskedPan: '1234123412341234',
        amount: 345,
        accrued: 10,
        circuitType: 'circuito',
        iban: '',
        channel: 'App IO',
        brandLogo: '',
        idTrxAcquirer: '349589304999',
        idTrxIssuer: '0001923192038',
        ...(operation === 'PAID_REFUND' ? { eventId: 'paid-refund-event' } : {}),
        ...(operation === 'REJECTED_REFUND' ? { eventId: 'rejected-refund-event' } : {}),
      });
    });

    InitiativeApiMocked.getTimeLine = async (
      _cf: string,
      _id: string,
      _opeType?: string,
      _dateFrom?: string,
      _dateTo?: string,
      _page?: number,
      _size?: number
    ): Promise<any> =>
      new Promise((resolve) =>
        resolve({
          lastUpdate: new Date('2023-01-05T10:22:28.012Z'),
          operationList: fullTimeline,
          pageNo: 0,
          pageSize: 10,
          totalElements: 11,
          totalPages: 2,
        })
      );

    renderWithContext(<InitiativeUserDetails />, store);
    const operationTypeButtons = (await screen.findAllByTestId(
      'operationTypeBtn'
    )) as HTMLButtonElement[];

    fireEvent.click(operationTypeButtons[0]);
    expect(screen.getByTestId('transaction-detail-modal')).toBeInTheDocument();

    fireEvent.click(operationTypeButtons[4]);
    expect(screen.getByTestId('initiative-refund-detail-modal')).toBeInTheDocument();

    fireEvent.click(operationTypeButtons[8]);
    expect(screen.getByTestId('initiative-refund-detail-modal')).toBeInTheDocument();
  });

  test('initative with discount, transaction in status AUTHORIZED on click of timeline event ', async () => {
    store.dispatch(setInitiativeRewardType(InitiativeRewardTypeEnum.DISCOUNT));
    InitiativeApiMocked.getTimeLine = async (
      _cf: string,
      _id: string,
      _opeType?: string,
      _dateFrom?: string,
      _dateTo?: string,
      _page?: number,
      _size?: number
    ): Promise<any> =>
      new Promise((resolve) =>
        resolve({
          lastUpdate: new Date('2023-01-05T10:22:28.012Z'),
          operationList: [
            buildTransactionOperation('op-transaction-authorized', 'AUTHORIZED'),
            buildTransactionOperation('op-transaction-rewarded', 'REWARDED'),
            buildTransactionOperation('op-transaction-cancelled', 'CANCELLED'),
            buildTransactionOperation('op-transaction-unknown', 'PENDING'),
          ],
          pageNo: 0,
          pageSize: 10,
          totalElements: 4,
          totalPages: 1,
        })
      );
    renderWithContext(<InitiativeUserDetails />, store);
    const transactionButtons = (await screen.findAllByTestId(
      'operationTypeBtn'
    )) as HTMLButtonElement[];

    expect(transactionButtons[0]).toHaveTextContent(
      'pages.initiativeUserDetails.operationTypes.payment'
    );
    expect(transactionButtons[1]).toHaveTextContent(
      'pages.initiativeUserDetails.operationTypes.payment'
    );
    expect(transactionButtons[2]).toHaveTextContent(
      'pages.initiativeUserDetails.operationTypes.paymentCancelled'
    );
    expect(transactionButtons[3]).toHaveTextContent(/^\s*$/);

    store.dispatch(setInitiativeRewardType(InitiativeRewardTypeEnum.REFUND));
  });

  test('test getIban ', () => {
    (InitiativeApiMocked.getIban = async (_iban: string): Promise<IbanDTO> =>
      new Promise((resolve) => resolve(mockedIbanInfo))),
      renderWithContext(<InitiativeUserDetails />);
  });

  test('testgetWalletDetails ', () => {
    InitiativeApiMocked.getWalletDetail = async (_id: string, _cf: string): Promise<WalletDTO> =>
      new Promise((resolve) => resolve(mockedWallet));
    renderWithContext(<InitiativeUserDetails />);
  });

  test('SUSPEND user when  getBeneficiaryOnboardingStatus api call with status OnboardingStatusEnum.ONBOARDING_OK', async () => {
    InitiativeApiMocked.getBeneficiaryOnboardingStatus('id', 'fiscal');
    renderWithContext(<InitiativeUserDetails />);
    const suspendUserBtn = await screen.findByText('pages.initiativeUserDetails.suspendUser');

    fireEvent.click(suspendUserBtn);
  });

  test('READMIT user when  getBeneficiaryOnboardingStatus api call with status OnboardingStatusEnum.SUSPENDED', async () => {
    InitiativeApiMocked.getBeneficiaryOnboardingStatus = async (
      _initiativeId: string,
      _fiscalCode: string
    ): Promise<OnboardingStatusDTO> =>
      new Promise((resolve) =>
        resolve({
          status: OnboardingStatusEnum.SUSPENDED,
          statusDate: new Date(),
        })
      );
    renderWithContext(<InitiativeUserDetails />);
    const readmitUserBtn = await screen.findByText('pages.initiativeUserDetails.readmit');

    fireEvent.click(readmitUserBtn);
  });

  test('test catch case of getIban api call', () => {
    InitiativeApiMocked.getIban = async (): Promise<IbanDTO> =>
      Promise.reject('catch case of getIban');
    renderWithContext(<InitiativeUserDetails />);
  });

  test('test catch case of getWalletDetail api call', () => {
    InitiativeApiMocked.getWalletDetail = async (): Promise<any> => Promise.reject('reason');
    renderWithContext(<InitiativeUserDetails />);
  });

  test('test catch case of getInstrumentList api call', () => {
    InitiativeApiMocked.getInstrumentList = async (): Promise<any> => Promise.reject('reason');
    renderWithContext(<InitiativeUserDetails />);
  });

  test('test catch case of getTimeLine api call', () => {
    InitiativeApiMocked.getTimeLine = async (): Promise<any> => Promise.reject('reason');
    renderWithContext(<InitiativeUserDetails />);
  });

  test('test catch case of getBeneficiaryOnboardingStatus api call', () => {
    InitiativeApiMocked.getBeneficiaryOnboardingStatus = async (): Promise<any> =>
      Promise.reject('reason');
    renderWithContext(<InitiativeUserDetails />);
  });

  test('renders non clickable timeline events and suspended actions', async () => {
    InitiativeApiMocked.getBeneficiaryOnboardingStatus = async (): Promise<OnboardingStatusDTO> =>
      Promise.resolve({
        status: OnboardingStatusEnum.SUSPENDED,
        statusDate: new Date(),
      });

    InitiativeApiMocked.getTimeLine = async (): Promise<any> =>
      Promise.resolve({
        lastUpdate: new Date('2023-01-05T10:22:28.012Z'),
        operationList: [
          {
            operationId: 'op-1',
            operationType: 'READMITTED',
            operationDate: '2023-02-05T10:22:28.012Z',
            amountCents: 10,
            accruedCents: 5,
          },
          {
            operationId: 'op-2',
            operationType: 'UNSUBSCRIBED',
            operationDate: '2023-02-05T10:22:28.012Z',
            amountCents: 10,
            accruedCents: 5,
          },
        ],
        pageNo: 0,
        pageSize: 10,
        totalElements: 2,
        totalPages: 1,
      });

    renderWithContext(<InitiativeUserDetails />);

    expect(await screen.findByText('pages.initiativeUserDetails.operationTypes.readmitted')).toBeInTheDocument();
    expect(screen.getByText('pages.initiativeUserDetails.operationTypes.unsubscribed')).toBeInTheDocument();
    expect(screen.getByTestId('exclude-forever')).toBeDisabled();
    expect(screen.queryByTestId('operationTypeBtn')).not.toBeInTheDocument();
  });

  test('apply timeline filters with dates and event', async () => {
    InitiativeApiMocked.getBeneficiaryOnboardingStatus = async (): Promise<OnboardingStatusDTO> =>
      Promise.resolve({
        status: OnboardingStatusEnum.ONBOARDING_OK,
        statusDate: new Date(),
      });

    renderWithContext(<InitiativeUserDetails />);

    fireEvent.change(screen.getByTestId('filterEvent-select'), {
      target: { value: 'ONBOARDING' },
    });
    fireEvent.change(screen.getByLabelText(/pages.initiativeUsers.form.from/), {
      target: { value: '01/02/2025' },
    });
    fireEvent.change(screen.getByLabelText(/pages.initiativeUsers.form.to/), {
      target: { value: '20/02/2025' },
    });
    fireEvent.click(screen.getByTestId('apply-filters-test'));
  });

  test('shows refund and discount filter options and instrument labels per reward type', async () => {
    store.dispatch(setInitiativeRewardType(InitiativeRewardTypeEnum.REFUND));
    InitiativeApiMocked.getBeneficiaryOnboardingStatus = async (): Promise<OnboardingStatusDTO> =>
      Promise.resolve({
        status: OnboardingStatusEnum.ONBOARDING_OK,
        statusDate: new Date(),
      });
    InitiativeApiMocked.getTimeLine = async (): Promise<any> =>
      Promise.resolve({
        lastUpdate: new Date('2026-03-01T10:00:00.000Z'),
        operationList: [
          buildInstrumentOperation('op-add-instrument', 'ADD_INSTRUMENT', '5678'),
          buildInstrumentOperation('op-delete-instrument', 'DELETE_INSTRUMENT', '9876'),
        ],
        pageNo: 0,
        pageSize: 10,
        totalElements: 2,
        totalPages: 1,
      });

    renderWithContext(<InitiativeUserDetails />, store);

    openFilterEventSelect();
    expect(await screen.findByText('pages.initiativeUserDetails.operationTypes.paidRefund')).toBeInTheDocument();
    expect(screen.getByText('pages.initiativeUserDetails.operationTypes.reversal')).toBeInTheDocument();
    expect(
      screen.queryByText('pages.initiativeUserDetails.operationTypes.discountAuthorized')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('pages.initiativeUserDetails.operationTypes.discountCancelled')
    ).not.toBeInTheDocument();

    const refundButtons = (await screen.findAllByTestId('operationTypeBtn')) as HTMLButtonElement[];
    expect(refundButtons[0]).toHaveTextContent(
      'pages.initiativeUserDetails.operationTypes.addInstrument'
    );
    expect(refundButtons[0]).toHaveTextContent('**** 5678');
    expect(refundButtons[1]).toHaveTextContent(
      'pages.initiativeUserDetails.operationTypes.deleteInstrument'
    );
    expect(refundButtons[1]).toHaveTextContent('**** 9876');

    cleanup();

    store.dispatch(setInitiativeRewardType(InitiativeRewardTypeEnum.DISCOUNT));
    InitiativeApiMocked.getTimeLine = async (): Promise<any> =>
      Promise.resolve({
        lastUpdate: new Date('2026-03-01T10:00:00.000Z'),
        operationList: [
          buildInstrumentOperation('op-add-instrument', 'ADD_INSTRUMENT', '5678'),
          buildInstrumentOperation('op-delete-instrument', 'DELETE_INSTRUMENT', '9876'),
        ],
        pageNo: 0,
        pageSize: 10,
        totalElements: 2,
        totalPages: 1,
      });

    renderWithContext(<InitiativeUserDetails />, store);

    openFilterEventSelect();
    expect(
      await screen.findByText('pages.initiativeUserDetails.operationTypes.discountAuthorized')
    ).toBeInTheDocument();
    expect(
      screen.getByText('pages.initiativeUserDetails.operationTypes.discountCancelled')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('pages.initiativeUserDetails.operationTypes.paidRefund')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('pages.initiativeUserDetails.operationTypes.reversal')
    ).not.toBeInTheDocument();

    const discountButtons = (await screen.findAllByTestId('operationTypeBtn')) as HTMLButtonElement[];
    expect(discountButtons[0]).toHaveTextContent(
      'pages.initiativeUserDetails.operationTypes.addInstrument'
    );
    expect(discountButtons[0]).not.toHaveTextContent('**** 5678');
    expect(discountButtons[1]).toHaveTextContent(
      'pages.initiativeUserDetails.operationTypes.deleteInstrument'
    );
    expect(discountButtons[1]).not.toHaveTextContent('**** 9876');

    store.dispatch(setInitiativeRewardType(InitiativeRewardTypeEnum.REFUND));
  });

  test('renders unknown operation types with an empty label fallback', async () => {
    InitiativeApiMocked.getBeneficiaryOnboardingStatus = async (): Promise<OnboardingStatusDTO> =>
      Promise.resolve({
        status: OnboardingStatusEnum.ONBOARDING_OK,
        statusDate: new Date(),
      });
    InitiativeApiMocked.getTimeLine = async (): Promise<any> =>
      Promise.resolve({
        lastUpdate: new Date('2026-03-01T10:00:00.000Z'),
        operationList: [
          {
            operationId: 'op-unknown',
            operationType: 'SOME_NEW_OPERATION',
            operationDate: '2026-03-01T10:00:00.000Z',
            amountCents: 0,
            accruedCents: 0,
          },
        ],
        pageNo: 0,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1,
      });

    renderWithContext(<InitiativeUserDetails />, store);

    const [unknownOperationButton] = await screen.findAllByTestId('operationTypeBtn');
    expect(unknownOperationButton).toHaveTextContent(/^\s*$/);
  });

  test('does not open refund details when refund operations miss the event id', async () => {
    store.dispatch(setInitiativeRewardType(InitiativeRewardTypeEnum.REFUND));
    InitiativeApiMocked.getBeneficiaryOnboardingStatus = async (): Promise<OnboardingStatusDTO> =>
      Promise.resolve({
        status: OnboardingStatusEnum.ONBOARDING_OK,
        statusDate: new Date(),
      });
    InitiativeApiMocked.getTimeLine = async (): Promise<any> =>
      Promise.resolve({
        lastUpdate: new Date('2026-03-01T10:00:00.000Z'),
        operationList: [
          {
            operationId: 'op-paid-no-event',
            operationType: 'PAID_REFUND',
            operationDate: '2026-03-01T10:00:00.000Z',
            amountCents: 200,
            accruedCents: 20,
          },
          {
            operationId: 'op-rejected-no-event',
            operationType: 'REJECTED_REFUND',
            operationDate: '2026-03-01T10:00:00.000Z',
            amountCents: 300,
            accruedCents: 30,
          },
        ],
        pageNo: 0,
        pageSize: 10,
        totalElements: 2,
        totalPages: 1,
      });

    renderWithContext(<InitiativeUserDetails />, store);

    const operationButtons = (await screen.findAllByTestId('operationTypeBtn')) as HTMLButtonElement[];
    fireEvent.click(operationButtons[0]);
    fireEvent.click(operationButtons[1]);

    expect(screen.queryByTestId('initiative-refund-detail-modal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('transaction-detail-modal')).not.toBeInTheDocument();
  });

  test('skips timeline fetch when onboarding status is not allowed and keeps filters inert', async () => {
    store.dispatch(setInitiativeRewardType(InitiativeRewardTypeEnum.REFUND));
    const getTimeLineSpy = jest.fn(async (): Promise<any> =>
      Promise.resolve({
        lastUpdate: new Date('2026-03-01T10:00:00.000Z'),
        operationList: [],
        pageNo: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      })
    );
    InitiativeApiMocked.getBeneficiaryOnboardingStatus = async (): Promise<OnboardingStatusDTO> =>
      Promise.resolve({
        status: OnboardingStatusEnum.DEMANDED,
        statusDate: new Date(),
      });
    InitiativeApiMocked.getTimeLine = getTimeLineSpy;

    renderWithContext(<InitiativeUserDetails />, store);

    expect(await screen.findByText('pages.initiativeUserDetails.noData')).toBeInTheDocument();
    expect(getTimeLineSpy).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('apply-filters-test'));
    fireEvent.click(screen.getByText('pages.initiativeUsers.form.resetFiltersBtn'));

    expect(getTimeLineSpy).not.toHaveBeenCalled();
  });
});