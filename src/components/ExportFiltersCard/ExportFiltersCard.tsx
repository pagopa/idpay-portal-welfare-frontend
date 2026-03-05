import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { MerchantItem } from '../../pages/initiativeRefundsMerchants/initiativeRefundsMerchants';
import MerchantAutocomplete from '../MerchantAutocomplete/MerchantAutocomplete';
import DateRangePicker from '../DateRangePicker/DateRangePicker';

interface ExportFiltersCardProps {
  onGenerateReport?: (data: { startDate: Date; endDate: Date; businessName: string }) => void;
  businessList: Array<MerchantItem>;
  isUsers?: boolean;
}

const ExportFiltersCard = ({ onGenerateReport, businessList, isUsers = false, }: ExportFiltersCardProps) => {
  const { t } = useTranslation();

  const [selectedMerchant, setSelectedMerchant] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const [merchantError, setMerchantError] = useState<'required' | 'invalid' | null>(null);
  const [dateFromError, setDateFromError] = useState(false);
  const [dateToError, setDateToError] = useState(false);

  const yesterday = endOfDay(subDays(new Date(), 1));
  const minDateFrom = startOfDay(new Date(2025, 10, 18));

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

    if (!isUsers) {
      if (!selectedMerchant.trim()) {
        setMerchantError('required');
        hasErrors = true;
      } else if (!merchantNames.some((m) => m.trim().toLowerCase() === selectedMerchant.trim().toLowerCase())) {
        setMerchantError('invalid');
        hasErrors = true;
      } else {
        setMerchantError(null);
      }
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
        startDate: format(startOfDay(dateFrom), "yyyy-MM-dd'T'HH:mm:ss.SSS") as unknown as Date,
        endDate: format(endOfDay(dateTo), "yyyy-MM-dd'T'HH:mm:ss.SSS") as unknown as Date,
        businessName: isUsers ? "" : selectedMerchant,
      });
      resetAllFields();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={it}>
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t(`pages.initiativeExportReport${isUsers ? 'Users' : ""}.exportFiltersCard.title`)}
          </Typography>

          <Typography variant="body2" sx={{ mb: 3, maxWidth: "88%" }}>
            {t(`pages.initiativeExportReport${isUsers ? 'Users' : ""}.exportFiltersCard.subtitle`)}
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
            {!isUsers &&
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
            }

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
              isUsers={isUsers}
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