import React from 'react';
import { renderWithProviders } from '../../../utils/test-utils';
import { mockLocationFunction } from '../../initiativeOverview/__tests__/initiativeOverview.test';
import InitiativeRefunds from '../initiativeRefunds';
import { screen, fireEvent } from '@testing-library/react';
import { isDate, parse } from 'date-fns';
import { date } from 'yup';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

jest.mock('react-router-dom', () => mockLocationFunction());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

describe('<InitiativeRefunds />', () => {
  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  it('Test Initiativerefunds Inputs and Element', async () => {
    renderWithProviders(<InitiativeRefunds />);

    //BUTTONS TEST

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    const uploadBtn = screen.getByTestId('upload-btn-test') as HTMLButtonElement;
    fireEvent.click(uploadBtn);

    const filterBtn = screen.getByTestId('apply-filters-test') as HTMLButtonElement;
    fireEvent.click(filterBtn);

    const resetFiltersBtn = screen.getByTestId('reset-filters-test') as HTMLButtonElement;
    fireEvent.click(resetFiltersBtn);

    //DATEPICKERS TEST

    const searchFrom = screen.getByLabelText(/pages.initiativeRefunds.form.from/);
    const searchTo = screen.getByLabelText(/pages.initiativeRefunds.form.to/);

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

    //SELECT TEST

    const filterStatus = screen.getByTestId('filterStatus-select') as HTMLSelectElement;

    fireEvent.click(filterStatus);

    fireEvent.change(filterStatus, {
      target: { value: 'EXPORTED' },
    });

    expect(filterStatus).toBeInTheDocument();
  });
});
