import { Box, FormControl, IconButton, TextField, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { Threshold } from '../../../../model/Initiative';
import { renderShopRuleIcon, handleShopRulesToSubmit, setError, setErrorText } from './helpers';

type Props = {
  title: string;
  code: string;
  handleShopListItemRemoved: any;
  action: string;
  shopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }>;
  setShopRulesToSubmit: Dispatch<
    SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
  >;
  data: Threshold | undefined;
  setData: Dispatch<SetStateAction<any>>;
};

const SpendingLimitItem = ({
  title,
  code,
  handleShopListItemRemoved,
  action,
  shopRulesToSubmit,
  setShopRulesToSubmit,
  data,
  setData,
}: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    // TODO use in a function on change
    console.log(setData);
  }, []);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
  }, [action]);

  const validationSchema = Yup.object().shape({
    minSpendingLimit: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive')),
    maxSpendingLimit: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .when('minSpendingLimit', (minSpendingLimit, schema) => {
        if (minSpendingLimit) {
          return Yup.number()
            .typeError(t('validation.numeric'))
            .required(t('validation.required'))
            .positive(t('validation.positive'))
            .min(parseFloat(minSpendingLimit) + 0.01, t('validation.outMaxSpendingLimit'));
        }
        return schema;
      }),
  });

  const formik = useFormik({
    initialValues: {
      minSpendingLimit: data?.from,
      maxSpendingLimit: data?.to,
    },
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      setShopRulesToSubmit([...handleShopRulesToSubmit(shopRulesToSubmit, code)]);
    },
  });

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        alignItems: 'start',
        borderColor: grey.A200,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: 2,
        my: 3,
        p: 3,
      }}
      data-testid="spending-limit-item-test"
    >
      <Box sx={{ gridColumn: 'span 1' }}>{renderShopRuleIcon(code, 0, 'inherit')}</Box>
      <Box sx={{ gridColumn: 'span 22' }}>
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', justifySelf: 'end' }}>
        <IconButton onClick={() => handleShopListItemRemoved(code)}>
          <DeleteOutlineIcon
            color="error"
            sx={{
              cursor: 'pointer',
            }}
            data-testid="delete-button-test"
          />
        </IconButton>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 24',
          display: 'grid',
          gridTemplateColumns: 'repeat( 4, 1fr)',
          gridTemplateRows: 'auto',
          gridTemplateAreas: `"minSpeningLimitField minSpendingLimitTooltip . . "
                              "maxSpendingLimitField maxSpendingLimitTooltip . . "`,
          alignItems: 'center',
          gap: 3,
          my: 2,
        }}
      >
        <FormControl sx={{ gridArea: 'minSpeningLimitField' }}>
          <TextField
            inputProps={{
              step: 0.01,
              min: 0,
              type: 'number',
              'data-testid': 'min-spending-limit',
            }}
            placeholder={t('components.wizard.stepThree.form.minSpeningLimit')}
            name="minSpendingLimit"
            value={formik.values.minSpendingLimit}
            onChange={(e) => formik.handleChange(e)}
            error={setError(formik.touched.minSpendingLimit, formik.errors.minSpendingLimit)}
            helperText={setErrorText(
              formik.touched.minSpendingLimit,
              formik.errors.minSpendingLimit
            )}
          />
        </FormControl>
        <Tooltip
          title={t('components.wizard.stepThree.form.minSpendingLimitTooltip')}
          placement="right"
          sx={{ gridArea: 'minSpendingLimitTooltip' }}
          arrow
        >
          <InfoOutlinedIcon color="primary" />
        </Tooltip>
        <FormControl sx={{ gridArea: 'maxSpendingLimitField' }}>
          <TextField
            inputProps={{
              step: 0.01,
              min: 0,
              type: 'number',
              'data-testid': 'max-spending-limit',
            }}
            placeholder={t('components.wizard.stepThree.form.maxSpeningLimit')}
            name="maxSpendingLimit"
            value={formik.values.maxSpendingLimit}
            onChange={(e) => formik.handleChange(e)}
            error={setError(formik.touched.maxSpendingLimit, formik.errors.maxSpendingLimit)}
            helperText={setErrorText(
              formik.touched.maxSpendingLimit,
              formik.errors.maxSpendingLimit
            )}
          />
        </FormControl>
        <Tooltip
          title={t('components.wizard.stepThree.form.maxSpendingLimitTooltip')}
          placement="right"
          sx={{ gridArea: 'maxSpendingLimitTooltip' }}
          arrow
        >
          <InfoOutlinedIcon color="primary" />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default SpendingLimitItem;
