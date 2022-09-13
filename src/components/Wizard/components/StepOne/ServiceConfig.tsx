import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  // FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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

      <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', pb: 2 }}>
        <FormControlLabel
          sx={{ gridColumn: 'span 2' }}
          control={
            <Switch
              data-testid="initiative-on-io-test"
              checked={false}
              value={false}
              inputProps={{
                checked: false,
                role: 'checkbox',
                name: 'initiativeOnIO',
                id: 'initiativeOnIO',
              }}
              onChange={(e) => console.log('changed ', e)}
              name="initiativeOnIO"
            />
          }
          label={t('components.wizard.stepOne.form.initiativeOnIo')}
        />
      </FormControl>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(24, 1fr)',
          borderColor: grey.A200,
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: 1,
          p: 3,
        }}
      >
        <Box sx={{ gridColumn: 'span 1' }}>
          <MenuBookIcon />
        </Box>
        <Box sx={{ gridColumn: 'span 22' }}>
          <Typography variant="subtitle1">
            {t('components.wizard.stepOne.form.description')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 1' }}></Box>

        <Box
          sx={{
            gridColumn: 'span 24',
            display: 'grid',
            gridTemplateColumns: 'repeat(24, 1fr)',
            gap: 2,
            mt: 3,
          }}
        >
          <FormControl sx={{ gridColumn: 'span 12' }}>
            <TextField
              label={t('components.wizard.stepOne.form.serviceName')}
              placeholder={t('components.wizard.stepOne.form.serviceName')}
              name="serviceName"
              aria-label="serviceName"
              role="input"
              required={true}
              InputLabelProps={{ required: false }}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: 'span 12' }}>
            <InputLabel>{t('components.wizard.stepOne.form.serviceArea')}</InputLabel>
            <Select
              id="serviceArea"
              data-testid="service-area-select"
              name="serviceArea"
              label={t('components.wizard.stepOne.form.serviceArea')}
              placeholder={t('components.wizard.stepOne.form.serviceArea')}
              // sx={{ gridColumn: 'span 6' }}
              // onChange={async (e) => {
              //   await formik.setFieldValue('serviceId', e.target.value);
              // }}
              // error={formik.touched.serviceId && Boolean(formik.errors.serviceId)}
              //

              value={'1'}
            >
              <MenuItem value={'1'}>aaaa</MenuItem>
              <MenuItem value={'2'}>bbbb</MenuItem>
            </Select>
            {/* <FormHelperText error={false}>{'aa'}</FormHelperText> */}
          </FormControl>
          <FormControl sx={{ gridColumn: 'span 24' }}>
            <TextField
              sx={{ gridColumn: 'span 12' }}
              multiline
              minRows={2}
              maxRows={4}
              label={t('components.wizard.stepOne.form.serviceDescription')}
              placeholder={t('components.wizard.stepOne.form.serviceDescription')}
              name="serviceDescription"
              aria-label="service-description"
              role="input"
              // value={formik.values.description}
              // onChange={(e) => formik.setFieldValue('description', e.target.value)}
              // error={formik.touched.description && Boolean(formik.errors.description)}
              // helperText={formik.touched.description && formik.errors.description}
              required={true}
              InputLabelProps={{ required: false }}
            />
          </FormControl>
        </Box>
      </Box>
    </Paper>
  );
};

export default ServiceConfig;
