/* eslint-disable functional/no-let */
import { useEffect, useState } from 'react';
import { matchPath } from 'react-router';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import {
  Box,
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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory } from 'react-router-dom';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { itIT } from '@mui/material/locale';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import itLocale from 'date-fns/locale/it';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { getOnboardingStatus } from '../../services/intitativeService';
import { InitiativeUserToDisplay } from '../../model/InitiativeUsers';
import { Initiative } from '../../model/Initiative';
import {
  cleanDate,
  initiativePagesFiltersFormContainerStyle,
  initiativePagesTableContainerStyle,
  initiativePagesBreadcrumbsContainerStyle,
  initiativeUsersAndRefundsValidationSchema,
} from '../../helpers';
import EmptyList from '../components/EmptyList';
import BreadcrumbsBox from '../components/BreadcrumbsBox';
import { BeneficiaryStateEnum } from '../../api/generated/initiative/StatusOnboardingDTOS';

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

  const renderUserStatus = (status: BeneficiaryStateEnum | undefined, initiative: Initiative) => {
    switch (status) {
      case BeneficiaryStateEnum.INVITED:
      case BeneficiaryStateEnum.ACCEPTED_TC:
      case BeneficiaryStateEnum.ON_EVALUATION:
        return <Chip label={t('pages.initiativeUsers.status.onEvaluation')} color="default" />;
      case BeneficiaryStateEnum.ONBOARDING_OK:
        if (initiative.generalInfo.rankingEnabled === 'true') {
          return <Chip label={t('pages.initiativeUsers.status.assignee')} color="success" />;
        } else {
          return <Chip label={t('pages.initiativeUsers.status.onboardingOk')} color="success" />;
        }
      case BeneficiaryStateEnum.ONBOARDING_KO:
        return <Chip label={t('pages.initiativeUsers.status.onboardingKo')} color="error" />;
      case BeneficiaryStateEnum.ELIGIBLE_KO:
        return <Chip label={t('pages.initiativeUsers.status.eligible')} color="warning" />;
      case BeneficiaryStateEnum.INACTIVE:
      case BeneficiaryStateEnum.UNSUBSCRIBED:
        return <Chip label={t('pages.initiativeUsers.status.inactive')} color="error" />;
      case BeneficiaryStateEnum.SUSPENDED:
        return <Chip label={t('pages.initiativeUsers.status.suspended')} color="error" />;
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

  const formik = useFormik({
    initialValues: {
      searchUser: '',
      searchFrom: null,
      searchTo: null,
      filterStatus: '',
    },
    validationSchema: initiativeUsersAndRefundsValidationSchema,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      let searchFromStr;
      let searchToStr;
      if (typeof id === 'string') {
        const filterBeneficiary =
          values.searchUser.length > 0 ? values.searchUser.toUpperCase() : undefined;
        setFilterByBeneficiary(filterBeneficiary);
        if (values.searchFrom) {
          const searchFrom = values.searchFrom as unknown as Date;
          searchFromStr = cleanDate(searchFrom, 'start');
          setFilterByDateFrom(searchFromStr);
        }
        if (values.searchTo) {
          const searchTo = values.searchTo as unknown as Date;
          searchToStr = cleanDate(searchTo, 'end');
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
    setRows([]);
    if (typeof id === 'string') {
      getTableData(id, 0, undefined, undefined, undefined, undefined);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof id === 'string') {
      getTableData(id, page, filterByBeneficiary, filterByDateFrom, filterByDateTo, filterByStatus);
    }
  }, [id, page]);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Box sx={initiativePagesBreadcrumbsContainerStyle}>
        <BreadcrumbsBox
          backUrl={`${BASE_ROUTE}/panoramica-iniziativa/${id}`}
          backLabel={t('breadcrumbs.back')}
          items={[
            initiativeSel.initiativeName,
            initiativeSel.generalInfo.rankingEnabled === 'true'
              ? t('breadcrumbs.initiativeUsersRanking')
              : t('breadcrumbs.initiativeUsers'),
          ]}
        />

        <Box sx={{ display: 'grid', gridColumn: 'span 12', mt: 2 }}>
          <TitleBox
            title={
              initiativeSel.generalInfo.rankingEnabled === 'true'
                ? t('pages.initiativeUsers.titleRanking')
                : t('pages.initiativeUsers.title')
            }
            subTitle={t('pages.initiativeUsers.subtitle')}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
      </Box>

      <Box sx={initiativePagesFiltersFormContainerStyle}>
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
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={itLocale}>
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
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={itLocale}>
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
            inputProps={{
              'data-testid': 'filterStatus-select',
            }}
            name="filterStatus"
            label={t('pages.initiativeUsers.form.status')}
            placeholder={t('pages.initiativeUsers.form.status')}
            onChange={(e) => formik.handleChange(e)}
            value={formik.values.filterStatus}
          >
            <MenuItem
              value={BeneficiaryStateEnum.ON_EVALUATION}
              data-testid="filterStatusOnEvaluation-test"
            >
              {t('pages.initiativeUsers.status.onEvaluation')}
            </MenuItem>
            <MenuItem
              value={BeneficiaryStateEnum.ONBOARDING_OK}
              data-testid="filterStatusOnboardingOk-test"
            >
              {initiativeSel.generalInfo.rankingEnabled === 'true'
                ? t('pages.initiativeUsers.status.assignee')
                : t('pages.initiativeUsers.status.onboardingOk')}
            </MenuItem>
            <MenuItem
              value={BeneficiaryStateEnum.ELIGIBLE_KO}
              data-testid="filterStatusEligible-test"
            >
              {t('pages.initiativeUsers.status.eligible')}
            </MenuItem>
            <MenuItem
              value={BeneficiaryStateEnum.ONBOARDING_KO}
              data-testid="filterStatusOnboardingKo-test"
            >
              {t('pages.initiativeUsers.status.onboardingKo')}
            </MenuItem>
            <MenuItem value={BeneficiaryStateEnum.INACTIVE} data-testid="filterStatusInactive-test">
              {t('pages.initiativeUsers.status.inactive')}
            </MenuItem>
            <MenuItem
              value={BeneficiaryStateEnum.SUSPENDED}
              data-testid="filterStatusSuspended-test"
            >
              {t('pages.initiativeUsers.status.suspended')}
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
        <Box sx={initiativePagesTableContainerStyle}>
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
                          sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            fontSize: '1em',
                            textAlign: 'left',
                          }}
                          onClick={() =>
                            history.replace(
                              `${BASE_ROUTE}/dettagli-utente/${id}/${r.beneficiary}`
                            )
                          }
                          data-testid="beneficiary-test"
                        >
                          {r.beneficiary}
                        </ButtonNaked>
                      </TableCell>
                      <TableCell>{r.updateStatusDate}</TableCell>
                      <TableCell>{renderUserStatus(r.beneficiaryState, initiativeSel)}</TableCell>
                      {/*
                       <TableCell align="right">
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
        <EmptyList message={t('pages.initiativeUsers.noData')} />
      )}
    </Box>
  );
};

export default InitiativeUsers;
