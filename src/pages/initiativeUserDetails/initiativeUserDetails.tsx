/* eslint-disable functional/no-let */
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import {
  Button,
  Chip,
  FormControl,
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
import { itIT } from '@mui/material/locale';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import itLocale from 'date-fns/locale/it';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath } from 'react-router-dom';
import { StatusEnum as OnboardingStatusEnum } from '../../api/generated/initiative/OnboardingStatusDTO';
import { OperationDTO } from '../../api/generated/initiative/OperationDTO';
import {
  cleanDate,
  formatStringToDate,
  formatedCurrency,
  formatedTimeLineCurrency,
  getTimeLineMaskedPan,
  initiativePagesBreadcrumbsContainerStyle,
  initiativePagesFiltersFormContainerStyle,
  initiativePagesTableContainerStyle,
  initiativeUsersAndRefundsValidationSchema,
} from '../../helpers';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { getBeneficiaryOnboardingStatus, getTimeLine } from '../../services/intitativeService';
import BreadcrumbsBox from '../components/BreadcrumbsBox';
import EmptyList from '../components/EmptyList';
import InitiativeRefundsDetailsModal from '../initiativeRefundsDetails/initiativeRefundsDetailsModal';
import { useInitiative } from '../../hooks/useInitiative';
import SuspensionModal from './SuspensionModal';
import TransactionDetailModal from './TransactionDetailModal';
import UserDetailsSummary from './components/UserDetailsSummary';

