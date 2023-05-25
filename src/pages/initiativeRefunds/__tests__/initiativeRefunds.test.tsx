import { cleanup, fireEvent, screen } from '@testing-library/react';
import { isDate, parse } from 'date-fns';
import React from 'react';
import { date } from 'yup';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { PageRewardExportsDTO } from '../../../api/generated/initiative/PageRewardExportsDTO';
import ROUTES from '../../../routes';
import { renderWithContext } from '../../../utils/test-utils';
import InitiativeRefunds from '../initiativeRefunds';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const oldWindowLocation = global.window.location;
const mockedLocation = {
  assign: jest.fn(),
  pathname: ROUTES.INITIATIVE_REFUNDS,
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

describe('<InitiativeRefunds />', (/* injectedHistory?: ReturnType<typeof createMemoryHistory> */) => {
  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  it('Test Initiativerefunds Inputs and Element', async () => {
    const { history } = renderWithContext(<InitiativeRefunds />);

    const oldLocPathname = history.location.pathname;

    // BUTTONS TEST

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    expect(oldLocPathname !== history.location.pathname).toBeTruthy();

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

  it('Test searchFrom and searchTo undefined case', async () => {
    renderWithContext(<InitiativeRefunds />);

    const searchFrom = screen.getByLabelText(/pages.initiativeRefunds.form.from/);
    const searchTo = screen.getByLabelText(/pages.initiativeRefunds.form.to/);

    fireEvent.click(searchFrom);
    fireEvent.change(searchFrom, { target: { value: undefined } });

    fireEvent.click(searchTo);
    fireEvent.change(searchTo, { target: { value: undefined } });

    const filterBtn = screen.getByTestId('apply-filters-test') as HTMLButtonElement;
    fireEvent.click(filterBtn);
  });

  it('test download file refunds button', async () => {
    renderWithContext(<InitiativeRefunds />);
    fireEvent.click(await screen.findByTestId('download-file-refunds'));
  });

  it('test render with response EXPORTED', async () => {
    (InitiativeApiMocked.getExportsPaged = async (): Promise<PageRewardExportsDTO> =>
      new Promise((resolve) =>
        resolve({
          content: [
            {
              feedbackDate: new Date(),
              filePath: 'string',
              id: 'string',
              initiativeId: 'string',
              initiativeName: 'string',
              notificationDate: new Date(),
              organizationId: 'string',
              percentageResulted: 'string',
              percentageResultedOk: 'string',
              percentageResults: 'string',
              rewardsExported: 'string',
              rewardsNotified: 0,
              rewardsResulted: 0,
              rewardsResultedOk: 0,
              rewardsResults: 'string',
              status: 'EXPORTED',
            },
          ],
          totalElements: 0,
          totalPages: 0,
        })
      )),
      renderWithContext(<InitiativeRefunds />);
  });

  test('test else case of getExportsPaged ', () => {
    InitiativeApiMocked.getExportsPaged = async (): Promise<PageRewardExportsDTO> =>
      new Promise((resolve) =>
        resolve({
          content: [],
          totalElements: undefined,
          totalPages: 0,
        })
      );

    renderWithContext(<InitiativeRefunds />);
  });

  test('test getExportsPaged call without initiativeId in the header', () => {
    InitiativeApiMocked.getExportsPaged = async (): Promise<PageRewardExportsDTO> =>
      new Promise((resolve) =>
        resolve({
          content: [
            {
              feedbackDate: new Date(),
              filePath: 'string',
              id: 'string',
              initiativeId: 'string',
              initiativeName: 'string',
              notificationDate: new Date(),
              organizationId: 'string',
              percentageResulted: 'string',
              percentageResultedOk: 'string',
              percentageResults: 'string',
              rewardsExported: 'string',
              rewardsNotified: 0,
              rewardsResulted: 0,
              rewardsResultedOk: 0,
              rewardsResults: 'string',
              status: 'EXPORTED',
            },
          ],
          totalElements: 0,
          totalPages: 0,
        })
      );

    renderWithContext(<InitiativeRefunds />);
  });

  it(' test catch case with promise reject', async () => {
    (InitiativeApiMocked.getExportsPaged = async (): Promise<any> => Promise.reject('reason')),
      renderWithContext(<InitiativeRefunds />);
  });
});
