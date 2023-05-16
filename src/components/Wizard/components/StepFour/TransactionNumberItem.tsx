import { Box, IconButton, Typography, FormControl, TextField } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { TrxCount } from '../../../../model/Initiative';
import {
  renderShopRuleIcon,
  handleShopRulesToSubmit,
  setError,
  setErrorText,
  handleUpdateFromToFieldState,
  boxItemStyle,
} from './helpers';

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

  const validationSchema = Yup.object().shape(
    {
      from: Yup.number()
        .nullable()
        .integer(t('validation.integer'))
        .typeError(t('validation.numeric'))
        .positive(t('validation.positive'))
        .when('to', (to, schema) => {
          if (!to) {
            return Yup.number().required(t('validation.positive'));
          }
          return schema;
        }),
      to: Yup.number()
        .nullable()
        .integer(t('validation.integer'))
        .typeError(t('validation.numeric'))
        .positive(t('validation.positive'))
        .when('from', (from, _schema) => {
          if (!from) {
            return Yup.number().required('');
          } else {
            return Yup.number().min(
              parseFloat(from) + 1,
              t('validation.outTransactionNumberLimit')
            );
          }
        }),
    },
    [['from', 'to']]
  );

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

  return (
    <Box sx={boxItemStyle} data-testid="transaction-number-item-test">
      <Box sx={{ gridColumn: 'span 1' }}>{renderShopRuleIcon(code, 0, 'inherit')}</Box>
      <Box sx={{ gridColumn: 'span 22' }}>
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', justifySelf: 'end' }}>
        <IconButton
          onClick={() => handleShopListItemRemoved(code)}
          data-testid="delete-button-test"
        >
          <DeleteOutlineIcon
            color="error"
            sx={{
              cursor: 'pointer',
            }}
          />
        </IconButton>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 24',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'auto',
          gridTemplateAreas: `"minTransactionNumberField minTransactionNumberTooltip . . "
                              "maxTransactionNumberField maxTransactionNumberTooltip . . "`,
          alignItems: 'center',
          gap: 2,
          mt: 1,
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
            placeholder={t('components.wizard.stepFour.form.minTransactionNumber')}
            name="from"
            value={formik.values.from}
            onChange={(e) => {
              formik.handleChange(e);
              handleUpdateFromToFieldState(e.target.value, 'from', data, setData);
            }}
            error={setError(formik.touched.from, formik.errors.from)}
            helperText={setErrorText(formik.touched.from, formik.errors.from)}
            size="small"
          />
        </FormControl>
        <Tooltip
          title={t('components.wizard.stepFour.form.minTransactionNumberTooltip')}
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
            placeholder={t('components.wizard.stepFour.form.maxTransactionNumber')}
            name="to"
            value={formik.values.to}
            onChange={(e) => {
              formik.handleChange(e);
              handleUpdateFromToFieldState(e.target.value, 'to', data, setData);
            }}
            error={setError(formik.touched.to, formik.errors.to)}
            helperText={setErrorText(formik.touched.to, formik.errors.to)}
            size="small"
          />
        </FormControl>
        <Tooltip
          title={t('components.wizard.stepFour.form.maxTransactionNumberTooltip')}
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
