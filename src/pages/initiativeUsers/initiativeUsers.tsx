/* eslint-disable functional/no-let */
import { useEffect, useState } from 'react';
import { matchPath } from 'react-router';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  FormControl,
  // IconButton,
  InputLabel,
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
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory } from 'react-router-dom';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { itIT } from '@mui/material/locale';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import * as Yup from 'yup';
import { parse } from 'date-fns';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { getOnboardingStatus } from '../../services/intitativeService';
import { InitiativeUserToDisplay } from '../../model/InitiativeUsers';
import { Initiative } from '../../model/Initiative';

const InitiativeUsers = () => {
  const { t } = useTranslation();
  const history = useHistory();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<Array<InitiativeUserToDisplay>>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [filterByBeneficiary, setFilterByBeneficiary] = useState<string | undefined>();
  const [filterByDateFrom, setFilterByDateFrom] = useState<string | undefined>();
  const [filterByDateTo, setFilterByDateTo] = useState<string | undefined>();
  const [filterByStatus, setFilterByStatus] = useState<string | undefined>();
  const setLoading = useLoading('GET_INITIATIVE_USERS');
  const addError = useErrorDispatcher();

  const theme = createTheme(itIT);

  const getTableData = (
    initiativeId: string,
    page: number,
    beneficiary: string | undefined,
    searchFrom: string | undefined,
    searchTo: string | undefined,
    filterStatus: string | undefined
  ) => {
    setLoading(true);
    getOnboardingStatus(initiativeId, page, beneficiary, searchFrom, searchTo, filterStatus)
      .then((res) => {
        if (typeof res.pageNo === 'number') {
          setPage(res.pageNo);
        }
        const rowsData = res.content?.map((row, index) => ({
          ...row,
          id: index,
          beneficiary: row.beneficiary,
          updateStatusDate:
            typeof row.updateStatusDate === 'object'
              ? row.updateStatusDate
                  .toLocaleString('fr-BE')
                  .substring(0, row.updateStatusDate.toLocaleString('fr-BE').length - 3)
              : '',
          beneficiaryState: row.beneficiaryState,
        }));
        if (Array.isArray(rowsData)) {
          setRows(rowsData);
        }
        if (typeof res.pageSize === 'number') {
          setRowsPerPage(res.pageSize);
        }
        if (typeof res.totalElements === 'number') {
          setTotalElements(res.totalElements);
        }
      })
      .catch((error) => {
        addError({
          id: 'GET_INITIATIVE_USERS_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting initiative users',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      })
      .finally(() => setLoading(false));
  };

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_USERS],
    exact: true,
    strict: false,
  });

  interface MatchParams {
    id: string;
  }

  const { id } = (match?.params as MatchParams) || {};

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof id === 'string') {
      getTableData(id, page, filterByBeneficiary, filterByDateFrom, filterByDateTo, filterByStatus);
    }
  }, [id, page]);

  const checkRankingEnded = (date: string | Date | undefined): boolean | undefined => {
    if (typeof date === 'object') {
      const now = new Date();
      return now > date;
    } else if (typeof date === 'string') {
      // eslint-disable-next-line functional/immutable-data
      const d = date.split('/').reverse().join('-');
      const rankingEnd = new Date(d);
      const now = new Date();
      return now > rankingEnd;
    } else {
      return undefined;
    }
  };

  // eslint-disable-next-line complexity, sonarjs/cognitive-complexity
  const renderUserStatus = (status: string | undefined, initiative: Initiative) => {
    const rankingEnded = checkRankingEnded(initiative.generalInfo.rankingEndDate);
    switch (status) {
      case 'INVITED':
      case 'ACCEPTED_TC':
      case 'ON_EVALUATION':
        if (rankingEnded) {
          return <Chip label={t('pages.initiativeUsers.status.notSignedOn')} color="error" />;
        } else {
          return <Chip label={t('pages.initiativeUsers.status.onEvaluation')} color="default" />;
        }
      case 'ONBOARDING_OK':
        if (initiative.generalInfo.rankingEnabled === 'true') {
          return <Chip label={t('pages.initiativeUsers.status.assignee')} color="success" />;
        } else {
          return <Chip label={t('pages.initiativeUsers.status.onboardingOk')} color="success" />;
        }
      case 'ONBOARDING_KO':
        return <Chip label={t('pages.initiativeUsers.status.onboardingKo')} color="error" />;
      case 'ELIGIBLE':
        return <Chip label={t('pages.initiativeUsers.status.eligible')} color="warning" />;
      case 'INACTIVE':
        return <Chip label={t('pages.initiativeUsers.status.inactive')} color="error" />;
      default:
        return null;
    }
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

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
      searchUser: '',
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
      if (typeof id === 'string') {
        const filterBeneficiary = values.searchUser.length > 0 ? values.searchUser : undefined;
        setFilterByBeneficiary(filterBeneficiary);
        if (values.searchFrom) {
          const searchFrom = values.searchFrom as unknown as Date;
          searchFromStr =
            searchFrom.toLocaleString('en-CA').split(' ')[0].length > 0
              ? `${searchFrom
                  .toLocaleString('en-CA')
                  .split(' ')[0]
                  .substring(
                    0,
                    searchFrom.toLocaleString('en-CA').split(' ')[0].length - 1
                  )}T00:00:00Z`
              : undefined;
          setFilterByDateFrom(searchFromStr);
        }
        if (values.searchTo) {
          const searchTo = values.searchTo as unknown as Date;
          searchToStr =
            searchTo.toLocaleString('en-CA').split(' ')[0].length > 0
              ? `${searchTo
                  .toLocaleString('en-CA')
                  .split(' ')[0]
                  .substring(
                    0,
                    searchTo.toLocaleString('en-CA').split(' ')[0].length - 1
                  )}T00:00:00Z`
              : undefined;
          setFilterByDateTo(searchToStr);
        }
        const filterStatus = values.filterStatus.length > 0 ? values.filterStatus : undefined;
        setFilterByStatus(filterStatus);
        getTableData(id, 0, filterBeneficiary, searchFromStr, searchToStr, filterStatus);
      }
    },
  });

  const resetForm = () => {
    const initialValues = { searchUser: '', searchFrom: null, searchTo: null, filterStatus: '' };
    formik.resetForm({ values: initialValues });
    setFilterByBeneficiary(undefined);
    setFilterByDateFrom(undefined);
    setFilterByDateTo(undefined);
    setFilterByStatus(undefined);
    if (typeof id === 'string') {
      getTableData(id, 0, undefined, undefined, undefined, undefined);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'grid', gridColumn: 'span 12' }}>
          <Breadcrumbs aria-label="breadcrumb" data-testid="breadcrumbs-test">
            <ButtonNaked
              component="button"
              onClick={() => history.replace(`${BASE_ROUTE}/panoramica-iniziativa/${id}`)}
              startIcon={<ArrowBackIcon />}
              sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
              weight="default"
              data-test
            >
              {t('breadcrumbs.back')}
            </ButtonNaked>
            <Typography color="text.primary" variant="body2">
              {initiativeSel.initiativeName}
            </Typography>
            <Typography color="text.primary" variant="body2">
              {t('breadcrumbs.initiativeUsers')}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 12', mt: 2 }}>
          <TitleBox
            title={t('pages.initiativeUsers.title')}
            subTitle={t('pages.initiativeUsers.subtitle')}
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
          alignItems: 'baseline',
          gap: 2,
          mb: 4,
        }}
      >
        <FormControl sx={{ gridColumn: 'span 4' }}>
          <TextField
            label={t('pages.initiativeUsers.form.search')}
            placeholder={t('pages.initiativeUsers.form.search')}
            name="searchUser"
            aria-label="searchUser"
            role="input"
            InputLabelProps={{ required: false }}
            value={formik.values.searchUser}
            onChange={(e) => formik.handleChange(e)}
            size="small"
            data-testid="searchUser-test"
          />
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 2' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={t('pages.initiativeUsers.form.from')}
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
              label={t('pages.initiativeUsers.form.to')}
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
          <InputLabel>{t('pages.initiativeUsers.form.status')}</InputLabel>
          <Select
            id="filterStatus"
            data-testid="filterStatus-select"
            name="filterStatus"
            label={t('pages.initiativeUsers.form.status')}
            placeholder={t('pages.initiativeUsers.form.status')}
            onChange={(e) => formik.handleChange(e)}
            value={formik.values.filterStatus}
          >
            <MenuItem value="ON_EVALUATION" data-testid="filterStatusOnEvaluation-test">
              {t('pages.initiativeUsers.status.onEvaluation')}
            </MenuItem>
            <MenuItem value="ONBOARDING_OK" data-testid="filterStatusOnboardingOk-test">
              {initiativeSel.generalInfo.rankingEnabled === 'true'
                ? t('pages.initiativeUsers.status.assignee')
                : t('pages.initiativeUsers.status.onboardingOk')}
            </MenuItem>
            <MenuItem value="ELIGIBLE" data-testid="filterStatusEligible-test">
              {t('pages.initiativeUsers.status.eligible')}
            </MenuItem>
            <MenuItem value="ONBOARDING_KO" data-testid="filterStatusOnboardingKo-test">
              {t('pages.initiativeUsers.status.onboardingKo')}
            </MenuItem>
            <MenuItem value="INACTIVE" data-testid="filterStatusInactive-test">
              {t('pages.initiativeUsers.status.inactive')}
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
            {t('pages.initiativeUsers.form.filterBtn')}
          </Button>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <ButtonNaked
            component="button"
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem' }}
            onClick={resetForm}
          >
            {t('pages.initiativeUsers.form.resetFiltersBtn')}
          </ButtonNaked>
        </FormControl>
      </Box>

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
                    <TableCell width="50%">
                      {t('pages.initiativeUsers.table.beneficiary')}
                    </TableCell>
                    <TableCell width="30%">
                      {t('pages.initiativeUsers.table.updateStatusDate')}
                    </TableCell>
                    <TableCell width="15%">
                      {t('pages.initiativeUsers.table.beneficiaryState')}
                    </TableCell>
                    {/* <TableCell width="10%"></TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <ButtonNaked
                          component="button"
                          sx={{ color: 'primary.main', fontWeight: 600, fontSize: '1em' }}
                          onClick={() => console.log('handle detail')}
                        >
                          {r.beneficiary}
                        </ButtonNaked>
                      </TableCell>
                      <TableCell>{r.updateStatusDate}</TableCell>
                      <TableCell>{renderUserStatus(r.beneficiaryState, initiativeSel)}</TableCell>
                      {/* <TableCell align="right">
                        <IconButton disabled>
                          <ArrowForwardIosIcon color="primary" />
                        </IconButton>
                      </TableCell> */}
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
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[rowsPerPage]}
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
            <Typography variant="body2">{t('pages.initiativeUsers.noData')}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InitiativeUsers;
