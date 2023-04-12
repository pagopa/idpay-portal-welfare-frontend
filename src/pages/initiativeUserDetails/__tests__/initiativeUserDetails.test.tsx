import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { IbanDTO } from '../../../api/generated/initiative/IbanDTO';
import {
  OnboardingStatusDTO,
  StatusEnum as OnboardingStatusEnum,
} from '../../../api/generated/initiative/OnboardingStatusDTO';
import { WalletDTO } from '../../../api/generated/initiative/WalletDTO';
import { BASE_ROUTE } from '../../../routes';
import { mockedIbanInfo, mockedWallet } from '../../../services/__mocks__/initiativeService';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import InitiativeUserDetails from '../initiativeUserDetails';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  //@ts-expect-error
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {
    ancestorOrigins: ['string'] as unknown as DOMStringList,
    hash: 'hash',
    host: 'localhost',
    port: '3000',
    protocol: 'http:',
    hostname: 'localhost:3000/portale-enti',
    href: 'http://localhost:3000/portale-enti/dettagli-utente/2333333/55fiscal',
    origin: 'http://localhost:3000/portale-enti',
    pathname: `${BASE_ROUTE}/dettagli-utente/2333333/55fiscal`,
    search: '',
    assign: () => {},
    reload: () => {},
    replace: () => {},
  };
});

afterEach(cleanup);

