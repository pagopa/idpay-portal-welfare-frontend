import { Box, FormControl, FormHelperText, MenuItem, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useAppDispatch } from '../../../../redux/hooks';
import { setAutomatedCriteria } from '../../../../redux/slices/initiativeSlice';
import { WIZARD_ACTIONS, FilterOperator, DateOfBirthOptions } from '../../../../utils/constants';
import {
  handleCriteriaToSubmit,
  setError,
  setErrorText,
  setFieldType,
  setFormControlDisplayProp,
} from './helpers';

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
  const [dateOfBirthEndValueVisible, setDateOfBirthEndValueVisible] = useState('hidden');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      dateOfBirthFormik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
    setAction('');
  }, [action]);

  const dateOfBirthValidationSchema = Yup.object().shape({
    dateOfBirthSelect: Yup.string().required(t('validation.required')),
    dateOfBirthRelationSelect: Yup.string().required(t('validation.required')),
    dateOfBirthStartValue: Yup.string().required(t('validation.required')),
    dateOfBirthEndValue: Yup.number().when(['dateOfBirthRelationSelect', 'dateOfBirthStartValue'], {
      is: (dateOfBirthRelationSelect: string, dateOfBirthStartValue: string) =>
        dateOfBirthRelationSelect === FilterOperator.IN && dateOfBirthStartValue,
      then: (_dateOfBirthStartValue) =>
        Yup.number()
          .required(t('validation.required'))
          .moreThan(Yup.ref('dateOfBirthStartValue'), t('validation.outValue')),
    }),
  });

  const dateOfBirthFormik = useFormik({
    initialValues: {
      field,
      authority,
      dateOfBirthSelect: DateOfBirthOptions.YEAR,
      dateOfBirthRelationSelect: FilterOperator.EQ,
      dateOfBirthStartValue: '',
      dateOfBirthEndValue: '',
    },
    validateOnChange: true,
    validationSchema: dateOfBirthValidationSchema,
    onSubmit: (values) => {
      const data = {
        authority: values.authority.toString(),
        code: values.dateOfBirthSelect,
        field: values.field.toString(),
        operator: values.dateOfBirthRelationSelect,
        value: values.dateOfBirthStartValue,
      };
      dispatch(setAutomatedCriteria(data));
      setCriteriaToSubmit([...handleCriteriaToSubmit(criteriaToSubmit, code)]);
    },
  });

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
          id="dateOfBirthSelect"
          name="dateOfBirthSelect"
          value={dateOfBirthFormik.values.dateOfBirthSelect}
          onChange={(e) => dateOfBirthFormik.handleChange(e)}
          error={setError(
            dateOfBirthFormik.touched.dateOfBirthSelect,
            dateOfBirthFormik.errors.dateOfBirthSelect
          )}
        >
          <MenuItem value={DateOfBirthOptions.YEAR}>
            {t('components.wizard.stepTwo.chooseCriteria.form.year')}
          </MenuItem>
          <MenuItem value={DateOfBirthOptions.AGE}>
            {t('components.wizard.stepTwo.chooseCriteria.form.age')}
          </MenuItem>
        </Select>
        <FormHelperText>
          {setErrorText(
            dateOfBirthFormik.touched.dateOfBirthSelect,
            dateOfBirthFormik.errors.dateOfBirthSelect
          )}
        </FormHelperText>
      </FormControl>
      <FormControl sx={{ gridColumn: 'span 1' }}>
        <Select
          id="dateOfBirthRelationSelect"
          name="dateOfBirthRelationSelect"
          value={dateOfBirthFormik.values.dateOfBirthRelationSelect}
          onChange={(e) => {
            setFieldType(e.target.value, setDateOfBirthEndValueVisible);
            dateOfBirthFormik.handleChange(e);
          }}
          error={setError(
            dateOfBirthFormik.touched.dateOfBirthRelationSelect,
            dateOfBirthFormik.errors.dateOfBirthRelationSelect
          )}
        >
          <MenuItem value={FilterOperator.EQ}>
            {t('components.wizard.stepTwo.chooseCriteria.form.exact')}
          </MenuItem>
          <MenuItem value={FilterOperator.GT}>
            {t('components.wizard.stepTwo.chooseCriteria.form.majorTo')}
          </MenuItem>
          <MenuItem value={FilterOperator.LT}>
            {t('components.wizard.stepTwo.chooseCriteria.form.minorTo')}
          </MenuItem>
          <MenuItem value={FilterOperator.GE}>
            {t('components.wizard.stepTwo.chooseCriteria.form.majorOrEqualTo')}
          </MenuItem>
          <MenuItem value={FilterOperator.LE}>
            {t('components.wizard.stepTwo.chooseCriteria.form.minorOrEqualTo')}
          </MenuItem>
          <MenuItem value={FilterOperator.IN}>
            {t('components.wizard.stepTwo.chooseCriteria.form.between')}
          </MenuItem>
        </Select>
        <FormHelperText>
          {setErrorText(
            dateOfBirthFormik.touched.dateOfBirthRelationSelect,
            dateOfBirthFormik.errors.dateOfBirthRelationSelect
          )}
        </FormHelperText>
      </FormControl>
      <FormControl sx={{ gridColumn: 'span 1' }}>
        <TextField
          inputProps={{
            step: 1,
            min: 1,
            type: 'number',
          }}
          placeholder={t('components.wizard.stepTwo.chooseCriteria.form.value')}
          name="dateOfBirthStartValue"
          value={dateOfBirthFormik.values.dateOfBirthStartValue}
          onChange={(e) => dateOfBirthFormik.handleChange(e)}
          error={setError(
            dateOfBirthFormik.touched.dateOfBirthStartValue,
            dateOfBirthFormik.errors.dateOfBirthStartValue
          )}
          helperText={setErrorText(
            dateOfBirthFormik.touched.dateOfBirthStartValue,
            dateOfBirthFormik.errors.dateOfBirthStartValue
          )}
        />
      </FormControl>
      <FormControl
        sx={{
          gridColumn: 'span 1',
          display: setFormControlDisplayProp(dateOfBirthEndValueVisible),
        }}
      >
        <TextField
          inputProps={{
            step: 1,
            min: 1,
            type: dateOfBirthEndValueVisible,
          }}
          placeholder={t('components.wizard.stepTwo.chooseCriteria.form.value')}
          name="dateOfBirthEndValue"
          value={dateOfBirthFormik.values.dateOfBirthEndValue}
          onChange={(e) => dateOfBirthFormik.handleChange(e)}
          error={setError(
            dateOfBirthFormik.touched.dateOfBirthEndValue,
            dateOfBirthFormik.errors.dateOfBirthEndValue
          )}
          helperText={setErrorText(
            dateOfBirthFormik.touched.dateOfBirthEndValue,
            dateOfBirthFormik.errors.dateOfBirthEndValue
          )}
        />
      </FormControl>
    </Box>
  );
};

export default DateOdBirthCriteriaItem;
