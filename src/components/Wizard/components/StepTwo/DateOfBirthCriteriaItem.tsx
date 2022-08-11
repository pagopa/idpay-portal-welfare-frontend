import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { grey } from '@mui/material/colors';
import _ from 'lodash';
import { FilterOperator, DateOfBirthOptions, WIZARD_ACTIONS } from '../../../../utils/constants';
import { AvailableCriteria } from '../../../../model/AdmissionCriteria';
import {
  handleCriteriaToSubmit,
  setError,
  setErrorText,
  setFieldType,
  setFormControlDisplayProp,
} from './helpers';

type Props = {
  action: string;
  formData: AvailableCriteria;
  handleCriteriaRemoved: MouseEventHandler<Element>;
  handleFieldValueChanged: any;
  criteriaToSubmit: Array<{ code: string | undefined; dispatched: boolean }>;
  setCriteriaToSubmit: Dispatch<
    SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
  >;
};

const DateOdBirthCriteriaItem = ({
  action,
  formData,
  handleCriteriaRemoved,
  handleFieldValueChanged,
  criteriaToSubmit,
  setCriteriaToSubmit,
}: Props) => {
  const { t } = useTranslation();
  const [dateOfBirthEndValueVisible, setDateOfBirthEndValueVisible] = useState(
    formData.operator === FilterOperator.BTW_OPEN ? 'number' : 'hidden'
  );

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      dateOfBirthFormik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
  }, [action]);

  const dateOfBirthValidationSchema = Yup.object().shape({
    dateOfBirthSelect: Yup.string().required(t('validation.required')),
    dateOfBirthRelationSelect: Yup.string().required(t('validation.required')),
    dateOfBirthStartValue: Yup.number().required(t('validation.required')),
    dateOfBirthEndValue: Yup.number().when(['dateOfBirthRelationSelect', 'dateOfBirthStartValue'], {
      is: (dateOfBirthRelationSelect: string, dateOfBirthStartValue: number) =>
        dateOfBirthRelationSelect === FilterOperator.BTW_OPEN && dateOfBirthStartValue,
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
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema: dateOfBirthValidationSchema,
    onSubmit: (_values) => {
      setCriteriaToSubmit([...handleCriteriaToSubmit(criteriaToSubmit, formData.code)]);
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
      data-testid="dateBirth-criteria-test"
    >
      <Box sx={{ gridColumn: 'span 11' }}>
        <Typography variant="subtitle1">{formData.fieldLabel}</Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', justifySelf: 'end' }}>
        <IconButton data-id={formData.code} onClick={(event: any) => handleCriteriaRemoved(event)}>
          <DeleteOutlineIcon
            color="error"
            data-id={formData.code}
            sx={{
              cursor: 'pointer',
            }}
            data-testid="delete-button-test"
          />
        </IconButton>
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
            onBlur={(e) => dateOfBirthFormik.handleBlur(e)}
            onChange={(e) => {
              dateOfBirthFormik.handleChange(e);
              handleFieldValueChanged(e.target.value, 'field', formData.code);
            }}
            error={setError(
              dateOfBirthFormik.touched.dateOfBirthSelect,
              dateOfBirthFormik.errors.dateOfBirthSelect
            )}
            inputProps={{ 'data-testid': 'dateOfBirth-select-test' }}
          >
            <MenuItem value={DateOfBirthOptions.YEAR} data-testid="year">
              {t('components.wizard.stepTwo.chooseCriteria.form.year')}
            </MenuItem>
            <MenuItem value={DateOfBirthOptions.AGE} data-testid="age">
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
            onBlur={(e) => dateOfBirthFormik.handleBlur(e)}
            onChange={(e) => {
              setFieldType(e.target.value, setDateOfBirthEndValueVisible);
              dateOfBirthFormik.handleChange(e);
              handleFieldValueChanged(e.target.value, 'operator', formData.code);
            }}
            error={setError(
              dateOfBirthFormik.touched.dateOfBirthRelationSelect,
              dateOfBirthFormik.errors.dateOfBirthRelationSelect
            )}
            inputProps={{ 'data-testid': 'dateOfBirth-relation-test' }}
          >
            <MenuItem value={FilterOperator.EQ} data-testid="exact">
              {t('components.wizard.stepTwo.chooseCriteria.form.exact')}
            </MenuItem>
            <MenuItem value={FilterOperator.GT} data-testid="majorTo">
              {t('components.wizard.stepTwo.chooseCriteria.form.majorTo')}
            </MenuItem>
            <MenuItem value={FilterOperator.LT} data-testid="minorTo">
              {t('components.wizard.stepTwo.chooseCriteria.form.minorTo')}
            </MenuItem>
            <MenuItem value={FilterOperator.GE} data-testid="majorOrEqualTo">
              {t('components.wizard.stepTwo.chooseCriteria.form.majorOrEqualTo')}
            </MenuItem>
            <MenuItem value={FilterOperator.LE} data-testid="minorOrEqualTo">
              {t('components.wizard.stepTwo.chooseCriteria.form.minorOrEqualTo')}
            </MenuItem>
            <MenuItem value={FilterOperator.BTW_OPEN} data-testid="between">
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
              'data-testid': 'dateOfBirth-start-value',
            }}
            placeholder={t('components.wizard.stepTwo.chooseCriteria.form.value')}
            name="dateOfBirthStartValue"
            value={dateOfBirthFormik.values.dateOfBirthStartValue}
            onBlur={(e) => dateOfBirthFormik.handleBlur(e)}
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
              'data-testid': 'dateOfBirth-end-value',
            }}
            placeholder={t('components.wizard.stepTwo.chooseCriteria.form.value')}
            name="dateOfBirthEndValue"
            value={dateOfBirthFormik.values.dateOfBirthEndValue}
            onBlur={(e) => dateOfBirthFormik.handleBlur(e)}
            onChange={(e) => {
              handleFieldValueChanged(e.target.value, 'value2', formData.code);
              dateOfBirthFormik.handleChange(e);
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
