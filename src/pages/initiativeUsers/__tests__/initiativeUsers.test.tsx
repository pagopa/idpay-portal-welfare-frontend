import { fireEvent, screen } from '@testing-library/react';
import { isDate, parse } from 'date-fns';
import React from 'react';
import { date } from 'yup';
import { renderWithProviders } from '../../../utils/test-utils';
import { mockLocationFunction } from '../../initiativeOverview/__tests__/initiativeOverview.test';
import InitiativeUsers from '../initiativeUsers';

jest.mock('react-router-dom', () => mockLocationFunction());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

describe('<InitiativeUsers />', () => {
  test('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  test('Test of breadcrumbs/searchUser and onChange of searchUser', async () => {
    renderWithProviders(<InitiativeUsers />);

    //BUTTONS TEST

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    const filterBtn = screen.getByTestId('apply-filters-test') as HTMLButtonElement;
    fireEvent.click(filterBtn);

    //TEXTFIELD TEST

    const searchUser = screen
      .getByTestId('searchUser-test')
      .querySelector('input') as HTMLInputElement;

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
});
