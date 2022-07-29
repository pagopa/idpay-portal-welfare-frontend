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
import { MouseEventHandler, useState } from 'react';
import * as Yup from 'yup';
import { grey } from '@mui/material/colors';
import { FilterOperator, DateOfBirthOptions } from '../../../../utils/constants';
import { AvailableCriteria } from '../../../../model/AdmissionCriteria';
import { setError, setErrorText, setFieldType, setFormControlDisplayProp } from './helpers';

type Props = {
  formData: AvailableCriteria;
  handleCriteriaRemoved: MouseEventHandler<Element>;
  handleFieldValueChanged: any;
};

const DateOdBirthCriteriaItem = ({
  formData,
  handleCriteriaRemoved,
  handleFieldValueChanged,
}: Props) => {
  const { t } = useTranslation();
  const [dateOfBirthEndValueVisible, setDateOfBirthEndValueVisible] = useState('hidden');

  // useEffect(() => {
  //   if (action === WIZARD_ACTIONS.SUBMIT) {
  //     dateOfBirthFormik.handleSubmit();
  //   } else if (action === WIZARD_ACTIONS.DRAFT) {
  //     return;
  //   }
  //   // setAction('');
  // }, [action]);

  console.log(formData);

  const dateOfBirthValidationSchema = Yup.object().shape({
    dateOfBirthSelect: Yup.string().required(t('validation.required')),
    dateOfBirthRelationSelect: Yup.string().required(t('validation.required')),
    dateOfBirthStartValue: Yup.string().required(t('validation.required')),
    dateOfBirthEndValue: Yup.number().when(['dateOfBirthRelationSelect', 'dateOfBirthStartValue'], {
      is: (dateOfBirthRelationSelect: string, dateOfBirthStartValue: string) =>
        dateOfBirthRelationSelect === FilterOperator.BTW_CLOSED && dateOfBirthStartValue,
      then: (_dateOfBirthStartValue) =>
        Yup.number()
          .required(t('validation.required'))
          .moreThan(Yup.ref('dateOfBirthStartValue'), t('validation.outValue')),
    }),
  });

  const dateOfBirthFormik = useFormik({
    initialValues: {
      dateOfBirthSelect: formData.field,
      dateOfBirthRelationSelect: formData.operator,
      dateOfBirthStartValue: formData.value,
      dateOfBirthEndValue: formData.value2,
    },
    validateOnChange: true,
    // enableReinitialize: true,
    validationSchema: dateOfBirthValidationSchema,
    onSubmit: (values) => {
      console.log(values);
      // const data = {
      //   authority: values.authority,
      //   code: values.code,
      //   field: values.dateOfBirthSelect,
      //   operator: values.dateOfBirthRelationSelect,
      //   value: values.dateOfBirthStartValue,
      // };
      // setFormValues({
      //   code: values.code,
      //   field: values.dateOfBirthSelect,
      //   operator: values.dateOfBirthRelationSelect,
      //   value: values.dateOfBirthStartValue,
      // });
      // dispatch(setAutomatedCriteria(data));
      // // setCriteriaToSubmit([...handleCriteriaToSubmit(criteriaToSubmit, initialFormValues.code)]);
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
            id="dateOfBirthSelect"
            name="dateOfBirthSelect"
            value={dateOfBirthFormik.values.dateOfBirthSelect}
            onChange={(e) => {
              dateOfBirthFormik.handleChange(e);
              handleFieldValueChanged(e.target.value, 'field', formData.code);
            }}
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
              handleFieldValueChanged(e.target.value, 'operator', formData.code);
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
            <MenuItem value={FilterOperator.BTW_CLOSED}>
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
            onChange={(e) => {
              dateOfBirthFormik.handleChange(e);
              handleFieldValueChanged(e.target.value, 'value', formData.code);
            }}
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
            onChange={(e) => {
              dateOfBirthFormik.handleChange(e);
              handleFieldValueChanged(e.target.value, 'value2', formData.code);
            }}
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
    </Box>
  );
};

export default DateOdBirthCriteriaItem;
