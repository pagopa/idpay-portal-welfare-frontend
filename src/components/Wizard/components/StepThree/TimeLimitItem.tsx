import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { grey } from '@mui/material/colors';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
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
};

const TimeLimitItem = ({
  title,
  code,
  handleShopListItemRemoved,
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
    timeLimit: Yup.array().of(
      Yup.object().shape({
        frequency: Yup.string().required(t('validation.required')),
        rewardLimit: Yup.number()
          .typeError(t('validation.numeric'))
          .required(t('validation.required'))
          .positive(t('validation.positive')),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      timeLimit: [{ frequency: 'DAILY', rewardLimit: '' }],
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

  const addTimeLimitItem = (values: any, setValues: any) => {
    const newTimeLimit = [...values.timeLimit, { frequency: 'DAILY', rewardLimit: '' }];
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
                    removeTimeLimitItem(i, formik.values, formik.setValues, formik.setTouched)
                  }
                  id={`remove_element_${i}`}
                />
              </Box>
            )}

            <FormControl
              sx={{ gridColumn: 'span 4' }}
              error={frequencyTouched && Boolean(frequencyError)}
            >
              <Select
                id={`timeLimit[${i}].frequency`}
                name={`timeLimit[${i}].frequency`}
                value={formik.values.timeLimit[i].frequency}
                onChange={(value) => formik.handleChange(value)}
                error={frequencyTouched && Boolean(frequencyError)}
              >
                <MenuItem value="DAILY">
                  {t('components.wizard.stepThree.form.rewardLimitDaily')}
                </MenuItem>
                <MenuItem value="MONTHLY">
                  {t('components.wizard.stepThree.form.rewardLimitMonthly')}
                </MenuItem>
                <MenuItem value="YEARLY">
                  {t('components.wizard.stepThree.form.rewardLimitYearly')}
                </MenuItem>
              </Select>
              <FormHelperText>{frequencyTouched && frequencyError}</FormHelperText>
            </FormControl>
            <FormControl sx={{ gridColumn: 'span 6' }}>
              <TextField
                id={`timeLimit[${i}].rewardLimit`}
                name={`timeLimit[${i}].rewardLimit`}
                value={formik.values.timeLimit[i].rewardLimit}
                onChange={(value) => formik.handleChange(value)}
                placeholder={t('components.wizard.stepThree.form.maxReward')}
                inputProps={{
                  step: 0.01,
                  min: 1,
                  type: 'number',
                  'data-testid': `timeLimit[${i}].rewardLimit`,
                }}
                error={rewardLimitTouched && Boolean(rewardLimitError)}
                helperText={rewardLimitTouched && rewardLimitError}
              />
            </FormControl>
          </Box>
        );
      })}
      <Box
        sx={{
          display: 'grid',
          gridColumn: 'span 12',
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
          onClick={() => addTimeLimitItem(formik.values, formik.setValues)}
          disableRipple={true}
          disableFocusRipple={true}
        >
          {t('components.wizard.stepThree.form.addTimeLimitItem')}
        </Button>
      </Box>
    </Box>
  );
};

export default TimeLimitItem;
