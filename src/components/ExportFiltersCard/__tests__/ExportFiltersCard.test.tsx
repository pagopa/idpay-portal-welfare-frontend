import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ExportFiltersCard from '../ExportFiltersCard';

const mockMerchantAutocomplete = jest.fn();
const mockDateRangePicker = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../..//MerchantAutocomplete/MerchantAutocomplete', () => ({
  __esModule: true,
  default: (props: any) => {
    mockMerchantAutocomplete(props);
    return (
      <div>
        <button data-testid="merchant-valid" onClick={() => props.onMerchantChange('Esercente test')}>
          merchant-valid
        </button>
        <button data-testid="merchant-invalid" onClick={() => props.onMerchantChange('Esercento non valido')}>
          merchant-invalid
        </button>
        <button data-testid="merchant-blur" onClick={() => props.onBlurValidation()}>
          merchant-blur
        </button>
      </div>
    );
  },
}));

jest.mock('../../DateRangePicker/DateRangePicker', () => ({
  __esModule: true,
  default: (props: any) => {
    mockDateRangePicker(props);
    return (
      <div>
        <button
          data-testid="set-date-from"
          onClick={() => props.onDateFromChange(new Date('2026-03-10T12:00:00.000Z'))}
        >
          set-date-from
        </button>
        <button
          data-testid="set-date-to"
          onClick={() => props.onDateToChange(new Date('2026-03-12T12:00:00.000Z'))}
        >
          set-date-to
        </button>
      </div>
    );
  },
}));

describe('ExportFiltersCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not generate report when mandatory fields are missing', () => {
    const onGenerateReport = jest.fn();

    render(
      <ExportFiltersCard
        onGenerateReport={onGenerateReport}
        businessList={[{ businessName: 'Esercente test' } as any]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'pages.initiativeExportReport.exportFiltersCard.buttonExport' }));
    expect(onGenerateReport).not.toHaveBeenCalled();
  });

  test('generates report with normalized dates and selected merchant', async () => {
    const onGenerateReport = jest.fn();

    render(
      <ExportFiltersCard
        onGenerateReport={onGenerateReport}
        businessList={[{ businessName: 'Esercente test' } as any]}
      />
    );

    fireEvent.click(screen.getByTestId('merchant-valid'));
    fireEvent.click(screen.getByTestId('set-date-from'));
    fireEvent.click(screen.getByTestId('set-date-to'));
    fireEvent.click(screen.getByRole('button', { name: 'pages.initiativeExportReport.exportFiltersCard.buttonExport' }));

    await waitFor(() => expect(onGenerateReport).toHaveBeenCalledTimes(1));
    expect(onGenerateReport).toHaveBeenCalledWith({
      startDate: '2026-03-10T00:00:00.000',
      endDate: '2026-03-12T23:59:59.999',
      businessName: 'Esercente test',
    });
  });

  test('marks merchant as invalid on blur when the value is unknown', async () => {
    const onGenerateReport = jest.fn();

    render(
      <ExportFiltersCard
        onGenerateReport={onGenerateReport}
        businessList={[{ businessName: 'Esercente test' } as any]}
      />
    );

    fireEvent.click(screen.getByTestId('merchant-invalid'));
    fireEvent.click(screen.getByTestId('merchant-blur'));

    await waitFor(() => {
      const latestMerchantCall = mockMerchantAutocomplete.mock.calls[mockMerchantAutocomplete.mock.calls.length - 1][0];
      expect(latestMerchantCall.merchantError).toBe('invalid');
    });

    fireEvent.click(screen.getByTestId('set-date-from'));
    fireEvent.click(screen.getByTestId('set-date-to'));
    fireEvent.click(screen.getByRole('button', { name: 'pages.initiativeExportReport.exportFiltersCard.buttonExport' }));

    expect(onGenerateReport).not.toHaveBeenCalled();
  });

  test('clears merchant error on blur when the value is valid', async () => {
    render(
      <ExportFiltersCard
        onGenerateReport={jest.fn()}
        businessList={[{ businessName: 'Esercente test' } as any]}
      />
    );

    fireEvent.click(screen.getByTestId('merchant-valid'));
    fireEvent.click(screen.getByTestId('merchant-blur'));

    await waitFor(() => {
      const latestMerchantCall = mockMerchantAutocomplete.mock.calls[mockMerchantAutocomplete.mock.calls.length - 1][0];
      expect(latestMerchantCall.merchantError).toBeNull();
    });
  });

  test('for users report does not require merchant and sends empty businessName', async () => {
    const onGenerateReport = jest.fn();

    render(<ExportFiltersCard onGenerateReport={onGenerateReport} businessList={[]} isUsers />);

    fireEvent.click(screen.getByTestId('set-date-from'));
    fireEvent.click(screen.getByTestId('set-date-to'));
    fireEvent.click(screen.getByRole('button', { name: 'pages.initiativeExportReport.exportFiltersCard.buttonExport' }));

    await waitFor(() => expect(onGenerateReport).toHaveBeenCalledTimes(1));
    expect(onGenerateReport).toHaveBeenCalledWith(
      expect.objectContaining({
        businessName: '',
      })
    );
  });
});

