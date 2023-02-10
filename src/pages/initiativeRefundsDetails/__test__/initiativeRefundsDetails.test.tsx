/* eslint-disable functional/immutable-data */
import { cleanup, fireEvent, screen } from '@testing-library/react';
import ROUTES from '../../../routes';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import InitiativeRefundsDetails from '../initiativeRefundsDetails';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  // @ts-expect-error need for matchPath to work
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {
    ancestorOrigins: ['string'] as unknown as DOMStringList,
    hash: 'hash',
    host: 'localhost',
    port: '3000',
    protocol: 'http:',
    hostname: 'localhost:3000/portale-enti',
    href: 'http://localhost:3000/portale-enti/dettaglio-rimborsi-iniziativa/111111/222222/333333',
    origin: 'http://localhost:3000/portale-enti',
    pathname: ROUTES.INITIATIVE_REFUNDS_DETAIL,
    search: '',
    assign: () => {},
    reload: () => {},
    replace: () => {},
  };
});

afterEach(() => cleanup);

describe('test suite for refund details', () => {
  test('test render of component InitiativeRefundsDetails ', async () => {
    const { history } = renderWithHistoryAndStore(<InitiativeRefundsDetails />);

    // on click of back location changes
    const oldLocPathname = history.location.pathname;

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    expect(oldLocPathname !== history.location.pathname).toBeTruthy();
  });

  test('on click of download file', () => {
    renderWithHistoryAndStore(<InitiativeRefundsDetails />);

    // download of file
    const downloadCsvBtn = screen.getByText(
      'pages.initiativeRefundsDetails.downloadBtn'
    ) as HTMLButtonElement;

    fireEvent.click(downloadCsvBtn);
  });

  test('test open modal and close modal', async () => {
    renderWithHistoryAndStore(<InitiativeRefundsDetails />);

    // click on arrow icon to open modal
    const openModalArrowBtn = (await screen.findAllByTestId(
      'open-modal-refunds-arrow'
    )) as Array<HTMLButtonElement>;

    fireEvent.click(openModalArrowBtn[0]);

    const modalTitle = await screen.findByText('pages.initiativeRefundsDetails.modal.title');

    expect(modalTitle).toBeInTheDocument();

    // click on x icon to close modal
    const closeModalXBTn = (await screen.findByTestId('close-modal-test')) as HTMLButtonElement;

    fireEvent.click(closeModalXBTn);
  });
});
