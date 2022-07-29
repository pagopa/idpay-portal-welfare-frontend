import {
  Box,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { grey } from '@mui/material/colors';
import { MouseEventHandler, useState } from 'react';
import { FilterOperator } from '../../../../utils/constants';
import { AvailableCriteria } from '../../../../model/AdmissionCriteria';
import { setError, setErrorText, setFieldType, setFormControlDisplayProp } from './helpers';

type Props = {
  formData: AvailableCriteria;
  handleCriteriaRemoved: MouseEventHandler<Element>;
  handleFieldValueChanged: any;
};

const IseeCriteriaItem = ({ formData, handleCriteriaRemoved, handleFieldValueChanged }: Props) => {
  const { t } = useTranslation();
  const [iseeEndValueVisible, setIseeEndValueVisible] = useState('hidden');

  const iseeValidationSchema = Yup.object().shape({
    iseeRelationSelect: Yup.string().required(t('validation.required')),
    iseeStartValue: Yup.number().required(t('validation.required')),
    iseeEndValue: Yup.number().when(['iseeRelationSelect', 'iseeStartValue'], {
      is: (iseeRelationSelect: string, iseeStartValue: string) =>
        iseeRelationSelect === FilterOperator.BTW_CLOSED && iseeStartValue,
      then: Yup.number()
        .required(t('validation.required'))
        .min(Yup.ref('iseeStartValue'), t('validation.outValue')),
    }),
  });

  const iseeFormik = useFormik({
    initialValues: {
      iseeRelationSelect: formData.operator,
      iseeStartValue: formData.value,
      iseeEndValue: formData.value2,
    },
    validateOnChange: true,
    validationSchema: iseeValidationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        alignItems: 'center',
        borderColor: grey.A200,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: 2,
        my: 3,
        p: 3,
      }}
    >
      <Box sx={{ gridColumn: 'span 11' }}>
        <Typography variant="subtitle1">{formData.fieldLabel}</Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', justifySelf: 'end' }}>
        <DeleteOutlineIcon
          color="error"
          data-id={formData.code}
          sx={{
            cursor: 'pointer',
          }}
          onClick={(event: any) => handleCriteriaRemoved(event)}
        />
      </Box>
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
              handleFieldValueChanged(e.target.value, 'operator', formData.code);
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
            <MenuItem value={FilterOperator.BTW_CLOSED}>
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
            onChange={(e) => {
              iseeFormik.handleChange(e);
              handleFieldValueChanged(e.target.value, 'value', formData.code);
            }}
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
            onChange={(e) => {
              iseeFormik.handleChange(e);
              handleFieldValueChanged(e.target.value, 'value2', formData.code);
            }}
            error={setError(iseeFormik.touched.iseeEndValue, iseeFormik.errors.iseeEndValue)}
            helperText={setErrorText(
              iseeFormik.touched.iseeEndValue,
              iseeFormik.errors.iseeEndValue
            )}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default IseeCriteriaItem;
