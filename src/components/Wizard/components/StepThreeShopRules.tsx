import { Box, Button, FormControl, FormLabel, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';

interface Props {
  action: string;
  // setAction: Function;
}

const StepThreeShopRules = ({ action }: Props) => {
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
        <Typography variant="h6">{t('components.wizard.stepThree.title')}</Typography>
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
            {t('components.wizard.stepThree.form.subTitle')}
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
            gridTemplateAreas: `"addRuleButton . . ."`,
            pt: 1,
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            size="medium"
            sx={{
              gridArea: 'addRuleButton',
              fontWeight: '700',
              fontSize: '16px',
              letterSpacing: '0.3px',
              lineHeight: '20px',
              borderRadius: '4px',
            }}
            startIcon={<AddIcon />}
          >
            {t('components.wizard.stepThree.form.addNew')}
          </Button>
        </FormControl>
      </form>
    </Paper>
  );
};

export default StepThreeShopRules;
