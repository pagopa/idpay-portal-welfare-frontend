import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { IbanDTO } from '../../../api/generated/initiative/IbanDTO';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { MockedOperationType } from '../../../model/Initiative';
import ROUTES, { BASE_ROUTE } from '../../../routes';
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
    href: 'http://localhost:3000/portale-enti/rimborsi-iniziativa/2333333/55fiscal',
    origin: 'http://localhost:3000/portale-enti',
    pathname: ROUTES.INITIATIVE_USER_DETAILS,
    search: '',
    assign: () => {},
    reload: () => {},
    replace: () => {},
  };
});

afterEach(cleanup);

describe('test suite initiative user details', () => {
  test('render of component InitiativeUserDetails', async () => {
    window.scrollTo = jest.fn();

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

    //test reset form btn
    const resetFilterBtn = screen.getByText(
      'pages.initiativeUsers.form.resetFiltersBtn'
    ) as HTMLButtonElement;
    fireEvent.click(resetFilterBtn);

    // test click of operation type
    const operationTypeBtn = (await screen.findAllByTestId(
      'operationTypeBtn'
    )) as HTMLButtonElement[];
    const firstOperationType = operationTypeBtn[0];
    fireEvent.click(firstOperationType);

    // test open statusSnackbar
    // const dowlnloadBtn = screen.getByText(
    //   'pages.initiativeUserDetails.downloadCsvBtn'
    // ) as HTMLButtonElement;
    // fireEvent.click(dowlnloadBtn);
    // expect(screen.getByText('pages.initiativeUserDetails.downloadCsv')).toBeInTheDocument();

    // fireEvent.keyDown(screen.getByText('pages.initiativeUserDetails.downloadCsv'), {
    //   key: 'Escape',
    //   code: 'Escape',
    //   keyCode: 27,
    //   charCode: 27,
    // });
  });

  test('test of render TransactionDetailModal with different type of opeType', () => {
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

    operationTypes.forEach((operation) => {
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
              {
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
              },
            ],
            pageNo: 0,
            pageSize: 10,
            totalElements: 3,
            totalPages: 1,
          })
        );

      renderWithHistoryAndStore(<InitiativeUserDetails />);
    });
  });

  test('test of render TransactionDetailModal with path ONBOARDING_KO', () => {
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
      href: 'http://http://localhost:3000/portale-enti/dettagli-utente/63eca4cc8483022c3e09c487/GMMMRA79L13H703E/ONBOARDING_KO',
      origin: 'http://localhost:3000/portale-enti',
      pathname: `${BASE_ROUTE}/dettagli-utente/63eca4cc8483022c3e09c487/GMMMRA79L13H703E/ONBOARDING_KO`,
      search: '',
      assign: () => {},
      reload: () => {},
      replace: () => {},
    };

    renderWithHistoryAndStore(<InitiativeUserDetails />);
    fireEvent.keyDown(screen.getByTestId('onboarding-ko-snackbar-test'), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
  });

  test('test of render TransactionDetailModal with path ONBOARDING_KO', () => {
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
      href: 'http://http://localhost:3000/portale-enti/dettagli-utente/63eca4cc8483022c3e09c487/GMMMRA79L13H703E/ONBOARDING_KO',
      origin: 'http://localhost:3000/portale-enti',
      pathname: `${BASE_ROUTE}/dettagli-utente/63eca4cc8483022c3e09c487/GMMMRA79L13H703E/ELIGIBLE_KO`,
      search: '',
      assign: () => {},
      reload: () => {},
      replace: () => {},
    };

    renderWithHistoryAndStore(<InitiativeUserDetails />);
    fireEvent.keyDown(screen.getByTestId('eligible-ko-snackbar-test'), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
  });

  test('test catch case of getIban api call', () => {
    InitiativeApiMocked.getIban = async (): Promise<IbanDTO> => Promise.reject('reason');
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
});
