import {
  Box,
  IconButton,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useFormik } from 'formik';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import * as Yup from 'yup';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { fetchMccCodes } from '../../../../services/mccCodesService';
import { MccCodesModel } from '../../../../model/MccCodes';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { MccFilterDTO } from '../../../../api/generated/initiative/MccFilterDTO';
import {
  boxItemStyle,
  handleShopRulesToSubmit,
  renderShopRuleIcon,
  setError,
  setErrorText,
} from './helpers';
import MCCModal from './MCCModal';

type Props = {
  title: string;
  code: string;
  handleShopListItemRemoved: any;
  action: string;
  shopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }>;
  setShopRulesToSubmit: Dispatch<
    SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
  >;
  data: MccFilterDTO | undefined;
  setData: Dispatch<SetStateAction<MccFilterDTO> | undefined>;
};

const MCCItem = ({
  title,
  code,
  handleShopListItemRemoved,
  action,
  shopRulesToSubmit,
  setShopRulesToSubmit,
  data,
  setData,
}: Props) => {
  const { t } = useTranslation();
  const [openModalMcc, setOpenModalMcc] = useState(false);
  const [mccCodesList, setMccCodesList] = useState(Array<MccCodesModel>);
  const addError = useErrorDispatcher();
  const setLoading = useLoading('GET_MCC_LIST');

  useEffect(() => {
    setLoading(true);
    fetchMccCodes()
      .then((response) => {
        const responseData = [...response];
        const newMccCodeList: Array<MccCodesModel> = [];
        responseData.forEach((a) => {
          const code = a.code || '';
          const description = a.description || '';
          const checked = false;
          const item = { code, description, checked };
          // eslint-disable-next-line functional/immutable-data
          newMccCodeList.push(item);
        });
        const mccCodeListStr = Array.isArray(data?.values) ? data?.values.join(', ') : '';
        handleMccCodeCheckedUpdate(newMccCodeList, mccCodeListStr as string);
      })
      .catch((error) => {
        addError({
          id: 'GET_TRANSACTION_MCC_CODES_LIST_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting MCC codes list',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
  }, [action]);

  const validationSchema = Yup.object().shape({
    allowedList: Yup.string().required(t('validation.required')),
    values: Yup.string()
      .required(t('validation.required'))
      .test('valid-mccCode-values', t('validation.notValidMccList'), function (val) {
        if (val && val.length > 0) {
          const mccCodesValue = val.replace(/\W+/g, ' ').trim();
          const mccCodesArr = mccCodesValue.split(' ');
          // eslint-disable-next-line functional/no-let
          let valid = true;
          // eslint-disable-next-line functional/no-let
          let mccCode = '';
          mccCodesList.forEach((c) => {
            mccCode = mccCode + ' ' + c.code;
          });
          mccCode = mccCode.trim();
          mccCodesArr.forEach((m) => {
            valid = valid && mccCode.includes(m);
          });
          return valid;
        }
        return true;
      }),
  });

  const formik = useFormik({
    initialValues: {
      allowedList: data?.allowedList ? 'true' : 'false',
      values: Array.isArray(data?.values) ? data?.values.join(', ') : '',
    },
    validationSchema,
    onSubmit: (_values) => {
      setShopRulesToSubmit([...handleShopRulesToSubmit(shopRulesToSubmit, code)]);
    },
  });

  const handleCloseModalMcc = () => setOpenModalMcc(false);

  const handleOpenModalMcc = () => setOpenModalMcc(true);

  const handleMccCodeCheckedUpdate = (mccCodeList: Array<MccCodesModel>, mccCodes: string) => {
    const mccCodesValue = mccCodes.replace(/\W+/g, ' ').trim().split(/\s/);
    const newMccCodeList: Array<{ code: string; description: string; checked: boolean }> = [];
    mccCodeList.forEach((i) => {
      // eslint-disable-next-line functional/no-let
      let j = 0;
      // eslint-disable-next-line functional/no-let
      let found = false;
      while (j < mccCodesValue.length && found === false) {
        if (mccCodesValue[j] === i.code) {
          found = true;
        }
        j++;
      }
      // eslint-disable-next-line functional/immutable-data
      newMccCodeList.push({ ...i, checked: found });
    });
    setMccCodesList([...newMccCodeList]);
  };

  const handleUpdateAllowedListFieldState = (value: string) => {
    const valueBoolean = value === 'true' ? true : false;
    const newState = { ...data, allowedList: valueBoolean };
    setData({ ...newState });
  };

  const handleUpdateValuesFieldState = (value: string | undefined) => {
    const valueArr = typeof value === 'string' ? value.replace(/\W+/g, ' ').trim().split(/\s/) : [];
    const newState = { ...data, values: [...valueArr] };
    setData({
      allowedList: newState.allowedList,
      values: [...newState.values],
    });
  };

  useEffect(() => {
    handleUpdateValuesFieldState(formik.values.values);
  }, [formik.values.values]);

  return (
    <Box sx={boxItemStyle} data-testid="mcc-item-test">
      <Box sx={{ gridColumn: 'span 1' }}>{renderShopRuleIcon(code, 0, 'inherit')}</Box>
      <Box sx={{ gridColumn: 'span 22' }}>
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', justifySelf: 'end' }}>
        <IconButton
          data-testid="delete-button-mcc-test"
          onClick={() => handleShopListItemRemoved(code)}
        >
          <DeleteOutlineIcon
            color="error"
            sx={{
              cursor: 'pointer',
            }}
          />
        </IconButton>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 24',
          display: 'grid',
          gridTemplateColumns: 'repeat( 3, 1fr)',
          gridTemplateRows: 'auto',
          gridTemplateAreas: `"merchant . . "
                              "MccCode MccCode MccCode"
                              "SelecFromList . . "`,
          alignItems: 'center',
          gap: 2,
          mt: 1,
        }}
      >
        <FormControl sx={{ gridArea: 'merchant' }} size="small">
          <Select
            defaultValue=""
            name="allowedList"
            id="allowedList"
            inputProps={{ 'data-testid': 'merchantSelect-test' }}
            onChange={(e) => {
              formik.handleChange(e);
              handleUpdateAllowedListFieldState(e.target.value);
            }}
            onBlur={(e) => formik.handleBlur(e)}
            value={formik.values.allowedList}
          >
            <MenuItem value={'false'} data-testid="everybody">
              {t('components.wizard.stepFour.form.everybodyExceptSelectItem')}
            </MenuItem>
            <MenuItem value={'true'} data-testid="nobody">
              {t('components.wizard.stepFour.form.nobodyExceptSelectItem')}
            </MenuItem>
          </Select>
          <FormHelperText
            error={formik.touched.allowedList && Boolean(formik.errors.allowedList)}
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.touched.allowedList && formik.errors.allowedList}
          </FormHelperText>
        </FormControl>
        <FormControl sx={{ gridArea: 'MccCode' }}>
          <TextField
            multiline
            minRows={2}
            maxRows={4}
            label={t('components.wizard.stepFour.form.mccCodes')}
            placeholder={t('components.wizard.stepFour.form.mccCodes')}
            name="values"
            aria-label="values"
            role="input"
            onChange={(e) => {
              formik.handleChange(e);
              handleMccCodeCheckedUpdate(mccCodesList, e.target.value);
            }}
            value={formik.values.values}
            error={setError(formik.touched.values, formik.errors.values)}
            helperText={setErrorText(formik.touched.values, formik.errors.values)}
            size="small"
            inputProps={{
              'data-testid': 'mccCodesTextArea',
            }}
          />
        </FormControl>

        <FormControl sx={{ gridArea: 'SelecFromList', alignItems: 'start' }}>
          <ButtonNaked
            size="small"
            component="button"
            onClick={handleOpenModalMcc}
            startIcon={<ListAltIcon />}
            sx={{ color: 'primary.main' }}
            weight="default"
          >
            {t('components.wizard.stepFour.form.selectFromList')}
          </ButtonNaked>
        </FormControl>
        <MCCModal
          openModalMcc={openModalMcc}
          handleCloseModalMcc={handleCloseModalMcc}
          mccCodesList={mccCodesList}
          setMccCodesList={setMccCodesList}
          setFieldValue={formik.setFieldValue}
          handleMccCodeCheckedUpdate={handleMccCodeCheckedUpdate}
          data-testid="modal-test"
        />
      </Box>
    </Box>
  );
};

export default MCCItem;
