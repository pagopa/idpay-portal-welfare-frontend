import { cleanup, fireEvent, screen } from '@testing-library/react';
import { isDate, parse } from 'date-fns';
import React from 'react';
import { date } from 'yup';
import { PageRewardExportsDTO } from '../../../api/generated/initiative/PageRewardExportsDTO';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import ROUTES from '../../../routes';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
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
    href: 'http://localhost:3000/portale-enti/rimborsi-iniziativa/2333333',
    origin: 'http://localhost:3000/portale-enti',
    pathname: ROUTES.INITIATIVE_REFUNDS,
    search: '',
    assign: () => {},
    reload: () => {},
    replace: () => {},
  };
});

afterEach(cleanup);

describe('<InitiativeRefunds />', (/* injectedHistory?: ReturnType<typeof createMemoryHistory> */) => {
  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  it('Test Initiativerefunds Inputs and Element', async () => {
    const { history } = renderWithHistoryAndStore(<InitiativeRefunds />);

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

  it('test download file refunds button', async () => {
    renderWithHistoryAndStore(<InitiativeRefunds />);
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
      renderWithHistoryAndStore(<InitiativeRefunds />);
  });

  it(' test catch case with promise reject', async () => {
    (InitiativeApiMocked.getExportsPaged = async (): Promise<any> => Promise.reject('reason')),
      renderWithHistoryAndStore(<InitiativeRefunds />);
  });
});
