import {
  Box,
  IconButton,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  FormHelperText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { grey } from '@mui/material/colors';
import { useFormik } from 'formik';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import * as Yup from 'yup';
import { fetchMccCodes } from '../../../../services/mccCodesService';
// import { MccCodesModel } from '../../../../model/MccCodes';
import { MccCodesModel } from '../../../../model/MccCodes';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { handleShopRulesToSubmit, renderShopRuleIcon, setError, setErrorText } from './helpers';
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
};

const MCCItem = ({
  title,
  code,
  handleShopListItemRemoved,
  action,
  shopRulesToSubmit,
  setShopRulesToSubmit,
}: Props) => {
  const { t } = useTranslation();
  const [openModalMcc, setOpenModalMcc] = useState(false);
  const [mccCodesList, setMccCodesList] = useState(Array<MccCodesModel>);

  useEffect(() => {
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

        setMccCodesList([...newMccCodeList]);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      formik.handleSubmit();
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
  }, [action]);

  const validationSchema = Yup.object().shape({
    merchantSelect: Yup.string()
      .typeError(t('validation.string'))
      .required(t('validation.required')),
    mccCodes: Yup.string().typeError(t('validation.string')).required(t('validation.required')),
  });

  const formik = useFormik({
    initialValues: {
      merchantSelect: '',
      mccCodes: '0742, 0743, 0744',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      setShopRulesToSubmit([...handleShopRulesToSubmit(shopRulesToSubmit, code)]);
    },
  });

  const handleCloseModalMcc = () => setOpenModalMcc(false);

  const handleOpenModalMcc = () => setOpenModalMcc(true);

  const handleMccCodeCheckedUpdate = (mccCodeList: Array<MccCodesModel>) => {
    const mccCodesValue = formik.values.mccCodes.split(', ');
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

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        alignItems: 'start',
        borderColor: grey.A200,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: 2,
        my: 3,
        p: 3,
      }}
      data-testid="mcc-item-test"
    >
      <Box sx={{ gridColumn: 'span 1' }}>{renderShopRuleIcon(code, 0, 'inherit')}</Box>
      <Box sx={{ gridColumn: 'span 22' }}>
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', justifySelf: 'end' }}>
        <IconButton onClick={() => handleShopListItemRemoved(code)}>
          <DeleteOutlineIcon
            color="error"
            sx={{
              cursor: 'pointer',
            }}
            data-testid="delete-button-test"
          />
        </IconButton>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 24',
          display: 'grid',
          gridTemplateColumns: 'repeat( 4, 1fr)',
          gridTemplateRows: 'auto',
          gridTemplateAreas: `"merchant . . ."
                              "MccCode MccCode MccCode MccCode"
                              "SelecFromList . . ."`,
          alignItems: 'center',
          gap: 3,
          my: 2,
        }}
      >
        <FormControl sx={{ gridArea: 'merchant' }}>
          <Select
            defaultValue=""
            name="merchantSelect"
            id="merchant-id-select"
            data-testid="merchantSelect-test"
            onChange={(e) => formik.setFieldValue('merchantSelect', e.target.value)}
            onBlur={(e) => formik.handleBlur(e)}
            value={formik.values.merchantSelect}
          >
            <MenuItem value={'everybody'} data-testid="everybody">
              {t('components.wizard.stepThree.form.everybodyExceptSelectItem')}
            </MenuItem>
            <MenuItem value={'mobody'} data-testid="nobody">
              {t('components.wizard.stepThree.form.nobodyExceptSelectItem')}
            </MenuItem>
          </Select>
          <FormHelperText
            error={formik.touched.merchantSelect && Boolean(formik.errors.merchantSelect)}
            sx={{ gridColumn: 'span 12' }}
          >
            {formik.touched.merchantSelect && formik.errors.merchantSelect}
          </FormHelperText>
        </FormControl>
        <FormControl sx={{ gridArea: 'MccCode' }}>
          <TextField
            multiline
            minRows={2}
            maxRows={4}
            label={t('components.wizard.stepThree.form.mccCodes')}
            placeholder={t('components.wizard.stepThree.form.mccCodes')}
            name="mccCodes"
            aria-label="mccCodes"
            role="input"
            onChange={(e) => formik.handleChange(e)}
            value={formik.values.mccCodes}
            error={setError(formik.touched.mccCodes, formik.errors.mccCodes)}
            helperText={setErrorText(formik.touched.mccCodes, formik.errors.mccCodes)}
          />
        </FormControl>

        <FormControl sx={{ gridArea: 'SelecFromList' }}>
          <Button
            size="large"
            sx={[
              {
                justifyContent: 'start',
                padding: 0,
                fontSize: '14px',
              },
              {
                '&:hover': { backgroundColor: 'transparent' },
              },
            ]}
            startIcon={<ListAltIcon />}
            onClick={handleOpenModalMcc}
            data-testid="SelecFromList-button-test"
            disableRipple={true}
            disableFocusRipple={true}
          >
            {t('components.wizard.stepThree.form.selectFromList')}
          </Button>
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
