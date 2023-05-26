import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { InitiativeRewardTypeEnum } from '../../../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { handleShopRulesToSubmit } from './helpers';

interface Props {
  code: string;
  action: string;
  rewardType: string;
  setRewardType: Dispatch<SetStateAction<InitiativeRewardTypeEnum>>;
  shopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }>;
  setShopRulesToSubmit: Dispatch<
    SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
  >;
}

const RewardType = ({
  code,
  action,
  rewardType,
  setRewardType,
  shopRulesToSubmit,
  setShopRulesToSubmit,
}: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
  }, [action]);

  const validationSchema = Yup.object().shape({
    initiativeRewardType: Yup.string().required(t('validation.required')),
  });

  const formik = useFormik({
    initialValues: {
      initiativeRewardType: rewardType || InitiativeRewardTypeEnum.REFUND,
    },
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (_values) => {
      setShopRulesToSubmit([...handleShopRulesToSubmit(shopRulesToSubmit, code)]);
    },
  });

  return (
    <Box sx={{ pt: 1 }}>
      <Typography variant="overline" sx={{ py: 3 }}>
        {t('components.wizard.stepFour.typology')}
      </Typography>
      <FormControl sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
        <RadioGroup
          sx={{ gridColumn: 'span 12' }}
          row
          aria-labelledby="initiativeRewardType--label"
          name="initiativeRewardType"
          value={formik.values.initiativeRewardType || ''}
          defaultValue={formik.values.initiativeRewardType || ''}
          onChange={async (e) => {
            const curValue = e.target.value as InitiativeRewardTypeEnum;
            setRewardType(curValue);
            await formik.setFieldValue('initiativeRewardType', e.target.value, false);
          }}
          data-testid="initiativeRewardType-test"
        >
          <FormControlLabel
            value={InitiativeRewardTypeEnum.REFUND}
            control={<Radio />}
            label={t('components.wizard.stepFour.form.initiativeRewardType.refund')}
            data-testid="initiativeRewardType_refund-test"
          />
          <FormControlLabel
            sx={{ ml: 2 }}
            value={InitiativeRewardTypeEnum.DISCOUNT}
            control={<Radio />}
            label={t('components.wizard.stepFour.form.initiativeRewardType.discount')}
            data-testid="initiativeRewardType_discount-test"
          />
        </RadioGroup>
        <FormHelperText
          error={formik.touched.initiativeRewardType && Boolean(formik.errors.initiativeRewardType)}
          sx={{ gridColumn: 'span 12' }}
        >
          {formik.touched.initiativeRewardType && formik.errors.initiativeRewardType}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};

export default RewardType;
