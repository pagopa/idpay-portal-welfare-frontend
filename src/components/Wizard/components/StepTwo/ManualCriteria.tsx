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
  IconButton,
} from '@mui/material';
import { Dispatch, MouseEvent, MouseEventHandler, SetStateAction, useEffect } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import { grey } from '@mui/material/colors';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ManualCriteriaOptions, WIZARD_ACTIONS } from '../../../../utils/constants';
import { ManualCriteriaItem } from '../../../../model/Initiative';
import { handleCriteriaToSubmit, setError, setErrorText } from './helpers';

type Props = {
  data: ManualCriteriaItem;
  action: string;
  handleCriteriaRemoved: MouseEventHandler<Element>;
  manualCriteriaToRender: Array<ManualCriteriaItem>;
  setManualCriteriaToRender: Dispatch<SetStateAction<Array<ManualCriteriaItem>>>;
  criteriaToSubmit: Array<{ code: string | undefined; dispatched: boolean }>;
  setCriteriaToSubmit: Dispatch<
    SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
  >;
};

const ManualCriteria = ({
  data,
  handleCriteriaRemoved,
  action,
  manualCriteriaToRender,
  setManualCriteriaToRender,
  criteriaToSubmit,
  setCriteriaToSubmit,
}: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      manualCriteriaFormik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
  }, [action]);

  const manualCriteriaValidationSchema = Yup.object().shape({
    manualCriteriaName: Yup.string()
      .required(t('validation.required'))
      .max(200, t('validation.maxTwoHundred')),
    manualCriteriaSelectName: Yup.string().required(t('validation.required')),
    manualCriteriaValues: Yup.array().of(
      Yup.string().when('manualCriteriaSelectName', (_manualCriteriaSelectName, schema) => {
        if (manualCriteriaFormik.values.manualCriteriaSelectName === ManualCriteriaOptions.MULTI) {
          return Yup.string().required(t('validation.required'));
        }
        return schema;
      })
    ),
  });

  const manualCriteriaFormik = useFormik({
    initialValues: {
      manualCriteriaCode: data.code,
      manualCriteriaName: data.description,
      // eslint-disable-next-line no-underscore-dangle
      manualCriteriaSelectName: data._type,
      manualCriteriaValues: data.multiValue,
    },
    validateOnMount: true,
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema: manualCriteriaValidationSchema,
    onSubmit: (_values) => {
      setCriteriaToSubmit([...handleCriteriaToSubmit(criteriaToSubmit, data.code)]);
    },
  });

  const handleCriteriaType = (e: SelectChangeEvent<string>, values: any, setValues: any) => {
    if (e.target.value === ManualCriteriaOptions.BOOLEAN) {
      setValues({
        ...values,
        manualCriteriaSelectName: e.target.value,
        manualCriteriaValues: ['', ''],
      });
    } else {
      setValues({ ...values, manualCriteriaSelectName: e.target.value });
    }
    manualCriteriaFormik.handleChange(e);
  };

  const handleFieldValueChanged = (value: string, fieldKey: string, code: string) => {
    const newManualCriteria: Array<ManualCriteriaItem> = [];
    manualCriteriaToRender.forEach((m) => {
      if (code === m.code) {
        const criteria = {
          ...m,
          [fieldKey]: value,
        };
        // eslint-disable-next-line functional/immutable-data
        newManualCriteria.push({ ...criteria });
      } else {
        // eslint-disable-next-line functional/immutable-data
        newManualCriteria.push({ ...m });
      }
    });
    setManualCriteriaToRender([...newManualCriteria]);
  };

  const handleOptionAdded = (optionValues: Array<string> | undefined, code: string) => {
    const newManualCriteria: Array<ManualCriteriaItem> = [];
    manualCriteriaToRender.forEach((m) => {
      if (code === m.code) {
        if (Array.isArray(optionValues)) {
          const criteria = {
            ...m,
            multiValue: [...optionValues, ''],
          };
          // eslint-disable-next-line functional/immutable-data
          newManualCriteria.push({ ...criteria });
        }
      } else {
        // eslint-disable-next-line functional/immutable-data
        newManualCriteria.push({ ...m });
      }
    });
    setManualCriteriaToRender([...newManualCriteria]);
  };

  const handleOptionDeleted = (deletedOptionIndex: number, code: string) => {
    const newManualCriteria: Array<ManualCriteriaItem> = [];
    manualCriteriaToRender.forEach((m) => {
      if (m.code === code) {
        const newValues: Array<string> = [];
        m.multiValue?.forEach((v, i) => {
          if (i !== deletedOptionIndex) {
            // eslint-disable-next-line functional/immutable-data
            newValues.push(v);
          }
        });
        // eslint-disable-next-line functional/immutable-data
        newManualCriteria.push({ ...m, multiValue: [...newValues] });
      } else {
        // eslint-disable-next-line functional/immutable-data
        newManualCriteria.push({ ...m });
      }
    });
    setManualCriteriaToRender([...newManualCriteria]);
  };

  const handleOptionChanged = (optionValue: string, optionIndex: number, code: string) => {
    const newManualCriteria: Array<ManualCriteriaItem> = [];
    manualCriteriaToRender.forEach((m) => {
      if (m.code === code) {
        const newOptions: Array<string> = [];
        m.multiValue?.forEach((v, i) => {
          if (i === optionIndex) {
            // eslint-disable-next-line functional/immutable-data
            newOptions.push(optionValue);
          } else {
            // eslint-disable-next-line functional/immutable-data
            newOptions.push(v);
          }
        });
        // eslint-disable-next-line functional/immutable-data
        newManualCriteria.push({ ...m, multiValue: [...newOptions] });
      } else {
        // eslint-disable-next-line functional/immutable-data
        newManualCriteria.push({ ...m });
      }
    });
    setManualCriteriaToRender([...newManualCriteria]);
  };

  const addOption = (values: any, setValues: any) => {
    const newOptionsValues = [...values.manualCriteriaValues, ''];
    setValues({ ...values, manualCriteriaValues: newOptionsValues });
  };

  const deleteOption = (
    indexValueToRemove: number,
    values: any,
    setValues: any,
    setTouched: any
  ) => {
    const newValues: Array<any> = [];
    values.manualCriteriaValues.forEach((v: any, i: number) => {
      if (i !== indexValueToRemove) {
        // eslint-disable-next-line functional/immutable-data
        newValues.push(v);
      }
    });
    setValues({ ...values, manualCriteriaValues: newValues });
    setTouched({}, false);
  };

  const changeOption = (e: any, i: number, values: any, setValues: any, setTouched: any) => {
    const options = [...values.manualCriteriaValues];
    // eslint-disable-next-line functional/immutable-data
    options[i] = e.target.value;
    setValues({ ...values, manualCriteriaValues: options });
    setTouched({}, false);
  };

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
        <Typography variant="subtitle1">{`${t(
          'components.wizard.stepTwo.chooseCriteria.form.manual'
        )} ${data.code}`}</Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', justifySelf: 'end' }}>
        <IconButton
          data-id={data.code}
          onClick={(event: MouseEvent<Element, globalThis.MouseEvent>) =>
            handleCriteriaRemoved(event)
          }
        >
          <DeleteOutlineIcon
            color="error"
            data-id={data.code}
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
            onChange={(e) => {
              handleCriteriaType(e, manualCriteriaFormik.values, manualCriteriaFormik.setValues);
              handleFieldValueChanged(
                e.target.value,
                '_type',
                manualCriteriaFormik.values.manualCriteriaCode
              );
            }}
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
            id={`manualCriteria${data.code}}`}
            name={`manualCriteriaName`}
            variant="outlined"
            value={manualCriteriaFormik.values.manualCriteriaName}
            placeholder={t('components.wizard.stepTwo.chooseCriteria.form.value')}
            onChange={(e) => {
              manualCriteriaFormik.handleChange(e);
              handleFieldValueChanged(
                e.target.value,
                'description',
                manualCriteriaFormik.values.manualCriteriaCode
              );
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
          manualCriteriaFormik.values.manualCriteriaValues.map((o, i) => {
            const optionErrors =
              Array.isArray(manualCriteriaFormik.errors.manualCriteriaValues) &&
              typeof manualCriteriaFormik.errors.manualCriteriaValues[i] === 'string'
                ? manualCriteriaFormik.errors.manualCriteriaValues[i]
                : '';
            // const optionTouched =
            //   Array.isArray(manualCriteriaFormik.touched.manualCriteriaValues) &&
            //   typeof manualCriteriaFormik.touched.manualCriteriaValues[i] === 'boolean'
            //     ? manualCriteriaFormik.touched.manualCriteriaValues[i]
            //     : false;

            return (
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
                  {i > 0 && (
                    <RemoveCircleOutlineIcon
                      color="error"
                      data-id={o}
                      sx={{
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        deleteOption(
                          i,
                          manualCriteriaFormik.values,
                          manualCriteriaFormik.setValues,
                          manualCriteriaFormik.setTouched
                        );
                        handleOptionDeleted(i, manualCriteriaFormik.values.manualCriteriaCode);
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ display: 'grid', gridColumn: 'span 11' }}>
                  <TextField
                    id={`manualCriteriaValues[${i}]}`}
                    name={`manualCriteriaValues[${i}]}`}
                    variant="outlined"
                    value={
                      typeof Array.isArray(manualCriteriaFormik.values.manualCriteriaValues) &&
                      typeof manualCriteriaFormik.values.manualCriteriaValues !== 'undefined'
                        ? manualCriteriaFormik.values.manualCriteriaValues[i]
                        : ''
                    }
                    onChange={(e) => {
                      void manualCriteriaFormik.setTouched({}, false);

                      changeOption(
                        e,
                        i,
                        manualCriteriaFormik.values,
                        manualCriteriaFormik.setValues,
                        manualCriteriaFormik.setTouched
                      );
                      handleOptionChanged(
                        e.target.value,
                        i,
                        manualCriteriaFormik.values.manualCriteriaCode
                      );
                    }}
                    error={optionErrors.length > 0}
                    helperText={optionErrors.length > 0 ? optionErrors : ''}
                  />
                </Box>
              </Box>
            );
          })}
        {manualCriteriaFormik.values.manualCriteriaSelectName === ManualCriteriaOptions.MULTI && (
          <Box
            sx={{
              gridColumn: 'span 12',
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 3,
              my: 2,
            }}
          >
            <Box sx={{ display: 'grid', gridColumn: 'span 12' }}>
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
                onClick={() => {
                  addOption(manualCriteriaFormik.values, manualCriteriaFormik.setValues);
                  handleOptionAdded(
                    manualCriteriaFormik.values.manualCriteriaValues,
                    manualCriteriaFormik.values.manualCriteriaCode
                  );
                }}
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

export default ManualCriteria;
