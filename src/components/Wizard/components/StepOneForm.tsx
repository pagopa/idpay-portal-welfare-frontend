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
  Tooltip,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { addDays } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { stepOneFormActions, stepOneFormSelector } from '../../../redux/slices/stepOneFormSlice';
import { WIZARD_ACTIONS } from '../../../utils/constants';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

const StepOneForm = ({ action, setAction, currentStep, setCurrentStep }: Props) => {
  const dispatch = useDispatch();
  const formData = useSelector(stepOneFormSelector);
  const { t } = useTranslation();

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      dispatch(stepOneFormActions.setFormData(formik.values));
    }
    setAction('');
  }, [action]);

  const peopleReached = (totalBudget: string, budgetPerPerson: string) => {
    const totalBudgetInt = parseInt(totalBudget, 10);
    const budgetPerPersonInt = parseInt(budgetPerPerson, 10);
    return Math.floor(totalBudgetInt / budgetPerPersonInt);
  };

  const validationSchema = Yup.object().shape({
    recipientsQuestionGroup: Yup.string().required(t('validation.required')),
    recipientsTypeGroup: Yup.string().required(t('validation.required')),
    totalBudget: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .integer(t('validation.integer')),
    budgetPerPerson: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .integer(t('validation.integer'))
      .when('totalBudget', (totalBudget, schema) => {
        if (totalBudget) {
          return Yup.number()
            .typeError(t('validation.numeric'))
            .required(t('validation.required'))
            .positive(t('validation.positive'))
            .integer(t('validation.integer'))
            .max(parseInt(totalBudget, 10) - 1, t('validation.outBudgetPerPerson'));
        }
        return schema;
      }),
    joinFrom: Yup.date().required(t('validation.required')),
    joinTo: Yup.date()
      .required(t('validation.required'))
      .when('joinFrom', (joinFrom, schema) => {
        if (joinFrom) {
          return Yup.date()
            .min(joinFrom, t('validation.outJoinTo'))
            .required(t('validation.required'));
        }
        return schema;
      }),
    spendFrom: Yup.date()
      .required(t('validation.required'))
      .when('joinTo', (joinTo, schema) => {
        if (joinTo) {
          return Yup.date()
            .min(joinTo, t('validation.outSpendFrom'))
            .required(t('validation.required'));
        }
        return schema;
      }),
    spendTo: Yup.date()
      .required(t('validation.required'))
      .when('spendFrom', (spendFrom, schema) => {
        if (spendFrom) {
          return Yup.date()
            .min(spendFrom, t('validation.outSpendTo'))
            .required(t('validation.required'));
        }
        return schema;
      }),
  });

  const formik = useFormik({
    initialValues: {
      recipientsQuestionGroup: formData.form.recipientsQuestionGroup,
      recipientsTypeGroup: formData.form.recipientsTypeGroup,
      totalBudget: formData.form.totalBudget,
      budgetPerPerson: formData.form.budgetPerPerson,
      joinFrom: formData.form.joinFrom,
      joinTo: formData.form.joinTo,
      spendFrom: formData.form.spendFrom,
      spendTo: formData.form.spendTo,
    },

    validateOnChange: true,
    validationSchema,
    onSubmit: (values) => {
      dispatch(stepOneFormActions.setFormData(values));
      setCurrentStep(currentStep + 1);
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
            data-testid="recipients-question-label"
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
            onChange={(value) => formik.setFieldValue('recipientsQuestionGroup', value)}
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
            error={
              formik.touched.recipientsQuestionGroup &&
              Boolean(formik.errors.recipientsQuestionGroup)
            }
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.touched.recipientsQuestionGroup && formik.errors.recipientsQuestionGroup}
          </FormHelperText>
        </FormControl>
        <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
          <FormLabel
            sx={{ gridColumn: 'span 12', pb: 1, fontSize: '16px', fontWeight: '600' }}
            id="recipients-type--label"
            data-testid="recipients-type-label"
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
            onChange={(e) => formik.setFieldValue('recipientsTypeGroup', e.target.value, false)}
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
            error={formik.touched.recipientsTypeGroup && Boolean(formik.errors.recipientsTypeGroup)}
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.touched.recipientsTypeGroup && formik.errors.recipientsTypeGroup}
          </FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"budgetTitle budgetTitle . ." 
                                  "totalBudget budgetPerPerson . budgetPerPersonCalc"`,
            py: 2,
          }}
        >
          <FormLabel sx={{ fontSize: '16px', fontWeight: '600', gridArea: 'budgetTitle' }}>
            {t('components.wizard.stepOne.form.budget')}
          </FormLabel>
          <TextField
            sx={{ gridArea: 'totalBudget' }}
            inputProps={{
              step: 1,
              min: 1,
              type: 'number',
            }}
            id="total-budget"
            data-testid="total-budget-t"
            label={t('components.wizard.stepOne.form.totalBudget')}
            placeholder={t('components.wizard.stepOne.form.totalBudget')}
            name="totalBudget"
            value={formik.values.totalBudget}
            onChange={(e) => formik.handleChange(e)}
            error={formik.touched.totalBudget && Boolean(formik.errors.totalBudget)}
            helperText={formik.touched.totalBudget && formik.errors.totalBudget}
            required
          />
          <TextField
            sx={{ gridArea: 'budgetPerPerson' }}
            inputProps={{
              step: 1,
              min: 1,
              type: 'number',
            }}
            id="budget-per-person"
            data-testid="budget-per-person"
            label={t('components.wizard.stepOne.form.budgetPerPerson')}
            placeholder={t('components.wizard.stepOne.form.budgetPerPerson')}
            name="budgetPerPerson"
            value={formik.values.budgetPerPerson}
            onChange={(e) => formik.handleChange(e)}
            error={formik.touched.budgetPerPerson && Boolean(formik.errors.budgetPerPerson)}
            helperText={formik.touched.budgetPerPerson && formik.errors.budgetPerPerson}
            required
          />
          {!isNaN(peopleReached(formik.values.totalBudget, formik.values.budgetPerPerson)) && (
            <Box
              sx={{
                gridArea: 'budgetPerPersonCalc',
                justifySelf: 'end',
                alignSelf: 'center',
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
                backgroundColor: grey[100],
                borderRadius: 2,
                py: 2,
              }}
            >
              <Typography
                variant="body2"
                component="span"
                sx={{ display: 'flex', alignSelf: 'center' }}
              >
                {t('components.wizard.stepOne.form.reachedUsers')}
              </Typography>
              <Typography
                variant="subtitle2"
                component="span"
                sx={{ display: 'flex', alignSelf: 'center' }}
              >
                {peopleReached(formik.values.totalBudget, formik.values.budgetPerPerson)}
              </Typography>
              <Tooltip
                title={t('components.wizard.stepOne.form.reachedUsersTooltip')}
                placement="top"
                arrow
              >
                <InfoOutlinedIcon color="primary" />
              </Tooltip>
            </Box>
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={t('components.wizard.stepOne.form.timeRangeJoinFrom')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.joinFrom}
              onChange={(value) => formik.setFieldValue('joinFrom', value)}
              minDate={new Date()}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="join-from"
                  data-testid="join-from-t"
                  name="joinFrom"
                  type="date"
                  sx={{ gridArea: 'timeRangeJoinFrom' }}
                  error={formik.touched.joinFrom && Boolean(formik.errors.joinFrom)}
                  helperText={formik.touched.joinFrom && formik.errors.joinFrom}
                  required
                />
              )}
            />
            <DesktopDatePicker
              label={t('components.wizard.stepOne.form.timeRangeJoinTo')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.joinTo}
              onChange={(value) => formik.setFieldValue('joinTo', value)}
              minDate={addDays(new Date(formik.values.joinFrom), 1)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="join-to"
                  data-testid="join-to-t"
                  name="joinTo"
                  type="date"
                  sx={{ gridArea: 'timeRangeJoinTo' }}
                  error={formik.touched.joinTo && Boolean(formik.errors.joinTo)}
                  helperText={formik.touched.joinTo && formik.errors.joinTo}
                  required
                />
              )}
            />
          </LocalizationProvider>
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
                  data-testid="spend-from-t"
                  name="spendFrom"
                  type="date"
                  sx={{ gridArea: 'timeRangeSpendFrom' }}
                  error={formik.touched.spendFrom && Boolean(formik.errors.spendFrom)}
                  helperText={formik.touched.spendFrom && formik.errors.spendFrom}
                  required
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
                  data-testid="spend-to-t"
                  name="spendTo"
                  type="date"
                  sx={{ gridArea: 'timeRangeSpendTo' }}
                  error={formik.touched.spendTo && Boolean(formik.errors.spendTo)}
                  helperText={formik.touched.spendTo && formik.errors.spendTo}
                  required
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
