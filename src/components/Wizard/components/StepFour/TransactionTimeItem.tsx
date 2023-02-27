import {
  Box,
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
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { DaysOfWeekInterval } from '../../../../model/Initiative';
import { boxItemStyle, handleShopRulesToSubmit, renderShopRuleIcon } from './helpers';

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
            if (val && val.length > 0) {
              const minTime = this.parent.startTime;
              if (minTime && minTime.length > 0) {
                const minTimeTrim = minTime.replace(':', '');
                const minTimeAsNumber = parseInt(minTimeTrim, 10);
                const maxTimeTrim = val.replace(':', '');
                const maxTimeAsNumber = parseInt(maxTimeTrim, 10);
                return minTimeAsNumber < maxTimeAsNumber;
              }
              return true;
            }
            return true;
          })
          .test(
            'no-equal-time-ranges-for-the-same-day',
            t('validation.uniqueInterval'),
            function (val) {
              if (val && val.length > 0) {
                const daysOfWeek = this.parent.daysOfWeek;
                const minTime = this.parent.startTime;
                if (daysOfWeek && daysOfWeek.length > 0 && minTime && minTime.length > 0) {
                  const values = formik.values.transactionTime;
                  // eslint-disable-next-line functional/no-let
                  let countFound = 0;
                  values.forEach((v) => {
                    if (
                      v.daysOfWeek === daysOfWeek &&
                      v.startTime === minTime &&
                      v.endTime === val
                    ) {
                      countFound++;
                    }
                  });
                  return countFound === 1;
                }
                return true;
              }
              return true;
            }
          ),
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
    onSubmit: (_values) => {
      setShopRulesToSubmit([...handleShopRulesToSubmit(shopRulesToSubmit, code)]);
    },
  });

  const addTransactionTimeItem = (values: any, setValues: any) => {
    const newTransactionTime = [
      ...values.transactionTime,
      { daysOfWeek: 'MONDAY', startTime: '', endTime: '' },
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

  useEffect(() => {
    setData([...formik.values.transactionTime]);
  }, [formik.values.transactionTime]);

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
              gap: 2,
              my: 1,
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
                  data-testid={'removeCircleIcon'}
                />
              </Box>
            )}
            <FormControl
              sx={{ gridColumn: 'span 5' }}
              error={daysOfWeekTouched && Boolean(daysOfWeekError)}
              size="small"
            >
              <Select
                id={`transactionTime[${i}].daysOfWeek`}
                name={`transactionTime[${i}].daysOfWeek`}
                value={formik.values.transactionTime[i].daysOfWeek}
                onChange={(value) => formik.handleChange(value)}
                error={daysOfWeekTouched && Boolean(daysOfWeekError)}
                inputProps={{ 'data-testid': 'selectDayOfWeek' }}
              >
                <MenuItem value="MONDAY">{t('components.wizard.stepFour.form.monday')}</MenuItem>
                <MenuItem value="TUESDAY">{t('components.wizard.stepFour.form.tuesday')}</MenuItem>
                <MenuItem value="WEDNESDAY">
                  {t('components.wizard.stepFour.form.wednesday')}
                </MenuItem>
                <MenuItem value="THURSDAY">
                  {t('components.wizard.stepFour.form.thursday')}
                </MenuItem>
                <MenuItem value="FRIDAY">{t('components.wizard.stepFour.form.friday')}</MenuItem>
                <MenuItem value="SATURDAY">
                  {t('components.wizard.stepFour.form.saturday')}
                </MenuItem>
                <MenuItem value="SUNDAY">{t('components.wizard.stepFour.form.sunday')}</MenuItem>
              </Select>
              <FormHelperText>{daysOfWeekTouched && daysOfWeekError}</FormHelperText>
            </FormControl>
            <FormControl sx={{ gridColumn: 'span 8' }}>
              <TextField
                id={`transactionTime[${i}].startTime`}
                name={`transactionTime[${i}].startTime`}
                value={formik.values.transactionTime[i].startTime}
                placeholder={t('components.wizard.stepFour.form.minTime')}
                onChange={(value) => formik.handleChange(value)}
                error={minTimeTouched && Boolean(minTimeError)}
                helperText={minTimeTouched && minTimeError}
                size="small"
                inputProps={{ 'data-testid': 'item-minTime' }}
              />
            </FormControl>
            <FormControl sx={{ gridColumn: 'span 8' }}>
              <TextField
                id={`transactionTime[${i}].endTime`}
                name={`transactionTime[${i}].endTime`}
                value={formik.values.transactionTime[i].endTime}
                placeholder={t('components.wizard.stepFour.form.maxTime')}
                onChange={(value) => formik.handleChange(value)}
                error={maxTimeTouched && Boolean(maxTimeError)}
                helperText={maxTimeTouched && maxTimeError}
                size="small"
                inputProps={{ 'data-testid': 'item-maxTime' }}
              />
            </FormControl>
            <Box sx={{ gridColumn: 'span 1', alignSelf: 'center' }}>
              <Tooltip
                title={t('components.wizard.stepFour.form.timeFormatTooltip')}
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
          gridColumn: 'span 4',
          mt: 1,
          justifyContent: 'start',
        }}
      >
        <ButtonNaked
          size="small"
          component="button"
          onClick={() => addTransactionTimeItem(formik.values, formik.setValues)}
          startIcon={<AddIcon />}
          sx={{ color: 'primary.main' }}
          weight="default"
        >
          {t('components.wizard.stepFour.form.addTransactionTimeItem')}
        </ButtonNaked>
      </Box>
    </Box>
  );
};

export default TransactionTimeItem;
