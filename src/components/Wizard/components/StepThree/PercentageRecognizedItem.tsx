import { grey } from '@mui/material/colors';
import { Box, FormControl, TextField, Typography } from '@mui/material';
import PercentIcon from '@mui/icons-material/Percent';
import { useTranslation } from 'react-i18next';

const PercentageRecognizedItem = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        alignItems: 'start',
        borderColor: grey.A200,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: 2,
        my: 3,
        p: 3,
      }}
      data-testid="percetage-recognized-test"
    >
      <Box sx={{ gridColumn: 'span 1' }}>
        <PercentIcon />
      </Box>
      <Box sx={{ gridColumn: 'span 23' }}>
        <Typography variant="subtitle1">
          {t('components.wizard.stepThree.form.percentageRecognized')}
        </Typography>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 24',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 3,
          my: 2,
        }}
      >
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <TextField
            inputProps={{
              step: 0.01,
              min: 0,
              type: 'number',
              'data-testid': 'percetage-recognized-value',
            }}
            placeholder={'%'}
            name="percetageRecognized"
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default PercentageRecognizedItem;
