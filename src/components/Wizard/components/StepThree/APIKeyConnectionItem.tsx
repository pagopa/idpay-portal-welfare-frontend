import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';

const APIKeyConnectionItem = () => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        alignItems: 'center',
        borderColor: grey.A200,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: 2,
        my: 3,
        p: 3,
      }}
      data-testid="apiKey-connection-item-test"
    >
      <Box sx={{ gridColumn: 'span 12' }}>
        <Typography>
          {t('components.wizard.stepThree.chooseCriteria.apiKeyConnection.title')}
        </Typography>
      </Box>
    </Box>
  );
};

export default APIKeyConnectionItem;
