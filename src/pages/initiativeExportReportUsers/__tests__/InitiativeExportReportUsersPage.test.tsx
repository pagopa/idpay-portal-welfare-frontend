import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  ReportDtoReportStatusEnum as ReportStatusEnum,
  ReportRequestReportTypeEnum,
} from '../../../api/generated/merchants/apiClient';
import InitiativeExportReportUsersPage from '../initiativeExportReportUsersPage';
import { createStore } from '../../../redux/store';

const mockSetAlert = jest.fn();
const mockSetLoading = jest.fn();
const mockGenerateReport = jest.fn();
const mockExportFiltersProps = jest.fn();
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
  TitleBox: () => <div data-testid="title-box">TitleBox</div>,
  useLoading: () => mockSetLoading,
}));

jest.mock('../../../services/merchantsService', () => ({
  generateReport: (...args: Array<unknown>) => mockGenerateReport(...args),
}));

jest.mock('../../../components/ExportFiltersCard/ExportFiltersCard', () => ({
  __esModule: true,
  default: (props: any) => {
    mockExportFiltersProps(props);
    return (
      <button
        data-testid="generate-report-btn"
        onClick={() =>
          props.onGenerateReport({
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-01-31'),
          })
        }
      >
        generate
      </button>
    );
  },
}));

jest.mock('../../../components/ReportTable/ReportTableCard', () => ({
  __esModule: true,
  default: (props: any) => {
    mockReportTableProps(props);
    return <div data-testid="report-table-card">ReportTableCard</div>;
  },
}));

describe('<InitiativeExportReportUsersPage />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, 'Test', '/portale-enti/esporta-report-dati-utenti/initiative-1');
    mockGenerateReport.mockResolvedValue({ reportStatus: ReportStatusEnum.GENERATED });
  });

  test('renders page and passes user mode props to child components', async () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <InitiativeExportReportUsersPage />
      </Provider>
    );

    expect(screen.getByTestId('title-box')).toBeInTheDocument();
    expect(screen.getByTestId('report-table-card')).toBeInTheDocument();

    expect(mockExportFiltersProps).toHaveBeenCalledWith(
      expect.objectContaining({
        isUsers: true,
        businessList: [],
      })
    );
    expect(mockReportTableProps).toHaveBeenCalledWith(
      expect.objectContaining({
        initiativeId: 'initiative-1',
        refreshToken: 0,
        isUsers: true,
      })
    );
  });

  test('handles generate report success and refreshes table', async () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <InitiativeExportReportUsersPage />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('generate-report-btn'));

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalledTimes(1);
      expect(mockSetAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'pages.initiativeExportReport.reportAlertMessage.generated',
          severity: 'success',
          isOpen: true,
        })
      );
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenLastCalledWith(false);
    });

    const [initiativeId, startDate, endDate, reportType] = mockGenerateReport.mock.calls[0];
    expect(initiativeId).toBe('initiative-1');
    expect(new Date(startDate as string).toISOString()).toBe(new Date('2026-01-01').toISOString());
    expect(new Date(endDate as string).toISOString()).toBe(new Date('2026-01-31').toISOString());
    expect(reportType).toBe(ReportRequestReportTypeEnum.USER_DETAILS);
    expect(
      mockReportTableProps.mock.calls.some((call) => call[0].refreshToken === 1)
    ).toBeTruthy();
  });

  test('handles generate report failure', async () => {
    mockGenerateReport.mockRejectedValueOnce(new Error('boom'));
    const store = createStore();
    render(
      <Provider store={store}>
        <InitiativeExportReportUsersPage />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('generate-report-btn'));

    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'errors.title',
          text: 'errors.getDataDescription',
          severity: 'error',
          isOpen: true,
        })
      );
      expect(mockSetLoading).toHaveBeenLastCalledWith(false);
    });
  });

  test('does not show a status alert when response has no reportStatus', async () => {
    mockGenerateReport.mockResolvedValueOnce({});
    const store = createStore();
    render(
      <Provider store={store}>
        <InitiativeExportReportUsersPage />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('generate-report-btn'));

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalledTimes(1);
      expect(mockSetAlert).not.toHaveBeenCalled();
    });

    expect(
      mockReportTableProps.mock.calls.some((call) => call[0].refreshToken === 1)
    ).toBeFalsy();
  });

  test.each([
    [
      ReportStatusEnum.FAILED,
      'pages.initiativeExportReport.reportAlertMessage.failed',
      'error',
    ],
    [
      ReportStatusEnum.INSERTED,
      'pages.initiativeExportReport.reportAlertMessage.processing',
      'info',
    ],
    [
      ReportStatusEnum.IN_PROGRESS,
      'pages.initiativeExportReport.reportAlertMessage.processing',
      'info',
    ],
  ])(
    'maps report status %s to alert correctly',
    async (status, expectedText, expectedSeverity) => {
      mockGenerateReport.mockResolvedValueOnce({ reportStatus: status });
      const store = createStore();
      render(
        <Provider store={store}>
          <InitiativeExportReportUsersPage />
        </Provider>
      );

      fireEvent.click(screen.getByTestId('generate-report-btn'));

      await waitFor(() => {
        expect(mockSetAlert).toHaveBeenCalledWith(
          expect.objectContaining({
            text: expectedText,
            severity: expectedSeverity,
            isOpen: true,
          })
        );
      });
    }
  );

  test('uses undefined initiative id when route does not match', async () => {
    window.history.pushState({}, 'Test', '/portale-enti/pagina-non-valida');
    const store = createStore();
    render(
      <Provider store={store}>
        <InitiativeExportReportUsersPage />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('generate-report-btn'));

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalledTimes(1);
    });

    expect(mockGenerateReport.mock.calls[0][0]).toBeUndefined();
    expect(
      mockReportTableProps.mock.calls.some(
        (call) => typeof call[0] !== 'undefined' && typeof call[0].initiativeId === 'undefined'
      )
    ).toBeTruthy();
  });
});
