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
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
import { InitiativeUserToDisplay } from '../../services/__mocks__/initiativeUsersService';
import { getOnboardingStatus } from '../../services/intitativeService';

// import { getGroupOfBeneficiaryStatusAndDetail } from '../../services/groupsService';

// interface MatchParams {
//   id: string;
// }

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
  // const [availableStatusOptions, setAvailableStatusOptions] = useState<
  //   Array<{ value: string; label: string }>
  // >([]);
  const setLoading = useLoading('GET_INITIATIVE_USERS');
  const addError = useErrorDispatcher();

  const theme = createTheme(itIT);

  // const columns = [
  //   { field: 'id', hide: true },
  //   { field: 'beneficiary', headerName: 'Beneficiario', width: 700 },
  //   { field: 'updateStatusDate', headerName: 'Data e ora', width: 300 },
  //   { field: 'beneficiaryState', headerName: 'Stato', width: 150 },
  // ];

  //
  // useEffect(() => {
  //   // eslint-disable-next-line no-prototype-builtins
  //   if (match !== null && match.params.hasOwnProperty('id')) {
  //     const { id } = match.params as MatchParams;
  //     if (
  //       initiativeSel.generalInfo.beneficiaryKnown === 'true' &&
  //       initiativeSel.initiativeId === id &&
  //       initiativeSel.status !== 'DRAFT'
  //     ) {
  //       getGroupOfBeneficiaryStatusAndDetail(initiativeSel.initiativeId)
  //         .then((res) => {
  //           console.log(res);
  //         })
  //         .catch((error) => {
  //           addError({
  //             id: 'GET_UPLOADED_FILE_DATA_ERROR',
  //             blocking: false,
  //             error,
  //             techDescription: 'An error occurred getting groups file info',
  //             displayableTitle: t('errors.title'),
  //             displayableDescription: t('errors.getFileDataDescription'),
  //             toNotify: true,
  //             component: 'Toast',
  //             showCloseIcon: true,
  //           });
  //         });
  //     }
  //   }
  // }, [
  //   JSON.stringify(match),
  //   initiativeSel.initiativeId,
  //   JSON.stringify(initiativeSel.generalInfo),
  // ]);

  // const setAcceptedStatusList = (data: any) => {
  //   const options = [
  //     ...new Set(data.map((item: { beneficiaryState: string }) => item.beneficiaryState)),
  //   ];

  //   const optionsList = options.map((o) => {
  //     switch (o) {
  //       case 'ACCEPTED_TC':
  //         return { value: o, label: t('pages.initiativeUsers.status.acceptedTc') };
  //       case 'INACTIVE':
  //         return { value: o, label: t('pages.initiativeUsers.status.inactive') };
  //       case 'ON_EVALUATION':
  //         return { value: o, label: t('pages.initiativeUsers.status.onEvaluation') };
  //       case 'INVITED':
  //         return { value: o, label: t('pages.initiativeUsers.status.invited') };
  //       case 'ONBOARDING_OK':
  //         return { value: o, label: t('pages.initiativeUsers.status.onboardingOk') };
  //       default:
  //         return { value: '', label: '' };
  //     }
  //   });
  //   setAvailableStatusOptions([...optionsList]);
  // };

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
        // if (Array.isArray(res.content)) {
        //   setAcceptedStatusList(res.content);
        // }
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

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof initiativeSel.initiativeId === 'string') {
      getTableData(
        initiativeSel.initiativeId,
        page,
        filterByBeneficiary,
        filterByDateFrom,
        filterByDateTo,
        filterByStatus
      );
    }
  }, [JSON.stringify(match), initiativeSel.initiativeId, page]);

  const renderUserStatus = (status: string | undefined) => {
    switch (status) {
      case 'ACCEPTED_TC':
        return <Chip label={t('pages.initiativeUsers.status.acceptedTc')} color="default" />;
      case 'INACTIVE':
        return <Chip label={t('pages.initiativeUsers.status.inactive')} color="error" />;
      case 'ON_EVALUATION':
        return <Chip label={t('pages.initiativeUsers.status.onEvaluation')} color="default" />;
      case 'INVITED':
        return <Chip label={t('pages.initiativeUsers.status.invited')} color="warning" />;
      case 'ONBOARDING_OK':
        return <Chip label={t('pages.initiativeUsers.status.onboardingOk')} color="success" />;
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
      if (typeof initiativeSel.initiativeId === 'string') {
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
        getTableData(
          initiativeSel.initiativeId,
          0,
          filterBeneficiary,
          searchFromStr,
          searchToStr,
          filterStatus
        );
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
    if (typeof initiativeSel.initiativeId === 'string') {
      getTableData(initiativeSel.initiativeId, 0, undefined, undefined, undefined, undefined);
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
          <Breadcrumbs aria-label="breadcrumb">
            <ButtonNaked
              component="button"
              onClick={() =>
                history.replace(`${BASE_ROUTE}/panoramica-iniziativa/${initiativeSel.initiativeId}`)
              }
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
            <MenuItem value="ACCEPTED_TC" data-testid="filterStatusAcceptedTc-test">
              {t('pages.initiativeUsers.status.acceptedTc')}
            </MenuItem>
            <MenuItem value="INACTIVE" data-testid="filterStatusInactive-test">
              {t('pages.initiativeUsers.status.inactive')}
            </MenuItem>
            <MenuItem value="ON_EVALUATION" data-testid="filterStatusOnEvaluation-test">
              {t('pages.initiativeUsers.status.onEvaluation')}
            </MenuItem>
            <MenuItem value="INVITED" data-testid="filterStatusInvited-test">
              {t('pages.initiativeUsers.status.invited')}
            </MenuItem>
            <MenuItem value="ONBOARDING_OK" data-testid="filterStatusOnboardingOk-test">
              {t('pages.initiativeUsers.status.onboardingOk')}
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
                    <TableCell width="40%">
                      {t('pages.initiativeUsers.table.updateStatusDate')}
                    </TableCell>
                    <TableCell width="10%">
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
                      <TableCell>{renderUserStatus(r.beneficiaryState)}</TableCell>
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
