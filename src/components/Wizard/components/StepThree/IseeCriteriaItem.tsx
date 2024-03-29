import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
  Autocomplete,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';
import { FilterOperator, WIZARD_ACTIONS } from '../../../../utils/constants';
import { AvailableCriteria } from '../../../../model/AdmissionCriteria';
import { BeneficiaryTypeEnum } from '../../../../api/generated/initiative/InitiativeGeneralDTO';
import {
  IseeTypologyEnum,
  boxItemStyle,
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
  rankingEnabled: string | undefined;
  beneficiaryType: BeneficiaryTypeEnum | undefined;
};

const IseeCriteriaItem = ({
  action,
  formData,
  handleCriteriaRemoved,
  handleFieldValueChanged,
  criteriaToSubmit,
  setCriteriaToSubmit,
  rankingEnabled,
  beneficiaryType,
}: Props) => {
  const { t } = useTranslation();
  const [iseeEndValueVisible, setIseeEndValueVisible] = useState(
    formData.operator === FilterOperator.BTW_CLOSED ? 'number' : 'hidden'
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [rankingOrderLabel, setRankingOrderLabel] = useState<string | undefined>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value: string, fieldKey: string, fieldCode: string) => {
    handleFieldValueChanged(value, fieldKey, fieldCode);
    setAnchorEl(null);
  };

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
        iseeRelationSelect === FilterOperator.BTW_CLOSED && iseeStartValue,
      then: Yup.number()
        .required(t('validation.required'))
        .moreThan(Yup.ref('iseeStartValue'), t('validation.outValue')),
    }),
    iseeTypes: Yup.array().min(1, t('validation.required')).required(t('validation.required')),
  });

  const setOrderDirection = (
    rankingEnabled: string | undefined,
    initialOrderDirection: string | undefined
  ) => {
    if (typeof rankingEnabled === 'string' && rankingEnabled === 'true') {
      if (typeof initialOrderDirection === 'string') {
        return initialOrderDirection;
      } else {
        return 'ASC';
      }
    } else {
      return undefined;
    }
  };

  const iseeFormik = useFormik({
    initialValues: {
      iseeRelationSelect: formData.operator,
      iseeStartValue: formData.value,
      iseeEndValue: formData.value2,
      orderDirection: setOrderDirection(rankingEnabled, formData.orderDirection),
      iseeTypes: formData?.iseeTypes,
    },
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema: iseeValidationSchema,
    onSubmit: (_values) => {
      setCriteriaToSubmit([...handleCriteriaToSubmit(criteriaToSubmit, formData.code)]);
    },
  });

  useEffect(() => {
    if (rankingEnabled === 'true' && typeof iseeFormik.values.orderDirection === 'string') {
      if (iseeFormik.values.orderDirection === 'ASC') {
        setRankingOrderLabel(t('components.wizard.stepThree.chooseCriteria.form.rankingOrderAsc'));
      } else if (iseeFormik.values.orderDirection === 'DESC') {
        setRankingOrderLabel(t('components.wizard.stepThree.chooseCriteria.form.rankingOrderDesc'));
      }
    }
  }, [iseeFormik.values.orderDirection, rankingEnabled]);

  const autocompleteOptionsList = [
    {
      value: IseeTypologyEnum.Dottorato,
      label: t('components.wizard.stepThree.chooseCriteria.form.iseeDottorato'),
    },
    {
      value: IseeTypologyEnum.Minorenne,
      label: t('components.wizard.stepThree.chooseCriteria.form.iseeMinorenne'),
    },
    {
      value: IseeTypologyEnum.Ordinario,
      label: t('components.wizard.stepThree.chooseCriteria.form.iseeOrdinario'),
    },
    {
      value: IseeTypologyEnum.Residenziale,
      label: t('components.wizard.stepThree.chooseCriteria.form.iseeResidenziale'),
    },
    {
      value: IseeTypologyEnum.SocioSanitario,
      label: t('components.wizard.stepThree.chooseCriteria.form.iseeSocioSanitario'),
    },
    {
      value: IseeTypologyEnum.Universitario,
      label: t('components.wizard.stepThree.chooseCriteria.form.iseeUniversitario'),
    },
  ];

  return (
    <Box sx={boxItemStyle} data-testid="isee-criteria-test">
      <Box
        sx={{
          gridColumn:
            typeof rankingEnabled === 'string' && rankingEnabled === 'true' ? 'span 8' : 'span 11',
        }}
      >
        <Typography variant="subtitle1">{formData.fieldLabel}</Typography>
      </Box>
      {typeof rankingEnabled === 'string' && rankingEnabled === 'true' && (
        <Box sx={{ gridColumn: 'span 3', textAlign: 'right' }}>
          <ButtonNaked
            id="ranking-button"
            aria-controls={open ? 'ranking-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            startIcon={<KeyboardArrowDownIcon />}
            sx={{ color: 'primary.main' }}
            size="small"
            component="button"
            weight="default"
            data-testid="ranking-button-test"
          >
            {rankingOrderLabel}
          </ButtonNaked>
          <Menu
            id="ranking-menu"
            anchorEl={anchorEl}
            open={open}
            MenuListProps={{
              'aria-labelledby': 'ranking-button',
            }}
          >
            <MenuItem
              onClick={async () => {
                handleClose('ASC', 'orderDirection', formData.code);
                await iseeFormik.setFieldValue('orderDirection', 'ASC');
              }}
            >
              {t('components.wizard.stepThree.chooseCriteria.form.rankingOrderAsc')}
            </MenuItem>
            <MenuItem
              onClick={async () => {
                handleClose('DESC', 'orderDirection', formData.code);
                await iseeFormik.setFieldValue('orderDirection', 'DESC');
              }}
            >
              {t('components.wizard.stepThree.chooseCriteria.form.rankingOrderDesc')}
            </MenuItem>
          </Menu>
        </Box>
      )}
      <Box sx={{ gridColumn: 'span 1', justifySelf: 'end' }}>
        {typeof beneficiaryType !== undefined && beneficiaryType !== BeneficiaryTypeEnum.NF && (
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
        )}
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
            {typeof rankingEnabled === 'string' && rankingEnabled === 'false' && (
              <MenuItem value={FilterOperator.EQ} data-testid="exact">
                {t('components.wizard.stepThree.chooseCriteria.form.exact')}
              </MenuItem>
            )}
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
            <MenuItem value={FilterOperator.BTW_CLOSED} data-testid="between">
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
                  <EuroSymbolIcon />
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
                  <EuroSymbolIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </FormControl>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 12',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
        }}
      >
        <FormControl sx={{ gridColumn: 'span 2', mt: 2 }}>
          <Autocomplete
            multiple={true}
            id="isee-typology"
            options={autocompleteOptionsList}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            value={iseeFormik.values.iseeTypes || []}
            onChange={async (_e, value) => {
              handleFieldValueChanged(value, 'iseeTypes', formData.code);
              await iseeFormik.setFieldValue('iseeTypes', value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('components.wizard.stepThree.chooseCriteria.form.typology')}
                size="small"
                error={setError(iseeFormik.touched.iseeTypes, iseeFormik.errors.iseeTypes)}
                helperText={
                  setErrorText(iseeFormik.touched.iseeTypes, iseeFormik.errors.iseeTypes) ||
                  t('components.wizard.stepThree.chooseCriteria.form.iseeTypologyHelpText')
                }
              />
            )}
            sx={{
              '& .MuiChip-root': {
                backgroundColor: '#fff',
                border: '1px solid rgba(0, 0, 0, 0.23)',
              },
              '& .MuiChip-label': {
                padding: '6px 9px',
              },
            }}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default IseeCriteriaItem;
