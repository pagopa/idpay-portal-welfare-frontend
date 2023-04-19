/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable functional/immutable-data */
/* eslint-disable sonarjs/cognitive-complexity */
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
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import * as Yup from 'yup';
import _ from 'lodash';
import { shallowEqual } from 'react-redux';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { parse } from 'date-fns';
import itLocale from 'date-fns/locale/it';
import Toast from '@pagopa/selfcare-common-frontend/components/Toast';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  generalInfoSelector,
  setGeneralInfo,
  initiativeIdSelector,
  additionalInfoSelector,
} from '../../../../redux/slices/initiativeSlice';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import {
  updateInitiativeGeneralInfo,
  updateInitiativeGeneralInfoDraft,
} from '../../../../services/intitativeService';
import { peopleReached } from '../../../../helpers';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import TitleBoxWithHelpLink from '../../../TitleBoxWithHelpLink/TitleBoxWithHelpLink';
import {
  BeneficiaryTypeEnum,
  FamilyUnitCompositionEnum,
} from '../../../../api/generated/initiative/InitiativeGeneralDTO';
import { getMinDate, parseValuesFormToInitiativeGeneralDTO, getYesterday } from './helpers';
import IntroductionTabPanel from './IntroductionTabPanel';
import IntroductionMarkdown from './IntroductionMarkdown';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setDisabledNext: Dispatch<SetStateAction<boolean>>;
}

