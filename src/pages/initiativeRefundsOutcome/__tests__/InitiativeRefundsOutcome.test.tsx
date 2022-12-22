import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { setInitiativeId } from '../../../redux/slices/initiativeSlice';
import { store } from '../../../redux/store';
import { renderWithProviders } from '../../../utils/test-utils';
import { mockLocationFunction } from '../../initiativeOverview/__tests__/initiativeOverview.test';
import InitiativeRefundsOutcome from '../initiativeRefundsOutcome';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

jest.mock('@pagopa/selfcare-common-frontend', () => ({
  ...jest.requireActual('@pagopa/selfcare-common-frontend/hooks/useLoading'),
  useLoading: () => ({}),
}));

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
    href: 'http://localhost:3000/portale-enti/esiti-rimborsi-iniziativa/3333322',
    origin: 'http://localhost:3000/portale-enti',
    pathname: '/portale-enti/esiti-rimborsi-iniziativa/3333322',
    search: '',
    assign: () => {},
    reload: () => {},
    replace: () => {},
  };
  store.dispatch(setInitiativeId('3333322'));
});

afterEach(cleanup);

describe('<InitiativeRefundsOutcome />', () => {
  test('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  test('Test InitiativeRefundsOutcome should upload with sucess', async () => {
    renderWithProviders(<InitiativeRefundsOutcome />);

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    // window.URL.createObjectURL = jest.fn().mockImplementation(() => 'url');
    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'application/zip', {
      type: 'application/zip',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
    waitFor(() => expect(screen.getByText('application/zip')).toBeInTheDocument());
  });

  test('Test InitiativeRefundsOutcome should fail upload with multiple files', async () => {
    renderWithProviders(<InitiativeRefundsOutcome />);

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'application/zip', {
      type: 'application/zip',
    });
    const file2 = new File(['file'], 'application/zip', {
      type: 'application/zip',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file, file2],
    });
    fireEvent.drop(inputEl);
  });

  test('Test InitiativeRefundsOutcome should fail upload with wrong type', async () => {
    renderWithProviders(<InitiativeRefundsOutcome />);

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'image/png', {
      type: 'image/png',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  test('Test InitiativeRefundsOutcome should fail upload with wrong size', async () => {
    renderWithProviders(<InitiativeRefundsOutcome />);

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'application/zip', {
      type: 'application/zip',
    });

    Object.defineProperty(file, 'size', { value: 193500800 });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);

    const downloadFileBtn = (await waitFor(() =>
      screen.getByTestId('download-file')
    )) as HTMLButtonElement;

    fireEvent.click(downloadFileBtn);

    const fileRejectedAlert = await waitFor(() => {
      return screen.getByText('pages.initiativeRefundsOutcome.uploadPaper.invalidFileTitle');
    });

    expect(fileRejectedAlert).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('CloseIcon'));
  });
});
