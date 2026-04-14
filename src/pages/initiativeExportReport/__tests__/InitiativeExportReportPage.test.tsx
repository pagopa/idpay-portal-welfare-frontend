import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import InitiativeExportReportPage from '../InitiativeExportReportPage';
import {
  ReportDtoReportStatusEnum as ReportStatusEnum,
  ReportTypeEnum,
} from '../../../api/generated/merchants/apiClient';

const mockSetAlert = jest.fn();
const mockSetLoading = jest.fn();
const mockGenerateReport = jest.fn();
const mockGetMerchantList = jest.fn();
const mockReportTableProps = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../../hooks/useInitiative', () => ({
  useInitiative: jest.fn(),
}));

jest.mock('../../../hooks/useAlert', () => ({
  useAlert: () => ({ setAlert: mockSetAlert }),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib', () => ({
  TitleBox: () => <div>TitleBox</div>,
  useLoading: () => mockSetLoading,
}));

jest.mock('../../../services/merchantsService', () => ({
  generateReport: (...args: Array<any>) => mockGenerateReport(...args),
  getMerchantList: (...args: Array<any>) => mockGetMerchantList(...args),
}));

jest.mock('../../../components/ExportFiltersCard/ExportFiltersCard', () => ({
  __esModule: true,
  default: (props: any) => (
    <button
      data-testid="generate-report-btn"
      onClick={() =>
        props.onGenerateReport({
          startDate: new Date('2026-01-01'),
          endDate: new Date('2026-01-31'),
          businessName: 'Esercente One',
        })
      }
    >
      generate
    </button>
  ),
}));

jest.mock('../../../components/ReportTable/ReportTableCard', () => ({
  __esModule: true,
  default: (props: any) => {
    mockReportTableProps(props);
    return <div data-testid="report-table-card">ReportTableCard</div>;
  },
}));

describe('<InitiativeExportReportPage />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, 'Test', '/portale-enti/esporta-report/initiative-1');
    mockGetMerchantList.mockResolvedValue({
      content: [{ merchantId: 'm1', businessName: 'Esercente One' }],
    });
    mockGenerateReport.mockResolvedValue({ reportStatus: ReportStatusEnum.GENERATED });
  });

  test('loads merchants and renders page', async () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <InitiativeExportReportPage />
      </Provider>
    );

    await waitFor(() => {
      expect(mockGetMerchantList).toHaveBeenCalledWith('initiative-1', 0);
    });

    expect(screen.getByTestId('report-table-card')).toBeInTheDocument();
  });

  test('handles generate report success and refreshes table', async () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <InitiativeExportReportPage />
      </Provider>
    );

    fireEvent.click(await screen.findByTestId('generate-report-btn'));

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalled();
      expect(mockSetAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'pages.initiativeExportReport.reportAlertMessage.generated',
          severity: 'success',
        })
      );
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenLastCalledWith(false);
    });

    expect(
      mockReportTableProps.mock.calls.some((call) => call[0].refreshToken === 1)
    ).toBeTruthy();
  });

  test('handles generate report failure', async () => {
    mockGenerateReport.mockRejectedValueOnce(new Error('boom'));
    const store = createStore();
    render(
      <Provider store={store}>
        <InitiativeExportReportPage />
      </Provider>
    );

    fireEvent.click(await screen.findByTestId('generate-report-btn'));

    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'errors.title',
          text: 'errors.getDataDescription',
          severity: 'error',
        })
      );
    });
  });

  test('uses an empty merchant id when the selected business is not in the loaded list', async () => {
    mockGetMerchantList.mockResolvedValueOnce({
      content: [],
    });
    const store = createStore();
    render(
      <Provider store={store}>
        <InitiativeExportReportPage />
      </Provider>
    );

    fireEvent.click(await screen.findByTestId('generate-report-btn'));

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalledTimes(1);
    });

    const [initiativeId, startDate, endDate, reportType, merchantId] = mockGenerateReport.mock.calls[0];
    expect(initiativeId).toBe('initiative-1');
    expect(new Date(startDate).toISOString()).toBe(new Date('2026-01-01').toISOString());
    expect(new Date(endDate).toISOString()).toBe(new Date('2026-01-31').toISOString());
    expect(reportType).toBe(ReportTypeEnum.MERCHANT_TRANSACTIONS);
    expect(merchantId).toBe('');
  });

  test('does not show a status alert when the generate report response has no status', async () => {
    mockGenerateReport.mockResolvedValueOnce({});
    const store = createStore();
    render(
      <Provider store={store}>
        <InitiativeExportReportPage />
      </Provider>
    );

    fireEvent.click(await screen.findByTestId('generate-report-btn'));

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalled();
      expect(mockSetAlert).not.toHaveBeenCalled();
    });

    expect(
      mockReportTableProps.mock.calls.some((call) => call[0].refreshToken === 1)
    ).toBeFalsy();
  });

  test('handles merchant list fetch failure', async () => {
    mockGetMerchantList.mockRejectedValueOnce(new Error('merchant fail'));
    const store = createStore();
    render(
      <Provider store={store}>
        <InitiativeExportReportPage />
      </Provider>
    );

    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'errors.title',
          text: 'errors.getDataDescription',
          severity: 'error',
        })
      );
    });
  });
});