import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import ReportTableCard from '../ReportTableCard';
import { ReportTypeEnum } from '../../../api/generated/merchants/apiClient';

const tMock = (key: string) => key;
const mockSetLoading = jest.fn();
const mockSetAlert = jest.fn();
const mockGetReportList = jest.fn();
const mockGetDownloadReport = jest.fn();
const mockDownloadCsv = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib', () => ({
  useLoading: () => mockSetLoading,
}));

jest.mock('../../../hooks/useAlert', () => ({
  useAlert: () => ({ setAlert: mockSetAlert }),
}));

jest.mock('../../../services/merchantsService', () => ({
  getReportList: (...args: Array<any>) => mockGetReportList(...args),
  getDownloadReport: (...args: Array<any>) => mockGetDownloadReport(...args),
}));

jest.mock('../../../utils/fileViewer-utils', () => ({
  downloadCsv: (...args: Array<any>) => mockDownloadCsv(...args),
}));

describe('ReportTableCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDownloadCsv.mockResolvedValue(undefined);
  });

  test('renders empty state when no reports are returned', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 0,
      totalPages: 1,
      reports: [],
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    expect(await screen.findByText('pages.initiativeExportReport.exportTable.emptyState')).toBeInTheDocument();
  });

  test('loads the next page when the pagination chevron is clicked', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 12,
      totalPages: 2,
      reports: [
        {
          id: 'report-1',
          fileName: 'report.csv',
          requestDate: '2026-03-20T10:00:00.000Z',
          elaborationDate: '2026-03-20T10:30:00.000Z',
          businessName: 'Esercente test',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L1',
          reportStatus: 'GENERATED',
        },
      ],
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    await screen.findByText('report.csv');

    fireEvent.click(screen.getByTestId('ChevronRightIcon'));

    await waitFor(() => {
      expect(mockGetReportList).toHaveBeenLastCalledWith(
        'initiative-1',
        1,
        10,
        'MERCHANT_TRANSACTIONS'
      );
    });
  });

  test('does not paginate before the first page or past the last page', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 12,
      totalPages: 2,
      reports: [
        {
          id: 'report-1',
          fileName: 'report.csv',
          requestDate: '2026-03-20T10:00:00.000Z',
          elaborationDate: '2026-03-20T10:30:00.000Z',
          businessName: 'Esercente test',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L1',
          reportStatus: 'GENERATED',
        },
      ],
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    await screen.findByText('report.csv');

    fireEvent.click(screen.getByTestId('ChevronLeftIcon'));
    expect(mockGetReportList).not.toHaveBeenCalledWith(
      'initiative-1',
      -1,
      expect.any(Number),
      ReportTypeEnum.MERCHANT_TRANSACTIONS
    );

    fireEvent.click(screen.getByTestId('ChevronRightIcon'));

    await waitFor(() => {
      expect(mockGetReportList).toHaveBeenLastCalledWith(
        'initiative-1',
        1,
        10,
        ReportTypeEnum.MERCHANT_TRANSACTIONS
      );
    });

    fireEvent.click(screen.getByTestId('ChevronRightIcon'));
    expect(mockGetReportList).not.toHaveBeenCalledWith(
      'initiative-1',
      2,
      expect.any(Number),
      ReportTypeEnum.MERCHANT_TRANSACTIONS
    );
  });

  test('resets to the first page when the page size changes', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 30,
      totalPages: 3,
      reports: [
        {
          id: 'report-1',
          fileName: 'report.csv',
          requestDate: '2026-03-20T10:00:00.000Z',
          elaborationDate: '2026-03-20T10:30:00.000Z',
          businessName: 'Esercente test',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L1',
          reportStatus: 'GENERATED',
        },
      ],
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    await screen.findByText('report.csv');

    fireEvent.click(screen.getByTestId('ChevronRightIcon'));

    await waitFor(() => {
      expect(mockGetReportList).toHaveBeenLastCalledWith(
        'initiative-1',
        1,
        10,
        ReportTypeEnum.MERCHANT_TRANSACTIONS
      );
    });

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('25'));

    await waitFor(() => {
      expect(mockGetReportList).toHaveBeenLastCalledWith(
        'initiative-1',
        0,
        25,
        ReportTypeEnum.MERCHANT_TRANSACTIONS
      );
    });
  });

  test('renders report rows, hides failed downloads and only triggers enabled downloads', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 3,
      totalPages: 1,
      reports: [
        {
          id: 'report-2',
          fileName: 'working.csv',
          requestDate: '2026-03-20T09:00:00.000Z',
          elaborationDate: '2026-03-20T09:30:00.000Z',
          businessName: 'Esercente 2',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L2',
          reportStatus: 'INSERTED',
        },
        {
          id: 'report-1',
          fileName: 'report.csv',
          requestDate: '2026-03-20T10:00:00.000Z',
          elaborationDate: '2026-03-20T10:30:00.000Z',
          businessName: 'Esercente test',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L1',
          reportStatus: 'GENERATED',
        },
        {
          id: 'report-3',
          fileName: 'failed.csv',
          requestDate: '2026-03-20T11:00:00.000Z',
          elaborationDate: '2026-03-20T11:30:00.000Z',
          businessName: 'Esercente 3',
          startPeriod: '2026-03-11T00:00:00.000Z',
          endPeriod: '2026-03-20T00:00:00.000Z',
          operatorLevel: 'L3',
          reportStatus: 'FAILED',
        },
      ],
    });
    mockGetDownloadReport.mockResolvedValue({
      reportUrl: 'https://example.blob.core.windows.net/reports/report.csv',
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    expect(await screen.findByText('working.csv')).toBeInTheDocument();
    expect(await screen.findByText('report.csv')).toBeInTheDocument();
    expect(screen.getByText('failed.csv')).toBeInTheDocument();
    expect(screen.getByText('Esercente test')).toBeInTheDocument();

    const workingRow = screen.getByText('working.csv').closest('tr') as HTMLElement;
    const generatedRow = screen.getByText('report.csv').closest('tr') as HTMLElement;
    const failedRow = screen.getByText('failed.csv').closest('tr') as HTMLElement;

    expect(within(workingRow).getByTestId('DownloadIcon')).toBeInTheDocument();
    expect(within(generatedRow).getByTestId('DownloadIcon')).toBeInTheDocument();
    expect(within(failedRow).queryByTestId('DownloadIcon')).not.toBeInTheDocument();

    fireEvent.click(within(workingRow).getByTestId('DownloadIcon'));
    expect(mockGetDownloadReport).not.toHaveBeenCalled();

    fireEvent.click(within(generatedRow).getByTestId('DownloadIcon'));

    await waitFor(() => {
      expect(mockGetDownloadReport).toHaveBeenCalledWith('initiative-1', 'report-1');
      expect(mockDownloadCsv).toHaveBeenCalledWith(
        'https://example.blob.core.windows.net/reports/report.csv',
        'report.csv'
      );
    });
  });

  test('renders the failed status icon and keeps failed rows non-downloadable', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 1,
      totalPages: 1,
      reports: [
        {
          id: 'report-failed',
          fileName: 'failed.csv',
          requestDate: '2026-03-20T11:00:00.000Z',
          elaborationDate: '2026-03-20T11:30:00.000Z',
          businessName: 'Esercente 3',
          startPeriod: '2026-03-11T00:00:00.000Z',
          endPeriod: '2026-03-20T00:00:00.000Z',
          operatorLevel: 'L3',
          reportStatus: 'FAILED',
        },
      ],
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    const failedRow = (await screen.findByText('failed.csv')).closest('tr') as HTMLElement;

    expect(within(failedRow).getByTestId('ErrorIcon')).toBeInTheDocument();
    expect(within(failedRow).queryByTestId('DownloadIcon')).not.toBeInTheDocument();
  });

  test('shows an alert when the download URL is missing', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 1,
      totalPages: 1,
      reports: [
        {
          id: 'report-1',
          fileName: 'fallback.csv',
          requestDate: '2026-03-20T10:00:00.000Z',
          elaborationDate: '2026-03-20T10:30:00.000Z',
          businessName: 'Esercente test',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L1',
          reportStatus: 'GENERATED',
        },
      ],
    });
    mockGetDownloadReport.mockResolvedValue({});

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    fireEvent.click(await screen.findByTestId('DownloadIcon'));

    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith({
        title: 'errors.title',
        text: 'errors.getDataDescription',
        isOpen: true,
        severity: 'error',
      });
      expect(mockDownloadCsv).not.toHaveBeenCalled();
    });
  });

  test('shows an alert when the csv download fails after resolving a valid url', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 1,
      totalPages: 1,
      reports: [
        {
          id: 'report-1',
          fileName: 'fallback.csv',
          requestDate: '2026-03-20T10:00:00.000Z',
          elaborationDate: '2026-03-20T10:30:00.000Z',
          businessName: 'Esercente test',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L1',
          reportStatus: 'GENERATED',
        },
      ],
    });
    mockGetDownloadReport.mockResolvedValue({
      reportUrl: 'https://example.blob.core.windows.net/reports/report.csv',
    });
    mockDownloadCsv.mockRejectedValue(new Error('download failed'));

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    fireEvent.click(await screen.findByTestId('DownloadIcon'));

    await waitFor(() => {
      expect(mockGetDownloadReport).toHaveBeenCalledWith('initiative-1', 'report-1');
      expect(mockDownloadCsv).toHaveBeenCalledWith(
        'https://example.blob.core.windows.net/reports/report.csv',
        'report.csv'
      );
      expect(mockSetAlert).toHaveBeenCalledWith({
        title: 'errors.title',
        text: 'errors.getDataDescription',
        isOpen: true,
        severity: 'error',
      });
    });
  });

  test('downloads using the decoded filename when the azure url is encoded', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 1,
      totalPages: 1,
      reports: [
        {
          id: 'report-1',
          fileName: 'fallback-name.csv',
          requestDate: '2026-03-20T10:00:00.000Z',
          elaborationDate: '2026-03-20T10:30:00.000Z',
          businessName: 'Esercente test',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L1',
          reportStatus: 'GENERATED',
        },
      ],
    });
    mockGetDownloadReport.mockResolvedValue({
      reportUrl: 'https://example.blob.core.windows.net/reports/report%20name.csv',
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    fireEvent.click(await screen.findByTestId('DownloadIcon'));

    await waitFor(() => {
      expect(mockGetDownloadReport).toHaveBeenCalledWith('initiative-1', 'report-1');
      expect(mockDownloadCsv).toHaveBeenCalledWith(
        'https://example.blob.core.windows.net/reports/report%20name.csv',
        'report name.csv'
      );
    });
  });

  test('shows an error alert when the report list request fails', async () => {
    mockGetReportList.mockRejectedValue(new Error('boom'));

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('errors.getDataDescription');
  });

  test('falls back to default values when the report list response is incomplete', async () => {
    mockGetReportList.mockResolvedValue({});

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    expect(await screen.findByText('pages.initiativeExportReport.exportTable.emptyState')).toBeInTheDocument();
  });

  test('normalizes a zero totalPages response to keep pagination stable', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 1,
      totalPages: 0,
      reports: [
        {
          id: 'report-1',
          fileName: 'single.csv',
          requestDate: '2026-03-20T10:00:00.000Z',
          elaborationDate: '2026-03-20T10:30:00.000Z',
          businessName: 'Esercente test',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L1',
          reportStatus: 'GENERATED',
        },
      ],
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    await screen.findByText('single.csv');

    fireEvent.click(screen.getByTestId('ChevronRightIcon'));

    expect(mockGetReportList).not.toHaveBeenCalledWith(
      'initiative-1',
      1,
      expect.any(Number),
      ReportTypeEnum.MERCHANT_TRANSACTIONS
    );
  });

  test('renders in-progress rows and keeps malformed date fields readable', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 1,
      totalPages: 1,
      reports: [
        {
          id: 'report-in-progress',
          fileName: 'pending.csv',
          requestDate: 'not-a-date',
          elaborationDate: null,
          businessName: null,
          startPeriod: null,
          endPeriod: null,
          operatorLevel: null,
          reportStatus: 'IN_PROGRESS',
        },
      ],
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    const row = (await screen.findByText('pending.csv')).closest('tr') as HTMLElement;

    expect(row).toHaveTextContent('pending.csv');
    expect(row).toHaveTextContent('not-a-date');
    expect(within(row).getByTestId('SyncIcon')).toBeInTheDocument();
    expect(within(row).getByTestId('DownloadIcon')).toBeInTheDocument();
  });

  test('renders users mode rows with fallback status, malformed dates, and one-sided periods', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 3,
      totalPages: 1,
      reports: [
        {
          id: 'report-unknown',
          fileName: 'unknown.csv',
          requestDate: null,
          elaborationDate: 'not-a-date',
          businessName: 'Esercente Unknown',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: null,
          operatorLevel: null,
          reportStatus: 'ARCHIVED',
        },
        {
          id: 'report-active',
          fileName: 'active.csv',
          requestDate: '2026-03-20T10:00:00.000Z',
          elaborationDate: null,
          businessName: 'Esercente Active',
          startPeriod: null,
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L1',
          reportStatus: 'IN_PROGRESS',
        },
        {
          id: 'report-failed',
          fileName: 'failed.csv',
          requestDate: '2026-03-20T11:00:00.000Z',
          elaborationDate: '2026-03-20T11:30:00.000Z',
          businessName: 'Esercente Failed',
          startPeriod: null,
          endPeriod: null,
          operatorLevel: 'L2',
          reportStatus: 'FAILED',
        },
      ],
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} isUsers />);

    const unknownRow = (await screen.findByText('unknown.csv')).closest('tr') as HTMLElement;
    const activeRow = screen.getByText('active.csv').closest('tr') as HTMLElement;
    const failedRow = screen.getByText('failed.csv').closest('tr') as HTMLElement;

    expect(mockGetReportList).toHaveBeenLastCalledWith(
      'initiative-1',
      0,
      10,
      ReportTypeEnum.USER_DETAILS
    );
    expect(screen.queryByText('pages.initiativeExportReport.exportFiltersCard.merchant')).not.toBeInTheDocument();
    expect(screen.queryByText('pages.initiativeExportReport.exportTable.columns.operator')).not.toBeInTheDocument();

    expect(unknownRow).toHaveTextContent('unknown.csv');
    expect(unknownRow).toHaveTextContent('-');
    expect(unknownRow).toHaveTextContent('not-a-date');
    expect(within(unknownRow).getByTestId('CheckCircleIcon')).toBeInTheDocument();
    expect(within(unknownRow).getByText('01/03/2026 - -')).toBeInTheDocument();

    expect(activeRow).toHaveTextContent('active.csv');
    expect(activeRow).toHaveTextContent('-');
    expect(within(activeRow).getByTestId('SyncIcon')).toBeInTheDocument();
    expect(within(activeRow).getByText('- - 10/03/2026')).toBeInTheDocument();

    expect(within(failedRow).getByTestId('ErrorIcon')).toBeInTheDocument();
    expect(within(failedRow).queryByTestId('DownloadIcon')).not.toBeInTheDocument();
  });

  test('downloads with the fallback file name when the azure url is invalid', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 1,
      totalPages: 1,
      reports: [
        {
          id: 'report-1',
          fileName: 'fallback-name.csv',
          requestDate: '2026-03-20T10:00:00.000Z',
          elaborationDate: '2026-03-20T10:30:00.000Z',
          businessName: 'Esercente test',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L1',
          reportStatus: 'GENERATED',
        },
      ],
    });
    mockGetDownloadReport.mockResolvedValue({
      reportUrl: 'not-a-valid-url',
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    fireEvent.click(await screen.findByTestId('DownloadIcon'));

    await waitFor(() => {
      expect(mockGetDownloadReport).toHaveBeenCalledWith('initiative-1', 'report-1');
      expect(mockDownloadCsv).toHaveBeenCalledWith('not-a-valid-url', 'fallback-name.csv');
    });
  });

  test('resets to the empty state when the page size changes and the next response is empty', async () => {
    mockGetReportList.mockResolvedValueOnce({
      totalElements: 1,
      totalPages: 1,
      reports: [
        {
          id: 'report-1',
          fileName: 'single.csv',
          requestDate: '2026-03-20T10:00:00.000Z',
          elaborationDate: '2026-03-20T10:30:00.000Z',
          businessName: 'Esercente test',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L1',
          reportStatus: 'GENERATED',
        },
      ],
    });
    mockGetReportList.mockResolvedValueOnce({
      totalElements: 0,
      totalPages: 1,
      reports: [],
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    await screen.findByText('single.csv');

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('25'));

    await waitFor(() => {
      expect(mockGetReportList).toHaveBeenLastCalledWith(
        'initiative-1',
        0,
        25,
        ReportTypeEnum.MERCHANT_TRANSACTIONS
      );
    });

    expect(await screen.findByText('pages.initiativeExportReport.exportTable.emptyState')).toBeInTheDocument();
  });

  test('skips download requests when a row id is missing', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 1,
      totalPages: 1,
      reports: [
        {
          id: '',
          fileName: 'empty-id.csv',
          requestDate: '2026-03-20T10:00:00.000Z',
          elaborationDate: '2026-03-20T10:30:00.000Z',
          businessName: 'Esercente test',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L1',
          reportStatus: 'GENERATED',
        },
      ],
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} />);

    fireEvent.click(await screen.findByTestId('DownloadIcon'));

    expect(mockGetDownloadReport).not.toHaveBeenCalled();
    expect(mockDownloadCsv).not.toHaveBeenCalled();
  });

  test('hides merchant/operator columns in users mode', async () => {
    mockGetReportList.mockResolvedValue({
      totalElements: 1,
      totalPages: 1,
      reports: [
        {
          id: 'report-1',
          fileName: 'users.csv',
          requestDate: '2026-03-20T10:00:00.000Z',
          elaborationDate: '2026-03-20T10:30:00.000Z',
          businessName: 'Esercente hidden',
          startPeriod: '2026-03-01T00:00:00.000Z',
          endPeriod: '2026-03-10T00:00:00.000Z',
          operatorLevel: 'L1',
          reportStatus: 'GENERATED',
        },
      ],
    });

    render(<ReportTableCard initiativeId="initiative-1" refreshToken={0} isUsers />);

    await screen.findByText('users.csv');
    expect(mockGetReportList).toHaveBeenLastCalledWith('initiative-1', 0, 10, ReportTypeEnum.USER_DETAILS);
    expect(screen.queryByText('pages.initiativeExportReport.exportFiltersCard.merchant')).not.toBeInTheDocument();
    expect(screen.queryByText('pages.initiativeExportReport.exportTable.columns.operator')).not.toBeInTheDocument();
  });
});


