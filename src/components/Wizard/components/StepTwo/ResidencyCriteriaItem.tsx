import { Box, FormControl, FormHelperText, MenuItem, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { setAutomatedCriteria } from '../../../../redux/slices/initiativeSlice';
import { WIZARD_ACTIONS, FilterOperator, ResidencyOptions } from '../../../../utils/constants';
import { handleCriteriaToSubmit } from './helpers';

type Props = {
  code: string | number;
  field: string | number;
  authority: string | number;
  action: string | number;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  criteriaToSubmit: Array<{ code: string; dispatched: boolean }>;
  setCriteriaToSubmit: Dispatch<SetStateAction<Array<{ code: string; dispatched: boolean }>>>;
};

const DateOdBirthCriteriaItem = ({
  code,
  field,
  authority,
  action,
  setAction,
  criteriaToSubmit,
  setCriteriaToSubmit,
}: // currentStep,
// setCurrentStep,
Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      residencyFormik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
    setAction('');
  }, [action]);

  const residencyValidationSchema = Yup.object().shape({
    residencySelect: Yup.string().required(t('validation.required')),
    residencyRelationSelect: Yup.string().required(t('validation.required')),
    residencyValue: Yup.string().required(t('validation.required')),
  });

  const residencyFormik = useFormik({
    initialValues: {
      field,
      authority,
      residencySelect: ResidencyOptions.CITY,
      residencyRelationSelect: FilterOperator.EQ,
      residencyValue: '',
    },
    validateOnChange: true,
    validationSchema: residencyValidationSchema,
    onSubmit: (values) => {
      const data = {
        authority: values.authority.toString(),
        code: values.residencySelect,
        field: values.field.toString(),
        operator: values.residencyRelationSelect,
        value: values.residencyValue,
      };
      dispatch(setAutomatedCriteria(data));
      setCriteriaToSubmit([...handleCriteriaToSubmit(criteriaToSubmit, code)]);
    },
  });

  const setError = (touched: boolean | undefined, errorText: string | undefined) =>
    touched && Boolean(errorText);

  const setErrorText = (touched: boolean | undefined, errorText: string | undefined) =>
    touched && errorText;

  return (
    <Box
      sx={{
        gridColumn: 'span 12',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 3,
        my: 2,
      }}
    >
      <FormControl sx={{ gridColumn: 'span 1' }}>
        <Select
          id="residencySelect"
          name="residencySelect"
          value={residencyFormik.values.residencySelect}
          onChange={(e) => residencyFormik.handleChange(e)}
          error={setError(
            residencyFormik.touched.residencySelect,
            residencyFormik.errors.residencySelect
          )}
        >
          <MenuItem value={ResidencyOptions.POSTAL_CODE}>
            {t('components.wizard.stepTwo.chooseCriteria.form.postalCode')}
          </MenuItem>
          <MenuItem value={ResidencyOptions.CITY}>
            {t('components.wizard.stepTwo.chooseCriteria.form.city')}
          </MenuItem>
          <MenuItem value={ResidencyOptions.REGION}>
            {t('components.wizard.stepTwo.chooseCriteria.form.region')}
          </MenuItem>
          <MenuItem value={ResidencyOptions.NATION}>
            {t('components.wizard.stepTwo.chooseCriteria.form.nation')}
          </MenuItem>
        </Select>
        <FormHelperText>
          {setErrorText(
            residencyFormik.touched.residencySelect,
            residencyFormik.errors.residencySelect
          )}
        </FormHelperText>
      </FormControl>
      <FormControl sx={{ gridColumn: 'span 1' }}>
        <Select
          id="residencyRelationSelect"
          name="residencyRelationSelect"
          value={residencyFormik.values.residencyRelationSelect}
          onChange={(e) => residencyFormik.handleChange(e)}
          error={setError(
            residencyFormik.touched.residencyRelationSelect,
            residencyFormik.errors.residencyRelationSelect
          )}
        >
          <MenuItem value={FilterOperator.EQ}>
            {t('components.wizard.stepTwo.chooseCriteria.form.is')}
          </MenuItem>
          <MenuItem value={FilterOperator.NOT_EQ}>
            {t('components.wizard.stepTwo.chooseCriteria.form.isNot')}
          </MenuItem>
        </Select>
        <FormHelperText>
          {setErrorText(
            residencyFormik.touched.residencyRelationSelect,
            residencyFormik.errors.residencyRelationSelect
          )}
        </FormHelperText>
      </FormControl>
      <FormControl sx={{ gridColumn: 'span 1' }}>
        <TextField
          id="residencyValue"
          name="residencyValue"
          placeholder={t('components.wizard.stepTwo.chooseCriteria.form.value')}
          variant="outlined"
          value={residencyFormik.values.residencyValue}
          onChange={(e) => residencyFormik.handleChange(e)}
          error={setError(
            residencyFormik.touched.residencyValue,
            residencyFormik.errors.residencyValue
          )}
          helperText={setErrorText(
            residencyFormik.touched.residencyValue,
            residencyFormik.errors.residencyValue
          )}
        />
      </FormControl>
    </Box>
  );
};

export default DateOdBirthCriteriaItem;
