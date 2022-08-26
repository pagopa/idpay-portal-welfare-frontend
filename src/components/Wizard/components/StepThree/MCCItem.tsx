import {
  Box,
  IconButton,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { grey } from '@mui/material/colors';
import { useFormik } from 'formik';
import { renderShopRuleIcon } from './helpers';

type Props = {
  title: string;
  code: string;
  handleShopListItemRemoved: any;
};

const MCCItem = ({ title, code, handleShopListItemRemoved }: Props) => {
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      merchantSelect: '',
      mccCodes: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

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
        </FormControl>

        {/* variant="text" */}

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
          />
        </FormControl>

        <FormControl sx={{ gridArea: 'SelecFromList' }}>
          <Button
            size="large"
            sx={[
              {
                justifyContent: 'start',
                padding: 0,
                ml: 0.5,
              },
              {
                '&:hover': { backgroundColor: 'transparent' },
              },
            ]}
            startIcon={<ListAltIcon />}
            data-testid="SelecFromList-button-test"
            disableRipple={true}
            disableFocusRipple={true}
          >
            {t('components.wizard.stepThree.form.SelecFromList')}
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
};

export default MCCItem;
