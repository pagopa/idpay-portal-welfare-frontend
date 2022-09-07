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
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  initiativeIdSelector,
  initiativeRefundRulesSelector,
  saveRefundRule,
} from '../../../../redux/slices/initiativeSlice';
import { AccomulatedTypeEnum } from '../../../../api/generated/initiative/AccumulatedAmountDTO';
import { TimeTypeEnum } from '../../../../api/generated/initiative/TimeParameterDTO';
import { putRefundRule } from '../../../../services/intitativeService';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { mapDataToSend, setError, setErrorText } from './helpers';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  setDisableNext: Dispatch<SetStateAction<boolean>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

const RefundRules = ({
  action,
  setAction,
  setDisableNext /* currentStep, setCurrentStep */,
}: Props) => {
  const { t } = useTranslation();
  const [_isChecked, setIsChecked] = useState('');
  const initiativeId = useAppSelector(initiativeIdSelector);
  const refundRules = useAppSelector(initiativeRefundRulesSelector);
  const [refundRulesData, _setRefundRulesData] = useState(refundRules);
  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    }
    // else if (action === WIZARD_ACTIONS.DRAFT) {
    //   return;
    // }
    setAction('');
  }, [action]);

  const validationSchema = Yup.object().shape({
    reimbursmentQuestionGroup: Yup.string().required(t('validation.required')),
    timeParameter: Yup.string()
      .nullable()
      .when('reimbursmentQuestionGroup', (reimbursment, schema) => {
        if (reimbursment === 'false') {
          Yup.string().required(t('validation.required'));
        }
        return schema;
      }),
    accumulatedAmount: Yup.string()
      .nullable()
      .when('reimbursmentQuestionGroup', (reimbursment, schema) => {
        if (reimbursment === 'true') {
          Yup.string().required(t('validation.required'));
        }
        return schema;
      }),
    additionalInfo: Yup.string(),
    reimbursementThreshold: Yup.number()
      .default(undefined)
      .test('reimbursement-threshold', t('validation.required'), function (val) {
        if (
          this.parent.reimbursmentQuestionGroup === 'true' &&
          this.parent.accumulatedAmount === AccomulatedTypeEnum.THRESHOLD_REACHED
        ) {
          return typeof val !== 'number';
        }
        return true;
      }),
  });

  const formik = useFormik({
    initialValues: {
      reimbursmentQuestionGroup: '',
      timeParameter: '',
      accumulatedAmount: '',
      additionalInfo: '',
      reimbursementThreshold: '',
    },
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      if (initiativeId) {
        const body = mapDataToSend(values);
        const b = { refundRule: { ...body } };
        putRefundRule(initiativeId, b)
          .then((res) => {
            dispatch(saveRefundRule(refundRulesData));
            // setCurrentStep(currentStep + 1);
            console.log(res);
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
        console.log(values);
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

  useEffect(() => {
    console.log(formik.errors);
  }, [formik]);

  return (
    <>
      <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
        <Box sx={{ py: 3 }}>
          <Typography variant="h6">{t('components.wizard.stepFour.title2')}</Typography>
        </Box>
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
            id="reimbursmentQuestionGroup"
            name="reimbursmentQuestionGroup"
            value={formik.values.reimbursmentQuestionGroup}
            defaultValue={formik.values.reimbursmentQuestionGroup}
            onChange={async (e) => {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              formik.setFieldValue('reimbursmentQuestionGroup', e.target.value);
              handleResetField(e.target.value);
            }}
          >
            <FormControlLabel
              value={'true'}
              control={<Radio />}
              label={t('components.wizard.stepFour.form.accumulatedAmount')}
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value={'false'}
              control={<Radio />}
              label={t('components.wizard.stepFour.form.timeParameter')}
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
              sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', py: 2, mb: 4 }}
            >
              <InputLabel id="select-accumulated-amount" sx={{ pt: 2 }}>
                {t('components.wizard.stepFour.form.selectedAccumulatedAmount')}
              </InputLabel>
              <Select
                id="accumulatedAmount"
                name="accumulatedAmount"
                value={formik.values.accumulatedAmount}
                label={t('components.wizard.stepFour.form.selectedAccumulatedAmount')}
                onChange={(e) => formik.setFieldValue('accumulatedAmount', e.target.value)}
                error={formik.touched.accumulatedAmount && Boolean(formik.errors.accumulatedAmount)}
              >
                <MenuItem
                  value={AccomulatedTypeEnum.BUDGET_EXHAUSTED}
                  data-testid="balance-exhausted"
                >
                  {t('components.wizard.stepFour.select.accumulatedAmount.balanceExhausted')}
                </MenuItem>
                <MenuItem
                  value={AccomulatedTypeEnum.THRESHOLD_REACHED}
                  data-testid="certain-threshold"
                >
                  {t('components.wizard.stepFour.select.accumulatedAmount.certainThreshold')}
                </MenuItem>
              </Select>
              <FormHelperText
                error={formik.touched.accumulatedAmount && Boolean(formik.errors.accumulatedAmount)}
                sx={{ gridColumn: 'span 12' }}
              >
                {formik.touched.accumulatedAmount && formik.errors.accumulatedAmount}
              </FormHelperText>
            </FormControl>

            {formik.values.accumulatedAmount === AccomulatedTypeEnum.THRESHOLD_REACHED ? (
              <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', mb: 4 }}>
                <TextField
                  inputProps={{
                    step: 0.01,
                    min: 0,
                    type: 'number',
                    'data-testid': 'reimbursement-threshold',
                  }}
                  id="reimbursementThreshold"
                  label={t('components.wizard.stepFour.form.reimbursementThreshold')}
                  placeholder={t('components.wizard.stepFour.form.reimbursementThreshold')}
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
                        <EuroSymbolIcon htmlColor="#17324D" />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            ) : null}
          </>
        ) : formik.values.reimbursmentQuestionGroup === 'false' ? (
          <>
            <FormControl
              sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', py: 2, mb: 4 }}
            >
              <InputLabel id="select-time-parameter" sx={{ pt: 2 }}>
                {t('components.wizard.stepFour.form.selectTimeParam')}
              </InputLabel>
              <Select
                id="selectTimeParam"
                name="selectTimeParam"
                value={formik.values.timeParameter}
                label={t('components.wizard.stepFour.form.selectTimeParam')}
                onChange={(e) => formik.setFieldValue('timeParameter', e.target.value)}
                error={formik.touched.timeParameter && Boolean(formik.errors.timeParameter)}
              >
                <MenuItem value={TimeTypeEnum.CLOSED} data-testid="initiative-done">
                  {t('components.wizard.stepFour.select.timrParameter.initiativeDone')}
                </MenuItem>
                <MenuItem value={TimeTypeEnum.DAILY} data-testid="every-day">
                  {t('components.wizard.stepFour.select.timrParameter.everyDay')}
                </MenuItem>
                <MenuItem value={TimeTypeEnum.WEEKLY} data-testid="every-week">
                  {t('components.wizard.stepFour.select.timrParameter.everyWeek')}
                </MenuItem>
                <MenuItem value={TimeTypeEnum.MONTHLY} data-testid="every-month">
                  {t('components.wizard.stepFour.select.timrParameter.everyMonth')}
                </MenuItem>
                <MenuItem value={TimeTypeEnum.QUARTERLY} data-testid="every-three-months">
                  {t('components.wizard.stepFour.select.timrParameter.everyThreeMonths')}
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

      <Paper sx={{ display: 'grid', width: '100%', my: 5, px: 3 }}>
        <Box sx={{ py: 3 }}>
          <Typography variant="h6">{t('components.wizard.stepFour.title2')}</Typography>
        </Box>
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

        <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', py: 2, mb: 4 }}>
          <TextField
            id="additionalInfo"
            label={t('components.wizard.stepFour.form.idCodeBalance')}
            placeholder={t('components.wizard.stepFour.form.idCodeBalance')}
            name="additionalInfo"
            aria-label="additionalInfo"
            value={formik.values.additionalInfo}
            onChange={(e) => formik.setFieldValue('additionalInfo', e.target.value)}
          />
        </FormControl>
      </Paper>
    </>
  );
};

export default RefundRules;
