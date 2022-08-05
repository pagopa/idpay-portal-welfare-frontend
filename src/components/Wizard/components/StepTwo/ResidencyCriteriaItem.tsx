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
import { grey } from '@mui/material/colors';
import _ from 'lodash';
import { AvailableCriteria } from '../../../../model/AdmissionCriteria';
import { FilterOperator, ResidencyOptions, WIZARD_ACTIONS } from '../../../../utils/constants';
import { handleCriteriaToSubmit } from './helpers';

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
        <IconButton data-id={formData.code}>
          <DeleteOutlineIcon
            color="error"
            data-id={formData.code}
            sx={{
              cursor: 'pointer',
            }}
            onClick={(event: any) => handleCriteriaRemoved(event)}
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
            {/* <MenuItem value={ResidencyOptions.NATION}>
              {t('components.wizard.stepTwo.chooseCriteria.form.nation')}
            </MenuItem> */}
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
            onBlur={(e) => residencyFormik.handleBlur(e)}
            onChange={(e) => {
              residencyFormik.handleChange(e);
              handleFieldValueChanged(e.target.value, 'operator', formData.code);
            }}
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
            placeholder={t('components.wizard.stepTwo.chooseCriteria.form.name')}
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
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default ResidencyCriteriaItem;