describe('test suite initiative user details', () => {
  window.scrollTo = jest.fn();

  test('test of render InitiativeUserDetails and filter button', async () => {
    const { history } = renderWithHistoryAndStore(<InitiativeUserDetails />);

    // on click of back btn location has changed
    const oldLocPathname = history.location.pathname;
    const breadcrumbsBackBtn = screen.getByText('breadcrumbs.back') as HTMLButtonElement;
    fireEvent.click(breadcrumbsBackBtn);
    expect(oldLocPathname !== history.location.pathname).toBeTruthy();

    // test the select to filter events
    const eventsFilterSelect = screen.getByTestId('filterEvent-select');
    fireEvent.change(eventsFilterSelect, { target: { value: 'ONBOARDING' } });
    expect(eventsFilterSelect).toBeInTheDocument();

    // test filter of date from
    const fromDatePickerFilter = screen.getByLabelText('pages.initiativeUsers.form.from');
    fireEvent.click(fromDatePickerFilter);
    fireEvent.change(fromDatePickerFilter, {
      target: {
        value: new Date('2023-01-05T10:22:28.012Z'),
      },
    });

    // test filter of date to
    const toDatePickerFilter = screen.getByLabelText('pages.initiativeUsers.form.to');
    fireEvent.click(toDatePickerFilter);
    fireEvent.change(toDatePickerFilter, {
      target: {
        value: new Date('2023-02-05T10:22:28.012Z'),
      },
    });

    // test sumbit filter btn
    const filterBtn = screen.getByText('pages.initiativeUsers.form.filterBtn') as HTMLButtonElement;
    fireEvent.click(filterBtn);
  });

  test('Test of reset filter button', async () => {
    InitiativeApiMocked.getBeneficiaryOnboardingStatus('id', 'fiscal');
    renderWithHistoryAndStore(<InitiativeUserDetails />);

    // test the select to filter events
    const eventsFilterSelect = screen.getByTestId('filterEvent-select');
    fireEvent.change(eventsFilterSelect, { target: { value: 'ONBOARDING' } });
    expect(eventsFilterSelect).toBeInTheDocument();

    // test filter of date from
    const fromDatePickerFilter = screen.getByLabelText('pages.initiativeUsers.form.from');
    fireEvent.click(fromDatePickerFilter);
    fireEvent.change(fromDatePickerFilter, {
      target: {
        value: new Date('2023-01-05T10:22:28.012Z'),
      },
    });

    // test filter of date to
    const toDatePickerFilter = screen.getByLabelText('pages.initiativeUsers.form.to');
    fireEvent.click(toDatePickerFilter);
    fireEvent.change(toDatePickerFilter, {
      target: {
        value: new Date('2023-02-05T10:22:28.012Z'),
      },
    });

    // test reset form btn
    const resetFilterBtn = await screen.findByText(
      'pages.initiativeUsers.form.resetFiltersBtn'
    ) as HTMLButtonElement;
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

    renderWithHistoryAndStore(<InitiativeUserDetails />);
  });
  // try
  test('test of render TransactionDetailModal with different type of opeType', async () => {
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
      undefined,
    ];
    const fullTimeline: any = [];
    operationTypes.forEach((operation) => {
      return fullTimeline.push({
        operationId: '1u1u1u1u1u1u1u',
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

    renderWithHistoryAndStore(<InitiativeUserDetails />);
    const operationTypeButtons = (await screen.findAllByTestId(
      'operationTypeBtn'
    )) as HTMLButtonElement[];

    // click ADD_IBAN
    fireEvent.click(operationTypeButtons[0]);
    // click PAID_REFUND
    fireEvent.click(operationTypeButtons[4]);
    // click REJECTED_REFUND
    fireEvent.click(operationTypeButtons[8]);
  });

  test('test getIban ', () => {
    (InitiativeApiMocked.getIban = async (_iban: string): Promise<IbanDTO> =>
      new Promise((resolve) => resolve(mockedIbanInfo))),
      renderWithHistoryAndStore(<InitiativeUserDetails />);
  });

  test('testgetWalletDetails ', () => {
    InitiativeApiMocked.getWalletDetail = async (_id: string, _cf: string): Promise<WalletDTO> =>
      new Promise((resolve) => resolve(mockedWallet));
    renderWithHistoryAndStore(<InitiativeUserDetails />);
  });

  test('test SUSPEND user when  getBeneficiaryOnboardingStatus api call with status OnboardingStatusEnum.ONBOARDING_OK', async () => {
    InitiativeApiMocked.getBeneficiaryOnboardingStatus('id', 'fiscal');
    renderWithHistoryAndStore(<InitiativeUserDetails />);
    const suspendUserBtn = await screen.findByText('pages.initiativeUserDetails.suspendUser');

    fireEvent.click(suspendUserBtn);
  });

  test('test READMIT user when  getBeneficiaryOnboardingStatus api call with status OnboardingStatusEnum.SUSPENDED', async () => {
    InitiativeApiMocked.getBeneficiaryOnboardingStatus = async (
      _initiativeId: string,
      _fiscalCode: string
    ): Promise<OnboardingStatusDTO> =>
      new Promise((resolve) =>
        resolve({
          status: OnboardingStatusEnum.SUSPENDED,
        })
      );
    renderWithHistoryAndStore(<InitiativeUserDetails />);
    const readmitUserBtn = await screen.findByText('pages.initiativeUserDetails.readmit');

    fireEvent.click(readmitUserBtn);
  });

  test('test catch case of getIban api call', () => {
    InitiativeApiMocked.getIban = async (): Promise<IbanDTO> =>
      Promise.reject('catch case of getIban');
    renderWithHistoryAndStore(<InitiativeUserDetails />);
  });

  test('test catch case of getWalletDetail api call', () => {
    InitiativeApiMocked.getWalletDetail = async (): Promise<any> => Promise.reject('reason');
    renderWithHistoryAndStore(<InitiativeUserDetails />);
  });

  test('test catch case of getInstrumentList api call', () => {
    InitiativeApiMocked.getInstrumentList = async (): Promise<any> => Promise.reject('reason');
    renderWithHistoryAndStore(<InitiativeUserDetails />);
  });

  test('test catch case of getTimeLine api call', () => {
    InitiativeApiMocked.getTimeLine = async (): Promise<any> => Promise.reject('reason');
    renderWithHistoryAndStore(<InitiativeUserDetails />);
  });

  test('test catch case of getBeneficiaryOnboardingStatus api call', () => {
    InitiativeApiMocked.getBeneficiaryOnboardingStatus = async (): Promise<any> =>
      Promise.reject('reason');
    renderWithHistoryAndStore(<InitiativeUserDetails />);
  });
});
