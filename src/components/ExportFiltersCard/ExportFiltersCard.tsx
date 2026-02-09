import { Box, Button, Card, CardContent, Typography, TextField, MenuItem, Autocomplete } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MerchantItem } from '../../pages/initiativeRefundsMerchants/initiativeRefundsMerchants';

interface ExportFiltersCardProps {
  onGenerateReport?: () => void;
  businessList: Array<MerchantItem>;
}

const ExportFiltersCard = ({ onGenerateReport, businessList }: ExportFiltersCardProps) => {
  const { t } = useTranslation();
  const [selectedMerchant, setSelectedMerchant] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState(false);

  const merchantNames = useMemo(() => {
    const names = businessList
      .map((m) => (m as any)?.businessName ?? (m as any)?.name ?? '')
      .filter(Boolean) as Array<string>;

    return Array.from(new Set(names));
  }, [businessList]);

  const normalizeString = (str: string): string => str.toLowerCase().replace(/\s+/g, '');

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {t('pages.initiativeExportReport.exportFiltersCard.title')}
        </Typography>

        <Typography variant="body2" sx={{ mb: 3 }}>
          {t('pages.initiativeExportReport.exportFiltersCard.subtitle')}
        </Typography>

        <Box sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
        }}>
          <Box sx={{ flex: '1 1 auto', maxWidth: '450px' }}>
            <Autocomplete
              freeSolo
              options={merchantNames}
              filterOptions={(options, { inputValue }) => {
                if (inputValue.length < 3) {
                  return [];
                }

                const normalizedInput = normalizeString(inputValue);
                return options.filter((option) =>
                  normalizeString(option).includes(normalizedInput)
                );
              }}
              inputValue={selectedMerchant}
              onInputChange={(_, value) => {
                setSelectedMerchant(value);
                // TODO onFiltersChange() notify father component
              }}
              sx={{
                '& .MuiInputBase-input': {
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                },
              }}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                  }}
                >
                  {option}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('pages.initiativeExportReport.exportFiltersCard.merchant')}
                  variant="outlined"
                  fullWidth
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  InputLabelProps={{
                    shrink: searchFocused || !!selectedMerchant,
                  }}
                />
              )}
            />
          </Box>

          <TextField
            select
            label={t('pages.initiativeUsers.form.from')}
            variant="outlined"
            sx={{ width: '100px' }}
            defaultValue=""
          >
            <MenuItem value=""></MenuItem>
          </TextField>

          <TextField
            select
            label={t('pages.initiativeUsers.form.to')}
            variant="outlined"
            sx={{ width: '100px' }}
            defaultValue=""
          >
            <MenuItem value=""></MenuItem>
          </TextField>

          <Box sx={{ flex: 1 }} />
          <Button
            variant="contained"
            onClick={onGenerateReport}
          >
            {t('pages.initiativeExportReport.exportFiltersCard.buttonExport')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExportFiltersCard;