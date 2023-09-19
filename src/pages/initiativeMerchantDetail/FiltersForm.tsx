import { Box, FormControl, TextField, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';

interface Props {
  formik: FormikProps<{ searchUser: string; filterStatus: string }>;
  resetForm: () => void;
  filterByStatusOptionsList: Array<{ value: string; label: string }>;
}

const FiltersForm = ({ formik, resetForm, filterByStatusOptionsList }: Props) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'grid',
        width: '100%',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 2,
        alignItems: 'baseline',
      }}
    >
      <FormControl sx={{ gridColumn: 'span 4' }}>
        <TextField
          label={t('pages.initiativeMerchantDetail.searchByFiscalCode')}
          placeholder={t('pages.initiativeMerchantDetail.searchByFiscalCode')}
          name="searchUser"
          aria-label="searchUser"
          role="input"
          InputLabelProps={{ required: false }}
          value={formik.values.searchUser}
          onChange={(e) => formik.handleChange(e)}
          size="small"
          data-testid="searchUserField-test"
        />
      </FormControl>
      <FormControl sx={{ gridColumn: 'span 2' }} size="small">
        <InputLabel>{t('pages.initiativeMerchantDetail.transactionStatus')}</InputLabel>
        <Select
          id="filterStatus"
          inputProps={{
            'data-testid': 'filterStatus-select',
          }}
          name="filterStatus"
          label={t('pages.initiativeMerchantDetail.transactionStatus')}
          placeholder={t('pages.initiativeMerchantDetail.transactionStatus')}
          onChange={(e) => formik.handleChange(e)}
          value={formik.values.filterStatus}
        >
          {filterByStatusOptionsList.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {t(item.label)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ gridColumn: 'span 1' }}>
        <Button
          sx={{ height: '44.5px' }}
          variant="outlined"
          size="small"
          onClick={() => formik.handleSubmit()}
          data-testid="apply-filters-btn-test"
        >
          {t('pages.initiativeMerchantDetail.filterBtn')}
        </Button>
      </FormControl>
      <FormControl sx={{ gridColumn: 'span 1' }}>
        <ButtonNaked
          component="button"
          sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem' }}
          onClick={resetForm}
        >
          {t('pages.initiativeMerchantDetail.removeFiltersBtn')}
        </ButtonNaked>
      </FormControl>
    </Box>
  );
};

export default FiltersForm;
