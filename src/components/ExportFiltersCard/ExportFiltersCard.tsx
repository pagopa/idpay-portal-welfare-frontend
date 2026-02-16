import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { MerchantItem } from '../../pages/initiativeRefundsMerchants/initiativeRefundsMerchants';
import MerchantAutocomplete from '../MerchantAutocomplete/MerchantAutocomplete';
import DateRangePicker from '../DateRangePicker/DateRangePicker';

interface ExportFiltersCardProps {
  onGenerateReport?: (data: { startDate: Date; endDate: Date; businessName: string }) => void;
  businessList: Array<MerchantItem>;
}

const ExportFiltersCard = ({ onGenerateReport, businessList }: ExportFiltersCardProps) => {
  const { t } = useTranslation();

  const [selectedMerchant, setSelectedMerchant] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const [merchantError, setMerchantError] = useState<'required' | 'invalid' | null>(null);
  const [dateFromError, setDateFromError] = useState(false);
  const [dateToError, setDateToError] = useState(false);

  const yesterday = endOfDay(subDays(new Date(), 1));
  const minDateFrom = startOfDay(new Date(2025, 10, 1));

  const merchantNames = useMemo(() => {
    const names = businessList
      .map((m) => (m as any)?.businessName ?? (m as any)?.name ?? '')
      .filter(Boolean) as Array<string>;

    return Array.from(new Set(names));
  }, [businessList]);

  const resetAllFields = () => {
    setSelectedMerchant('');
    setDateFrom(null);
    setDateTo(null);
    setMerchantError(null);
    setDateFromError(false);
    setDateToError(false);
  };

  const handleGenerateReport = () => {
    // eslint-disable-next-line functional/no-let
    let hasErrors = false;

    if (!selectedMerchant.trim()) {
      setMerchantError('required');
      hasErrors = true;
    } else if (!merchantNames.some((m) => m.trim().toLowerCase() === selectedMerchant.trim().toLowerCase())) {
      setMerchantError('invalid');
      hasErrors = true;
    } else {
      setMerchantError(null);
    }

    if (!dateFrom) {
      setDateFromError(true);
      hasErrors = true;
    }

    if (!dateTo) {
      setDateToError(true);
      hasErrors = true;
    }

    if (hasErrors) { return; }

    if (onGenerateReport && dateFrom && dateTo) {
      onGenerateReport({
        startDate: dateFrom,
        endDate: dateTo,
        businessName: selectedMerchant,
      });
      resetAllFields();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={it}>
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('pages.initiativeExportReport.exportFiltersCard.title')}
          </Typography>

          <Typography variant="body2" sx={{ mb: 3 }}>
            {t('pages.initiativeExportReport.exportFiltersCard.subtitle')}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'flex-start',
              flexDirection: { xs: 'column', md: 'row' },
              flexWrap: 'nowrap',
            }}
          >
            <MerchantAutocomplete
              merchantNames={merchantNames}
              selectedMerchant={selectedMerchant}
              merchantError={merchantError}
              onMerchantChange={(value) => {
                setSelectedMerchant(value);
                setMerchantError(null);
              }}
              onBlurValidation={() => {
                if (selectedMerchant.trim() && !merchantNames.some((m) => m.trim().toLowerCase() === selectedMerchant.trim().toLowerCase())) {
                  setMerchantError('invalid');
                } else {
                  setMerchantError(null);
                }
              }}
            />

            <DateRangePicker
              dateFrom={dateFrom}
              dateTo={dateTo}
              dateFromError={dateFromError}
              dateToError={dateToError}
              minDateFrom={minDateFrom}
              yesterday={yesterday}
              onDateFromChange={(newValue) => {
                setDateFrom(newValue ? startOfDay(newValue) : null);
                setDateFromError(false);
                setDateTo(null);
              }}
              onDateToChange={(newValue) => {
                setDateTo(newValue ? endOfDay(newValue) : null);
                setDateToError(false);
              }}
            />
            <Box sx={{ flex: 1 }} />
            <Button
              variant="contained"
              sx={{
                flexShrink: 0,
                whiteSpace: 'nowrap',
                mt: 0.5
              }}
              onClick={handleGenerateReport}
            >
              {t('pages.initiativeExportReport.exportFiltersCard.buttonExport')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default ExportFiltersCard;