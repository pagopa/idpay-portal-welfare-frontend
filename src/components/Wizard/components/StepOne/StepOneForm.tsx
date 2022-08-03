/* eslint-disable no-prototype-builtins */
/* eslint-disable complexity */
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
  Button,
  Switch,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import * as Yup from 'yup';
import _ from 'lodash';
import { shallowEqual } from 'react-redux';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  setInitiativeId,
  generalInfoSelector,
  additionalInfoSelector,
  setGeneralInfo,
  setAdditionalInfo,
  initiativeIdSelector,
} from '../../../../redux/slices/initiativeSlice';
import { BeneficiaryTypeEnum, WIZARD_ACTIONS } from '../../../../utils/constants';
import { saveGeneralInfoService, putGeneralInfo } from '../../../../services/intitativeService';
import {
  getMinDate,
  peopleReached,
  parseValuesFormToInitiativeGeneralDTO,
  serviceOptions,
  contacts,
  getYesterday,
} from './helpers';
interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const StepOneForm = ({ action, setAction, currentStep, setCurrentStep }: Props) => {
  const dispatch = useAppDispatch();
  const generalInfoForm = useAppSelector(generalInfoSelector, shallowEqual);
  const additionalInfoForm = useAppSelector(additionalInfoSelector, shallowEqual);
  const initiativeIdSel = useAppSelector(initiativeIdSelector, shallowEqual);
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(additionalInfoForm.serviceId ? true : false);

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
      .positive(t('validation.positive')),
    // .integer(t('validation.integer')),
    beneficiaryBudget: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      // .integer(t('validation.integer'))
      // eslint-disable-next-line sonarjs/no-identical-functions
      .when('budget', (budget, schema) => {
        if (budget) {
          return (
            Yup.number()
              .typeError(t('validation.numeric'))
              .required(t('validation.required'))
              .positive(t('validation.positive'))
              // .integer(t('validation.integer'))
              .max(parseFloat(budget) - 1, t('validation.outBudgetPerPerson'))
          );
        }
        return schema;
      }),
    rankingStartDate: Yup.date().nullable().typeError(t('validation.invalidDate')),
    // eslint-disable-next-line sonarjs/no-identical-functions
    rankingEndDate: Yup.date()
      .nullable()
      .typeError(t('validation.invalidDate'))
      .when('rankingStartDate', (rankingStartDate, _schema) => {
        const timestamp = Date.parse(rankingStartDate);
        if (isNaN(timestamp) === false) {
          return Yup.date()
            .min(rankingStartDate, t('validation.outJoinTo'))
            .required(t('validation.required'))
            .typeError(t('validation.invalidDate'));
        } else {
          return Yup.date().nullable().default(undefined).typeError(t('validation.invalidDate'));
        }
      }),
    startDate: Yup.date()
      .nullable()
      .required(t('validation.required'))
      .typeError(t('validation.invalidDate'))
      // eslint-disable-next-line sonarjs/no-identical-functions
      .when('rankingEndDate', (rankingEndDate, _schema) => {
        const timestamp = Date.parse(rankingEndDate);
        if (isNaN(timestamp) === false) {
          return Yup.date()
            .min(rankingEndDate, t('validation.outSpendFrom'))
            .required(t('validation.required'))
            .typeError(t('validation.invalidDate'));
        } else {
          return Yup.date()
            .nullable()
            .min(getYesterday())
            .required(t('validation.required'))
            .typeError(t('validation.invalidDate'));
        }
      }),
    endDate: Yup.date()
      .nullable()
      .required(t('validation.required'))
      .typeError(t('validation.invalidDate'))
      // eslint-disable-next-line sonarjs/no-identical-functions
      .when('startDate', (startDate, schema) => {
        const timestamp = Date.parse(startDate);
        if (isNaN(timestamp) === false) {
          return Yup.date()
            .nullable()
            .min(startDate, t('validation.outSpendTo'))
            .required(t('validation.required'))
            .typeError(t('validation.invalidDate'));
        }
        return schema;
      }),
    initiativeOnIO: Yup.boolean(),
    serviceId: Yup.string()
      .nullable()
      .default(undefined)
      .when('initiativeOnIO', {
        is: true,
        then: Yup.string().required(t('validation.required')),
      }),
    serviceName: Yup.string()
      .nullable()
      .default(undefined)
      .when('initiativeOnIO', {
        is: false,
        then: Yup.string()
          .max(50, t('validation.maxServiceNameChar'))
          .required(t('validation.required')),
      }),
    argument: Yup.string()
      .nullable()
      .default(undefined)
      .when('initiativeOnIO', {
        is: false,
        then: Yup.string()
          .max(50, t('validation.maxServiceNameChar'))
          .required(t('validation.required')),
      }),
    description: Yup.string()
      .nullable()
      .default(undefined)
      .when('initiativeOnIO', {
        is: false,
        then: Yup.string()
          .max(50, t('validation.maxServiceNameChar'))
          .required(t('validation.required')),
      }),
    channels: Yup.array()
      .nullable()
      .default(undefined)
      .when('initiativeOnIO', {
        is: false,
        then: Yup.array().of(
          Yup.object().shape({
            type: Yup.string().required(t('validation.required')),
            contact: Yup.string()
              .required(t('validation.required'))
              .when('type', (type, schema) => {
                if (type && type === 'web') {
                  return Yup.string()
                    .required(t('validation.required'))
                    .url(t('validation.webValid'));
                }
                if (type && type === 'email') {
                  return Yup.string()
                    .required(t('validation.required'))
                    .email(t('validation.emailValid'));
                }
                if (type && type === 'mobile') {
                  return Yup.string()
                    .required(t('validation.required'))
                    .matches(/^\s*[0-9]{2,4}-?\/?\s?[0-9]{1,10}\s*$/, t('validation.celNumValid'));
                }
                return schema;
              }),
          })
        ),
      }),
  });

  const formik = useFormik({
    initialValues: {
      beneficiaryType: generalInfoForm.beneficiaryType,
      beneficiaryKnown: generalInfoForm.beneficiaryKnown,
      budget: generalInfoForm.budget,
      beneficiaryBudget: generalInfoForm.beneficiaryBudget,
      rankingStartDate: generalInfoForm.rankingStartDate,
      rankingEndDate: generalInfoForm.rankingEndDate,
      startDate: generalInfoForm.startDate,
      endDate: generalInfoForm.endDate,
      initiativeOnIO: additionalInfoForm.serviceId ? true : false,
      serviceId: additionalInfoForm.serviceId,
      serviceName: additionalInfoForm.serviceName,
      argument: additionalInfoForm.argument,
      description: additionalInfoForm.description,
      channels: [...additionalInfoForm.channels],
    },
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema,
    onSubmit: (values) => {
      const formValuesParsed = parseValuesFormToInitiativeGeneralDTO(values);
      const { additionalInfo } = formValuesParsed;
      dispatch(setGeneralInfo(values));
      dispatch(setAdditionalInfo(additionalInfo));

      if (!initiativeIdSel) {
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
      } else if (typeof initiativeIdSel === 'string') {
        putGeneralInfo(initiativeIdSel, formValuesParsed)
          .then((_response) => {
            setCurrentStep(currentStep + 1);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  });

  const handleInitiativeOnIO = (value: boolean, setFieldValue: any) => {
    setIsChecked(() => value);
    setFieldValue('initiativeOnIO', value);
    if (value === true) {
      setFieldValue('serviceName', '');
      setFieldValue('description', '');
      setFieldValue('argument', '');
      setFieldValue('channels', [{ type: '', contact: '' }]);
    } else {
      setFieldValue('serviceId', '');
    }
  };

  const addAssistanceChannel = (values: any, setValues: any) => {
    const newAssistanceChannel = [...values.channels, { type: '', contact: '' }];
    setValues({ ...values, channels: newAssistanceChannel });
  };

  const deleteAssistanceChannel = (i: number, values: any, setValues: any, setTouched: any) => {
    const indexValueToRemove = i;
    // eslint-disable-next-line functional/immutable-data
    const newValues = values.channels.filter((v: any, i: number) => {
      if (i !== indexValueToRemove) {
        return v;
      }
    });
    setValues({ ...values, channels: newValues });
    setTouched({}, false);
  };

  const handleAssistanceChannelDTOChange = (
    e: any,
    i: number,
    values: any,
    setValues: any,
    setTouched: any
  ) => {
    const assistanceChannelChanged = [...values.channels];
    // eslint-disable-next-line functional/immutable-data
    assistanceChannelChanged[i] = {
      ...assistanceChannelChanged[i],
      contact: e.target.value,
    };

    setValues({ ...values, channels: [...assistanceChannelChanged] });
    setTouched({}, false);
  };

  const handleContactSelect = (
    e: any,
    setValues: any,
    index: number,
    values: {
      beneficiaryType: BeneficiaryTypeEnum;
      beneficiaryKnown: string | undefined;
      budget: string;
      beneficiaryBudget: string;
      startDate: Date | string | undefined;
      endDate: Date | string | undefined;
      rankingStartDate: Date | string | undefined;
      rankingEndDate: Date | string | undefined;
      serviceId: string | undefined;
      serviceName: string | undefined;
      argument: string | undefined;
      description: string | undefined;
      channels: Array<{ type: string; contact: string }>;
    },
    setTouched: any
  ) => {
    const newValue = e.target.value;
    const newAssistanceChannel = values.channels.map((v, i) => {
      if (i === index) {
        return {
          type: newValue,
          contact: v.contact,
        };
      } else {
        return { ...v };
      }
    });
    setValues({ ...values, channels: [...newAssistanceChannel] });
    setTouched({}, false);
  };

  return (
    <>
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
                step: 0.01,
                min: 1,
                type: 'number',
              }}
              label={t('components.wizard.stepOne.form.budget')}
              placeholder={t('components.wizard.stepOne.form.budget')}
              /* needed by getByTextLabel */
              aria-labelledby={t('components.wizard.stepOne.form.budget')}
              id={t('components.wizard.stepOne.form.budget')}
              name="budget"
              value={formik.values.budget}
              onChange={(e) => formik.handleChange(e)}
              error={formik.touched.budget && Boolean(formik.errors.budget)}
              helperText={formik.touched.budget && formik.errors.budget}
              data-testid="budget-test"
              required
              InputLabelProps={{ required: false }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EuroSymbolIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              sx={{ gridArea: 'beneficiaryBudget' }}
              inputProps={{
                step: 0.01,
                min: 1,
                type: 'number',
              }}
              label={t('components.wizard.stepOne.form.beneficiaryBudget')}
              placeholder={t('components.wizard.stepOne.form.beneficiaryBudget')}
              /* needed by getByTextLbel */
              aria-labelledby={t('components.wizard.stepOne.form.beneficiaryBudget')}
              id={t('components.wizard.stepOne.form.beneficiaryBudget')}
              name="beneficiaryBudget"
              value={formik.values.beneficiaryBudget}
              onChange={(e) => formik.handleChange(e)}
              error={formik.touched.beneficiaryBudget && Boolean(formik.errors.beneficiaryBudget)}
              helperText={formik.touched.beneficiaryBudget && formik.errors.beneficiaryBudget}
              data-testid="beneficiary-budget-test"
              required
              InputLabelProps={{ required: false }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EuroSymbolIcon />
                  </InputAdornment>
                ),
              }}
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
                    error={
                      formik.touched.rankingStartDate && Boolean(formik.errors.rankingStartDate)
                    }
                    helperText={formik.touched.rankingStartDate && formik.errors.rankingStartDate}
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
                    required
                    InputLabelProps={{ required: false }}
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
                    required
                    InputLabelProps={{ required: false }}
                  />
                )}
              />
            </LocalizationProvider>
          </FormControl>
        </form>
      </Paper>
      <Paper sx={{ mt: 5 }}>
        <Box sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
          <Box sx={{ py: 3 }}>
            <Typography variant="h6">
              {t('components.wizard.stepOne.form.otherInfo.title')}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="body1">
                {t('components.wizard.stepOne.form.otherInfo.subTitle')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Button size="small" href="" sx={{ p: 0 }}>
                {t('components.wizard.common.links.findOut')}
              </Button>
            </Box>
          </Box>

          <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', py: 2 }}>
            <FormControlLabel
              sx={{ gridColumn: 'span 1' }}
              control={
                <Switch
                  value={isChecked}
                  onChange={(e) => {
                    handleInitiativeOnIO(e.target.checked, formik.setFieldValue);
                  }}
                  name="initiativeOnIO"
                />
              }
              label={t('components.wizard.stepOne.form.otherInfo.deliverInitiative')}
            />
          </FormControl>

          <FormControl>
            {isChecked ? (
              <>
                <FormControl
                  sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}
                >
                  <InputLabel sx={{ mt: 2 }}>
                    {t('components.wizard.stepOne.form.otherInfo.serviceSelect')}
                  </InputLabel>
                  <Select
                    defaultValue=""
                    label={t('components.wizard.stepOne.form.otherInfo.serviceSelect')}
                    placeholder={t('components.wizard.stepOne.form.otherInfo.serviceSelect')}
                    sx={{ gridColumn: 'span 9' }}
                    onChange={(e) => formik.setFieldValue('serviceId', e.target.value)}
                    error={formik.touched.serviceId && Boolean(formik.errors.serviceId)}
                    value={formik.values.serviceId}
                  >
                    {serviceOptions.map(({ name, value }) => (
                      <MenuItem key={value} value={value}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText
                    error={formik.touched.serviceId && Boolean(formik.errors.serviceId)}
                    sx={{ gridColumn: 'span 12' }}
                  >
                    {formik.touched.serviceId && formik.errors.serviceId}
                  </FormHelperText>
                </FormControl>
              </>
            ) : (
              <>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
                  <Typography sx={{ fontSize: '18px', fontWeight: '600', gridColumn: 'span 2' }}>
                    {t('components.wizard.stepOne.form.otherInfo.description')}
                  </Typography>
                </Box>
                <FormControl
                  sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}
                >
                  <TextField
                    label={t('components.wizard.stepOne.form.otherInfo.serviceName')}
                    placeholder={t('components.wizard.stepOne.form.otherInfo.serviceName')}
                    sx={{ gridColumn: 'span 6', pr: 4 }}
                    value={formik.values.serviceName}
                    onChange={(e) => formik.setFieldValue('serviceName', e.target.value)}
                    error={formik.touched.serviceName && Boolean(formik.errors.serviceName)}
                    helperText={formik.touched.serviceName && formik.errors.serviceName}
                  />
                  <TextField
                    label={t('components.wizard.stepOne.form.otherInfo.argument')}
                    placeholder={t('components.wizard.stepOne.form.otherInfo.argument')}
                    sx={{ gridColumn: 'span 6' }}
                    value={formik.values.argument}
                    onChange={(e) => formik.setFieldValue('argument', e.target.value)}
                    error={formik.touched.argument && Boolean(formik.errors.argument)}
                    helperText={formik.touched.argument && formik.errors.argument}
                  />
                  <TextField
                    sx={{ gridColumn: 'span 12', mt: 4 }}
                    multiline
                    maxRows={4}
                    label={t('components.wizard.stepOne.form.otherInfo.description')}
                    placeholder={t('components.wizard.stepOne.form.otherInfo.description')}
                    value={formik.values.description}
                    onChange={(e) => formik.setFieldValue('description', e.target.value)}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </FormControl>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
                  <Typography sx={{ fontSize: '18px', fontWeight: '600', gridColumn: 'span 2' }}>
                    {t('components.wizard.stepOne.form.otherInfo.helpChannels')}
                  </Typography>
                  <Tooltip
                    title={t('components.wizard.stepOne.form.otherInfo.helpChannelsTooltip')}
                    placement="right"
                    arrow
                  >
                    <InfoOutlinedIcon color="primary" />
                  </Tooltip>
                </Box>

                {formik.values.channels.map((_o, i) => {
                  const channelErrors =
                    (formik.errors.channels?.length && formik.errors.channels[i]) || {};
                  const channelTouched =
                    (formik.touched.channels?.length && formik.touched.channels[i]) || {};

                  const typeError = typeof channelErrors === 'string' ? '' : channelErrors.type;
                  const typeTouched = channelTouched.type;
                  const contactError =
                    typeof channelErrors === 'string' ? '' : channelErrors.contact;
                  const contactTouched = channelTouched.contact;

                  return (
                    <Box
                      key={i}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(24, 1fr)',
                        py: 2,
                      }}
                    >
                      <FormControl sx={{ gridColumn: 'span 1' }}>
                        {i !== 0 && (
                          <RemoveCircleOutlineIcon
                            color="error"
                            sx={{
                              cursor: 'pointer',
                              alignItems: 'start',
                              mt: 2,
                              fontSize: 30,
                              gridColumn: 'span 1',
                            }}
                            onClick={() =>
                              deleteAssistanceChannel(
                                i,
                                formik.values,
                                formik.setValues,
                                formik.setTouched
                              )
                            }
                          />
                        )}
                      </FormControl>

                      <FormControl
                        sx={{ gridColumn: 'span 4' }}
                        error={typeTouched && Boolean(typeError)}
                      >
                        <InputLabel id={`channels[${i}].type}_label`}>
                          {t('components.wizard.stepOne.form.otherInfo.contact')}
                        </InputLabel>
                        <Select
                          labelId={`channels[${i}].type}_label`}
                          name={`channels[${i}].type}`}
                          label={t('components.wizard.stepOne.form.otherInfo.contact')}
                          value={formik.values.channels[i].type}
                          onChange={(e) =>
                            handleContactSelect(
                              e,
                              formik.setValues,
                              i,
                              formik.values,
                              formik.setTouched
                            )
                          }
                          error={typeTouched && Boolean(typeError)}
                        >
                          {contacts.map(({ name, value }, id) => (
                            <MenuItem key={id} value={value}>
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{typeTouched && typeError}</FormHelperText>
                      </FormControl>
                      <FormControl sx={{ gridColumn: 'span 10' }}>
                        <TextField
                          id={`channels[${i}].contact}`}
                          name={`channels[${i}].contact}`}
                          variant="outlined"
                          label={t('components.wizard.stepOne.form.otherInfo.indicatesChannel')}
                          sx={{ gridColumn: 'span 12', ml: 4, gridArea: 'Channel' }}
                          placeholder={t(
                            'components.wizard.stepOne.form.otherInfo.indicatesChannel'
                          )}
                          value={formik.values.channels[i].contact}
                          onChange={(e) =>
                            handleAssistanceChannelDTOChange(
                              e,
                              i,
                              formik.values,
                              formik.setValues,
                              formik.setTouched
                            )
                          }
                          error={contactTouched && Boolean(contactError)}
                          helperText={contactTouched && contactError}
                        />
                      </FormControl>
                    </Box>
                  );
                })}
                <FormControl
                  sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}
                >
                  <Button
                    sx={[
                      {
                        justifyContent: 'start',
                        padding: 0,
                        gridColumn: 'span 12',
                      },
                      {
                        '&:hover': { backgroundColor: 'transparent' },
                      },
                    ]}
                    size="small"
                    variant="text"
                    startIcon={<AddIcon />}
                    color="primary"
                    onClick={() => addAssistanceChannel(formik.values, formik.setValues)}
                  >
                    {t('components.wizard.stepOne.form.otherInfo.addChannel')}
                  </Button>
                </FormControl>
              </>
            )}
          </FormControl>
        </Box>
      </Paper>
    </>
  );
};

export default StepOneForm;
