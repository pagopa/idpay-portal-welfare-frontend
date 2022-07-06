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
  FormHelperText,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { addDays } from 'date-fns';
import { validateString, validateBudget, validateDateRange } from '../../../utils/validations';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
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

const StepOneForm = ({ action, setAction }: Props) => {
  useEffect(() => {
    if (action === 'SUBMIT') {
      formik.handleSubmit();
    } else {
      return;
    }
    setAction('');
  }, [action]);

  const fieldOnError = (errorMessage: string | undefined, isTouched: boolean | undefined) => {
    console.log(errorMessage);
    console.log(isTouched);

    if (typeof isTouched === undefined || isTouched === null) {
      return false;
    }
    if (!errorMessage) {
      return false;
    }
    return errorMessage?.length && isTouched ? true : false;
  };

  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: {
      recipientsQuestionGroup: 'persons',
      recipientsTypeGroup: 'manual_list',
      totalBudget: '',
      budgetPerPerson: '',
      joinFrom: '',
      joinTo: '',
      spendFrom: '',
      spendTo: '',
    },
    validateOnChange: false,
    validate: (values) => {
      const errors: Errors = {
        recipientsQuestionGroup: validateString(values.recipientsQuestionGroup),
        recipientsTypeGroup: validateString(values.recipientsTypeGroup),
        totalBudget: validateBudget(values.totalBudget, values.budgetPerPerson),
        budgetPerPerson: validateBudget(values.totalBudget, values.budgetPerPerson),
        joinFrom: '',
        joinTo: '',
        spendFrom: validateDateRange(new Date(values.spendFrom), new Date(values.spendTo)),
        spendTo: validateDateRange(new Date(values.spendFrom), new Date(values.spendTo)),
      };
      console.log(errors);
      return errors;
    },

    onSubmit: (values) => {
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
            defaultValue="persons"
            onChange={formik.handleChange}
          >
            <FormControlLabel
              value="persons"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.person')}
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value="families"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.family')}
              disabled
            />
          </RadioGroup>
          <FormHelperText
            error={fieldOnError(
              formik.errors.recipientsQuestionGroup,
              formik.touched.recipientsQuestionGroup
            )}
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.errors.recipientsQuestionGroup}
          </FormHelperText>
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
            defaultValue="manual_list"
            onChange={formik.handleChange}
          >
            <FormControlLabel
              value="tax_code_list"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.taxCodeList')}
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value="manual_list"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.manualSelection')}
            />
          </RadioGroup>
          <FormHelperText
            error={fieldOnError(
              formik.errors.recipientsTypeGroup,
              formik.touched.recipientsTypeGroup
            )}
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.errors.recipientsTypeGroup}
          </FormHelperText>
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
          {!isNaN(
            parseInt(formik.values.totalBudget, 10) / parseInt(formik.values.budgetPerPerson, 10)
          ) && (
            <FormLabel
              sx={{ fontSize: '16px', gridArea: 'budgetPerPersonCalcTitle', justifySelf: 'end' }}
            >
              {t('components.wizard.stepOne.form.reachedUsers')}
            </FormLabel>
          )}
          <TextField
            sx={{ gridArea: 'totalBudget' }}
            inputProps={{
              step: 1,
              min: 1,
              type: 'number',
            }}
            label={t('components.wizard.stepOne.form.totalBudget')}
            placeholder={t('components.wizard.stepOne.form.totalBudget')}
            name="totalBudget"
            value={formik.values.totalBudget}
            onChange={formik.handleChange}
            error={fieldOnError(formik.errors.totalBudget, formik.touched.totalBudget)}
            helperText={formik.errors.totalBudget}
          />
          <TextField
            sx={{ gridArea: 'budgetPerPerson' }}
            inputProps={{
              step: 1,
              min: 1,
              type: 'number',
            }}
            label={t('components.wizard.stepOne.form.budgetPerPerson')}
            placeholder={t('components.wizard.stepOne.form.budgetPerPerson')}
            name="budgetPerPerson"
            value={formik.values.budgetPerPerson}
            onChange={formik.handleChange}
            error={fieldOnError(formik.errors.budgetPerPerson, formik.touched.budgetPerPerson)}
            helperText={formik.errors.budgetPerPerson}
          />
          {!isNaN(
            parseInt(formik.values.totalBudget, 10) / parseInt(formik.values.budgetPerPerson, 10)
          ) && (
            <Typography
              variant="subtitle2"
              sx={{ gridArea: 'budgetPerPersonCalc', justifySelf: 'end', alignSelf: 'center' }}
            >
              {parseInt(formik.values.totalBudget, 10) /
                parseInt(formik.values.budgetPerPerson, 10)}
            </Typography>
          )}
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
            error={fieldOnError(formik.errors.joinFrom, formik.touched.joinFrom)}
            helperText={formik.errors.joinFrom}
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
            error={fieldOnError(formik.errors.joinTo, formik.touched.joinTo)}
            helperText={formik.errors.joinTo}
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={t('components.wizard.stepOne.form.timeRangeSpendFrom')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.spendFrom}
              onChange={(value) => formik.setFieldValue('spendFrom', value)}
              minDate={addDays(new Date(formik.values.joinTo), 1)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="spend-from"
                  label={t('components.wizard.stepOne.form.timeRangeSpendFrom')}
                  name="spendFrom"
                  type="date"
                  sx={{ gridArea: 'timeRangeSpendFrom' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={fieldOnError(formik.errors.spendFrom, formik.touched.spendFrom)}
                  helperText={formik.errors.spendFrom}
                />
              )}
            />
            <DesktopDatePicker
              label={t('components.wizard.stepOne.form.timeRangeSpendTo')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.spendTo}
              onChange={(value) => formik.setFieldValue('spendTo', value)}
              minDate={addDays(new Date(formik.values.spendFrom), 1)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="spend-to"
                  label={t('components.wizard.stepOne.form.timeRangeSpendTo')}
                  name="spendTo"
                  type="date"
                  sx={{ gridArea: 'timeRangeSpendTo' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={fieldOnError(formik.errors.spendTo, formik.touched.spendTo)}
                  helperText={formik.errors.spendTo}
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
      </form>
    </Paper>
  );
};

export default StepOneForm;
