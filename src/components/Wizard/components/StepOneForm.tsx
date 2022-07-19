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
import _ from 'lodash';
import { setGeneralInfo, generalInfoSelector } from '../../../redux/slices/initiativeSlice';
import { WIZARD_ACTIONS } from '../../../utils/constants';
import { saveGeneralInfoService } from '../../../services/intitativeService';
import { BeneficiaryTypeEnum } from '../../../utils/constants';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

const StepOneForm = ({ action, setAction, currentStep, setCurrentStep }: Props) => {
  const dispatch = useDispatch();
  const formData = useSelector(generalInfoSelector);
  const { t } = useTranslation();

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      dispatch(setGeneralInfo(formik.values));
    }
    setAction('');
  }, [action]);

  const peopleReached = (totalBudget: string, budgetPerPerson: string) => {
    const totalBudgetInt = parseInt(totalBudget, 10);
    const budgetPerPersonInt = parseInt(budgetPerPerson, 10);
    return Math.floor(totalBudgetInt / budgetPerPersonInt);
  };

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
    rankingStartDate: Yup.date(),
    rankingEndDate: Yup.date().when('rankingStartDate', (rankingStartDate, schema) => {
      if (rankingStartDate) {
        return Yup.date()
          .min(rankingStartDate, t('validation.outJoinTo'))
          .required(t('validation.required'));
      }
      return schema;
    }),
    startDate: Yup.date()
      .required(t('validation.required'))
      .when('rankingEndDate', (rankingEndDate, schema) => {
        if (rankingEndDate) {
          return Yup.date()
            .min(rankingEndDate, t('validation.outSpendFrom'))
            .required(t('validation.required'));
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

  const parseValuesFormToInitiativeGeneralDTO = (values: any) => ({
    name: 'test',
    beneficiaryType:
      values.beneficiaryType === 'PF' ? BeneficiaryTypeEnum.PF : BeneficiaryTypeEnum.PG,
    beneficiaryKnown: values.beneficiaryKnown === 'true' ? true : false,
    budget: Number(values.budget),
    beneficiaryBudget: Number(values.beneficiaryBudget),
    rankingStartDate: new Date(values.rankingStartDate),
    rankingEndDate: new Date(values.rankingEndDate),
    startDate: new Date(values.startDate),
    endDate: new Date(values.endDate),
  });

  const formik = useFormik({
    initialValues: {
      beneficiaryType: formData.beneficiaryType,
      beneficiaryKnown: formData.beneficiaryKnown,
      budget: formData.budget,
      beneficiaryBudget: formData.beneficiaryBudget,
      rankingStartDate: formData.rankingStartDate,
      rankingEndDate: formData.rankingEndDate,
      startDate: formData.startDate,
      endDate: formData.endDate,
    },
    validateOnChange: true,
    validationSchema,
    onSubmit: (values) => {
      const formValuesParsed = parseValuesFormToInitiativeGeneralDTO(values);
      saveGeneralInfoService(formValuesParsed)
        .then((response) => {
          console.log('PIPPONE', response);
          dispatch(setGeneralInfo(values));
          setCurrentStep(currentStep + 1);
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
            name="budget"
            value={formik.values.budget}
            onChange={(e) => formik.handleChange(e)}
            error={formik.touched.budget && Boolean(formik.errors.budget)}
            helperText={formik.touched.budget && formik.errors.budget}
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
            name="beneficiaryBudget"
            value={formik.values.beneficiaryBudget}
            onChange={(e) => formik.handleChange(e)}
            error={formik.touched.beneficiaryBudget && Boolean(formik.errors.beneficiaryBudget)}
            helperText={formik.touched.beneficiaryBudget && formik.errors.beneficiaryBudget}
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
                  name="rankingStartDate"
                  type="date"
                  sx={{ gridArea: 'rankingStartDate' }}
                  error={formik.touched.rankingStartDate && Boolean(formik.errors.rankingStartDate)}
                  helperText={formik.touched.rankingStartDate && formik.errors.rankingStartDate}
                />
              )}
            />
            <DesktopDatePicker
              label={t('components.wizard.stepOne.form.rankingEndDate')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.rankingEndDate}
              onChange={(value) => formik.setFieldValue('rankingEndDate', value)}
              minDate={addDays(new Date(formik.values.rankingStartDate), 1)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="rankingEndDate"
                  name="rankingEndDate"
                  type="date"
                  sx={{ gridArea: 'rankingEndDate' }}
                  error={formik.touched.rankingEndDate && Boolean(formik.errors.rankingEndDate)}
                  helperText={formik.touched.rankingEndDate && formik.errors.rankingEndDate}
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
              minDate={addDays(new Date(formik.values.rankingEndDate), 1)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="startDate"
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
              minDate={addDays(new Date(formik.values.startDate), 1)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="endDate"
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
