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
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import { setError, setErrorText } from './helpers';

interface Props {
  action: string;
  // setAction: Function;
}

const RefundRules = ({ action }: Props) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    reimbursmentQuestionGroup: Yup.string().required(t('validation.required')),
    timeParameter: Yup.string().required(t('validation.required')),
    accumulatedAmount: Yup.string().required(t('validation.required')),
    idCodeBalance: Yup.string(),
    reimbursementThreshold: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive')),
  });

  const formik = useFormik({
    initialValues: {
      reimbursmentQuestionGroup: '',
      timeParameter: '',
      accumulatedAmount: '',
      idCodeBalance: '',
      reimbursementThreshold: '',
    },
    validateOnChange: true,
    // enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
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
            defaultValue={formik.values.reimbursmentQuestionGroup}
            onChange={(e) => formik.setFieldValue('reimbursmentQuestionGroup', e.target.value)}
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label={t('components.wizard.stepFour.form.accumulatedAmount')}
            />
            <FormControlLabel
              sx={{ ml: 2 }}
              value="false"
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
                id="select-accumulated-amount"
                value={formik.values.accumulatedAmount}
                label={t('components.wizard.stepFour.form.selectedAccumulatedAmount')}
                onChange={(e) => formik.setFieldValue('accumulatedAmount', e.target.value)}
                onBlur={(e) => formik.handleBlur(e)}
              >
                <MenuItem value="balanceExhausted" data-testid="balance-exhausted">
                  {t('components.wizard.stepFour.select.accumulatedAmount.balanceExhausted')}
                </MenuItem>
                <MenuItem value="certainThreshold" data-testid="certain-threshold">
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

            {formik.values.accumulatedAmount === 'certainThreshold' ? (
              <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', mb: 4 }}>
                <TextField
                  inputProps={{
                    step: 0.01,
                    min: 0,
                    type: 'number',
                    'data-testid': 'reimbursement-threshold',
                  }}
                  id="reimbursement-threshold"
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
                id="select-time-parameter"
                value={formik.values.timeParameter}
                label={t('components.wizard.stepFour.form.selectTimeParam')}
                onChange={(e) => formik.setFieldValue('timeParameter', e.target.value)}
                onBlur={(e) => formik.handleBlur(e)}
              >
                <MenuItem value="initiativeDone" data-testid="initiative-done">
                  {t('components.wizard.stepFour.select.timrParameter.initiativeDone')}
                </MenuItem>
                <MenuItem value="everyDay" data-testid="every-day">
                  {t('components.wizard.stepFour.select.timrParameter.everyDay')}
                </MenuItem>
                <MenuItem value="everyWeek" data-testid="every-week">
                  {t('components.wizard.stepFour.select.timrParameter.everyWeek')}
                </MenuItem>
                <MenuItem value="everyMonth" data-testid="every-month">
                  {t('components.wizard.stepFour.select.timrParameter.everyMonth')}
                </MenuItem>
                <MenuItem value="everyThreeMonths" data-testid="every-three-months">
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
            id="id-code-balance"
            label={t('components.wizard.stepFour.form.idCodeBalance')}
            placeholder={t('components.wizard.stepFour.form.idCodeBalance')}
            name="idCodeBalance"
            aria-label="idCodeBalance"
            value={formik.values.idCodeBalance}
            onChange={(e) => formik.setFieldValue('idCodeBalance', e.target.value)}
          />
        </FormControl>
      </Paper>
    </>
  );
};

export default RefundRules;
