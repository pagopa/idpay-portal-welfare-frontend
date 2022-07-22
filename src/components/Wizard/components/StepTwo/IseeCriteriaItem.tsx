import { Box, FormControl, FormHelperText, MenuItem, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { setAutomatedCriteria } from '../../../../redux/slices/initiativeSlice';
import { WIZARD_ACTIONS, FilterOperator } from '../../../../utils/constants';
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

const IseeCriteriaItem = ({
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
  const [iseeEndValueVisible, setIseeEndValueVisible] = useState('hidden');
  const dispatch = useDispatch();

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      iseeFormik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
    setAction('');
  }, [action]);

  const iseeValidationSchema = Yup.object().shape({
    iseeRelationSelect: Yup.string().required(t('validation.required')),
    iseeStartValue: Yup.number().required(t('validation.required')),
    iseeEndValue: Yup.number().when(['iseeRelationSelect', 'iseeStartValue'], {
      is: (iseeRelationSelect: string, iseeStartValue: string) =>
        iseeRelationSelect === FilterOperator.IN && iseeStartValue,
      then: Yup.number()
        .required(t('validation.required'))
        .min(Yup.ref('iseeStartValue'), t('validation.outValue')),
    }),
  });

  const iseeFormik = useFormik({
    initialValues: {
      field,
      authority,
      iseeRelationSelect: FilterOperator.EQ,
      iseeStartValue: '',
      iseeEndValue: '',
    },
    validateOnChange: true,
    validationSchema: iseeValidationSchema,
    onSubmit: (values) => {
      const data = {
        authority: values.authority.toString(),
        code: values.field.toString(),
        field: values.field.toString(),
        operator: values.iseeRelationSelect,
        value: values.iseeStartValue,
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
          id="iseeRelationSelect"
          name="iseeRelationSelect"
          value={iseeFormik.values.iseeRelationSelect}
          onChange={(e) => {
            iseeFormik.handleChange(e);
            setFieldType(e.target.value, setIseeEndValueVisible);
          }}
          error={setError(
            iseeFormik.touched.iseeRelationSelect,
            iseeFormik.errors.iseeRelationSelect
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
            iseeFormik.touched.iseeRelationSelect,
            iseeFormik.errors.iseeRelationSelect
          )}
        </FormHelperText>
      </FormControl>
      <FormControl sx={{ gridColumn: 'span 1' }}>
        <TextField
          inputProps={{
            step: 1,
            min: 0,
            type: 'number',
          }}
          placeholder={t('components.wizard.stepTwo.chooseCriteria.form.value')}
          name="iseeStartValue"
          value={iseeFormik.values.iseeStartValue}
          onChange={(e) => iseeFormik.handleChange(e)}
          error={setError(iseeFormik.touched.iseeStartValue, iseeFormik.errors.iseeStartValue)}
          helperText={setErrorText(
            iseeFormik.touched.iseeStartValue,
            iseeFormik.errors.iseeStartValue
          )}
        />
      </FormControl>
      <FormControl
        sx={{ gridColumn: 'span 1', display: setFormControlDisplayProp(iseeEndValueVisible) }}
      >
        <TextField
          inputProps={{
            step: 1,
            min: 1,
            type: iseeEndValueVisible,
          }}
          placeholder={t('components.wizard.stepTwo.chooseCriteria.form.value')}
          name="iseeEndValue"
          value={iseeFormik.values.iseeEndValue}
          onChange={(e) => iseeFormik.handleChange(e)}
          error={setError(iseeFormik.touched.iseeEndValue, iseeFormik.errors.iseeEndValue)}
          helperText={setErrorText(iseeFormik.touched.iseeEndValue, iseeFormik.errors.iseeEndValue)}
        />
      </FormControl>
    </Box>
  );
};

export default IseeCriteriaItem;
