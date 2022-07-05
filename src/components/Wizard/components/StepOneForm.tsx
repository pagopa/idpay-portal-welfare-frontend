import {
  Paper,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  action: string;
  // setAction: Function;
}

interface Errors {
  recipientsQuestionGroup: string;
  recipientsTypeGroup: string;
  totalBudget: string;
  budgetPerPerson: string;
  joinFrom: string;
  joinTo: string;
  spendFrom: string;
  spendTo: string;
}

const StepOneForm = ({ action }: Props) => {
  useEffect(() => {
    if (action === 'SUBMIT') {
      formik.handleSubmit();
    } else {
      return;
    }
    // setAction('');
  }, [action]);

  const validateNumber = (value: string) => {
    /* eslint-disable functional/no-let */
    const numericValue = parseInt(value, 10);
    let error = '';
    if (isNaN(numericValue)) {
      error = 'Campo richiesto';
    }
    if (numericValue === 0) {
      error = 'Immettere un valore positivo';
    }
    return error;
  };

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
      recipientsQuestionGroup: '',
      recipientsTypeGroup: '',
      totalBudget: '',
      budgetPerPerson: '',
      joinFrom: '',
      joinTo: '',
      spendFrom: '',
      spendTo: '',
    },
    validate: (values) => {
      const errors: Errors = {
        recipientsQuestionGroup: validateString(values.recipientsQuestionGroup),
        recipientsTypeGroup: validateString(values.recipientsTypeGroup),
        totalBudget: validateNumber(values.totalBudget),
        budgetPerPerson: validateNumber(values.budgetPerPerson),
        joinFrom: '',
        joinTo: '',
        spendFrom: '',
        spendTo: '',
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

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">{t('components.wizard.stepOne.title')}</Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
          <FormLabel
            sx={{ gridColumn: 'span 12', pb: 1, fontSize: '16px', fontWeight: '600' }}
            id="recipients-question--label"
          >
            {t('components.wizard.stepOne.form.initiativeRecipients')}
          </FormLabel>
          <RadioGroup
            sx={{ gridColumn: 'span 12' }}
            row
            aria-labelledby="recipients-question--label"
            name="recipientsQuestionGroup"
            value={formik.values.recipientsQuestionGroup}
            onChange={formik.handleChange}
          >
            <FormControlLabel
              value="Persona fisica"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.person')}
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value="Nucleo Familiare"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.family')}
            />
          </RadioGroup>
        </FormControl>
        <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
          <FormLabel
            sx={{ gridColumn: 'span 12', pb: 1, fontSize: '16px', fontWeight: '600' }}
            id="recipients-type--label"
          >
            {t('components.wizard.stepOne.form.recipientsType')}
          </FormLabel>
          <RadioGroup
            sx={{ gridColumn: 'span 12' }}
            row
            aria-labelledby="recipients-type--label"
            name="recipientsTypeGroup"
            value={formik.values.recipientsTypeGroup}
            onChange={formik.handleChange}
          >
            <FormControlLabel
              value="Si, ho una lista di codici fiscali"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.taxCodeList')}
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value="No, imposterò dei criteri d'ammissione"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.manualSelection')}
            />
          </RadioGroup>
        </FormControl>
        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"budgetTitle budgetTitle budgetPerPersonCalcTitle budgetPerPersonCalcTitle" 
                                  "totalBudget budgetPerPerson budgetPerPersonCalc budgetPerPersonCalc"`,
            py: 2,
          }}
        >
          <FormLabel sx={{ fontSize: '16px', fontWeight: '600', gridArea: 'budgetTitle' }}>
            {t('components.wizard.stepOne.form.budget')}
          </FormLabel>
          <FormLabel
            sx={{ fontSize: '16px', gridArea: 'budgetPerPersonCalcTitle', justifySelf: 'end' }}
          >
            {t('components.wizard.stepOne.form.reachedUsers')}
          </FormLabel>
          <TextField
            sx={{ gridArea: 'totalBudget' }}
            inputProps={{ type: 'number', pattern: '[0-9]*' }}
            label={t('components.wizard.stepOne.form.totalBudget')}
            placeholder={t('components.wizard.stepOne.form.totalBudget')}
            name="totalBudget"
            value={formik.values.totalBudget}
            onChange={formik.handleChange}
          />
          <TextField
            sx={{ gridArea: 'budgetPerPerson' }}
            inputProps={{ type: 'number', pattern: '[0-9]*' }}
            label={t('components.wizard.stepOne.form.budgetPerPerson')}
            placeholder={t('components.wizard.stepOne.form.budgetPerPerson')}
            name="budgetPerPerson"
            value={formik.values.budgetPerPerson}
            onChange={formik.handleChange}
          />
          <Typography
            variant="subtitle2"
            sx={{ gridArea: 'budgetPerPersonCalc', justifySelf: 'end', alignSelf: 'center' }}
          >
            000
          </Typography>
        </FormControl>
        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"timeRangeJoinTitle timeRangeJoinTitle timeRangeJoinTitle timeRangeJoinTitle" 
                                  "timeRangeJoinFrom timeRangeJoinTo . . "`,
            py: 2,
          }}
        >
          <FormLabel sx={{ fontSize: '16px', fontWeight: '600', gridArea: 'timeRangeJoinTitle' }}>
            {t('components.wizard.stepOne.form.timeRangeJoinTitle')}
          </FormLabel>
          <TextField
            id="join-from"
            label={t('components.wizard.stepOne.form.timeRangeJoinFrom')}
            name="joinFrom"
            type="date"
            value={formik.values.joinFrom}
            sx={{ gridArea: 'timeRangeJoinFrom' }}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="join-to"
            label={t('components.wizard.stepOne.form.timeRangeJoinTo')}
            name="joinTo"
            type="date"
            value={formik.values.joinTo}
            sx={{ gridArea: 'timeRangeJoinTo' }}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"timeRangeSpendTitle timeRangeSpendTitle timeRangeSpendTitle timeRangeSpendTitle" 
                                  "timeRangeSpendFrom timeRangeSpendTo . . "`,
            py: 2,
          }}
        >
          <FormLabel sx={{ fontSize: '16px', fontWeight: '600', gridArea: 'timeRangeSpendTitle' }}>
            {t('components.wizard.stepOne.form.timeRangeSpendTitle')}
          </FormLabel>
          <TextField
            id="spend-from"
            label={t('components.wizard.stepOne.form.timeRangeSpendFrom')}
            name="spendFrom"
            type="date"
            value={formik.values.spendFrom}
            sx={{ gridArea: 'timeRangeSpendFrom' }}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="spend-to"
            label={t('components.wizard.stepOne.form.timeRangeSpendTo')}
            name="spendTo"
            type="date"
            value={formik.values.spendTo}
            sx={{ gridArea: 'timeRangeSpendTo' }}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
      </form>
    </Paper>
  );
};

export default StepOneForm;
