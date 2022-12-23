import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import { grey } from '@mui/material/colors';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { RewardLimit } from '../../../../model/Initiative';
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
  data: Array<RewardLimit> | undefined;
  setData: Dispatch<SetStateAction<Array<RewardLimit> | undefined>>;
};

const TimeLimitItem = ({
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
    timeLimit: Yup.array().of(
      Yup.object().shape({
        frequency: Yup.string()
          .required(t('validation.required'))
          .test('unique-frequency', t('validation.uniqueFrequency'), function (val) {
            if (val && val.length > 0) {
              const frequencies = formik.values.timeLimit;
              // eslint-disable-next-line functional/no-let
              let countFound = 0;
              frequencies.forEach((f) => {
                if (val === f.frequency) {
                  countFound++;
                }
              });
              return countFound === 1;
            }
            return true;
          }),
        rewardLimit: Yup.number()
          .typeError(t('validation.numeric'))
          .required(t('validation.required'))
          .positive(t('validation.positive')),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      timeLimit: Array.isArray(data) ? [...data] : [{ frequency: 'DAILY', rewardLimit: undefined }],
    },
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (_values) => {
      setShopRulesToSubmit([...handleShopRulesToSubmit(shopRulesToSubmit, code)]);
    },
  });

  const addTimeLimitItem = (values: any, setValues: any) => {
    const newTimeLimit = [...values.timeLimit, { frequency: 'DAILY', rewardLimit: undefined }];
    setValues({ ...values, timeLimit: [...newTimeLimit] });
  };

  const removeTimeLimitItem = (i: number, values: any, setValues: any, setTouched: any) => {
    const indexValueToRemove = i;
    const newTimeLimitItems = values.timeLimit.filter((v: any, j: number) => {
      if (j !== indexValueToRemove) {
        return v;
      }
    });
    setValues({ ...values, timeLimit: newTimeLimitItems });
    setTouched({}, false);
  };

  useEffect(() => {
    setData([...formik.values.timeLimit]);
  }, [formik.values.timeLimit]);

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
      data-testid="time-limit-item-test"
    >
      <Box sx={{ gridColumn: 'span 1', mb: 1 }}>{renderShopRuleIcon(code, 0, 'inherit')}</Box>
      <Box sx={{ gridColumn: 'span 22', mb: 1 }}>
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', justifySelf: 'end', mb: 1 }}>
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

      {formik.values.timeLimit.map((_tl, i) => {
        const timeLimitErrors =
          (formik.errors.timeLimit?.length && formik.errors.timeLimit[i]) || {};
        const timeLimitTouched =
          (formik.touched.timeLimit?.length && formik.touched.timeLimit[i]) || {};

        const frequencyError = typeof timeLimitErrors === 'string' ? '' : timeLimitErrors.frequency;
        const frequencyTouched = timeLimitTouched.frequency;
        const rewardLimitError =
          typeof timeLimitErrors === 'string' ? '' : timeLimitErrors.rewardLimit;
        const rewardLimitTouched = timeLimitTouched.rewardLimit;

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
                    removeTimeLimitItem(i, formik.values, formik.setValues, formik.setTouched)
                  }
                  id={`remove_element_${i}`}
                  data-testid={'removeCircleIconLimit'}
                />
              </Box>
            )}

            <FormControl
              sx={{ gridColumn: 'span 5' }}
              error={frequencyTouched && Boolean(frequencyError)}
              size="small"
            >
              <Select
                id={`timeLimit[${i}].frequency`}
                name={`timeLimit[${i}].frequency`}
                value={formik.values.timeLimit[i].frequency}
                onChange={(value) => formik.handleChange(value)}
                error={frequencyTouched && Boolean(frequencyError)}
                inputProps={{ 'data-testid': 'select-frequency-test' }}
              >
                <MenuItem value="DAILY">
                  {t('components.wizard.stepFour.form.rewardLimitDaily')}
                </MenuItem>
                <MenuItem value="MONTHLY">
                  {t('components.wizard.stepFour.form.rewardLimitMonthly')}
                </MenuItem>
                <MenuItem value="YEARLY">
                  {t('components.wizard.stepFour.form.rewardLimitYearly')}
                </MenuItem>
              </Select>
              <FormHelperText>{frequencyTouched && frequencyError}</FormHelperText>
            </FormControl>
            <FormControl sx={{ gridColumn: 'span 8' }}>
              <TextField
                id={`timeLimit[${i}].rewardLimit`}
                name={`timeLimit[${i}].rewardLimit`}
                value={formik.values.timeLimit[i].rewardLimit}
                onChange={(value) => formik.handleChange(value)}
                placeholder={t('components.wizard.stepFour.form.maxReward')}
                inputProps={{
                  step: 0.01,
                  min: 1,
                  type: 'number',
                  'data-testid': `timeLimit[${i}].rewardLimit`,
                }}
                error={rewardLimitTouched && Boolean(rewardLimitError)}
                helperText={rewardLimitTouched && rewardLimitError}
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
          onClick={() => addTimeLimitItem(formik.values, formik.setValues)}
          startIcon={<AddIcon />}
          sx={{ color: 'primary.main' }}
          weight="default"
        >
          {t('components.wizard.stepFour.form.addTimeLimitItem')}
        </ButtonNaked>
      </Box>
    </Box>
  );
};

export default TimeLimitItem;
