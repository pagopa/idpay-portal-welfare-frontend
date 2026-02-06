import { Box, Button, Card, CardContent, Typography, TextField, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ExportFiltersCardProps {
  onGenerateReport?: () => void;
}

const ExportFiltersCard = ({ onGenerateReport }: ExportFiltersCardProps) => {
  const { t } = useTranslation();

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
          <TextField
            label={t('pages.initiativeExportReport.exportFiltersCard.merchant')}
            variant="outlined"
            sx={{ flex: '1 1 auto', maxWidth: '450px' }}
          />

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