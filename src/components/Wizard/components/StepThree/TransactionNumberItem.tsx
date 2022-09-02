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
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
  }, [action]);

  const validationSchema = Yup.object().shape({
    from: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive')),
    to: Yup.number()
      .typeError(t('validation.numeric'))
      .required(t('validation.required'))
      .positive(t('validation.positive'))
      .when('from', (from, schema) => {
        if (from) {
          return Yup.number()
            .typeError(t('validation.numeric'))
            .required(t('validation.required'))
            .positive(t('validation.positive'))
            .min(parseFloat(from) + 1, t('validation.outTransactionNumberLimit'));
        }
        return schema;
      }),
  });

  const formik = useFormik({
    initialValues: {
      from: data?.from,
      to: data?.to,
    },
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (_values) => {
      setShopRulesToSubmit([...handleShopRulesToSubmit(shopRulesToSubmit, code)]);
    },
  });

  const handleUpdateFromFieldState = (value: string | undefined) => {
    const valueNumber =
      typeof value === 'string' && value.length > 0 ? parseFloat(value) : undefined;
    const newState = { ...data, from: valueNumber };
    setData({ ...newState });
  };

  const handleUpdateToFieldState = (value: string | undefined) => {
    const valueNumber =
      typeof value === 'string' && value.length > 0 ? parseFloat(value) : undefined;
    const newState = { ...data, to: valueNumber };
    setData({ ...newState });
  };

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
            name="from"
            value={formik.values.from}
            onChange={(e) => {
              formik.handleChange(e);
              handleUpdateFromFieldState(e.target.value);
            }}
            error={setError(formik.touched.from, formik.errors.from)}
            helperText={setErrorText(formik.touched.from, formik.errors.from)}
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
            name="to"
            value={formik.values.to}
            onChange={(e) => {
              formik.handleChange(e);
              handleUpdateToFieldState(e.target.value);
            }}
            error={setError(formik.touched.to, formik.errors.to)}
            helperText={setErrorText(formik.touched.to, formik.errors.to)}
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