import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { matchPath } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES from '../../routes';

const InitiativeRefunds = () => {
  const { t } = useTranslation();
  const history = useHistory();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_USERS],
    exact: true,
    strict: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [JSON.stringify(match), initiativeSel.initiativeId]);

  useEffect(() => {
    // TODO CALL API
    console.log('match');
  }, [JSON.stringify(match)]);

  const formik = useFormik({
    initialValues: {
      searchFrom: '',
      searchTo: '',
      filterStatus: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'grid', gridColumn: 'span 12' }}>
          <Breadcrumbs aria-label="breadcrumb">
            <ButtonNaked
              component="button"
              onClick={() => history.replace(ROUTES.HOME)}
              startIcon={<ArrowBackIcon />}
              sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
              weight="default"
            >
              {t('breadcrumbs.back')}
            </ButtonNaked>
            <Typography color="text.primary" variant="body2">
              {initiativeSel.initiativeName}
            </Typography>
            <Typography color="text.primary" variant="body2">
              {t('breadcrumbs.initiativeRefunds')}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 12', mt: 2 }}>
          <TitleBox
            title={t('pages.initiativeRefunds.title')}
            subTitle={t('pages.initiativeRefunds.subtitle')}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
          gap: 2,
          mb: 4,
        }}
      >
        <FormControl sx={{ gridColumn: 'span 2' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={t('pages.initiativeRefunds.form.from')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.searchFrom}
              onChange={(value) => formik.setFieldValue('searchFrom', value)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="searchFrom"
                  data-testid="searchFrom-test"
                  name="searchFrom"
                  type="date"
                  size="small"
                  error={formik.touched.searchFrom && Boolean(formik.errors.searchFrom)}
                  helperText={formik.touched.searchFrom && formik.errors.searchFrom}
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 2' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={t('pages.initiativeRefunds.form.to')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.searchTo}
              onChange={(value) => formik.setFieldValue('searchTo', value)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="searchTo"
                  data-testid="searchTo-test"
                  name="searchTo"
                  type="date"
                  size="small"
                  error={formik.touched.searchTo && Boolean(formik.errors.searchTo)}
                  helperText={formik.touched.searchTo && formik.errors.searchTo}
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 2' }} size="small">
          <InputLabel>{t('pages.initiativeRefunds.form.status')}</InputLabel>
          <Select
            id="filterStatus"
            data-testid="filterStatus-select"
            name="filterStatus"
            label={t('pages.initiativeRefunds.form.status')}
            placeholder={t('pages.initiativeRefunds.form.status')}
            onChange={(e) => formik.handleChange(e)}
            value={formik.values.filterStatus}
          >
            <MenuItem value="COMPLETED" data-testid="filterStatusWaiting-test">
              {t('pages.initiativeRefunds.form.completed')}
            </MenuItem>
            <MenuItem value="TO_LOAD" data-testid="filterStatusRegistered-test">
              {t('pages.initiativeRefunds.form.toLoad')}
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <Button
            sx={{ py: 2, height: '44px' }}
            variant="outlined"
            size="small"
            onClick={() => console.log('apply filters')}
            data-testid="apply-filters-test"
            disabled
          >
            {t('pages.initiativeRefunds.form.filterBtn')}
          </Button>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <ButtonNaked
            component="button"
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem' }}
            onClick={() => console.log('reset filters')}
            disabled
          >
            {t('pages.initiativeRefunds.form.resetFiltersBtn')}
          </ButtonNaked>
        </FormControl>
      </Box>
    </Box>
  );
};

export default InitiativeRefunds;
