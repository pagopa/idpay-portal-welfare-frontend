import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { RewardValueTypeEnum } from '../../../../api/generated/initiative/InitiativeRewardRuleDTO';
import { useAppSelector } from '../../../../redux/hooks';
import { generalInfoSelector } from '../../../../redux/slices/initiativeSlice';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { boxItemStyle, handleShopRulesToSubmit, setError, setErrorText } from './helpers';

interface Props {
  code: string;
  action: string;
  shopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }>;
  setShopRulesToSubmit: Dispatch<
    SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
  >;
  data:
    | {
        _type: string;
        rewardValue: number | undefined;
      }
    | undefined;
  setData: Dispatch<SetStateAction<any>>;
}

const PercentageRecognizedItem = ({
  code,
  action,
  shopRulesToSubmit,
  setShopRulesToSubmit,
  data,
  setData,
}: Props) => {
  const { t } = useTranslation();
  const generalInfo = useAppSelector(generalInfoSelector);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
  }, [action]);

 

  const validationSchema = Yup.object().shape({
    percentageRecognized: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .max(100, t('validation.outPercentageRecognized')),
    fixedPremiumValue: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .max(parseFloat(generalInfo.beneficiaryBudget), t('validation.outFixedPremiumValue')),
    rewardValueType: Yup.string().required(t('validation.required')),
  });

  const formik = useFormik({
    initialValues: {
      percentageRecognized: data?.rewardValue || undefined,
      fixedPremiumValue: data?.rewardValue || undefined,
      rewardValueType: '',
    },
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (_values) => {
      setShopRulesToSubmit([...handleShopRulesToSubmit(shopRulesToSubmit, code)]);
    },
  });

  const handleUpdateState = (value: string | undefined) => {
    const valueNumber =
      typeof value === 'string' && value.length > 0 ? parseFloat(value) : undefined;
    const newState = {
      ...data,
      rewardValue: valueNumber,
    };
    setData({ ...newState });
  };

  return (
    <Box sx={boxItemStyle} data-testid="percentage-recognized-test">
      <Box sx={{ gridColumn: 'span 1' }}>
        <ReceiptLongIcon />
      </Box>
      <Box sx={{ gridColumn: 'span 23' }}>
        <Typography variant="subtitle1">
          {t('components.wizard.stepFour.form.selectedAccumulatedAmount')}
        </Typography>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 24',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateAreas: `"select . ."
                              "input . ."`,
          gap: 2,
          mt: 1,
        }}
      >
        <FormControl sx={{ gridColumn: 'span 1', gridArea: 'select' }} size="small">
          <Select
            id="rewardValueType"
            name="rewardValueType"
            value={formik.values.rewardValueType}
            onChange={(e) => formik.setFieldValue('rewardValueType', e.target.value)}
            error={formik.touched.rewardValueType && Boolean(formik.errors.rewardValueType)}
            inputProps={{
              'data-testid': 'rewardValueType-test',
            }}
          >
            <MenuItem value={RewardValueTypeEnum.ABSOLUTE} data-testid="select-reward-type">
              {t('components.wizard.stepFour.form.select.selectedAccumulatedAmount.fixedPremium')}
            </MenuItem>
            <MenuItem value={RewardValueTypeEnum.PERCENTAGE} data-testid="absolute">
              {t('components.wizard.stepFour.form.select.selectedAccumulatedAmount.percentage')}
            </MenuItem>
          </Select>
          <FormHelperText
            error={formik.touched.rewardValueType && Boolean(formik.errors.rewardValueType)}
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.touched.rewardValueType && formik.errors.rewardValueType}
          </FormHelperText>
        </FormControl>

        {formik.values.rewardValueType === RewardValueTypeEnum.PERCENTAGE ? (
          <FormControl sx={{ gridColumn: 'span 1', gridArea: 'input' }}>
            <TextField
              inputProps={{
                step: 0.01,
                min: 1,
                max: 100,
                type: 'number',
                'data-testid': 'percentage-recognized-value',
              }}
              placeholder={'%'}
              name="percentageRecognized"
              value={formik.values.percentageRecognized}
              onChange={(e) => {
                formik.handleChange(e);
                handleUpdateState(e.target.value);
              }}
              error={setError(
                formik.touched.percentageRecognized,
                formik.errors.percentageRecognized
              )}
              helperText={setErrorText(
                formik.touched.percentageRecognized,
                formik.errors.percentageRecognized
              )}
              size="small"
            />
          </FormControl>
        ) : formik.values.rewardValueType === RewardValueTypeEnum.ABSOLUTE ? (
          <FormControl sx={{ gridColumn: 'span 1', gridArea: 'input' }}>
            <TextField
              inputProps={{
                step: 0.01,
                min: 1,
                max: parseFloat(generalInfo.beneficiaryBudget),
                type: 'number',
                'data-testid': 'fixed-premium-value',
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EuroSymbolIcon />
                  </InputAdornment>
                ),
              }}
              placeholder={t('components.wizard.stepFour.form.fixedPlaceholder')}
              name="fixedPremiumValue"
              value={formik.values.fixedPremiumValue}
              onChange={(e) => {
                formik.handleChange(e);
                handleUpdateState(e.target.value);
              }}
              error={setError(formik.touched.fixedPremiumValue, formik.errors.fixedPremiumValue)}
              helperText={setErrorText(
                formik.touched.fixedPremiumValue,
                formik.errors.fixedPremiumValue
              )}
              size="small"
            />
          </FormControl>
        ) : null}
      </Box>
    </Box>
  );
};

export default PercentageRecognizedItem;
