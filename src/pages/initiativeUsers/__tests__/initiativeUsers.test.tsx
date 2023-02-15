import { fireEvent, screen, waitFor } from '@testing-library/react';
import { isDate, parse } from 'date-fns';
import React from 'react';
import { date } from 'yup';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { mockedInitiative } from '../../../model/__tests__/Initiative.test';
import { setInitiative } from '../../../redux/slices/initiativeSlice';
import { store } from '../../../redux/store';
import { renderWithHistoryAndStore, renderWithProviders } from '../../../utils/test-utils';
import { mockLocationFunction } from '../../initiativeOverview/__tests__/initiativeOverview.test';
import InitiativeUsers from '../initiativeUsers';

jest.mock('react-router-dom', () => mockLocationFunction());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

beforeEach(() => {
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
    href: 'http://localhost:3000/portale-enti/utenti-iniziativa/23232333',
    origin: 'http://localhost:3000/portale-enti',
    pathname: '/portale-enti/utenti-iniziativa/23232333',
    search: '',
    assign: () => {},
    reload: () => {},
    replace: () => {},
  };
});

describe('<InitiativeUsers />', () => {
  test('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  test('Test of breadcrumbs/searchUser and onChange of searchUser', async () => {
    store.dispatch(setInitiative(mockedInitiative));
    renderWithProviders(<InitiativeUsers />);

    //BUTTONS TEST

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    const filterBtn = screen.getByTestId('apply-filters-test') as HTMLButtonElement;
    fireEvent.click(filterBtn);

    //TEXTFIELD TEST

    const searchUser = screen.getByLabelText(
      'pages.initiativeUsers.form.search'
    ) as HTMLInputElement;

    fireEvent.change(searchUser, { target: { value: 'searchUser' } });
    expect(searchUser.value).toBe('searchUser');

    expect(searchUser).toBeInTheDocument();

    //SELECT TEST

    const filterStatus = screen.getByTestId('filterStatus-select') as HTMLSelectElement;

    fireEvent.click(filterStatus);

    fireEvent.change(filterStatus, {
      target: { value: 'ON_EVALUATION' },
    });

    expect(filterStatus).toBeInTheDocument();

    //DATEPICKERS TEST

    const searchFrom = screen.getByLabelText(/pages.initiativeUsers.form.from/);
    const searchTo = screen.getByLabelText(/pages.initiativeUsers.form.to/);

    function parseDateString(_value: any, originalValue: string) {
      return isDate(originalValue) ? originalValue : parse(originalValue, 'dd-MM-yyyy', new Date());
    }

    function isValidDate(date: any): date is Date {
      return date instanceof Date && !isNaN(date.getTime());
    }

    const d = date().transform(parseDateString);

    // Checking if invalid cast return invalid date
    expect(isValidDate(d.cast(null, { assert: false }))).toBe(false);
    expect(isValidDate(d.cast('', { assert: false }))).toBe(false);

    // Casting
    expect(d.cast(new Date())).toBeInstanceOf(Date);

    fireEvent.click(searchFrom);
    fireEvent.change(searchFrom, { target: { value: '12/12/2022' } });

    expect(
      d
        .cast('12-12-2022')
        ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
    ).toBe('12/12/2022');

    fireEvent.click(searchTo);
    fireEvent.change(searchTo, { target: { value: '12/12/2022' } });

    expect(
      d
        .cast('12-12-2022')
        ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
    ).toBe('12/12/2022');
  });

  test('Reset Form on Click Annulla filtri and test click beneficiaryBtn', async () => {
    renderWithHistoryAndStore(<InitiativeUsers />);

    const searchUser = screen.getByLabelText(
      'pages.initiativeUsers.form.search'
    ) as HTMLInputElement;

    fireEvent.change(searchUser, { target: { value: 'searchUser' } });
    expect(searchUser.value).toBe('searchUser');

    const annullaFiltriBtn = screen.getByText(
      'pages.initiativeUsers.form.resetFiltersBtn'
    ) as HTMLButtonElement;

    fireEvent.click(annullaFiltriBtn);

    await waitFor(() => expect(searchUser.value).toEqual(''));

    // click beneficiaryBtn
    const beneficiaryBtn = (await screen.findByTestId('beneficiary-test')) as HTMLButtonElement;
    fireEvent.click(beneficiaryBtn);
  });

  test('render with different Onboarding user Status', async () => {
    const onbUserStatusArr = [
      'INVITED',
      'ACCEPTED_TC',
      'ON_EVALUATION',
      'ONBOARDING_OK',
      'ONBOARDING_KO',
      'ELIGIBLE_KO',
      'ELIGIBLE_KO',
      'INACTIVE',
      'UNSUBSCRIBED',
    ];
    onbUserStatusArr.forEach((item) => {
      (InitiativeApiMocked.getOnboardingStatus = async (): Promise<any> =>
        new Promise((resolve) =>
          resolve({
            content: [
              {
                beneficiary: 'string',
                beneficiaryState: item,
                updateStatusDate: new Date(),
              },
            ],
            pageNo: 0,
            pageSize: 0,
            totalElements: 0,
            totalPages: 0,
          })
        )),
        renderWithHistoryAndStore(<InitiativeUsers />);
    });
  });

  test('test catch case of onboarding api call', () => {
    InitiativeApiMocked.getOnboardingStatus = async (): Promise<any> => Promise.reject('reason');
    renderWithHistoryAndStore(<InitiativeUsers />);
  });
});
