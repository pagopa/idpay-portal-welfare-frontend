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
import { Dispatch, MouseEventHandler, SetStateAction, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { AvailableCriteria } from '../../../../model/AdmissionCriteria';
import { FilterOperator, ResidencyOptions, WIZARD_ACTIONS } from '../../../../utils/constants';
import { boxItemStyle, handleCriteriaToSubmit } from './helpers';

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

const ResidencyCriteriaItem = ({
  action,
  formData,
  handleCriteriaRemoved,
  handleFieldValueChanged,
  criteriaToSubmit,
  setCriteriaToSubmit,
}: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      residencyFormik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
  }, [action]);

  const residencyValidationSchema = Yup.object().shape({
    residencySelect: Yup.string().required(t('validation.required')),
    residencyRelationSelect: Yup.string().required(t('validation.required')),
    residencyValue: Yup.string().required(t('validation.required')),
  });

  const residencyFormik = useFormik({
    initialValues: {
      residencySelect: formData.field,
      residencyRelationSelect: formData.operator,
      residencyValue: formData.value,
    },
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema: residencyValidationSchema,
    onSubmit: (_values) => {
      setCriteriaToSubmit([...handleCriteriaToSubmit(criteriaToSubmit, formData.code)]);
    },
  });

  const setError = (touched: boolean | undefined, errorText: string | undefined) =>
    touched && Boolean(errorText);

  const setErrorText = (touched: boolean | undefined, errorText: string | undefined) =>
    touched && errorText;

  return (
    <Box sx={boxItemStyle} data-testid="residency-criteria-test">
      <Box sx={{ gridColumn: 'span 11' }}>
        <Typography variant="subtitle1">{formData.fieldLabel}</Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', justifySelf: 'end' }}>
        <IconButton
          data-id={formData.code}
          onClick={(event: any) => handleCriteriaRemoved(event)}
          data-testid="delete-button-test"
        >
          <DeleteOutlineIcon
            color="error"
            data-id={formData.code}
            sx={{
              cursor: 'pointer',
            }}
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
            id="residencySelect"
            name="residencySelect"
            value={residencyFormik.values.residencySelect}
            onBlur={(e) => residencyFormik.handleBlur(e)}
            onChange={(e) => {
              residencyFormik.handleChange(e);
              handleFieldValueChanged(e.target.value, 'field', formData.code);
            }}
            error={setError(
              residencyFormik.touched.residencySelect,
              residencyFormik.errors.residencySelect
            )}
            inputProps={{ 'data-testid': 'residency-select-test' }}
          >
            <MenuItem value={ResidencyOptions.POSTAL_CODE} data-testid="postalCode">
              {t('components.wizard.stepThree.chooseCriteria.form.postalCode')}
            </MenuItem>
            <MenuItem value={ResidencyOptions.CITY_COUNCIL} data-testid="cityCouncil">
              {t('components.wizard.stepThree.chooseCriteria.form.cityCouncil')}
            </MenuItem>
            <MenuItem value={ResidencyOptions.CITY} data-testid="city">
              {t('components.wizard.stepThree.chooseCriteria.form.city')}
            </MenuItem>
            <MenuItem value={ResidencyOptions.PROVINCE} data-testid="province">
              {t('components.wizard.stepThree.chooseCriteria.form.province')}
            </MenuItem>
            <MenuItem value={ResidencyOptions.REGION} data-testid="region">
              {t('components.wizard.stepThree.chooseCriteria.form.region')}
            </MenuItem>
          </Select>
          <FormHelperText>
            {setErrorText(
              residencyFormik.touched.residencySelect,
              residencyFormik.errors.residencySelect
            )}
          </FormHelperText>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 1' }} size="small">
          <Select
            id="residencyRelationSelect"
            name="residencyRelationSelect"
            value={residencyFormik.values.residencyRelationSelect}
            onBlur={(e) => residencyFormik.handleBlur(e)}
            onChange={(e) => {
              residencyFormik.handleChange(e);
              handleFieldValueChanged(e.target.value, 'operator', formData.code);
            }}
            error={setError(
              residencyFormik.touched.residencyRelationSelect,
              residencyFormik.errors.residencyRelationSelect
            )}
            inputProps={{ 'data-testid': 'residency-relation-test' }}
          >
            <MenuItem value={FilterOperator.EQ} data-testid="is">
              {t('components.wizard.stepThree.chooseCriteria.form.is')}
            </MenuItem>
            <MenuItem value={FilterOperator.NOT_EQ} data-testid="isNot">
              {t('components.wizard.stepThree.chooseCriteria.form.isNot')}
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
            placeholder={t('components.wizard.stepThree.chooseCriteria.form.name')}
            variant="outlined"
            value={residencyFormik.values.residencyValue}
            onBlur={(e) => residencyFormik.handleBlur(e)}
            onChange={(e) => {
              residencyFormik.handleChange(e);
              handleFieldValueChanged(e.target.value, 'value', formData.code);
            }}
            error={setError(
              residencyFormik.touched.residencyValue,
              residencyFormik.errors.residencyValue
            )}
            helperText={setErrorText(
              residencyFormik.touched.residencyValue,
              residencyFormik.errors.residencyValue
            )}
            inputProps={{ 'data-testid': 'residencyValue' }}
            size="small"
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default ResidencyCriteriaItem;
