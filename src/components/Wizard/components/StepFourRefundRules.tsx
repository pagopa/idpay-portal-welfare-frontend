import {
  Paper,
  Typography,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  MenuItem,
  Select,
  InputLabel,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  action: string;
  // setAction: Function;
}

interface Errors {
  reimbursmentQuestionGroup: string;
  timeParameter: string;
}

const StepFourRefundRules = ({ action }: Props) => {
  const validateString = (value: string) => {
    /* eslint-disable functional/no-let */
    let error = '';
    if (!value.length) {
      error = 'Campo richiesto';
    }
    return error;
  };

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      reimbursmentQuestionGroup: '',
      timeParameter: '',
    },
    validate: (values) => {
      const errors: Errors = {
        reimbursmentQuestionGroup: validateString(values.reimbursmentQuestionGroup),
        timeParameter: validateString(values.timeParameter),
      };
      console.log('ESEGUO validate');
      console.log(values);
      console.log(errors);
    },
    onSubmit: (values) => {
      console.log('ESEGUO onSubmit');
      console.log(values);
    },
  });

  useEffect(() => {
    if (action === 'SUBMIT') {
      //   formik.handleSubmit();
    } else {
      return;
    }
    // setAction('');
  }, [action]);

  return (
    <>
      <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
        <Box sx={{ py: 3 }}>
          <Typography variant="h6">{t('components.wizard.stepFour.title2')}</Typography>
        </Box>

        <form>
          <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 1 }}>
            <FormLabel
              sx={{ gridColumn: 'span 12', pb: 2, fontSize: '16px', fontWeight: '600' }}
              id="import-time-label"
            >
              {t('components.wizard.stepFour.form.subTitle')}
            </FormLabel>

            <RadioGroup
              sx={{ gridColumn: 'span 12' }}
              row
              aria-labelledby="import-time-label"
              name="reimbursmentQuestionGroup"
              value={formik.values.reimbursmentQuestionGroup}
              onChange={formik.handleChange}
            >
              <FormControlLabel
                value="Importo accumulato"
                control={<Radio />}
                label={t('components.wizard.stepFour.form.accumulatedAmount')}
              />
              <FormControlLabel
                sx={{ ml: 2 }}
                value="Parametro temporale"
                control={<Radio />}
                label={t('components.wizard.stepFour.form.timeParameter')}
              />
            </RadioGroup>
          </FormControl>

          <FormControl
            sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', py: 2, mb: 4 }}
          >
            <InputLabel id="select-time-parameter" sx={{ pt: 2 }}>
              {t('components.wizard.stepFour.form.selectTimeParam')}
            </InputLabel>
            <Select
              id="select-time-parameter"
              value={formik.values.timeParameter}
              label={t('components.wizard.stepFour.form.selectTimeParam')}
              onChange={formik.handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
            </Select>
          </FormControl>
        </form>
      </Paper>

      <Paper sx={{ display: 'grid', width: '100%', my: 5, px: 3 }}>
        <Box sx={{ py: 3 }}>
          <Typography variant="h6">{t('components.wizard.stepFour.title2')}</Typography>
        </Box>

        <form>
          <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 1 }}>
            <FormLabel
              sx={{
                gridColumn: 'span 12',
                pb: 2,
                fontSize: '16px',
                fontWeight: '400',
                letterSpacing: '0.15px',
              }}
              id="import-time-label"
            >
              {t('components.wizard.stepFour.form.subTitle')}
            </FormLabel>
          </FormControl>

          <FormControl
            sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', py: 2, mb: 4 }}
          >
            <TextField
              id="id-code-balance"
              label={t('components.wizard.stepFour.form.idCodeBalance')}
              variant="outlined"
            />
          </FormControl>
        </form>
      </Paper>
    </>
  );
};

export default StepFourRefundRules;
