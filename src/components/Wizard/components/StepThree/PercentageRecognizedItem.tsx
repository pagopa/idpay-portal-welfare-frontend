import { grey } from '@mui/material/colors';
import { Box, FormControl, TextField, Typography } from '@mui/material';
import PercentIcon from '@mui/icons-material/Percent';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { handleShopRulesToSubmit, setError, setErrorText } from './helpers';

interface Props {
  code: string;
  action: string;
  shopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }>;
  setShopRulesToSubmit: Dispatch<
    SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
  >;
}

const PercentageRecognizedItem = ({
  code,
  action,
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
    percetageRecognized: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .max(100, t('validation.outPercentageRecognized')),
  });

  const formik = useFormik({
    initialValues: {
      percetageRecognized: '',
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
      data-testid="percetage-recognized-test"
    >
      <Box sx={{ gridColumn: 'span 1' }}>
        <PercentIcon />
      </Box>
      <Box sx={{ gridColumn: 'span 23' }}>
        <Typography variant="subtitle1">
          {t('components.wizard.stepThree.form.percentageRecognized')}
        </Typography>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 24',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 3,
          my: 2,
        }}
      >
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <TextField
            inputProps={{
              step: 0.01,
              min: 1,
              max: 100,
              type: 'number',
              'data-testid': 'percetage-recognized-value',
            }}
            placeholder={'%'}
            name="percetageRecognized"
            value={formik.values.percetageRecognized}
            onChange={(e) => formik.handleChange(e)}
            error={setError(formik.touched.percetageRecognized, formik.errors.percetageRecognized)}
            helperText={setErrorText(
              formik.touched.percetageRecognized,
              formik.errors.percetageRecognized
            )}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default PercentageRecognizedItem;
