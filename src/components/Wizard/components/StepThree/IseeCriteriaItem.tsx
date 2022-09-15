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
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { grey } from '@mui/material/colors';
import { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from 'react';
import _ from 'lodash';
import { FilterOperator, WIZARD_ACTIONS } from '../../../../utils/constants';
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

const IseeCriteriaItem = ({
  action,
  formData,
  handleCriteriaRemoved,
  handleFieldValueChanged,
  criteriaToSubmit,
  setCriteriaToSubmit,
}: Props) => {
  const { t } = useTranslation();
  const [iseeEndValueVisible, setIseeEndValueVisible] = useState(
    formData.operator === FilterOperator.BTW_OPEN ? 'number' : 'hidden'
  );

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      iseeFormik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
  }, [action]);

  const iseeValidationSchema = Yup.object().shape({
    iseeRelationSelect: Yup.string().required(t('validation.required')),
    iseeStartValue: Yup.number().required(t('validation.required')),
    iseeEndValue: Yup.number().when(['iseeRelationSelect', 'iseeStartValue'], {
      is: (iseeRelationSelect: string, iseeStartValue: number) =>
        iseeRelationSelect === FilterOperator.BTW_OPEN && iseeStartValue,
      then: Yup.number()
        .required(t('validation.required'))
        .moreThan(Yup.ref('iseeStartValue'), t('validation.outValue')),
    }),
  });

  const iseeFormik = useFormik({
    initialValues: {
      iseeRelationSelect: formData.operator,
      iseeStartValue: formData.value,
      iseeEndValue: formData.value2,
    },
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema: iseeValidationSchema,
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
      data-testid="isee-criteria-test"
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
          gap: 2,
        }}
      >
        <FormControl sx={{ gridColumn: 'span 1' }} size="small">
          <Select
            id="iseeRelationSelect"
            name="iseeRelationSelect"
            value={iseeFormik.values.iseeRelationSelect}
            onBlur={(e) => iseeFormik.handleBlur(e)}
            onChange={(e) => {
              iseeFormik.handleChange(e);
              setFieldType(e.target.value, setIseeEndValueVisible);
              handleFieldValueChanged(e.target.value, 'operator', formData.code);
            }}
            error={setError(
              iseeFormik.touched.iseeRelationSelect,
              iseeFormik.errors.iseeRelationSelect
            )}
            inputProps={{ 'data-testid': 'isee-realtion-select' }}
          >
            <MenuItem value={FilterOperator.EQ} data-testid="exact">
              {t('components.wizard.stepThree.chooseCriteria.form.exact')}
            </MenuItem>
            <MenuItem value={FilterOperator.GT} data-testid="majorTo">
              {t('components.wizard.stepThree.chooseCriteria.form.majorTo')}
            </MenuItem>
            <MenuItem value={FilterOperator.LT} data-testid="minorTo">
              {t('components.wizard.stepThree.chooseCriteria.form.minorTo')}
            </MenuItem>
            <MenuItem value={FilterOperator.GE} data-testid="majorOrEqualTo">
              {t('components.wizard.stepThree.chooseCriteria.form.majorOrEqualTo')}
            </MenuItem>
            <MenuItem value={FilterOperator.LE} data-testid="minorOrEqualTo">
              {t('components.wizard.stepThree.chooseCriteria.form.minorOrEqualTo')}
            </MenuItem>
            <MenuItem value={FilterOperator.BTW_OPEN} data-testid="between">
              {t('components.wizard.stepThree.chooseCriteria.form.between')}
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
              step: 0.01,
              min: 0,
              type: 'number',
              'data-testid': 'isee-start-value',
            }}
            placeholder={t('components.wizard.stepThree.chooseCriteria.form.value')}
            name="iseeStartValue"
            value={iseeFormik.values.iseeStartValue}
            onBlur={(e) => iseeFormik.handleBlur(e)}
            onChange={(e) => {
              iseeFormik.handleChange(e);
              handleFieldValueChanged(e.target.value, 'value', formData.code);
            }}
            error={setError(iseeFormik.touched.iseeStartValue, iseeFormik.errors.iseeStartValue)}
            helperText={setErrorText(
              iseeFormik.touched.iseeStartValue,
              iseeFormik.errors.iseeStartValue
            )}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EuroSymbolIcon htmlColor="#17324D" />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </FormControl>
        <FormControl
          sx={{ gridColumn: 'span 1', display: setFormControlDisplayProp(iseeEndValueVisible) }}
        >
          <TextField
            inputProps={{
              step: 0.01,
              min: 1,
              type: iseeEndValueVisible,
              'data-testid': 'isee-end-value',
            }}
            placeholder={t('components.wizard.stepThree.chooseCriteria.form.value')}
            name="iseeEndValue"
            value={iseeFormik.values.iseeEndValue}
            onBlur={(e) => iseeFormik.handleBlur(e)}
            onChange={(e) => {
              handleFieldValueChanged(e.target.value, 'value2', formData.code);
              iseeFormik.handleChange(e);
            }}
            error={setError(iseeFormik.touched.iseeEndValue, iseeFormik.errors.iseeEndValue)}
            helperText={setErrorText(
              iseeFormik.touched.iseeEndValue,
              iseeFormik.errors.iseeEndValue
            )}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EuroSymbolIcon htmlColor="#17324D" />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default IseeCriteriaItem;
