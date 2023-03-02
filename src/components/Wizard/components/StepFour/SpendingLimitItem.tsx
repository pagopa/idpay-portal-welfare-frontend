import { Box, FormControl, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import { useTranslation } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { Threshold } from '../../../../model/Initiative';
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
            .min(parseFloat(from) + 0.01, t('validation.outMaxSpendingLimit'));
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

  return (
    <Box sx={boxItemStyle} data-testid="spending-limit-item-test">
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
            data-testid="delete-button-spending-limit-test"
          />
        </IconButton>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 24',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'auto',
          gridTemplateAreas: `"minSpeningLimitField minSpendingLimitTooltip . . "
                              "maxSpendingLimitField maxSpendingLimitTooltip . . "`,
          alignItems: 'center',
          gap: 2,
          mt: 1,
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
            placeholder={t('components.wizard.stepFour.form.minSpeningLimit')}
            name="from"
            value={formik.values.from}
            onChange={(e) => {
              formik.handleChange(e);
              handleUpdateFromToFieldState(e.target.value, 'from', data, setData);
            }}
            error={setError(formik.touched.from, formik.errors.from)}
            helperText={setErrorText(formik.touched.from, formik.errors.from)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EuroSymbolIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </FormControl>
        <Tooltip
          title={t('components.wizard.stepFour.form.minSpendingLimitTooltip')}
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
            placeholder={t('components.wizard.stepFour.form.maxSpeningLimit')}
            name="to"
            value={formik.values.to}
            onChange={(e) => {
              formik.handleChange(e);
              handleUpdateFromToFieldState(e.target.value, 'to', data, setData);
            }}
            error={setError(formik.touched.to, formik.errors.to)}
            helperText={setErrorText(formik.touched.to, formik.errors.to)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EuroSymbolIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </FormControl>
        <Tooltip
          title={t('components.wizard.stepFour.form.maxSpendingLimitTooltip')}
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
