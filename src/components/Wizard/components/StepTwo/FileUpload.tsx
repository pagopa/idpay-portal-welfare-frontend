import { Box, Button, FormControl, FormLabel, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { WIZARD_ACTIONS } from '../../../../utils/constants';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  // currentStep: number;
  // setCurrentStep: Dispatch<SetStateAction<number>>;
}

const FileUpload = ({ action, setAction /* , currentStep, setCurrentStep */ }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      //   formik.handleSubmit();
    } else {
      return;
    }
    setAction('');
  }, [action]);

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">{t('components.wizard.stepTwo.form.title2')}</Typography>
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
            {t('components.wizard.stepTwo.form.subTitle2')}
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
            <Button size="small" href="/" sx={{ p: 0 }}>
              {t('components.wizard.common.links.findOut')}
            </Button>
          </FormLabel>
        </FormControl>
      </form>
    </Paper>
  );
};

export default FileUpload;
