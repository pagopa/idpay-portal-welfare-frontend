import { Paper, Box, Typography, FormControl, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { setError, setErrorText } from './helpers';

type Props = {
  action: string;
};

const APIKeyConnectionItem = ({ action }: Props) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    apiKeyClientId: Yup.string().required(t('validation.required')),
    apiKeyClientAssertion: Yup.string().required(t('validation.required')),
  });

  const formik = useFormik({
    initialValues: {
      apiKeyClientId: '',
      apiKeyClientAssertion: '',
    },
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
  }, [action]);

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">
          {t('components.wizard.stepThree.chooseCriteria.apiKeyConnection.title')}
        </Typography>
      </Box>
      <Box sx={{ pb: 3 }}>
        <Typography variant="body2">
          {t('components.wizard.stepThree.chooseCriteria.apiKeyConnection.subtitle')}
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 1, pb: 4 }}>
        <FormControl sx={{ gridColumn: 'span 6' }}>
          <TextField
            id="apiKeyClientId"
            name="apiKeyClientId"
            label={t('components.wizard.stepThree.chooseCriteria.apiKeyConnection.form.clientId')}
            placeholder={t(
              'components.wizard.stepThree.chooseCriteria.apiKeyConnection.form.clientId'
            )}
            variant="outlined"
            size="small"
            value={formik.values.apiKeyClientId}
            onBlur={(e) => formik.handleBlur(e)}
            onChange={(e) => formik.handleChange(e)}
            error={setError(formik.touched.apiKeyClientId, formik.errors.apiKeyClientId)}
            helperText={setErrorText(formik.touched.apiKeyClientId, formik.errors.apiKeyClientId)}
          />
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 6' }}>
          <TextField
            id="apiKeyClientAssertion"
            name="apiKeyClientAssertion"
            label={t(
              'components.wizard.stepThree.chooseCriteria.apiKeyConnection.form.clientAssertion'
            )}
            placeholder={t(
              'components.wizard.stepThree.chooseCriteria.apiKeyConnection.form.clientAssertion'
            )}
            variant="outlined"
            size="small"
            value={formik.values.apiKeyClientAssertion}
            onBlur={(e) => formik.handleBlur(e)}
            onChange={(e) => formik.handleChange(e)}
            error={setError(
              formik.touched.apiKeyClientAssertion,
              formik.errors.apiKeyClientAssertion
            )}
            helperText={setErrorText(
              formik.touched.apiKeyClientAssertion,
              formik.errors.apiKeyClientAssertion
            )}
          />
        </FormControl>
      </Box>
    </Paper>
  );
};

export default APIKeyConnectionItem;
