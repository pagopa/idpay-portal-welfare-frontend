/* eslint-disable functional/immutable-data */
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { ExportListDTO } from '../../../api/generated/initiative/ExportListDTO';
import { SasToken } from '../../../api/generated/initiative/SasToken';
import { BASE_ROUTE } from '../../../routes';
import { mockedInitiativeId } from '../../../services/__mocks__/groupsService';
import { mockedGetRewardFileDownload } from '../../../services/__mocks__/intitativeService';
import * as initiativeService from '../../../services/intitativeService';
import { renderWithContext } from '../../../utils/test-utils';
import InitiativeRefundsDetails from '../initiativeRefundsDetails';
import userEvent from '@testing-library/user-event';

jest.mock('../../../services/intitativeService');

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

afterEach(() => cleanup());

describe('test suite for refund details', () => {
  test('test render of component InitiativeRefundsDetails ', async () => {
    const { history } = renderWithContext(<InitiativeRefundsDetails />);

    // on click of back location changes
    const oldLocPathname = history.location.pathname;

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    expect(oldLocPathname !== history.location.pathname).toBeTruthy();
  });

  test('Render component when user resets filters', async () => {
    renderWithContext(<InitiativeRefundsDetails />);
    const user = userEvent.setup();
    await user.click(screen.getByTestId('reset-filters-test'));
  });

  test('Render component when user filters results', async () => {
    renderWithContext(<InitiativeRefundsDetails />);
    const user = userEvent.setup();
    const filterByUser = screen.getByLabelText(
      'pages.initiativeRefundsDetails.form.cro'
    ) as HTMLInputElement;

    await user.type(filterByUser, 'test');

    await user.click(screen.getByTestId('apply-filters-test'));
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

    const selectByStatus = screen.getByRole('combobox') as HTMLElement;
    fireEvent.mouseDown(selectByStatus);
    fireEvent.click(screen.getByTestId('filterStatusOnboardingOk-test'));

    const filterBtn = screen.getByText(
      'pages.initiativeRefundsDetails.form.filterBtn'
    ) as HTMLButtonElement;

    fireEvent.click(filterBtn);

    const resetFiltersBtn = screen.getByText(
      'pages.initiativeRefundsDetails.form.resetFiltersBtn'
    ) as HTMLButtonElement;

    fireEvent.click(resetFiltersBtn);
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

  test('test getExportRefundsListPaged with wrong response', async () => {
    const mockedRefundsDetailsListItem = {
      content: [],
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

  test('handle download file with non-200 response', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        pathname: `${BASE_ROUTE}/dettaglio-rimborsi-iniziativa/${mockedInitiativeId}/1234567890/filePath`,
      },
    });

    const fetchSpy = jest.spyOn(global, 'fetch' as any).mockResolvedValue({
      status: 500,
      statusText: 'ERR',
    } as Response);

    renderWithContext(<InitiativeRefundsDetails />);
    fireEvent.click(screen.getByTestId('download-btn-test'));

    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    fetchSpy.mockRestore();
  });

  test('open refund details modal from table row', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        pathname: `${BASE_ROUTE}/dettaglio-rimborsi-iniziativa/${mockedInitiativeId}/1234567890/filePath`,
      },
    });

    const exportPagedSpy = jest
      .spyOn(initiativeService, 'getExportRefundsListPaged')
      .mockResolvedValue({
        content: [
          {
            amountCents: 100,
            eventId: 'evt-1',
            iban: 'IT12T1234512345123456789012',
            status: 'COMPLETED_OK',
          },
        ],
        pageNo: 0,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1,
      } as ExportListDTO);

    renderWithContext(<InitiativeRefundsDetails />);

    const openModalArrowBtn = (await screen.findAllByTestId(
      'open-modal-refunds-arrow'
    ))[0] as HTMLButtonElement;
    fireEvent.click(openModalArrowBtn);

    expect(await screen.findByText('pages.initiativeRefundsDetails.modal.title')).toBeInTheDocument();
    exportPagedSpy.mockRestore();
  });

  test('renders summary truthy branches and applies status filter value', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        pathname: `${BASE_ROUTE}/dettaglio-rimborsi-iniziativa/${mockedInitiativeId}/1234567890/filePath`,
      },
    });

    const summarySpy = jest.spyOn(initiativeService, 'getExportSummary').mockResolvedValue({
      createDate: new Date('2026-03-30T10:00:00.000Z'),
      totalAmountCents: 10000,
      totalRefundedAmountCents: 8000,
      totalRefunds: 3,
      successPercentage: 75,
      status: 'COMPLETE',
    } as any);

    const pagedSpy = jest
      .spyOn(initiativeService, 'getExportRefundsListPaged')
      .mockResolvedValue({
        content: [
          {
            amountCents: 100,
            eventId: 'evt-1',
            iban: 'IT12T1234512345123456789012',
            status: 'COMPLETED_OK',
          },
        ],
        pageNo: 0,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1,
      } as ExportListDTO);

    renderWithContext(<InitiativeRefundsDetails />);

    expect(await screen.findByText('75%')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(document.querySelector('.MuiChip-root')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByTestId('filterStatusOnboardingOk-test'));
    fireEvent.click(screen.getByTestId('apply-filters-test'));

    await waitFor(() => {
      expect(pagedSpy).toHaveBeenCalledWith(
        mockedInitiativeId,
        '1234567890',
        0,
        undefined,
        'COMPLETED_OK'
      );
    });

    summarySpy.mockRestore();
    pagedSpy.mockRestore();
  });

  test('applies filters with empty values using undefined CRO and status', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        pathname: `${BASE_ROUTE}/dettaglio-rimborsi-iniziativa/${mockedInitiativeId}/1234567890/filePath`,
      },
    });

    const pagedSpy = jest
      .spyOn(initiativeService, 'getExportRefundsListPaged')
      .mockResolvedValue({
        content: [],
        pageNo: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      } as ExportListDTO);

    renderWithContext(<InitiativeRefundsDetails />);
    fireEvent.click(await screen.findByTestId('apply-filters-test'));

    await waitFor(() => {
      expect(pagedSpy).toHaveBeenCalledWith(
        mockedInitiativeId,
        '1234567890',
        0,
        undefined,
        undefined
      );
    });

    pagedSpy.mockRestore();
  });
});
