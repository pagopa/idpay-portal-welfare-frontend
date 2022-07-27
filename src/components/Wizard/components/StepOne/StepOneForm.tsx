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
import * as Yup from 'yup';
import _ from 'lodash';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  setInitiativeId,
  generalInfoSelector,
  setGeneralInfo,
} from '../../../../redux/slices/initiativeSlice';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { saveGeneralInfoService } from '../../../../services/intitativeService';
import { getMinDate, peopleReached, parseValuesFormToInitiativeGeneralDTO } from './helpers';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

const StepOneForm = ({ action, setAction, currentStep, setCurrentStep }: Props) => {
  const dispatch = useAppDispatch();
  const generalInfoForm = useAppSelector(generalInfoSelector, shallowEqual);
  const { t } = useTranslation();

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      dispatch(setGeneralInfo(formik.values));
    }
    setAction('');
  }, [action]);

  const validationSchema = Yup.object().shape({
    beneficiaryType: Yup.string().required(t('validation.required')),
    beneficiaryKnown: Yup.string().required(t('validation.required')),
    budget: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .integer(t('validation.integer')),
    beneficiaryBudget: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .integer(t('validation.integer'))
      .when('budget', (budget, schema) => {
        if (budget) {
          return Yup.number()
            .typeError(t('validation.numeric'))
            .required(t('validation.required'))
            .positive(t('validation.positive'))
            .integer(t('validation.integer'))
            .max(parseInt(budget, 10) - 1, t('validation.outBudgetPerPerson'));
        }
        return schema;
      }),
    rankingStartDate: Yup.date().nullable().default(undefined),
    rankingEndDate: Yup.date().when('rankingStartDate', (rankingStartDate, _schema) => {
      if (rankingStartDate !== null) {
        return Yup.date()
          .min(rankingStartDate, t('validation.outJoinTo'))
          .required(t('validation.required'));
      } else {
        return Yup.date().nullable().default(undefined);
      }
    }),
    startDate: Yup.date()
      .required(t('validation.required'))
      .when('rankingEndDate', (rankingEndDate, schema) => {
        if (rankingEndDate) {
          return Yup.date()
            .min(rankingEndDate, t('validation.outSpendFrom'))
            .required(t('validation.required'));
        } else {
          return Yup.date().min(new Date()).required(t('validation.required'));
        }
        return schema;
      }),
    endDate: Yup.date()
      .required(t('validation.required'))
      .when('startDate', (startDate, schema) => {
        if (startDate) {
          return Yup.date()
            .min(startDate, t('validation.outSpendTo'))
            .required(t('validation.required'));
        }
        return schema;
      }),
  });

  const formik = useFormik({
    initialValues: generalInfoForm,
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema,
    onSubmit: (values) => {
      const formValuesParsed = parseValuesFormToInitiativeGeneralDTO(values);
      dispatch(setGeneralInfo(values));
      saveGeneralInfoService(formValuesParsed)
        .then((response) => {
          const initiativeId = response?.initiativeId;
          if (typeof initiativeId === 'string') {
            dispatch(setInitiativeId(initiativeId));
            setCurrentStep(currentStep + 1);
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
            id="beneficiaryType--label"
          >
            {t('components.wizard.stepOne.form.beneficiaryType')}
          </FormLabel>
          <RadioGroup
            sx={{ gridColumn: 'span 12' }}
            row
            aria-labelledby="beneficiaryType--label"
            name="beneficiaryType"
            value={formik.values.beneficiaryType}
            defaultValue="persons"
            onChange={(value) => formik.setFieldValue('beneficiaryType', value)}
            data-testid="beneficiary-type-test"
          >
            <FormControlLabel
              value="PF"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.person')}
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value="families" // TBD
              control={<Radio />}
              label={t('components.wizard.stepOne.form.family')}
              disabled
            />
          </RadioGroup>
          <FormHelperText
            error={formik.touched.beneficiaryType && Boolean(formik.errors.beneficiaryType)}
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.touched.beneficiaryType && formik.errors.beneficiaryType}
          </FormHelperText>
        </FormControl>
        <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
          <FormLabel
            sx={{ gridColumn: 'span 12', pb: 1, fontSize: '16px', fontWeight: '600' }}
            id="beneficiaryKnown--label"
          >
            {t('components.wizard.stepOne.form.beneficiaryKnown')}
          </FormLabel>
          <RadioGroup
            sx={{ gridColumn: 'span 12' }}
            row
            aria-labelledby="beneficiaryKnown--label"
            name="beneficiaryKnown"
            value={formik.values.beneficiaryKnown}
            defaultValue={formik.values.beneficiaryKnown}
            onChange={(e) => formik.setFieldValue('beneficiaryKnown', e.target.value, false)}
            data-testid="beneficiary-known-test"
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.taxCodeList')}
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value="false"
              control={<Radio />}
              label={t('components.wizard.stepOne.form.manualSelection')}
            />
          </RadioGroup>
          <FormHelperText
            error={formik.touched.beneficiaryKnown && Boolean(formik.errors.beneficiaryKnown)}
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.touched.beneficiaryKnown && formik.errors.beneficiaryKnown}
          </FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"budgetTitle budgetTitle . ." 
                                  "budget beneficiaryBudget . budgetPerPersonCalc"`,
            py: 2,
          }}
        >
          <FormLabel sx={{ fontSize: '16px', fontWeight: '600', gridArea: 'budgetTitle' }}>
            {t('components.wizard.stepOne.form.budgetTitle')}
          </FormLabel>
          <TextField
            sx={{ gridArea: 'budget' }}
            inputProps={{
              step: 1,
              min: 1,
              type: 'number',
            }}
            label={t('components.wizard.stepOne.form.budget')}
            placeholder={t('components.wizard.stepOne.form.budget')}
            /* needed by getByTextLabel */
            aria-labelledby={t('components.wizard.stepOne.form.budget')}
            id={t('components.wizard.stepOne.form.budget')}
            /*  */
            name="budget"
            value={formik.values.budget}
            onChange={(e) => formik.handleChange(e)}
            error={formik.touched.budget && Boolean(formik.errors.budget)}
            helperText={formik.touched.budget && formik.errors.budget}
            data-testid="budget-test"
            required
          />
          <TextField
            sx={{ gridArea: 'beneficiaryBudget' }}
            inputProps={{
              step: 1,
              min: 1,
              type: 'number',
            }}
            label={t('components.wizard.stepOne.form.beneficiaryBudget')}
            placeholder={t('components.wizard.stepOne.form.beneficiaryBudget')}
            /* needed by getByTextLbel */
            aria-labelledby={t('components.wizard.stepOne.form.beneficiaryBudget')}
            id={t('components.wizard.stepOne.form.beneficiaryBudget')}
            /*  */
            name="beneficiaryBudget"
            value={formik.values.beneficiaryBudget}
            onChange={(e) => formik.handleChange(e)}
            error={formik.touched.beneficiaryBudget && Boolean(formik.errors.beneficiaryBudget)}
            helperText={formik.touched.beneficiaryBudget && formik.errors.beneficiaryBudget}
            data-testid="beneficiary-budget-test"
            required
          />
          {!isNaN(peopleReached(formik.values.budget, formik.values.beneficiaryBudget)) && (
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
                {peopleReached(formik.values.budget, formik.values.beneficiaryBudget)}
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
            gridTemplateAreas: `"timeRangeRankingTitle timeRangeRankingTitle timeRangeRankingTitle timeRangeRankingTitle" 
                                  "rankingStartDate rankingEndDate . . "`,
            py: 2,
          }}
        >
          <FormLabel
            sx={{ fontSize: '16px', fontWeight: '600', gridArea: 'timeRangeRankingTitle' }}
          >
            {t('components.wizard.stepOne.form.timeRangeRankingTitle')}
          </FormLabel>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={t('components.wizard.stepOne.form.rankingStartDate')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.rankingStartDate}
              onChange={(value) => formik.setFieldValue('rankingStartDate', value)}
              minDate={new Date()}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="rankingStartDate"
                  data-testid="ranking-start-date-test"
                  name="rankingStartDate"
                  type="date"
                  sx={{ gridArea: 'rankingStartDate' }}
                  error={formik.touched.rankingStartDate && Boolean(formik.errors.rankingStartDate)}
                  helperText={formik.touched.rankingStartDate && formik.errors.rankingStartDate}
                  required
                />
              )}
            />
            <DesktopDatePicker
              label={t('components.wizard.stepOne.form.rankingEndDate')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.rankingEndDate}
              onChange={(value) => formik.setFieldValue('rankingEndDate', value)}
              minDate={getMinDate(formik.values.rankingStartDate)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="rankingEndDate"
                  data-testid="ranking-end-date-test"
                  name="rankingEndDate"
                  type="date"
                  sx={{ gridArea: 'rankingEndDate' }}
                  error={formik.touched.rankingEndDate && Boolean(formik.errors.rankingEndDate)}
                  helperText={formik.touched.rankingEndDate && formik.errors.rankingEndDate}
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
            gridTemplateAreas: `"timeRangeTitle timeRangeTitle timeRangeTitle timeRangeTitle" 
                                  "startDate endDate . . "`,
            py: 2,
          }}
        >
          <FormLabel sx={{ fontSize: '16px', fontWeight: '600', gridArea: 'timeRangeTitle' }}>
            {t('components.wizard.stepOne.form.timeRangeTitle')}
          </FormLabel>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={t('components.wizard.stepOne.form.startDate')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.startDate}
              onChange={(value) => formik.setFieldValue('startDate', value)}
              minDate={getMinDate(formik.values.rankingEndDate)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="startDate"
                  data-testid="start-date-test"
                  name="startDate"
                  type="date"
                  sx={{ gridArea: 'startDate' }}
                  error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                  helperText={formik.touched.startDate && formik.errors.startDate}
                />
              )}
            />
            <DesktopDatePicker
              label={t('components.wizard.stepOne.form.endDate')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.endDate}
              onChange={(value) => formik.setFieldValue('endDate', value)}
              minDate={getMinDate(formik.values.startDate)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="endDate"
                  data-testid="end-date-test"
                  name="endDate"
                  type="date"
                  sx={{ gridArea: 'endDate' }}
                  error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                  helperText={formik.touched.endDate && formik.errors.endDate}
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
