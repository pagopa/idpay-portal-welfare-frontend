import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { MockedOperationType } from '../../../model/Initiative';
import ROUTES from '../../../routes';
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
    fireEvent.change(eventsFilterSelect, { target: { value: MockedOperationType.ONBOARDING } });
    expect(eventsFilterSelect).toBeInTheDocument();

    // test filter of date from
    const fromDatePickerFilter = screen.getByLabelText('pages.initiativeUsers.form.from');
    fireEvent.click(fromDatePickerFilter);
    fireEvent.change(fromDatePickerFilter, {
      target: {
        value: new Date(),
      },
    });

    // test filter of date to
    const toDatePickerFilter = screen.getByLabelText('pages.initiativeUsers.form.to');
    fireEvent.click(toDatePickerFilter);
    fireEvent.change(toDatePickerFilter, {
      target: {
        value: new Date(),
      },
    });

    // test sumbit filter btn  TODO once btn disabled is removed
    // const filterBtn = screen.getByText('pages.initiativeUsers.form.filterBtn') as HTMLButtonElement;

    // test click of operation type
    const operationTypeBtn = (await screen.findAllByTestId(
      'operationTypeBtn'
    )) as HTMLButtonElement[];
    const firstOperationType = operationTypeBtn[0];
    fireEvent.click(firstOperationType);
  });
});