// eslint-disable-next-line sonarjs/cognitive-complexity
const InitiativeUserDetails = () => {
  const { t } = useTranslation();

  const [rows, setRows] = useState<Array<any>>([]);
  const [filterByDateFrom, setFilterByDateFrom] = useState<string | undefined>();
  const [filterByDateTo, setFilterByDateTo] = useState<string | undefined>();
  const [filterByEvent, setFilterByEvent] = useState<string | undefined>();
  const [openRefundDetailModal, setOpenRefundDetailModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOperationId, setSelectedOperationId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [statusOnb, setStatusOnb] = useState<OnboardingStatusEnum | undefined>();
  const [suspensionModalOpen, setSuspensionModalOpen] = useState(false);
  const [buttonType, setButtonType] = useState<string>('');
  const [holderBank, setHolderBank] = useState<string | undefined>(undefined);
  const setLoading = useLoading('GET_INITIATIVE_USER_DETAILS');
  const addError = useErrorDispatcher();
  const theme = createTheme(itIT);

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_USER_DETAILS],
    exact: true,
    strict: false,
  });

  interface MatchParams {
    id: string;
    cf: string;
  }

  const { id, cf } = (match?.params as MatchParams) || {};

  useInitiative();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof id === 'string' && typeof cf === 'string') {
      getBeneficiaryOnboardingStatus(id, cf)
        .then((res) => {
          setStatusOnb(res.status);
        })
        .catch((error) => {
          addError({
            id: 'GET_BENEFICARY_STATUS',
            blocking: false,
            error,
            techDescription: 'An error occurred getting beneficary status',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
        });
    }
  }, [id, cf]);

  const getTableData = (
    cf: string,
    initiativeId: string,
    filterEvent: string | undefined,
    searchFrom: string | undefined,
    searchTo: string | undefined,
    page: number
  ) => {
    setLoading(true);
    getTimeLine(cf, initiativeId, filterEvent, searchFrom, searchTo, page)
      .then((res) => {
        const rowsData: Array<any> = res.operationList.map((r: any) => r);
        if (Array.isArray(rowsData) && rowsData.length > 0) {
          setRows(rowsData);
        } else {
          setRows([]);
        }
        if (typeof res.pageNo === 'number') {
          setPage(res.pageNo);
        }
        if (typeof res.pageSize === 'number') {
          setRowsPerPage(res.pageSize);
        }
        if (typeof res.totalElements === 'number') {
          setTotalElements(res.totalElements);
        }
      })
      .catch((error) => {
        setRows([]);
        addError({
          id: 'GET_INITIATIVE_USER_DETAILS_OPERATION_LIST',
          blocking: false,
          error,
          techDescription: 'An error occurred getting initiative user details operation list',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      })
      .finally(() => setLoading(false));
  };

  const formik = useFormik({
    initialValues: {
      searchFrom: null,
      searchTo: null,
      filterEvent: '',
    },
    validationSchema: initiativeUsersAndRefundsValidationSchema,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      let searchFromStr;
      let searchToStr;
      if (
        typeof id === 'string' &&
        typeof cf === 'string' &&
        (statusOnb === OnboardingStatusEnum.ONBOARDING_OK ||
          statusOnb === OnboardingStatusEnum.UNSUBSCRIBED ||
          statusOnb === OnboardingStatusEnum.SUSPENDED)
      ) {
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
        const filterEvent = values.filterEvent.length > 0 ? values.filterEvent : undefined;
        setFilterByEvent(filterEvent);
        getTableData(cf, id, filterEvent, searchFromStr, searchToStr, 0);
      }
    },
  });

  const resetForm = () => {
    const initialValues = { searchUser: '', searchFrom: null, searchTo: null, filterEvent: '' };
    formik.resetForm({ values: initialValues });
    setFilterByDateFrom(undefined);
    setFilterByDateTo(undefined);
    setFilterByEvent(undefined);
    setRows([]);
    if (
      typeof id === 'string' &&
      typeof cf === 'string' &&
      (statusOnb === OnboardingStatusEnum.ONBOARDING_OK ||
        statusOnb === OnboardingStatusEnum.UNSUBSCRIBED ||
        statusOnb === OnboardingStatusEnum.SUSPENDED)
    ) {
      getTableData(cf, id, undefined, undefined, undefined, 0);
    }
  };

  const handleOpenModal = (id: string) => {
    setOpenModal(true);
    setSelectedOperationId(id);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenRefundDetailModal = (eventId: string) => {
    setOpenRefundDetailModal(true);
    setSelectedEventId(eventId);
  };

  const handleCloseRefundDetailModal = () => {
    setOpenRefundDetailModal(false);
  };

  const handleOpenModalOnOpeType = (
    opeType: string,
    opeId: string,
    eventId: string | undefined
  ) => {
    if (opeType !== 'PAID_REFUND' && opeType !== 'REJECTED_REFUND') {
      handleOpenModal(opeId);
    } else if (
      (opeType === 'PAID_REFUND' || opeType === 'REJECTED_REFUND') &&
      typeof eventId === 'string'
    ) {
      handleOpenRefundDetailModal(eventId);
    }
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const operationTypeLabel = (id: string, opeType: string, event: OperationDTO) => {
    switch (opeType) {
      case 'ADD_IBAN':
        return t('pages.initiativeUserDetails.operationTypes.addIban');
      case 'ADD_INSTRUMENT':
        return `${t(
          'pages.initiativeUserDetails.operationTypes.addInstrument'
        )} ${getTimeLineMaskedPan(id, event.maskedPan)}`;
      case 'DELETE_INSTRUMENT':
        return `${t(
          'pages.initiativeUserDetails.operationTypes.deleteInstrument'
        )} ${getTimeLineMaskedPan(id, event.maskedPan)}`;
      case 'ONBOARDING':
        return t('pages.initiativeUserDetails.operationTypes.onboarding');
      case 'PAID_REFUND':
        return `${t(
          'pages.initiativeUserDetails.operationTypes.paidRefund'
        )} di ${formatedTimeLineCurrency(id, event.amount)}`;
      case 'REJECTED_ADD_INSTRUMENT':
        return t('pages.initiativeUserDetails.operationTypes.rejectedAddInstrument');
      case 'REJECTED_DELETE_INSTRUMENT':
      case 'DELETE_INSTRUMENT_KO':
        return t('pages.initiativeUserDetails.operationTypes.rejectedDeleteInstrument');
      case 'REJECTED_REFUND':
        return t('pages.initiativeUserDetails.operationTypes.rejectedRefund');
      case 'REVERSAL':
        return t('pages.initiativeUserDetails.operationTypes.reversal');
      case 'TRANSACTION':
        return t('pages.initiativeUserDetails.operationTypes.transaction');
      case 'SUSPENDED':
        return t('pages.initiativeUserDetails.operationTypes.suspended');
      default:
        return null;
    }
  };

  useEffect(() => {
    if (
      typeof id === 'string' &&
      typeof cf === 'string' &&
      (statusOnb === OnboardingStatusEnum.ONBOARDING_OK ||
        statusOnb === OnboardingStatusEnum.UNSUBSCRIBED ||
        statusOnb === OnboardingStatusEnum.SUSPENDED)
    ) {
      getTableData(cf, id, filterByEvent, filterByDateFrom, filterByDateTo, page);
    }
  }, [id, cf, page, statusOnb]);

  const handleSuspension = (buttonType: string) => {
    setSuspensionModalOpen(true);
    setButtonType(buttonType);
  };

  const renderNonClicableEvents = (opeType: string | undefined) => {
    switch (opeType) {
      case 'SUSPENDED':
        return (
          <Typography
            sx={{
              color: 'error.main',
              fontWeight: 600,
              fontSize: '1em',
              textAlign: 'left',
            }}
          >
            {t('pages.initiativeUserDetails.operationTypes.suspended')}
          </Typography>
        );
      case 'READMITTED':
        return (
          <Typography
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '1em',
              textAlign: 'left',
            }}
          >
            {t('pages.initiativeUserDetails.operationTypes.readmitted')}
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={initiativePagesBreadcrumbsContainerStyle}>
        <BreadcrumbsBox
          backUrl={`${BASE_ROUTE}/utenti-iniziativa/${id}`}
          backLabel={t('breadcrumbs.back')}
          items={[t('breadcrumbs.initiativeUsers'), cf?.toUpperCase()]}
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
          mt: 3,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridColumn: 'span 8',
            width: '100%',
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'grid', gridColumn: 'span 6' }}>
            <TitleBox
              title={cf?.toUpperCase()}
              subTitle={''}
              mtTitle={0}
              mbTitle={0}
              variantTitle="h4"
              variantSubTitle="body1"
            />
          </Box>
          <Box sx={{ display: 'grid', gridColumn: 'span 2' }}>
            {statusOnb === OnboardingStatusEnum.SUSPENDED && (
              <Chip
                label={t('pages.initiativeUserDetails.suspended')}
                sx={{ fontSize: '14px' }}
                color="warning"
                size="small"
              />
            )}
          </Box>
        </Box>

        {statusOnb === OnboardingStatusEnum.ONBOARDING_OK && (
          <Box sx={{ display: 'grid', gridColumn: 'span 4', justifyContent: 'end' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleSuspension('SUSPEND')}
              data-testid="suspended"
              color="error"
            >
              {t('pages.initiativeUserDetails.suspendUser')}
            </Button>
          </Box>
        )}

        {statusOnb === OnboardingStatusEnum.SUSPENDED && (
          <Box sx={{ display: 'flex', gridColumn: 'span 4', justifyContent: 'end', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleSuspension('READMIT')}
              data-testid="readmit"
            >
              {t('pages.initiativeUserDetails.readmit')}
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleSuspension('EXCLUDE')}
              data-testid="exclude-forever"
              color="error"
              disabled
            >
              {t('pages.initiativeUserDetails.excludeForever')}
            </Button>
          </Box>
        )}
        {/* <Box sx={{ display: 'grid', gridColumn: 'span 3' }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenSnackBar(true)}
            data-testid="download-csv-test"
          >
            {t('pages.initiativeUserDetails.downloadCsvBtn')}
          </Button>

          <Snackbar
            sx={{ pb: 2 }}
            open={openSnackBar}
            onClose={() => setOpenSnackBar(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            autoHideDuration={3000}
            data-testid="snack-bar-test"
          >
            <Alert severity="success" elevation={6} variant="outlined">
              {t('pages.initiativeUserDetails.downloadCsv')}
            </Alert>
          </Snackbar>
        </Box> */}
      </Box>

      <UserDetailsSummary
        id={id}
        cf={cf}
        statusOnb={statusOnb}
        holderBank={holderBank}
        setHolderBank={setHolderBank}
      />

      <Box sx={{ display: 'inline-flex', mt: 5, mb: 3 }}>
        <Typography variant="h6">{t('pages.initiativeUserDetails.historyState')}</Typography>
      </Box>

      <Box sx={initiativePagesFiltersFormContainerStyle}>
        <FormControl sx={{ gridColumn: 'span 6' }} size="small">
          <InputLabel>{t('pages.initiativeUserDetails.filterEvent')}</InputLabel>
          <Select
            id="filterEvent"
            inputProps={{
              'data-testid': 'filterEvent-select',
            }}
            name="filterEvent"
            label={t('pages.initiativeUserDetails.filterEvent')}
            placeholder={t('pages.initiativeUserDetails.filterEvent')}
            onChange={(e) => formik.handleChange(e)}
            value={formik.values.filterEvent}
          >
            <MenuItem value={'ONBOARDING'}>
              {t('pages.initiativeUserDetails.operationTypes.onboarding')}
            </MenuItem>
            <MenuItem value={'ADD_IBAN'}>
              {t('pages.initiativeUserDetails.operationTypes.addIban')}
            </MenuItem>
            <MenuItem value={'ADD_INSTRUMENT'}>
              {t('pages.initiativeUserDetails.operationTypes.addInstrument')}
            </MenuItem>
            <MenuItem value={'DELETE_INSTRUMENT'}>
              {t('pages.initiativeUserDetails.operationTypes.deleteInstrument')}
            </MenuItem>
            <MenuItem value={'REJECTED_ADD_INSTRUMENT'}>
              {t('pages.initiativeUserDetails.operationTypes.rejectedAddInstrument')}
            </MenuItem>
            <MenuItem value={'REJECTED_DELETE_INSTRUMENT'}>
              {t('pages.initiativeUserDetails.operationTypes.rejectedDeleteInstrument')}
            </MenuItem>
            <MenuItem value={'REJECTED_REFUND'}>
              {t('pages.initiativeUserDetails.operationTypes.rejectedRefund')}
            </MenuItem>
            <MenuItem value={'TRANSACTION'}>
              {t('pages.initiativeUserDetails.operationTypes.transaction')}
            </MenuItem>
            <MenuItem value={'PAID_REFUND'}>
              {t('pages.initiativeUserDetails.operationTypes.paidRefund')}
            </MenuItem>
            <MenuItem value={'REVERSAL'}>
              {t('pages.initiativeUserDetails.operationTypes.reversal')}
            </MenuItem>
          </Select>
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
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <Button
            sx={{ height: '44.5px' }}
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
        <Box sx={{ ...initiativePagesTableContainerStyle, height: 'auto' }}>
          <Box sx={{ display: 'grid', gridColumn: 'span 12', height: '100%' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="17.5%">
                      {t('pages.initiativeUserDetails.table.dateAndHour')}
                    </TableCell>
                    <TableCell width="57.5%">
                      {t('pages.initiativeUserDetails.table.event')}
                    </TableCell>
                    <TableCell width="10%">
                      {t('pages.initiativeUserDetails.table.totExpense')}
                    </TableCell>
                    <TableCell width="15%">
                      {t('pages.initiativeUserDetails.table.toRefund')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rows.map((r) => (
                    <TableRow key={r.operationId}>
                      <TableCell sx={{ textAlign: 'left' }}>
                        {/* {r.operationDate?.toLocaleString('fr-BE').slice(0, 16)} */}
                        {formatStringToDate(r.operationDate)}
                      </TableCell>
                      <TableCell>
                        {r.operationType === 'SUSPENDED' || r.operationType === 'READMITTED' ? (
                          renderNonClicableEvents(r.operationType)
                        ) : (
                          <ButtonNaked
                            data-testid="operationTypeBtn"
                            component="button"
                            sx={{
                              color: 'primary.main',
                              fontWeight: 600,
                              fontSize: '1em',
                              textAlign: 'left',
                            }}
                            onClick={() => {
                              handleOpenModalOnOpeType(r.operationType, r.operationId, r.eventId);
                            }}
                          >
                            {operationTypeLabel(r.operationId, r.operationType, r)}
                          </ButtonNaked>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'left' }}>
                        {r.operationType === 'PAID_REFUND' || r.operationType === 'REJECTED_REFUND'
                          ? '-'
                          : formatedCurrency(r.amount)}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'left' }}>
                        {r.operationType === 'PAID_REFUND' || r.operationType === 'REJECTED_REFUND'
                          ? '-'
                          : formatedCurrency(r.accrued)}
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
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[rowsPerPage]}
                />
              </ThemeProvider>
              <TransactionDetailModal
                fiscalCode={cf}
                operationId={selectedOperationId}
                openModal={openModal}
                handleCloseModal={handleCloseModal}
                initiativeId={id}
                holderBank={holderBank}
              />
              <InitiativeRefundsDetailsModal
                openRefundsDetailModal={openRefundDetailModal}
                handleCloseRefundModal={handleCloseRefundDetailModal}
                refundEventId={selectedEventId}
                initiativeId={id}
              />
              <SuspensionModal
                suspensionModalOpen={suspensionModalOpen}
                setSuspensionModalOpen={setSuspensionModalOpen}
                statusOnb={statusOnb}
                setStatusOnb={setStatusOnb}
                buttonType={buttonType}
                id={id}
                cf={cf}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <EmptyList message={t('pages.initiativeUserDetails.noData')} />
      )}
    </Box>
  );
};

export default InitiativeUserDetails;
