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
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { useHistory } from 'react-router-dom';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  initiativeIdSelector,
  initiativeRefundRulesSelector,
  saveRefundRule,
  generalInfoSelector,
} from '../../../../redux/slices/initiativeSlice';
import { AccumulatedTypeEnum } from '../../../../api/generated/initiative/AccumulatedAmountDTO';
import { TimeTypeEnum } from '../../../../api/generated/initiative/TimeParameterDTO';
import { putRefundRule, putRefundRuleDraft } from '../../../../services/intitativeService';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import ROUTES from '../../../../routes';
import { mapDataToSend, setError, setErrorText } from './helpers';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setDisableNext: Dispatch<SetStateAction<boolean>>;
}

const RefundRules = ({ action, setAction, setDisableNext }: Props) => {
  const { t } = useTranslation();
  const [_isChecked, setIsChecked] = useState('');
  const initiativeId = useAppSelector(initiativeIdSelector);
  const generalInfo = useAppSelector(generalInfoSelector);
  const budgetPerPerson = generalInfo.beneficiaryBudget;
  const refundRulesSelector = useAppSelector(initiativeRefundRulesSelector);
  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();
  const history = useHistory();
  const setLoading = useLoading('PUT_REFUND_RULES');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      const body = mapDataToSend(formik.values);
      if (initiativeId) {
        setLoading(true);
        putRefundRuleDraft(initiativeId, body)
          .then((_res) => {
            dispatch(saveRefundRule(formik.values));
          })
          .catch((error) => {
            addError({
              id: 'EDIT_REFUND_RULES_SAVE_DRAFT_ERROR',
              blocking: false,
              error,
              techDescription: 'An error occurred editing draft initiative transaction rules',
              displayableTitle: t('errors.title'),
              displayableDescription: t('errors.invalidDataDescription'),
              toNotify: true,
              component: 'Toast',
              showCloseIcon: true,
            });
          })
          .finally(() => setLoading(false));
      }
      return;
    }
    setAction('');
  }, [action]);

  const validationSchema = Yup.object().shape({
    reimbursmentQuestionGroup: Yup.string().required(t('validation.required')),
    timeParameter: Yup.string()
      // .nullable()
      .when('reimbursmentQuestionGroup', (reimbursment, schema) => {
        if (reimbursment === 'false') {
          return Yup.string().required(t('validation.required'));
        }
        return schema;
      }),
    accumulatedAmount: Yup.string()
      // .nullable()
      .when('reimbursmentQuestionGroup', (reimbursment, schema) => {
        if (reimbursment === 'true') {
          return Yup.string().required(t('validation.required'));
        }
        return schema;
      }),
    additionalInfo: Yup.string(),
    reimbursementThreshold: Yup.number()
      .default(undefined)
      .test('reimbursement-threshold-number', t('validation.required'), function (val) {
        if (
          this.parent.reimbursmentQuestionGroup === 'true' &&
          this.parent.accumulatedAmount === AccumulatedTypeEnum.THRESHOLD_REACHED
        ) {
          return typeof val === 'number';
        }
        return true;
      })
      .test('reimbursement-threshold-min-one', t('validation.positive'), function (val) {
        if (
          this.parent.reimbursmentQuestionGroup === 'true' &&
          this.parent.accumulatedAmount === AccumulatedTypeEnum.THRESHOLD_REACHED
        ) {
          return typeof val === 'number' && val >= 1;
        }
        return true;
      })
      .test(
        'reimbursement-threshold-max',
        t('validation.maxValue', { value: budgetPerPerson }),
        function (val) {
          if (
            this.parent.reimbursmentQuestionGroup === 'true' &&
            this.parent.accumulatedAmount === AccumulatedTypeEnum.THRESHOLD_REACHED
          ) {
            return typeof val === 'number' && val <= parseFloat(budgetPerPerson);
          }
          return true;
        }
      ),
  });

  const formik = useFormik({
    initialValues: {
      reimbursmentQuestionGroup: refundRulesSelector?.reimbursmentQuestionGroup,
      timeParameter: refundRulesSelector?.timeParameter,
      accumulatedAmount: refundRulesSelector?.accumulatedAmount,
      additionalInfo: refundRulesSelector?.additionalInfo,
      reimbursementThreshold: refundRulesSelector?.reimbursementThreshold,
    },
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      if (initiativeId) {
        const body = mapDataToSend(values);
        putRefundRule(initiativeId, body)
          .then((_res) => {
            dispatch(saveRefundRule(values));
            history.replace(ROUTES.INITIATIVE_LIST);
          })
          .catch((error) => {
            addError({
              id: 'EDIT_REFUND_RULES_SAVE_ERROR',
              blocking: false,
              error,
              techDescription: 'An error occurred editing initiative transaction rules',
              displayableTitle: t('errors.title'),
              displayableDescription: t('errors.invalidDataDescription'),
              toNotify: true,
              component: 'Toast',
              showCloseIcon: true,
            });
          });
      }
    },
  });

  const handleResetField = (value: string) => {
    setIsChecked(() => value);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    formik.setFieldValue('reimbursmentQuestionGroup', value);

    if (value === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      formik.setFieldValue('timeParameter', '');
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      formik.setFieldValue('accumulatedAmount', '');
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      formik.setFieldValue('reimbursementThreshold', '');
    }
  };

  useEffect(() => {
    if (formik.dirty || formik.isValid) {
      setDisableNext(false);
    } else {
      setDisableNext(true);
    }
  }, [formik]);

  return (
    <>
      <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
        <Box sx={{ py: 3 }}>
          <Typography variant="h6">{t('components.wizard.stepFive.title1')}</Typography>
        </Box>
        <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 1 }}>
          <Typography
            sx={{ gridColumn: 'span 12', pb: 2, fontSize: '16px', fontWeight: '600' }}
            id="import-time-label"
          >
            {t('components.wizard.stepFive.form.radioQuestion')}
          </Typography>

          <RadioGroup
            sx={{ gridColumn: 'span 12' }}
            row
            aria-labelledby="import-time-label"
            id="reimbursmentQuestionGroup"
            name="reimbursmentQuestionGroup"
            value={formik.values.reimbursmentQuestionGroup}
            defaultValue={formik.values.reimbursmentQuestionGroup}
            onChange={async (e) => {
              await formik.setFieldValue('reimbursmentQuestionGroup', e.target.value);
              handleResetField(e.target.value);
            }}
            data-testid="reimbursmentQuestionGroup-test"
          >
            <FormControlLabel
              value={'true'}
              control={<Radio />}
              label={t('components.wizard.stepFive.form.accumulatedAmount')}
              data-testid="accumulatedAmount-radio-test"
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value={'false'}
              control={<Radio />}
              label={t('components.wizard.stepFive.form.timeParameter')}
              data-testid="timeParameter-radio-test"
            />
          </RadioGroup>
          <FormHelperText
            error={
              formik.touched.reimbursmentQuestionGroup &&
              Boolean(formik.errors.reimbursmentQuestionGroup)
            }
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.touched.reimbursmentQuestionGroup && formik.errors.reimbursmentQuestionGroup}
          </FormHelperText>
        </FormControl>

        {formik.values.reimbursmentQuestionGroup === 'true' ? (
          <>
            <FormControl
              sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', mt: 2, mb: 3 }}
              size="small"
            >
              <InputLabel id="select-accumulated-amount">
                {t('components.wizard.stepFive.form.selectedAccumulatedAmount')}
              </InputLabel>
              <Select
                id="accumulatedAmount"
                name="accumulatedAmount"
                value={formik.values.accumulatedAmount}
                label={t('components.wizard.stepFive.form.selectedAccumulatedAmount')}
                onChange={(e) => formik.setFieldValue('accumulatedAmount', e.target.value)}
                error={formik.touched.accumulatedAmount && Boolean(formik.errors.accumulatedAmount)}
                inputProps={{
                  'data-testid': 'accumulatedAmount-test',
                }}
              >
                <MenuItem
                  value={AccumulatedTypeEnum.BUDGET_EXHAUSTED}
                  data-testid="balance-exhausted"
                >
                  {t('components.wizard.stepFive.select.accumulatedAmount.balanceExhausted')}
                </MenuItem>
                <MenuItem
                  value={AccumulatedTypeEnum.THRESHOLD_REACHED}
                  data-testid="certain-threshold"
                >
                  {t('components.wizard.stepFive.select.accumulatedAmount.certainThreshold')}
                </MenuItem>
              </Select>
              <FormHelperText
                error={formik.touched.accumulatedAmount && Boolean(formik.errors.accumulatedAmount)}
                sx={{ gridColumn: 'span 12' }}
              >
                {formik.touched.accumulatedAmount && formik.errors.accumulatedAmount}
              </FormHelperText>
            </FormControl>

            {formik.values.accumulatedAmount === AccumulatedTypeEnum.THRESHOLD_REACHED ? (
              <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', mb: 4 }}>
                <TextField
                  inputProps={{
                    step: 0.01,
                    min: 1,
                    max: budgetPerPerson,
                    type: 'number',
                    'data-testid': 'reimbursementThreshold-test',
                  }}
                  id="reimbursementThreshold"
                  label={t('components.wizard.stepFive.form.reimbursementThreshold')}
                  placeholder={t('components.wizard.stepFive.form.reimbursementThreshold')}
                  name="reimbursementThreshold"
                  aria-label="reimbursementThreshold"
                  value={formik.values.reimbursementThreshold}
                  onChange={(e) => formik.setFieldValue('reimbursementThreshold', e.target.value)}
                  error={setError(
                    formik.touched.reimbursementThreshold,
                    formik.errors.reimbursementThreshold
                  )}
                  helperText={setErrorText(
                    formik.touched.reimbursementThreshold,
                    formik.errors.reimbursementThreshold
                  )}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EuroSymbolIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                />
              </FormControl>
            ) : null}
          </>
        ) : formik.values.reimbursmentQuestionGroup === 'false' ? (
          <>
            <FormControl
              sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', mt: 2, mb: 3 }}
              size="small"
            >
              <InputLabel id="select-time-parameter">
                {t('components.wizard.stepFive.form.selectTimeParam')}
              </InputLabel>
              <Select
                id="timeParameter"
                name="timeParameter"
                value={formik.values.timeParameter}
                label={t('components.wizard.stepFive.form.selectTimeParam')}
                onChange={(e) => formik.setFieldValue('timeParameter', e.target.value)}
                error={formik.touched.timeParameter && Boolean(formik.errors.timeParameter)}
                inputProps={{
                  'data-testid': 'selectTimeParam-test',
                }}
              >
                <MenuItem value={TimeTypeEnum.CLOSED} data-testid="initiative-done">
                  {t('components.wizard.stepFive.select.timrParameter.initiativeDone')}
                </MenuItem>
                <MenuItem value={TimeTypeEnum.DAILY} data-testid="every-day">
                  {t('components.wizard.stepFive.select.timrParameter.everyDay')}
                </MenuItem>
                <MenuItem value={TimeTypeEnum.WEEKLY} data-testid="every-week">
                  {t('components.wizard.stepFive.select.timrParameter.everyWeek')}
                </MenuItem>
                <MenuItem value={TimeTypeEnum.MONTHLY} data-testid="every-month">
                  {t('components.wizard.stepFive.select.timrParameter.everyMonth')}
                </MenuItem>
                <MenuItem value={TimeTypeEnum.QUARTERLY} data-testid="every-three-months">
                  {t('components.wizard.stepFive.select.timrParameter.everyThreeMonths')}
                </MenuItem>
              </Select>
              <FormHelperText
                error={formik.touched.timeParameter && Boolean(formik.errors.timeParameter)}
                sx={{ gridColumn: 'span 12' }}
              >
                {formik.touched.timeParameter && formik.errors.timeParameter}
              </FormHelperText>
            </FormControl>
          </>
        ) : null}
      </Paper>

      <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
        <Box sx={{ py: 3 }}>
          <Typography variant="h6">{t('components.wizard.stepFive.title2')}</Typography>
        </Box>
        <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)' }}>
          <FormLabel
            sx={{
              gridColumn: 'span 12',

              fontSize: '16px',
              fontWeight: '400',
              letterSpacing: '0.15px',
            }}
            id="import-time-label"
          >
            {t('components.wizard.stepFive.form.subTitle')}
          </FormLabel>
        </FormControl>

        <FormControl
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', rowGap: 3, mt: 3, mb: 5 }}
        >
          <TextField
            id="additionalInfo"
            label={t('components.wizard.stepFive.form.idCodeBalance')}
            placeholder={t('components.wizard.stepFive.form.idCodeBalance')}
            name="additionalInfo"
            aria-label="additionalInfo"
            value={formik.values.additionalInfo}
            onChange={(e) => formik.setFieldValue('additionalInfo', e.target.value)}
            inputProps={{
              'data-testid': 'additionalInfo-test',
            }}
            size="small"
          />
        </FormControl>
      </Paper>
    </>
  );
};

export default RefundRules;
