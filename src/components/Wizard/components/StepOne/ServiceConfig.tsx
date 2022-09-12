import { Box, Button, Paper, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WIZARD_ACTIONS } from '../../../../utils/constants';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setDisabledNext: Dispatch<SetStateAction<boolean>>;
}

const ServiceConfig = ({
  action,
  setAction,
  currentStep,
  setCurrentStep,
  setDisabledNext,
}: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    setDisabledNext(false);
  }, []);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      setCurrentStep(currentStep + 1);
    }
    setAction('');
  }, [action]);

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">{t('components.wizard.stepOne.title')}</Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Typography variant="body1">{t('components.wizard.stepOne.subtitle')}</Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Button size="small" sx={{ p: 0 }}>
            {t('components.wizard.common.links.findOut')}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ServiceConfig;
