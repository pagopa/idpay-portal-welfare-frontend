import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import { Dispatch, SetStateAction, MouseEvent, MouseEventHandler, useEffect } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import { grey } from '@mui/material/colors';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ManualCriteriaOptions, WIZARD_ACTIONS } from '../../../../utils/constants';
import { setManualCriteria } from '../../../../redux/slices/initiativeSlice';
import { useAppDispatch } from '../../../../redux/hooks';
import {
  SelfDeclarationCriteriaMultiItem,
  SelfDeclarationCriteriaBoolItem,
} from '../../../../model/Initiative';
// import { handleCriteriaToSubmit } from './helpers';

type Props = {
  code: string | number | undefined;
  data: SelfDeclarationCriteriaMultiItem | SelfDeclarationCriteriaBoolItem;
  name: string;
  handleCriteriaRemoved: MouseEventHandler<Element>;
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  // criteriaToSubmit: Array<{ code: string | undefined; dispatched: boolean }>;
  // setCriteriaToSubmit: Dispatch<
  //   SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
  // >;
};

const ManualCriteriaItem = ({
  code,
  data,
  name,
  handleCriteriaRemoved,
  action,
}: // setAction,
// criteriaToSubmit,
// setCriteriaToSubmit,
Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      manualCriteriaFormik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
    // setAction('');
  }, [action]);

  useEffect(() => console.log(data), []);

  const manualCriteriaValidationSchema = Yup.object().shape({
    manualCriteriaName: Yup.string()
      .required(t('validation.required'))
      .max(200, t('validation.maxTwoHundred')),
    manualCriteriaSelectName: Yup.string().required(t('validation.required')),
    manualCriteriaValues: Yup.array().of(
      Yup.object().shape({
        value: Yup.string().when('manualCriteriaSelectName', {
          is: (manualCriteriaSelectName: ManualCriteriaOptions) =>
            manualCriteriaSelectName === ManualCriteriaOptions.MULTI,
          then: Yup.string().required(t('validation.required')),
        }),
      })
    ),
  });

  const manualCriteriaFormik = useFormik({
    initialValues: {
      manualCriteriaCode: data.code,
      manualCriteriaName: data.description,
      // eslint-disable-next-line no-underscore-dangle
      manualCriteriaSelectName: data._type,
      manualCriteriaValues: Array.isArray(data.value)
        ? data.value.map((v) => ({ value: v }))
        : data.value,
    },
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema: manualCriteriaValidationSchema,
    // eslint-disable-next-line sonarjs/cognitive-complexity
    onSubmit: (values) => {
      if (values.manualCriteriaSelectName === ManualCriteriaOptions.BOOLEAN) {
        const data = {
          _type: values.manualCriteriaSelectName,
          description: values.manualCriteriaName,
          value: true,
          code: values.manualCriteriaCode,
        };
        dispatch(setManualCriteria(data));
        // const manualCriteriaIndex =
        //   typeof values.manualCriteriaCode === 'number'
        //     ? values.manualCriteriaCode
        //     : typeof values.manualCriteriaCode === 'string'
        //     ? parseInt(values.manualCriteriaCode, 10)
        //     : '0';
        // const criteriaToSubmitCode = `manual_${manualCriteriaIndex}`;
        // setCriteriaToSubmit([...handleCriteriaToSubmit(criteriaToSubmit, criteriaToSubmitCode)]);
      } else if (values.manualCriteriaSelectName === ManualCriteriaOptions.MULTI) {
        const optionsValues: Array<string> = [];
        if (
          typeof values.manualCriteriaValues !== undefined &&
          Array.isArray(values.manualCriteriaValues)
        ) {
          values.manualCriteriaValues.forEach((element) => {
            if (typeof element === 'object' && element.value !== undefined) {
              // eslint-disable-next-line functional/immutable-data
              optionsValues.push(element.value);
            }
          });
          const data = {
            _type: values.manualCriteriaSelectName,
            description: values.manualCriteriaName,
            value: optionsValues,
            code: values.manualCriteriaCode,
          };
          dispatch(setManualCriteria(data));
          // const manualCriteriaIndex =
          //   typeof values.manualCriteriaCode === 'number'
          //     ? values.manualCriteriaCode
          //     : typeof values.manualCriteriaCode === 'string'
          //     ? parseInt(values.manualCriteriaCode, 10)
          //     : '0';

          // console.log(manualCriteriaIndex);
          // const criteriaToSubmitCode = `manual_${manualCriteriaIndex}`;
          // setCriteriaToSubmit([...handleCriteriaToSubmit(criteriaToSubmit, criteriaToSubmitCode)]);
        }
      }

      // setCurrentStep(currentStep + 1);
    },
  });

  const setError = (touched: boolean | undefined, errorText: string | undefined) =>
    touched && Boolean(errorText);

  const setErrorText = (touched: boolean | undefined, errorText: string | undefined) =>
    touched && errorText;

  const handleCriteriaType = (e: SelectChangeEvent<string>, values: any, setValues: any) => {
    if (e.target.value === ManualCriteriaOptions.BOOLEAN) {
      setValues({
        ...values,
        manualCriteriaSelectName: e.target.value,
        manualCriteriaValues: [{ value: '' }, { value: '' }],
      });
    } else {
      setValues({ ...values, manualCriteriaSelectName: e.target.value });
    }
    manualCriteriaFormik.handleChange(e);
  };

  const addOption = (values: any, setValues: any) => {
    const newOptionsValues = [...values.manualCriteriaValues, { value: '' }];
    setValues({ ...values, manualCriteriaValues: newOptionsValues });
  };

  const deleteOption = (i: number, values: any, setValues: any, setTouched: any) => {
    const indexValueToRemove = i;
    // eslint-disable-next-line functional/immutable-data
    const newValues = values.manualCriteriaValues.filter((v: any, i: number) => {
      if (i !== indexValueToRemove) {
        return v;
      }
    });
    setValues({ ...values, manualCriteriaValues: newValues });
    setTouched({}, false);
  };

  const handleOptionChange = (e: any, i: number, values: any, setValues: any, setTouched: any) => {
    const options = [...values.manualCriteriaValues];
    // eslint-disable-next-line functional/immutable-data
    options[i].value = e.target.value;
    setValues({ ...values, manualCriteriaValues: options });
    setTouched({}, false);
  };

  // const getOptionErrorText = (errors: string | FormikErrors<{ value: string }>) => {
  //   try {
  //     if (typeof errors === 'string') {
  //       return errors;
  //     } else if (errors.value) {
  //       return errors.value;
  //     } else {
  //       return '';
  //     }
  //   } catch {
  //     return '';
  //   }
  // };

  return (
    <Box
      key={code}
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
        <Typography variant="subtitle1">{name}</Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', justifySelf: 'end' }}>
        <DeleteOutlineIcon
          color="error"
          data-id={code}
          sx={{
            cursor: 'pointer',
          }}
          onClick={(event: MouseEvent<Element, globalThis.MouseEvent>) =>
            handleCriteriaRemoved(event)
          }
        />
      </Box>
      <Box
        sx={{
          gridColumn: 'span 12',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 3,
          my: 2,
        }}
      >
        <FormControl sx={{ gridColumn: 'span 3' }}>
          <Select
            id={`manualCriteriaSelectName`}
            name={`manualCriteriaSelectName`}
            value={manualCriteriaFormik.values.manualCriteriaSelectName}
            onChange={(e) =>
              handleCriteriaType(e, manualCriteriaFormik.values, manualCriteriaFormik.setValues)
            }
            error={setError(
              manualCriteriaFormik.touched.manualCriteriaSelectName,
              manualCriteriaFormik.errors.manualCriteriaSelectName
            )}
          >
            <MenuItem value={ManualCriteriaOptions.BOOLEAN}>
              {t('components.wizard.stepTwo.chooseCriteria.form.boolean')}
            </MenuItem>
            <MenuItem value={ManualCriteriaOptions.MULTI}>
              {t('components.wizard.stepTwo.chooseCriteria.form.multi')}
            </MenuItem>
          </Select>
          <FormHelperText>
            {setErrorText(
              manualCriteriaFormik.touched.manualCriteriaSelectName,
              manualCriteriaFormik.errors.manualCriteriaSelectName
            )}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 12',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 3,
          my: 2,
        }}
      >
        <FormControl sx={{ gridColumn: 'span 9' }}>
          <TextField
            id={`manualCriteria${code}}`}
            name={`manualCriteriaName`}
            variant="outlined"
            value={manualCriteriaFormik.values.manualCriteriaName}
            placeholder={t('components.wizard.stepTwo.chooseCriteria.form.value')}
            onChange={(e) => {
              manualCriteriaFormik.handleChange(e);
            }}
            error={setError(
              manualCriteriaFormik.touched.manualCriteriaName,
              manualCriteriaFormik.errors.manualCriteriaName
            )}
            helperText={
              setErrorText(
                manualCriteriaFormik.touched.manualCriteriaName,
                manualCriteriaFormik.errors.manualCriteriaName
              ) || t('validation.maxTwoHundred')
            }
          />
        </FormControl>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 12',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 3,
          my: 2,
        }}
      >
        {manualCriteriaFormik.values.manualCriteriaSelectName === ManualCriteriaOptions.MULTI &&
          Array.isArray(manualCriteriaFormik.values.manualCriteriaValues) &&
          manualCriteriaFormik.values.manualCriteriaValues.map((o, i) => (
            // const optionErrors =
            //   manualCriteriaFormik.errors.manualCriteriaValues?.length &&
            //   getOptionErrorText(manualCriteriaFormik.errors.manualCriteriaValues[i]);
            // const optionTouched =
            //   (manualCriteriaFormik.touched.manualCriteriaValues?.length &&
            //     manualCriteriaFormik.touched.manualCriteriaValues[i].value) ||
            //   false;
            <Box
              key={i}
              sx={{
                gridColumn: 'span 24',
                display: 'grid',
                gridTemplateColumns: 'repeat(24, 1fr)',
                gap: 3,
                my: 2,
              }}
            >
              <Box sx={{ display: 'grid', gridColumn: 'span 1', alignItems: 'center' }}>
                <RemoveCircleOutlineIcon
                  color="error"
                  data-id={o}
                  sx={{
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    deleteOption(
                      i,
                      manualCriteriaFormik.values,
                      manualCriteriaFormik.setValues,
                      manualCriteriaFormik.setTouched
                    )
                  }
                />
              </Box>
              <Box sx={{ display: 'grid', gridColumn: 'span 11' }}>
                <TextField
                  id={`manualCriteriaValues[${i}].value}`}
                  name={`manualCriteriaValues[${i}].value}`}
                  variant="outlined"
                  value={
                    typeof Array.isArray(manualCriteriaFormik.values.manualCriteriaValues) &&
                    typeof manualCriteriaFormik.values.manualCriteriaValues !== 'boolean' &&
                    typeof manualCriteriaFormik.values.manualCriteriaValues !== 'undefined'
                      ? manualCriteriaFormik.values.manualCriteriaValues[i].value
                      : manualCriteriaFormik.values.manualCriteriaValues
                  }
                  onChange={(e) =>
                    handleOptionChange(
                      e,
                      i,
                      manualCriteriaFormik.values,
                      manualCriteriaFormik.setValues,
                      manualCriteriaFormik.setTouched
                    )
                  }
                  // error={optionTouched && Boolean(optionErrors)}
                  // helperText={optionTouched && optionErrors}
                />
              </Box>
            </Box>
          ))}
        {manualCriteriaFormik.values.manualCriteriaSelectName === ManualCriteriaOptions.MULTI && (
          <Box
            sx={{
              gridColumn: 'span 12',
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 3,
              my: 2,
            }}
          >
            <Box sx={{ display: 'grid', gridColumn: 'span 1' }}>
              <Button
                sx={[
                  {
                    justifyContent: 'start',
                    padding: 0,
                  },
                  {
                    '&:hover': { backgroundColor: 'transparent' },
                  },
                ]}
                size="small"
                variant="text"
                startIcon={<AddIcon />}
                onClick={() =>
                  addOption(manualCriteriaFormik.values, manualCriteriaFormik.setValues)
                }
                disableRipple={true}
                disableFocusRipple={true}
              >
                {t('components.wizard.stepTwo.chooseCriteria.form.addOption')}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ManualCriteriaItem;
