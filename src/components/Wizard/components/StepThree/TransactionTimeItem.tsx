import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { grey } from '@mui/material/colors';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { DaysOfWeekInterval } from '../../../../model/Initiative';
import { handleShopRulesToSubmit, renderShopRuleIcon } from './helpers';

type Props = {
  title: string;
  code: string;
  handleShopListItemRemoved: any;
  action: string;
  shopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }>;
  setShopRulesToSubmit: Dispatch<
    SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
  >;
  data: Array<DaysOfWeekInterval> | undefined;
  setData: Dispatch<SetStateAction<Array<DaysOfWeekInterval> | undefined>>;
};

const TransactionTimeItem = ({
  title,
  code,
  handleShopListItemRemoved,
  action,
  shopRulesToSubmit,
  setShopRulesToSubmit,
  data,
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
    transactionTime: Yup.array().of(
      Yup.object().shape({
        daysOfWeek: Yup.string().required(t('validation.required')),
        startTime: Yup.string()
          .required(t('validation.required'))
          .matches(/^((?:[01]\d|2[0-3]):[0-5]\d$)/, t('validation.formatTimeInvalid')),
        endTime: Yup.string()
          .required(t('validation.required'))
          .matches(/^((?:[01]\d|2[0-3]):[0-5]\d$)/, t('validation.formatTimeInvalid'))
          .test('conditional-range-method', t('validation.outTransactionTime'), function (val) {
            if (val) {
              const minTime = this.parent.startTime;
              const minTimeAsNumber = parseInt(minTime.replace('/:/g', ''), 10);
              const maxTimeAsNumber = parseInt(val.replace('/:/g', ''), 10);
              return minTimeAsNumber < maxTimeAsNumber;
            }
            return true;
          }),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      transactionTime: Array.isArray(data)
        ? [...data]
        : [{ daysOfWeek: 'MONDAY', startTime: '', endTime: '' }],
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

  const addTransactionTimeItem = (values: any, setValues: any) => {
    const newTransactionTime = [
      ...values.transactionTime,
      { daysOfWeek: 'MONDAY', minTime: '', maxTime: '' },
    ];
    setValues({ ...values, transactionTime: [...newTransactionTime] });
  };

  const removeTransactionTimeItem = (i: number, values: any, setValues: any, setTouched: any) => {
    const indexValueToRemove = i;
    const newTransactionTime = values.transactionTime.filter((v: any, j: number) => {
      if (j !== indexValueToRemove) {
        return v;
      }
    });
    setValues({ ...values, transactionTime: newTransactionTime });
    setTouched({}, false);
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

      {formik.values.transactionTime.map((_tt, i) => {
        const transactionTimeErrors =
          (formik.errors.transactionTime?.length && formik.errors.transactionTime[i]) || {};
        const transactionTimeTouched =
          (formik.touched.transactionTime?.length && formik.touched.transactionTime[i]) || {};
        const daysOfWeekError =
          typeof transactionTimeErrors === 'string' ? '' : transactionTimeErrors.daysOfWeek;
        const daysOfWeekTouched = transactionTimeTouched.daysOfWeek;
        const minTimeError =
          typeof transactionTimeErrors === 'string' ? '' : transactionTimeErrors.startTime;
        const minTimeTouched = transactionTimeTouched.startTime;
        const maxTimeError =
          typeof transactionTimeErrors === 'string' ? '' : transactionTimeErrors.endTime;
        const maxTimeTouched = transactionTimeTouched.endTime;

        return (
          <Box
            key={i}
            sx={{
              gridColumn: 'span 24',
              display: 'grid',
              gridTemplateColumns: 'repeat(24, 1fr)',
              gap: 3,
              my: 2,
            }}
          >
            {i !== 0 && (
              <Box sx={{ display: 'grid', gridColumn: 'span 1', alignItems: 'center' }}>
                <RemoveCircleOutlineIcon
                  color="error"
                  sx={{
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    removeTransactionTimeItem(i, formik.values, formik.setValues, formik.setTouched)
                  }
                  id={`remove_element_${i}`}
                />
              </Box>
            )}
            <FormControl
              sx={{ gridColumn: 'span 4' }}
              error={daysOfWeekTouched && Boolean(daysOfWeekError)}
            >
              <Select
                id={`transactionTime[${i}].daysOfWeek`}
                name={`transactionTime[${i}].daysOfWeek`}
                value={formik.values.transactionTime[i].daysOfWeek}
                onChange={(value) => formik.handleChange(value)}
                error={daysOfWeekTouched && Boolean(daysOfWeekError)}
              >
                <MenuItem value="MONDAY">{t('components.wizard.stepThree.form.monday')}</MenuItem>
                <MenuItem value="TUESDAY">{t('components.wizard.stepThree.form.tuesday')}</MenuItem>
                <MenuItem value="WEDNESDAY">
                  {t('components.wizard.stepThree.form.wednesday')}
                </MenuItem>
                <MenuItem value="THURSDAY">
                  {t('components.wizard.stepThree.form.thursday')}
                </MenuItem>
                <MenuItem value="FRIDAY">{t('components.wizard.stepThree.form.friday')}</MenuItem>
                <MenuItem value="SATURDAY">
                  {t('components.wizard.stepThree.form.saturday')}
                </MenuItem>
                <MenuItem value="SUNDAY">{t('components.wizard.stepThree.form.sunday')}</MenuItem>
              </Select>
              <FormHelperText>{daysOfWeekTouched && daysOfWeekError}</FormHelperText>
            </FormControl>
            <FormControl sx={{ gridColumn: 'span 6' }}>
              <TextField
                id={`transactionTime[${i}].startTime`}
                name={`transactionTime[${i}].startTime`}
                value={formik.values.transactionTime[i].startTime}
                placeholder={t('components.wizard.stepThree.form.minTime')}
                onChange={(value) => formik.handleChange(value)}
                error={minTimeTouched && Boolean(minTimeError)}
                helperText={minTimeTouched && minTimeError}
              />
            </FormControl>
            <FormControl sx={{ gridColumn: 'span 6' }}>
              <TextField
                id={`transactionTime[${i}].endTime`}
                name={`transactionTime[${i}].endTime`}
                value={formik.values.transactionTime[i].endTime}
                placeholder={t('components.wizard.stepThree.form.maxTime')}
                onChange={(value) => formik.handleChange(value)}
                error={maxTimeTouched && Boolean(maxTimeError)}
                helperText={maxTimeTouched && maxTimeError}
              />
            </FormControl>
            <Box sx={{ gridColumn: 'span 1', alignSelf: 'center' }}>
              <Tooltip
                title={t('components.wizard.stepThree.form.timeFormatTooltip')}
                placement="right"
                arrow
              >
                <InfoOutlinedIcon color="primary" />
              </Tooltip>
            </Box>
          </Box>
        );
      })}
      <Box
        sx={{
          display: 'grid',
          gridColumn: 'span 3',
          py: 2,
        }}
      >
        <Button
          sx={[
            {
              justifyContent: 'start',
              padding: 0,
            },
            {
              '&:hover': { backgroundColor: 'transparent' },
            },
          ]}
          id="add-option"
          size="small"
          variant="text"
          startIcon={<AddIcon />}
          onClick={() => addTransactionTimeItem(formik.values, formik.setValues)}
          disableRipple={true}
          disableFocusRipple={true}
        >
          {t('components.wizard.stepThree.form.addTransactionTimeItem')}
        </Button>
      </Box>
    </Box>
  );
};

export default TransactionTimeItem;
