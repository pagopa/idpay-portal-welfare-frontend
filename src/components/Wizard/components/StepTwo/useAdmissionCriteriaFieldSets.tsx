import { Box, FormControl, FormHelperText, MenuItem, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { WIZARD_ACTIONS } from '../../../../utils/constants';

type Props = {
  id: string | number;
  action: string | number;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
};

const useAdmissionCriteriaFieldSets = ({
  id,
  action,
  setAction,
  currentStep,
  setCurrentStep,
}: Props) => {
  const { t } = useTranslation();
  const [dateOfBirthEndValueVisible, setDateOfBirthEndValueVisible] = useState('hidden');
  const [iseeEndValueVisible, setIseeEndValueVisible] = useState('hidden');

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      dateOfBirthFormik.handleSubmit();
      residencyFormik.handleSubmit();
      iseeFormik.handleSubmit();
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
        dateOfBirthRelationSelect === '6' && dateOfBirthStartValue,
      then: Yup.number()
        .required(t('validation.required'))
        .min(Yup.ref('dateOfBirthStartValue'), t('validation.outValue')),
    }),
  });

  const dateOfBirthFormik = useFormik({
    initialValues: {
      dateOfBirthSelect: 1,
      dateOfBirthRelationSelect: 1,
      dateOfBirthStartValue: '',
      dateOfBirthEndValue: '',
    },
    validateOnChange: true,
    validationSchema: dateOfBirthValidationSchema,
    onSubmit: (values) => {
      console.log('data di nascita');
      console.log(values);
      // TODO dispatch values
      setCurrentStep(currentStep + 1);
    },
  });

  const residencyValidationSchema = Yup.object().shape({
    residencySelect: Yup.string().required(t('validation.required')),
    residencyRelationSelect: Yup.string().required(t('validation.required')),
    residencyValue: Yup.string().required(t('validation.required')),
  });

  const residencyFormik = useFormik({
    initialValues: {
      residencySelect: 2,
      residencyRelationSelect: 1,
      residencyValue: '',
    },
    validateOnChange: true,
    validationSchema: residencyValidationSchema,
    onSubmit: (values) => {
      console.log('residenza');
      console.log(values);
      // TODO dispatch values
      setCurrentStep(currentStep + 1);
    },
  });

  const iseeValidationSchema = Yup.object().shape({
    iseeRelationSelect: Yup.string().required(t('validation.required')),
    iseeStartValue: Yup.number().required(t('validation.required')),
    iseeEndValue: Yup.number().when(['iseeRelationSelect', 'iseeStartValue'], {
      is: (iseeRelationSelect: string, iseeStartValue: string) =>
        iseeRelationSelect === '6' && iseeStartValue,
      then: Yup.number()
        .required(t('validation.required'))
        .min(Yup.ref('iseeStartValue'), t('validation.outValue')),
    }),
  });

  const iseeFormik = useFormik({
    initialValues: {
      iseeRelationSelect: 1,
      iseeStartValue: '',
      iseeEndValue: '',
    },
    validateOnChange: true,
    validationSchema: iseeValidationSchema,
    onSubmit: (values) => {
      console.log('isee');
      console.log(values);
      // TODO dispatch values
      setCurrentStep(currentStep + 1);
    },
  });

  const setError = (touched: boolean | undefined, errorText: string | undefined) =>
    touched && Boolean(errorText);

  const setErrorText = (touched: boolean | undefined, errorText: string | undefined) =>
    touched && errorText;

  const setFieldType = (
    value: string | number,
    setterFunction: Dispatch<SetStateAction<string>>
  ) => {
    if (value === '6' || value === 6) {
      setterFunction('number');
    } else {
      setterFunction('hidden');
    }
  };

  const setFormControlDisplayProp = (inputType: string) =>
    inputType === 'number' ? 'flex' : 'none';

  switch (id) {
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
              <MenuItem value={1}>
                {t('components.wizard.stepTwo.chooseCriteria.form.year')}
              </MenuItem>
              <MenuItem value={2}>
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
              <MenuItem value={1}>
                {t('components.wizard.stepTwo.chooseCriteria.form.exact')}
              </MenuItem>
              <MenuItem value={2}>
                {t('components.wizard.stepTwo.chooseCriteria.form.majorTo')}
              </MenuItem>
              <MenuItem value={3}>
                {t('components.wizard.stepTwo.chooseCriteria.form.minorTo')}
              </MenuItem>
              <MenuItem value={4}>
                {t('components.wizard.stepTwo.chooseCriteria.form.majorOrEqualTo')}
              </MenuItem>
              <MenuItem value={5}>
                {t('components.wizard.stepTwo.chooseCriteria.form.minorOrEqualTo')}
              </MenuItem>
              <MenuItem value={6}>
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
              <MenuItem value={1}>
                {t('components.wizard.stepTwo.chooseCriteria.form.postalCode')}
              </MenuItem>
              <MenuItem value={2}>
                {t('components.wizard.stepTwo.chooseCriteria.form.city')}
              </MenuItem>
              <MenuItem value={3}>
                {t('components.wizard.stepTwo.chooseCriteria.form.region')}
              </MenuItem>
              <MenuItem value={4}>
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
              <MenuItem value={1}>{t('components.wizard.stepTwo.chooseCriteria.form.is')}</MenuItem>
              <MenuItem value={2}>
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
              <MenuItem value={1}>
                {t('components.wizard.stepTwo.chooseCriteria.form.exact')}
              </MenuItem>
              <MenuItem value={2}>
                {t('components.wizard.stepTwo.chooseCriteria.form.majorTo')}
              </MenuItem>
              <MenuItem value={3}>
                {t('components.wizard.stepTwo.chooseCriteria.form.minorTo')}
              </MenuItem>
              <MenuItem value={4}>
                {t('components.wizard.stepTwo.chooseCriteria.form.majorOrEqualTo')}
              </MenuItem>
              <MenuItem value={5}>
                {t('components.wizard.stepTwo.chooseCriteria.form.minorOrEqualTo')}
              </MenuItem>
              <MenuItem value={6}>
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
            <TextField
              inputProps={{
                step: 1,
                min: 1,
                type: 'number',
              }}
              placeholder={t('components.wizard.stepTwo.chooseCriteria.form.value')}
              name={`manualCriteria${id}}`}
              // value={dateOfBirthFormik.values.dateOfBirthStartValue}
              // onChange={(e) => dateOfBirthFormik.handleChange(e)}
              // error={setError(
              //   dateOfBirthFormik.touched.dateOfBirthStartValue,
              //   dateOfBirthFormik.errors.dateOfBirthStartValue
              // )}
              // helperText={setErrorText(
              //   dateOfBirthFormik.touched.dateOfBirthStartValue,
              //   dateOfBirthFormik.errors.dateOfBirthStartValue
              // )}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: 'span 1' }}>
            <Select
              id={`manualCriteriaSelect${id}}`}
              name={`manualCriteriaSelect${id}}`}
              value={1}
              // onChange={(e) => dateOfBirthFormik.handleChange(e)}
              // error={setError(
              //   dateOfBirthFormik.touched.dateOfBirthSelect,
              //   dateOfBirthFormik.errors.dateOfBirthSelect
              // )}
            >
              <MenuItem value={1}>
                {t('components.wizard.stepTwo.chooseCriteria.form.boolean')}
              </MenuItem>
            </Select>
            <FormHelperText>
              {/* {setErrorText(
                dateOfBirthFormik.touched.dateOfBirthSelect,
                dateOfBirthFormik.errors.dateOfBirthSelect
              )} */}
            </FormHelperText>
          </FormControl>
        </Box>
      );
  }
};

export default useAdmissionCriteriaFieldSets;
