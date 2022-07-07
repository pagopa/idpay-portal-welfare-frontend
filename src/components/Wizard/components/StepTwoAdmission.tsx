import { Box, Button, FormControl, FormLabel, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ListAltIcon from '@mui/icons-material/ListAlt';

interface Props {
  action: string;
  // setAction: Function;
}

const StepTwoAdmission = ({ action }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (action === 'SUBMIT') {
      //   formik.handleSubmit();
    } else {
      return;
    }
    // setAction('');
  }, [action]);

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">{t('components.wizard.stepTwo.form.title1')}</Typography>
      </Box>

      <form>
        <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
          <FormLabel
            sx={{
              gridColumn: 'span 12',
              fontWeight: 400,
              fontSize: '16px',
              letterSpacing: '0.15px',
            }}
          >
            {t('components.wizard.stepTwo.form.subTitle1')}
          </FormLabel>
          <FormLabel
            sx={{
              gridColumn: 'span 12',
              fontWeight: 700,
              pb: 1,
              fontSize: '14px',
              letterSpacing: '0.3px',
            }}
          >
            <Button size="small" href="" sx={{ p: 0 }}>
              {t('components.wizard.common.links.findOut')}
            </Button>
          </FormLabel>
        </FormControl>
        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"criteriaButton addButton . ."`,
            py: 2,
            mb: 8,
          }}
        >
          <Button
            variant="contained"
            size="medium"
            sx={{
              gridArea: 'criteriaButton',
              fontWeight: '700',
              fontSize: '16px',
              letterSpacing: '0.3px',
              lineHeight: '20px',
              borderRadius: '4px',
            }}
            startIcon={<ListAltIcon />}
          >
            {t('components.wizard.stepTwo.form.criteria')}
          </Button>

          <Button
            variant="text"
            size="medium"
            sx={{
              gridArea: 'addButton',
              fontWeight: '700',
              fontSize: '16px',
              letterSpacing: '0.3px',
              lineHeight: '20px',
              borderRadius: '4px',
            }}
          >
            {t('components.wizard.stepTwo.form.addManually')}
          </Button>
        </FormControl>
      </form>
    </Paper>
  );
};

export default StepTwoAdmission;
