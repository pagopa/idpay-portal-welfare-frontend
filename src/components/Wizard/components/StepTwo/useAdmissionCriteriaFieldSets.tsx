import { Box, FormControl, FormHelperText, MenuItem, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { setAutomatedCriteria } from '../../../../redux/slices/initiativeSlice';
import {
  WIZARD_ACTIONS,
  FilterOperator,
  DateOfBirthOptions,
  ResidencyOptions,
} from '../../../../utils/constants';

type Props = {
  code: string | number;
  field: string | number;
  authority: string | number;
  action: string | number;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
};

const useAdmissionCriteriaFieldSets = ({
  code,
  field,
  authority,
  action,
  setAction,
}: // currentStep,
// setCurrentStep,
Props) => {
  const { t } = useTranslation();
  const [dateOfBirthEndValueVisible, setDateOfBirthEndValueVisible] = useState('hidden');
  const [iseeEndValueVisible, setIseeEndValueVisible] = useState('hidden');
  const dispatch = useDispatch();

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      dateOfBirthFormik.handleSubmit();
      residencyFormik.handleSubmit();
      iseeFormik.handleSubmit();
      // manualCriteriaFormik.handleSubmit();
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
      then: Yup.number()
        .required(t('validation.required'))
        .min(Yup.ref('dateOfBirthStartValue'), t('validation.outValue')),
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
    },
  });

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
    },
  });

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
    },
  });

  // const manualCriteriaValidationSchema = Yup.object().shape({
  //   manualCriteriaName: Yup.string().required(t('validation.required')),
  //   manualCriteriaSelectName: Yup.number().required(t('validation.required')),
  // });

  // const manualCriteriaFormik = useFormik({
  //   initialValues: {
  //     manualCriteriaName: '',
  //     manualCriteriaSelectName: ManualCriteriaOptions.BOOLEAN,
  //   },
  //   validateOnChange: true,
  //   validationSchema: manualCriteriaValidationSchema,
  //   onSubmit: (values) => {
  //     console.log('manual criteria');
  //     console.log(values);
  //     // TODO dispatch values
  //     setCurrentStep(currentStep + 1);
  //   },
  // });

  const setError = (touched: boolean | undefined, errorText: string | undefined) =>
    touched && Boolean(errorText);

  const setErrorText = (touched: boolean | undefined, errorText: string | undefined) =>
    touched && errorText;

  const setFieldType = (
    value: string | number,
    setterFunction: Dispatch<SetStateAction<string>>
  ) => {
    if (value === FilterOperator.IN || value === 6) {
      setterFunction('number');
    } else {
      setterFunction('hidden');
    }
  };

  const setFormControlDisplayProp = (inputType: string) =>
    inputType === 'number' ? 'flex' : 'none';

  switch (code) {
    case '1':
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
    case '2':
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
    case '3':
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
              helperText={setErrorText(
                iseeFormik.touched.iseeEndValue,
                iseeFormik.errors.iseeEndValue
              )}
            />
          </FormControl>
        </Box>
      );
    default:
      return null;
    // return (
    //   <Box
    //     sx={{
    //       gridColumn: 'span 12',
    //       display: 'grid',
    //       gridTemplateColumns: 'repeat(4, 1fr)',
    //       gap: 3,
    //       my: 2,
    //     }}
    //   >
    //     <FormControl sx={{ gridColumn: 'span 1' }}>
    //       <TextField
    //         id={`manualCriteria${code}}`}
    //         name={`manualCriteriaName`}
    //         variant="outlined"
    //         value={manualCriteriaFormik.values.manualCriteriaName}
    //         placeholder={t('components.wizard.stepTwo.chooseCriteria.form.value')}
    //         onChange={(e) => manualCriteriaFormik.handleChange(e)}
    //         error={setError(
    //           manualCriteriaFormik.touched.manualCriteriaName,
    //           manualCriteriaFormik.errors.manualCriteriaName
    //         )}
    //         helperText={setErrorText(
    //           manualCriteriaFormik.touched.manualCriteriaName,
    //           manualCriteriaFormik.errors.manualCriteriaName
    //         )}
    //       />
    //     </FormControl>
    //     <FormControl sx={{ gridColumn: 'span 1' }}>
    //       <Select
    //         id={`manualCriteriaSelect${code}}`}
    //         name={`manualCriteriaSelectName`}
    //         value={manualCriteriaFormik.values.manualCriteriaSelectName}
    //         onChange={(e) => manualCriteriaFormik.handleChange(e)}
    //         error={setError(
    //           manualCriteriaFormik.touched.manualCriteriaSelectName,
    //           manualCriteriaFormik.errors.manualCriteriaSelectName
    //         )}
    //       >
    //         <MenuItem value={ManualCriteriaOptions.BOOLEAN}>
    //           {t('components.wizard.stepTwo.chooseCriteria.form.boolean')}
    //         </MenuItem>
    //         <MenuItem value={ManualCriteriaOptions.MULTI}>
    //           {t('components.wizard.stepTwo.chooseCriteria.form.multi')}
    //         </MenuItem>
    //       </Select>
    //       <FormHelperText>
    //         {setErrorText(
    //           manualCriteriaFormik.touched.manualCriteriaSelectName,
    //           manualCriteriaFormik.errors.manualCriteriaSelectName
    //         )}
    //       </FormHelperText>
    //     </FormControl>
    //   </Box>
    // );
  }
};

export default useAdmissionCriteriaFieldSets;
