/* eslint-disable functional/no-let */
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { matchPath } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { itIT } from '@mui/material/locale';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import * as Yup from 'yup';
import { parse } from 'date-fns';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES from '../../routes';
import { numberWithCommas } from '../../helpers';
import { getExportsPaged } from '../../services/intitativeService';
import { InitiativeRefundToDisplay } from '../../services/__mocks__/initiativeService';

const InitiativeRefunds = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [rows, setRows] = useState<Array<InitiativeRefundToDisplay>>([]);
  const theme = createTheme(itIT);
  const setLoading = useLoading('GET_INITIATIVE_REFUNDS');
  const [filterByNotificationDateFrom, setFilterByNotificationDateFrom] = useState<
    string | undefined
  >();
  const [filterByNotificationDateTo, setFilterByNotificationDateTo] = useState<
    string | undefined
  >();
  const [filterByStatus, setFilterByStatus] = useState<string | undefined>();

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_USERS],
    exact: true,
    strict: false,
  });

  const calcSuccessPercentage = (rewardsResulted: number, rewardsNotified: number): string => {
    if (rewardsResulted > 0 && rewardsNotified > 0) {
      return `${(rewardsResulted / rewardsNotified) * 100}%`;
    }
    return '';
  };

  const getTableData = (
    initiativeId: string,
    page: number,
    searchFrom: string | undefined,
    searchTo: string | undefined,
    filterStatus: string | undefined
  ) => {
    setLoading(true);
    getExportsPaged(initiativeId, page, searchFrom, searchTo, filterStatus)
      .then((res) => {
        if (typeof res.totalElements === 'number') {
          setTotalElements(res.totalElements);
        }
        if (Array.isArray(res.content) && res.content.length > 0) {
          const rowsData = res.content.map((r) => ({
            ...r,
            id: r.id,
            notificationDate: r.notificationDate.toLocaleString('fr-BE').split(' ')[0],
            typology: t('pages.initiativeRefunds.table.typeOrdinary'),
            rewardsExported: `${numberWithCommas(r.rewardsExported)} €`,
            rewardsResults: `${numberWithCommas(r.rewardsResults)} €`,
            successPercentage: calcSuccessPercentage(r.rewardsResulted, r.rewardsNotified),
            filePath: r.filePath,
          }));
          setRows([...rowsData]);
        }
      })
      .catch((error) => {
        addError({
          id: 'GET_EXPORTS_PAGED_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting export paged data',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof initiativeSel.initiativeId === 'string') {
      getTableData(
        initiativeSel.initiativeId,
        page,
        filterByNotificationDateFrom,
        filterByNotificationDateTo,
        filterByStatus
      );
    }
  }, [JSON.stringify(match), initiativeSel.initiativeId, page]);

  const validationSchema = Yup.object().shape({
    searchFrom: Yup.date()
      .nullable()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        return parse(originalValue, 'dd/MM/yyyy', new Date());
      })
      .typeError(t('validation.invalidDate')),
    searchTo: Yup.date()
      .nullable()
      // eslint-disable-next-line sonarjs/no-identical-functions
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        return parse(originalValue, 'dd/MM/yyyy', new Date());
      })
      .typeError(t('validation.invalidDate'))
      .when('searchFrom', (searchFrom, _schema) => {
        const timestamp = Date.parse(searchFrom);
        if (isNaN(timestamp) === false) {
          return Yup.date()
            .nullable()
            .min(searchFrom, t('validation.outDateTo'))
            .typeError(t('validation.invalidDate'));
        } else {
          return Yup.date().nullable().typeError(t('validation.invalidDate'));
        }
      }),
  });

  const formik = useFormik({
    initialValues: {
      searchFrom: null,
      searchTo: null,
      filterStatus: '',
    },
    validationSchema,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      let searchFromStr;
      let searchToStr;
      if (typeof initiativeSel.initiativeId === 'string') {
        if (values.searchFrom) {
          const searchFrom = values.searchFrom as unknown as Date;
          searchFromStr =
            searchFrom.toLocaleString('fr-BE').split(' ')[0].length > 0
              ? searchFrom.toLocaleString('fr-BE').split(' ')[0]
              : undefined;
          setFilterByNotificationDateFrom(searchFromStr);
        }
        if (values.searchTo) {
          const searchTo = values.searchTo as unknown as Date;
          searchToStr =
            searchTo.toLocaleString('fr-BE').split(' ')[0].length > 0
              ? searchTo.toLocaleString('fr-BE').split(' ')[0]
              : undefined;

          setFilterByNotificationDateTo(searchToStr);
        }
        const filterStatus = values.filterStatus.length > 0 ? values.filterStatus : undefined;
        setFilterByStatus(filterStatus);
        getTableData(initiativeSel.initiativeId, 0, searchFromStr, searchToStr, filterStatus);
      }
    },
  });

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const resetForm = () => {
    const initialValues = { searchFrom: null, searchTo: null, filterStatus: '' };
    formik.resetForm({ values: initialValues });
    setFilterByNotificationDateFrom(undefined);
    setFilterByNotificationDateTo(undefined);
    setFilterByStatus(undefined);
    if (typeof initiativeSel.initiativeId === 'string') {
      getTableData(initiativeSel.initiativeId, 0, undefined, undefined, undefined);
    }
  };

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
      {rows.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignItems: 'baseline',
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
              onClick={() => formik.handleSubmit()}
              data-testid="apply-filters-test"
            >
              {t('pages.initiativeRefunds.form.filterBtn')}
            </Button>
          </FormControl>
          <FormControl sx={{ gridColumn: 'span 1' }}>
            <ButtonNaked
              component="button"
              sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem' }}
              onClick={resetForm}
            >
              {t('pages.initiativeRefunds.form.resetFiltersBtn')}
            </ButtonNaked>
          </FormControl>
        </Box>
      )}
      {rows.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            height: '100%',
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'grid', gridColumn: 'span 12', height: '100%' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="15%">
                      {t('pages.initiativeRefunds.table.creationDate')}
                    </TableCell>
                    <TableCell width="15%">{t('pages.initiativeRefunds.table.typology')}</TableCell>
                    <TableCell width="15%">{t('pages.initiativeRefunds.table.amount')}</TableCell>
                    <TableCell width="15%">{t('pages.initiativeRefunds.table.refunds')}</TableCell>
                    <TableCell width="15%">
                      {t('pages.initiativeRefunds.table.successPercentage')}
                    </TableCell>
                    <TableCell width="15%">{t('pages.initiativeRefunds.table.status')}</TableCell>
                    <TableCell width="10%"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.notificationDate}</TableCell>
                      <TableCell>{r.typology}</TableCell>
                      <TableCell>{r.rewardsExported}</TableCell>
                      <TableCell>{r.rewardsResults}</TableCell>
                      <TableCell>{r.successPercentage}</TableCell>
                      <TableCell>{r.status}</TableCell>
                      <TableCell align="right">
                        <Link href={r.filePath} download target="_blank">
                          <ArrowForwardIosIcon color="primary" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ThemeProvider theme={theme}>
                <TablePagination
                  component="div"
                  onPageChange={handleChangePage}
                  page={page}
                  count={totalElements}
                  rowsPerPage={10}
                  rowsPerPageOptions={[10]}
                />
              </ThemeProvider>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignItems: 'center',
            backgroundColor: 'white',
          }}
        >
          <Box sx={{ display: 'grid', gridColumn: 'span 12', justifyContent: 'center', py: 2 }}>
            <Typography variant="body2">{t('pages.initiativeRefunds.noData')}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InitiativeRefunds;
