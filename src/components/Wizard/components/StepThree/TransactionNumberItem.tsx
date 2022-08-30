import { Box, IconButton, Typography, FormControl, TextField } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { TrxCount } from '../../../../model/Initiative';
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
  data: TrxCount | undefined;
  setData: Dispatch<SetStateAction<any>>;
};

const TransactionNumberItem = ({
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
    minTransactionNumber: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive')),
    maxTransactionNumber: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .when('minTransactionNumber', (minTransactionNumber, schema) => {
        if (minTransactionNumber) {
          return Yup.number()
            .typeError(t('validation.numeric'))
            .required(t('validation.required'))
            .positive(t('validation.positive'))
            .min(parseFloat(minTransactionNumber) + 1, t('validation.outTransactionNumberLimit'));
        }
        return schema;
      }),
  });

  const formik = useFormik({
    initialValues: {
      minTransactionNumber: data?.from,
      maxTransactionNumber: data?.to,
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
      data-testid="transaction-number-item-test"
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
          gridTemplateAreas: `"minTransactionNumberField minTransactionNumberTooltip . . "
                              "maxTransactionNumberField maxTransactionNumberTooltip . . "`,
          alignItems: 'center',
          gap: 3,
          my: 2,
        }}
      >
        <FormControl sx={{ gridArea: 'minTransactionNumberField' }}>
          <TextField
            inputProps={{
              step: 1,
              min: 0,
              type: 'number',
              'data-testid': 'min-spending-limit',
            }}
            placeholder={t('components.wizard.stepThree.form.minTransactionNumber')}
            name="minTransactionNumber"
            value={formik.values.minTransactionNumber}
            onChange={(e) => formik.handleChange(e)}
            error={setError(
              formik.touched.minTransactionNumber,
              formik.errors.minTransactionNumber
            )}
            helperText={setErrorText(
              formik.touched.minTransactionNumber,
              formik.errors.minTransactionNumber
            )}
          />
        </FormControl>
        <Tooltip
          title={t('components.wizard.stepThree.form.minTransactionNumberTooltip')}
          placement="right"
          sx={{ gridArea: 'minTransactionNumberTooltip' }}
          arrow
        >
          <InfoOutlinedIcon color="primary" />
        </Tooltip>
        <FormControl sx={{ gridArea: 'maxTransactionNumberField' }}>
          <TextField
            inputProps={{
              step: 1,
              min: 0,
              type: 'number',
              'data-testid': 'max-spending-limit',
            }}
            placeholder={t('components.wizard.stepThree.form.maxTransactionNumber')}
            name="maxTransactionNumber"
            value={formik.values.maxTransactionNumber}
            onChange={(e) => formik.handleChange(e)}
            error={setError(
              formik.touched.maxTransactionNumber,
              formik.errors.maxTransactionNumber
            )}
            helperText={setErrorText(
              formik.touched.maxTransactionNumber,
              formik.errors.maxTransactionNumber
            )}
          />
        </FormControl>
        <Tooltip
          title={t('components.wizard.stepThree.form.maxTransactionNumberTooltip')}
          placement="right"
          sx={{ gridArea: 'maxTransactionNumberTooltip' }}
          arrow
        >
          <InfoOutlinedIcon color="primary" />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TransactionNumberItem;
