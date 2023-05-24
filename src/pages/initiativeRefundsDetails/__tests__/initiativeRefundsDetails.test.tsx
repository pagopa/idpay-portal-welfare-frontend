/* eslint-disable functional/immutable-data */
import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { ExportListDTO } from '../../../api/generated/initiative/ExportListDTO';
import { SasToken } from '../../../api/generated/initiative/SasToken';
import { BASE_ROUTE } from '../../../routes';
import { mockedInitiativeId } from '../../../services/__mocks__/groupService';
import { mockedGetRewardFileDownload } from '../../../services/__mocks__/initiativeService';
import { renderWithContext } from '../../../utils/test-utils';
import InitiativeRefundsDetails from '../initiativeRefundsDetails';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const oldWindowLocation = global.window.location;
const mockedLocation = {
  assign: jest.fn(),
  pathname: `${BASE_ROUTE}/dettaglio-rimborsi-iniziativa/${mockedInitiativeId}/1234567890/filePath`,
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

afterEach(() => cleanup);

describe('test suite for refund details', () => {
  test('test render of component InitiativeRefundsDetails ', async () => {
    const { history } = renderWithContext(<InitiativeRefundsDetails />);

    // on click of back location changes
    const oldLocPathname = history.location.pathname;

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    expect(oldLocPathname !== history.location.pathname).toBeTruthy();
  });

  test('on click of download file', () => {
    InitiativeApiMocked.getRewardFileDownload = async (
      _id: string,
      _filePath: string
    ): Promise<SasToken> => new Promise((resolve) => resolve(mockedGetRewardFileDownload));

    renderWithContext(<InitiativeRefundsDetails />);

    const downloadCsvBtn = screen.getByTestId('download-btn-test') as HTMLButtonElement;
    fireEvent.click(downloadCsvBtn);
  });

  test('test on filters of refund Details', async () => {
    renderWithContext(<InitiativeRefundsDetails />);
    const filterByCro = screen.getByLabelText(
      'pages.initiativeRefundsDetails.form.cro'
    ) as HTMLInputElement;

    fireEvent.change(filterByCro, { target: { value: 'cro' } });

    expect(filterByCro.value).toEqual('cro');

    const selectByStatus = screen.getByPlaceholderText(
      'pages.initiativeRefundsDetails.form.outcome'
    ) as HTMLSelectElement;

    fireEvent.click(selectByStatus);

    fireEvent.change(selectByStatus, { target: { value: 'COMPLETED_OK' } });

    const filterBtn = screen.getByText(
      'pages.initiativeRefundsDetails.form.filterBtn'
    ) as HTMLButtonElement;

    fireEvent.click(filterBtn);

    const resetFiltersBtn = screen.getByText(
      'pages.initiativeRefundsDetails.form.resetFiltersBtn'
    ) as HTMLButtonElement;

    fireEvent.click(resetFiltersBtn);
  });

  test('test open modal and close modal', async () => {
    renderWithContext(<InitiativeRefundsDetails />);

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

  test('test getExportRefundsListPaged with empty response', async () => {
    const mockedRefundsDetailsListItem = {
      content: [],
      pageNo: 0,
      pageSize: 0,
      totalElements: 0,
      totalPages: 0,
    };

    InitiativeApiMocked.getExportRefundsListPaged = async (
      _initiativeId: string,
      _exportId: string,
      _page: number,
      _cro?: string,
      _status?: string
    ): Promise<ExportListDTO> => new Promise((resolve) => resolve(mockedRefundsDetailsListItem));
    renderWithContext(<InitiativeRefundsDetails />);
  });

  test('test catch case of getRewardFileDownload api call', async () => {
    InitiativeApiMocked.getRewardFileDownload = async (): Promise<any> =>
      Promise.reject('mocked error response for tests');

    renderWithContext(<InitiativeRefundsDetails />);
  });

  test('test render component without parameter in the header', async () => {
    let mockedLocationWithoutPathParams = {
      assign: jest.fn(),
      pathname: `${BASE_ROUTE}/dettaglio-rimborsi-iniziativa/`,
      origin: 'MOCKED_ORIGIN',
      search: '',
      hash: '',
    };

    Object.defineProperty(window, 'location', { value: mockedLocationWithoutPathParams });

    renderWithContext(<InitiativeRefundsDetails />);
  });

  test('test addError with reject case for getExportSummary, getExportRefundsListPaged and getRewardFileDownload', async () => {
    InitiativeApiMocked.getRewardFileDownload = async (): Promise<any> =>
      Promise.reject('mocked error response for tests');

    InitiativeApiMocked.getExportSummary = async (): Promise<any> =>
      Promise.reject('mocked error response for tests');

    InitiativeApiMocked.getExportRefundsListPaged = async (): Promise<any> =>
      Promise.reject('mocked error response for tests');
    renderWithContext(<InitiativeRefundsDetails />);
  });
});