// eslint-disable-next-line complexity
const Generalnfo = ({ action, setAction, currentStep, setCurrentStep, setDisabledNext }: Props) => {
  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();
  const generalInfoForm = useAppSelector(generalInfoSelector, shallowEqual);
  const initiativeIdSel = useAppSelector(initiativeIdSelector, shallowEqual);
  const initiativeAdditionalInfoSel = useAppSelector(additionalInfoSelector);
  const selectedPartySel = useAppSelector(partiesSelectors.selectPartySelected);
  const [value, setValue] = useState(0);
  const [dateOffset, setDateOffset] = useState(1);
  const [openDraftSavedToast, setOpenDraftSavedToast] = useState(false);

  const { t } = useTranslation();
  const setLoading = useLoading('UPDATE_GENERAL_INFO');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      const formValuesParsed = parseValuesFormToInitiativeGeneralDTO(formik.values);
      dispatch(setGeneralInfo(formik.values));
      if (initiativeIdSel) {
        setLoading(true);
        updateInitiativeGeneralInfoDraft(initiativeIdSel, formValuesParsed)
          .then((_res) => {
            setOpenDraftSavedToast(true);
          })
          .catch((error) => {
            addError({
              id: 'EDIT_GENERAL_INFO_SAVE_DRAFT_ERROR',
              blocking: false,
              error,
              techDescription: 'An error occurred editing draft initiative general info',
              displayableTitle: t('errors.title'),
              displayableDescription: t('errors.invalidDataDescription'),
              toNotify: true,
              component: 'Toast',
              showCloseIcon: true,
            });
          })
          .finally(() => setLoading(false));
      }
    }
    setAction('');
  }, [action]);

  const validationSchema = Yup.object().shape({
    beneficiaryType: Yup.string().required(t('validation.required')),
    familyUnitComposition: Yup.string()
      .default(undefined)
      .when('beneficiaryType', {
        is: BeneficiaryTypeEnum.NF,
        then: Yup.string().required(t('validation.required')),
        otherwise: Yup.string().default(undefined),
      }),
    beneficiaryKnown: Yup.string().default(undefined).required(t('validation.required')),
    rankingEnabled: Yup.string()
      .default(undefined)
      .required(t('validation.required'))
      .when('beneficiaryType', {
        is: BeneficiaryTypeEnum.PF,
        then: Yup.string().required(t('validation.required')),
        otherwise: Yup.string().default(undefined),
      }),
    budget: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .min(1, t('validation.minOne')),
    beneficiaryBudget: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .min(1, t('validation.minOne'))
      // eslint-disable-next-line sonarjs/no-identical-functions
      .when('budget', (budget, schema) => {
        if (budget) {
          return Yup.number()
            .typeError(t('validation.numeric'))
            .required(t('validation.required'))
            .positive(t('validation.positive'))
            .min(1, t('validation.minOne'))
            .max(parseFloat(budget) - 1, t('validation.outBudgetPerPerson'));
        }
        return schema;
      }),
    rankingStartDate: Yup.date()
      .nullable()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        return parse(originalValue, 'dd/MM/yyyy', new Date());
      })
      .typeError(t('validation.invalidDate'))
      .min(getYesterday(), t('validation.outJoinFrom'))
      .typeError(t('validation.invalidDate'))
      .when('rankingEnabled', {
        is: 'true',
        then: Yup.date().required(t('validation.required')).typeError(t('validation.invalidDate')),
        otherwise: Yup.date().nullable().typeError(t('validation.invalidDate')),
      }),
    rankingEndDate: Yup.date()
      .nullable()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        return parse(originalValue, 'dd/MM/yyyy', new Date());
      })
      .typeError(t('validation.invalidDate'))
      .when('rankingStartDate', (rankingStartDate, _schema) => {
        const timestamp = Date.parse(rankingStartDate);
        if (isNaN(timestamp) === false) {
          return Yup.date()
            .min(getMinDate(rankingStartDate, 1), t('validation.outJoinTo'))
            .required(t('validation.required'))
            .typeError(t('validation.invalidDate'));
        } else {
          return Yup.date().nullable().typeError(t('validation.invalidDate'));
        }
      })
      .when('rankingEnabled', {
        is: 'true',
        then: Yup.date().required(t('validation.required')).typeError(t('validation.invalidDate')),
        otherwise: Yup.date().nullable().typeError(t('validation.invalidDate')),
      }),
    startDate: Yup.date()
      .nullable()
      .required(t('validation.required'))
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        return parse(originalValue, 'dd/MM/yyyy', new Date());
      })
      .typeError(t('validation.invalidDate'))
      .when('rankingEnabled', {
        is: 'true',
        then: Yup.date()
          .nullable()
          .required(t('validation.required'))
          .transform(function (value, originalValue) {
            if (this.isType(value)) {
              return value;
            }
            return parse(originalValue, 'dd/MM/yyyy', new Date());
          })
          .typeError(t('validation.invalidDate'))
          .when('rankingEndDate', (rankingEndDate, _schema) => {
            const timestamp = Date.parse(rankingEndDate);
            if (isNaN(timestamp) === false) {
              return Yup.date()
                .min(getMinDate(rankingEndDate, 11), t('validation.outSpendFromWithRanking'))
                .required(t('validation.required'))
                .typeError(t('validation.invalidDate'));
            } else {
              return Yup.date()
                .nullable()
                .min(getYesterday())
                .required(t('validation.required'))
                .typeError(t('validation.invalidDate'));
            }
          })
          .typeError(t('validation.invalidDate')),
        otherwise: Yup.date()
          .nullable()
          .required(t('validation.required'))
          .transform(function (value, originalValue) {
            if (this.isType(value)) {
              return value;
            }
            return parse(originalValue, 'dd/MM/yyyy', new Date());
          })
          .typeError(t('validation.invalidDate'))
          .when('rankingEndDate', (rankingEndDate, _schema) => {
            const timestamp = Date.parse(rankingEndDate);
            if (isNaN(timestamp) === false) {
              return Yup.date()
                .min(getMinDate(rankingEndDate, 1), t('validation.outSpendFrom'))
                .required(t('validation.required'))
                .typeError(t('validation.invalidDate'));
            } else {
              return Yup.date()
                .nullable()
                .min(getYesterday())
                .required(t('validation.required'))
                .typeError(t('validation.invalidDate'));
            }
          })
          .typeError(t('validation.invalidDate')),
      }),
    endDate: Yup.date()
      .nullable()
      .required(t('validation.required'))
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        return parse(originalValue, 'dd/MM/yyyy', new Date());
      })
      .typeError(t('validation.invalidDate'))
      .when('startDate', (startDate, schema) => {
        const timestamp = Date.parse(startDate);
        if (isNaN(timestamp) === false) {
          return Yup.date()
            .nullable()
            .min(getMinDate(startDate, 1), t('validation.outSpendTo'))
            .required(t('validation.required'))
            .typeError(t('validation.invalidDate'));
        }
        return schema;
      })
      .typeError(t('validation.invalidDate')),
    introductionTextIT: Yup.string().required(
      t('components.wizard.stepTwo.form.requiredItalianIntroduction')
    ),
  });

  const formik = useFormik({
    initialValues: {
      beneficiaryType: generalInfoForm.beneficiaryType,
      familyUnitComposition: generalInfoForm.famylyUnitComposition,
      beneficiaryKnown: generalInfoForm.beneficiaryKnown,
      rankingEnabled: generalInfoForm.rankingEnabled,
      budget: generalInfoForm.budget,
      beneficiaryBudget: generalInfoForm.beneficiaryBudget,
      rankingStartDate: generalInfoForm.rankingStartDate,
      rankingEndDate: generalInfoForm.rankingEndDate,
      startDate: generalInfoForm.startDate,
      endDate: generalInfoForm.endDate,
      introductionTextIT: generalInfoForm.introductionTextIT,
      introductionTextEN: generalInfoForm.introductionTextEN,
      introductionTextFR: generalInfoForm.introductionTextFR,
      introductionTextDE: generalInfoForm.introductionTextDE,
      introductionTextSL: generalInfoForm.introductionTextSL,
    },
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      const formValuesParsed = parseValuesFormToInitiativeGeneralDTO(values);
      dispatch(setGeneralInfo(values));
      if (initiativeIdSel) {
        setLoading(true);
        updateInitiativeGeneralInfo(initiativeIdSel, formValuesParsed)
          .then((_res) => {
            setCurrentStep(currentStep + 1);
          })
          .catch((error) => {
            addError({
              id: 'EDIT_GENERAL_INFO_SAVE_ERROR',
              blocking: false,
              error,
              techDescription: 'An error occurred editing initiative general info',
              displayableTitle: t('errors.title'),
              displayableDescription: t('errors.invalidDataDescription'),
              toNotify: true,
              component: 'Toast',
              showCloseIcon: true,
            });
          })
          .finally(() => setLoading(false));
      }
    },
  });

  useEffect(() => {
    if (formik.values.rankingEnabled === 'true') {
      setDateOffset(11);
    } else {
      setDateOffset(1);
    }
  }, [formik.values]);

  useEffect(() => {
    if (formik.dirty || formik.isValid) {
      setDisabledNext(false);
    } else {
      setDisabledNext(true);
    }
  }, [formik]);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const introductionArrayOptions = () => {
    const optionList: Array<{ label: string; formikValue: string }> = [];

    if (typeof formik.values.introductionTextIT === 'string') {
      optionList.push({
        label: t('components.wizard.common.languages.italian'),
        formikValue: formik.values.introductionTextIT,
      });
    }

    if (typeof formik.values.introductionTextEN === 'string') {
      optionList.push({
        label: t('components.wizard.common.languages.english'),
        formikValue: formik.values.introductionTextEN,
      });
    }

    if (typeof formik.values.introductionTextFR === 'string') {
      optionList.push({
        label: t('components.wizard.common.languages.french'),
        formikValue: formik.values.introductionTextFR,
      });
    }

    if (typeof formik.values.introductionTextDE === 'string') {
      optionList.push({
        label: t('components.wizard.common.languages.german'),
        formikValue: formik.values.introductionTextDE,
      });
    }

    if (typeof formik.values.introductionTextSL === 'string') {
      optionList.push({
        label: t('components.wizard.common.languages.slovenian'),
        formikValue: formik.values.introductionTextSL,
      });
    }

    return optionList;
  };

  const setRankingEnabled = (newValue: string, formik: any) => {
    if (newValue === 'true') {
      formik.setFieldValue('rankingEnabled', 'false');
    } else {
      formik.setFieldValue('rankingEnabled', 'true');
    }
  };

  return (
    <>
      <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
        <Box sx={{ py: 3 }}>
          <Typography variant="h6">{t('components.wizard.stepTwo.title')}</Typography>
        </Box>

        <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
          <Typography
            sx={{ gridColumn: 'span 12', pb: 1, fontSize: '16px', fontWeight: '600' }}
            id="beneficiaryType--label"
          >
            {t('components.wizard.stepTwo.form.beneficiaryType')}
          </Typography>
          <RadioGroup
            sx={{ gridColumn: 'span 12' }}
            row
            aria-labelledby="beneficiaryType--label"
            name="beneficiaryType"
            value={formik.values.beneficiaryType || ''}
            defaultValue={formik.values.beneficiaryType || ''}
            onChange={async (e) => {
              await formik.setFieldValue('beneficiaryType', e.target.value, false);
              if (e.target.value === BeneficiaryTypeEnum.NF) {
                await formik.setFieldValue('rankingEnabled', 'false', false);
                await formik.setFieldValue('beneficiaryKnown', 'false', false);
                await formik.setFieldValue(
                  'familyUnitComposition',
                  FamilyUnitCompositionEnum.INPS,
                  false
                );
              } else {
                await formik.setFieldValue('familyUnitComposition', undefined, false);
              }
            }}
            data-testid="beneficiary-type-test"
          >
            <FormControlLabel
              value={BeneficiaryTypeEnum.PF}
              control={<Radio />}
              label={t('components.wizard.stepTwo.form.person')}
              data-testid="beneficiary-radio-test"
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value={BeneficiaryTypeEnum.NF}
              control={<Radio />}
              label={t('components.wizard.stepTwo.form.family')}
            />
          </RadioGroup>
          <FormHelperText
            error={formik.touched.beneficiaryType && Boolean(formik.errors.beneficiaryType)}
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.touched.beneficiaryType && formik.errors.beneficiaryType}
          </FormHelperText>
        </FormControl>

        {formik.values.beneficiaryType === BeneficiaryTypeEnum.NF && (
          <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
            <Typography
              sx={{ gridColumn: 'span 12', pb: 1, fontSize: '16px', fontWeight: '600' }}
              id="familyUnitComposition--label"
            >
              {t('components.wizard.stepTwo.form.familyUnitCompositionTitleGroup')}
            </Typography>
            <RadioGroup
              row
              sx={{ gridColumn: 'span 12' }}
              aria-labelledby="familyUnitComposition--label"
              name="familyUnitComposition"
              data-testid="family-unit-composition-test"
              value={formik.values.familyUnitComposition || ''}
              defaultValue={formik.values.familyUnitComposition || ''}
              onChange={(e) => formik.setFieldValue('familyUnitComposition', e.target.value, false)}
            >
              <FormControlLabel
                value={FamilyUnitCompositionEnum.INPS}
                control={<Radio />}
                label={
                  <div>
                    <Typography>
                      {t('components.wizard.stepTwo.form.familyUnitCompositionTitleISEE')}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                      {t('components.wizard.stepTwo.form.familyUnitCompositionSubitleISEE')}
                    </Typography>
                  </div>
                }
                data-testid="family-unit-composition-radio-test"
              />
              <FormControl>
                <FormControlLabel
                  sx={{ ml: 2 }}
                  value={FamilyUnitCompositionEnum.ANPR}
                  control={<Radio />}
                  label={
                    <div>
                      <Typography color="#A2ADB8">
                        {t('components.wizard.stepTwo.form.familyUnitCompositionTitleANPR')}
                      </Typography>
                      <Typography color="#A2ADB8" variant="caption" display="block" gutterBottom>
                        {t('components.wizard.stepTwo.form.familyUnitCompositionSubitleANPR')}
                      </Typography>
                    </div>
                  }
                  disabled
                />
              </FormControl>
            </RadioGroup>
            <FormHelperText
              error={
                formik.touched.familyUnitComposition && Boolean(formik.errors.familyUnitComposition)
              }
              sx={{ gridColumn: 'span 12' }}
            >
              {formik.touched.familyUnitComposition && formik.errors.familyUnitComposition}
            </FormHelperText>
          </FormControl>
        )}

        <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
          <Typography
            sx={{ gridColumn: 'span 12', pb: 1, fontSize: '16px', fontWeight: '600' }}
            id="beneficiaryKnown--label"
          >
            {t('components.wizard.stepTwo.form.beneficiaryKnown')}
          </Typography>
          <RadioGroup
            sx={{ gridColumn: 'span 12' }}
            row
            aria-labelledby="beneficiaryKnown--label"
            name="beneficiaryKnown"
            value={formik.values.beneficiaryKnown || ''}
            defaultValue={formik.values.beneficiaryKnown || ''}
            onChange={async (e) => {
              await formik.setFieldValue('beneficiaryKnown', e.target.value, false);
              setRankingEnabled(e.target.value, formik);
            }}
            data-testid="beneficiary-known-test"
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label={t('components.wizard.stepTwo.form.taxCodeList')}
              disabled={formik.values.beneficiaryType === BeneficiaryTypeEnum.NF}
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value="false"
              control={<Radio />}
              label={t('components.wizard.stepTwo.form.manualSelection')}
            />
          </RadioGroup>
          <FormHelperText
            error={formik.touched.beneficiaryKnown && Boolean(formik.errors.beneficiaryKnown)}
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.touched.beneficiaryKnown && formik.errors.beneficiaryKnown}
          </FormHelperText>
        </FormControl>

        {formik.values.beneficiaryKnown === 'false' &&
          formik.values.beneficiaryType !== BeneficiaryTypeEnum.NF && (
            <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
              <Typography
                sx={{ gridColumn: 'span 12', pb: 1, fontSize: '16px', fontWeight: '600' }}
                id="witRanking--label"
              >
                {t('components.wizard.stepTwo.form.withRanking')}
              </Typography>
              <RadioGroup
                sx={{ gridColumn: 'span 12' }}
                row
                aria-labelledby="witRanking--label"
                name="witRanking--label"
                value={formik.values.rankingEnabled || ''}
                defaultValue={formik.values.rankingEnabled || ''}
                onChange={async (e) => {
                  await formik.setFieldValue('rankingEnabled', e.target.value, false);
                  formik.handleBlur(e);
                }}
                data-testid="witRanking-test"
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label={t('components.wizard.stepTwo.form.yes')}
                />
                <FormControlLabel
                  sx={{ ml: 2 }}
                  value="false"
                  control={<Radio />}
                  label={t('components.wizard.stepTwo.form.no')}
                />
              </RadioGroup>
              <FormHelperText
                error={formik.touched.rankingEnabled && Boolean(formik.errors.rankingEnabled)}
                sx={{ gridColumn: 'span 12' }}
              >
                {formik.touched.rankingEnabled && formik.errors.rankingEnabled}
              </FormHelperText>
            </FormControl>
          )}

        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
            mb: 3,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"budgetTitle budgetTitle . ." 
                                  "budget beneficiaryBudget budgetPerPersonCalc budgetPerPersonCalc "`,
          }}
        >
          <FormLabel sx={{ fontSize: '16px', fontWeight: '600', gridArea: 'budgetTitle' }}>
            {t('components.wizard.stepTwo.form.budgetTitle')}
          </FormLabel>
          <TextField
            sx={{ gridArea: 'budget' }}
            inputProps={{
              step: 0.01,
              min: 1,
              type: 'number',
            }}
            label={t('components.wizard.stepTwo.form.budget')}
            placeholder={t('components.wizard.stepTwo.form.budget')}
            aria-labelledby={t('components.wizard.stepTwo.form.budget')}
            id="budget"
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
            size="small"
          />
          <TextField
            sx={{ gridArea: 'beneficiaryBudget' }}
            inputProps={{
              step: 0.01,
              min: 1,
              type: 'number',
            }}
            label={
              formik.values.beneficiaryType === BeneficiaryTypeEnum.PF
                ? t('components.wizard.stepTwo.form.beneficiaryBudgetPerson')
                : t('components.wizard.stepTwo.form.beneficiaryBudgetFamily')
            }
            placeholder={
              formik.values.beneficiaryType === BeneficiaryTypeEnum.PF
                ? t('components.wizard.stepTwo.form.beneficiaryBudgetPerson')
                : t('components.wizard.stepTwo.form.beneficiaryBudgetFamily')
            }
            aria-labelledby={
              formik.values.beneficiaryType === BeneficiaryTypeEnum.PF
                ? t('components.wizard.stepTwo.form.beneficiaryBudgetPerson')
                : t('components.wizard.stepTwo.form.beneficiaryBudgetFamily')
            }
            id="beneficiaryBudget"
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
            size="small"
          />
          {!isNaN(peopleReached(formik.values.budget, formik.values.beneficiaryBudget)) && (
            <Box
              sx={{
                gridArea: 'budgetPerPersonCalc',
                justifySelf: 'end',
                alignSelf: 'center',
                display: 'flex',
                justifyContent: 'space-around',
                minWidth: '60%',
                backgroundColor: grey[100],
                borderRadius: 2,
                py: 1,
                px: 2,
              }}
            >
              <Typography
                variant="body2"
                component="span"
                sx={{ display: 'flex', alignSelf: 'center', pr: 2 }}
              >
                {formik.values.beneficiaryType === BeneficiaryTypeEnum.PF
                  ? t('components.wizard.stepTwo.form.reachedUsers')
                  : t('components.wizard.stepTwo.form.reachedFamilies')}
              </Typography>
              <Typography
                variant="subtitle2"
                component="span"
                sx={{ display: 'flex', alignSelf: 'center', pr: 2 }}
              >
                {peopleReached(formik.values.budget, formik.values.beneficiaryBudget) !== Infinity
                  ? peopleReached(formik.values.budget, formik.values.beneficiaryBudget)
                  : '-'}
              </Typography>
              <Tooltip
                title={
                  formik.values.beneficiaryType === BeneficiaryTypeEnum.PF
                    ? t('components.wizard.stepTwo.form.reachedUsersTooltip')
                    : t('components.wizard.stepTwo.form.reachedFamiliesTooltip')
                }
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
            gap: 2,
            mb: 3,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"timeRangeRankingTitle timeRangeRankingTitle timeRangeRankingTitle timeRangeRankingTitle" 
                                  "rankingStartDate rankingEndDate . . "`,
          }}
        >
          <FormLabel
            sx={{ fontSize: '16px', fontWeight: '600', gridArea: 'timeRangeRankingTitle' }}
          >
            {t('components.wizard.stepTwo.form.timeRangeRankingTitle')}
          </FormLabel>

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={itLocale}>
            <DesktopDatePicker
              label={t('components.wizard.stepTwo.form.rankingStartDate')}
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
                  size="small"
                />
              )}
            />
            <DesktopDatePicker
              label={t('components.wizard.stepTwo.form.rankingEndDate')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.rankingEndDate}
              onChange={(value) => formik.setFieldValue('rankingEndDate', value)}
              minDate={getMinDate(formik.values.rankingStartDate, 1)}
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
                  size="small"
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
            mb: 3,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"timeRangeTitle timeRangeTitle timeRangeTitle timeRangeTitle" 
                                  "startDate endDate . . "`,
          }}
        >
          <FormLabel sx={{ fontSize: '16px', fontWeight: '600', gridArea: 'timeRangeTitle' }}>
            {t('components.wizard.stepTwo.form.timeRangeTitle')}
          </FormLabel>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={itLocale}>
            <DesktopDatePicker
              label={t('components.wizard.stepTwo.form.startDate')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.startDate}
              onChange={(value) => formik.setFieldValue('startDate', value)}
              minDate={getMinDate(formik.values.rankingEndDate, dateOffset)}
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
                  size="small"
                />
              )}
            />
            <DesktopDatePicker
              label={t('components.wizard.stepTwo.form.endDate')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.endDate}
              onChange={(value) => formik.setFieldValue('endDate', value)}
              minDate={getMinDate(formik.values.startDate, 1)}
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
                  size="small"
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
      </Paper>
      <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
        <TitleBoxWithHelpLink
          title={t('components.wizard.stepTwo.form.introductionTitle')}
          subtitle={t('components.wizard.stepTwo.form.introductionSubTitle')}
          helpLink={t('helpStaticUrls.wizard.generalInfo')}
          helpLabel={t('components.wizard.common.links.findOut')}
        />

        <Box sx={{ width: '100%', pt: 2 }}>
          <Box>
            <Tabs value={value} onChange={handleTabChange} aria-label="tabs">
              <Tab label={t('components.wizard.common.languages.italian')} />
              <Tab label={t('components.wizard.common.languages.english')} />
              <Tab label={t('components.wizard.common.languages.french')} />
              <Tab label={t('components.wizard.common.languages.german')} />
              <Tab label={t('components.wizard.common.languages.slovenian')} />
            </Tabs>
          </Box>

          <FormControl
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 3fr 1fr)',
              rowGap: 3,
              mt: 1,
              alignItems: 'baseline',
            }}
          >
            <IntroductionTabPanel value={value} index={0}>
              <TextField
                id="introductionTextIT"
                placeholder={t('components.wizard.stepTwo.form.introductiveInfoLabel')}
                name="introductionTextIT"
                aria-label={t('components.wizard.stepTwo.form.introductiveInfoLabel')}
                fullWidth
                value={formik.values.introductionTextIT}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                inputProps={{ 'data-testid': 'introductionTextIT-test' }}
                size="small"
                minRows={3}
                multiline
                required
                InputLabelProps={{ required: false }}
                error={
                  formik.touched.introductionTextIT && Boolean(formik.errors.introductionTextIT)
                }
                helperText={formik.touched.introductionTextIT && formik.errors.introductionTextIT}
              />
            </IntroductionTabPanel>
            <IntroductionTabPanel value={value} index={1}>
              <TextField
                id="introductionTextEN"
                placeholder={t('components.wizard.stepTwo.form.introductiveInfoLabel')}
                name="introductionTextEN"
                aria-label={t('components.wizard.stepTwo.form.introductiveInfoLabel')}
                fullWidth
                value={formik.values.introductionTextEN}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                inputProps={{ 'data-testid': 'introductionTextEN-test' }}
                size="small"
                minRows={3}
                multiline
                error={
                  formik.touched.introductionTextIT && Boolean(formik.errors.introductionTextIT)
                }
                helperText={formik.touched.introductionTextIT && formik.errors.introductionTextIT}
              />
            </IntroductionTabPanel>
            <IntroductionTabPanel value={value} index={2}>
              <TextField
                id="introductionTextFR"
                placeholder={t('components.wizard.stepTwo.form.introductiveInfoLabel')}
                name="introductionTextFR"
                aria-label={t('components.wizard.stepTwo.form.introductiveInfoLabel')}
                fullWidth
                value={formik.values.introductionTextFR}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                inputProps={{ 'data-testid': 'introductionTextFR-test' }}
                size="small"
                minRows={3}
                multiline
                error={
                  formik.touched.introductionTextIT && Boolean(formik.errors.introductionTextIT)
                }
                helperText={formik.touched.introductionTextIT && formik.errors.introductionTextIT}
              />
            </IntroductionTabPanel>
            <IntroductionTabPanel value={value} index={3}>
              <TextField
                id="introductionTextDE"
                placeholder={t('components.wizard.stepTwo.form.introductiveInfoLabel')}
                name="introductionTextDE"
                aria-label={t('components.wizard.stepTwo.form.introductiveInfoLabel')}
                fullWidth
                value={formik.values.introductionTextDE}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                inputProps={{ 'data-testid': 'introductionTextDE-test' }}
                size="small"
                minRows={3}
                multiline
                error={
                  formik.touched.introductionTextIT && Boolean(formik.errors.introductionTextIT)
                }
                helperText={formik.touched.introductionTextIT && formik.errors.introductionTextIT}
              />
            </IntroductionTabPanel>
            <IntroductionTabPanel value={value} index={4}>
              <TextField
                id="introductionTextSL"
                placeholder={t('components.wizard.stepTwo.form.introductiveInfoLabel')}
                name="introductionTextSL"
                aria-label={t('components.wizard.stepTwo.form.introductiveInfoLabel')}
                fullWidth
                value={formik.values.introductionTextSL}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                inputProps={{ 'data-testid': 'introductionTextSL-test' }}
                size="small"
                minRows={3}
                multiline
                error={
                  formik.touched.introductionTextIT && Boolean(formik.errors.introductionTextIT)
                }
                helperText={formik.touched.introductionTextIT && formik.errors.introductionTextIT}
              />
            </IntroductionTabPanel>
            <IntroductionMarkdown
              textToRender={introductionArrayOptions()}
              serviceName={initiativeAdditionalInfoSel.serviceName}
              selectedParty={selectedPartySel?.description}
              logoUrl={initiativeAdditionalInfoSel.logoURL}
            />
          </FormControl>
        </Box>
      </Paper>
      {openDraftSavedToast && (
        <Toast
          open={openDraftSavedToast}
          title={t('components.wizard.common.draftSaved')}
          showToastCloseIcon={true}
          onCloseToast={() => setOpenDraftSavedToast(false)}
        />
      )}
    </>
  );
};

export default Generalnfo;
