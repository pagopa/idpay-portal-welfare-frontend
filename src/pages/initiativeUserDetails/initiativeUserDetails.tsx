/* eslint-disable functional/no-let */
import {
  Alert,
  Button,
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
  Snackbar,
  Chip,
} from '@mui/material';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { matchPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { itIT } from '@mui/material/locale';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import itLocale from 'date-fns/locale/it';
import { useFormik } from 'formik';
import ROUTES, { BASE_ROUTE } from '../../routes';
import {
  cleanDate,
  formatedCurrency,
  formatedTimeLineCurrency,
  formatStringToDate,
  getTimeLineMaskedPan,
  initiativeUsersAndRefundsValidationSchema,
  initiativePagesFiltersFormContainerStyle,
  initiativePagesTableContainerStyle,
  initiativePagesBreadcrumbsContainerStyle,
} from '../../helpers';
import {
  getInstrumentList,
  getWalletDetail,
  getIban,
  getTimeLine,
  getBeneficiaryOnboardingStatus,
} from '../../services/intitativeService';
import { StatusEnum } from '../../api/generated/initiative/WalletDTO';
import { StatusEnum as OnboardingStatusEnum } from '../../api/generated/initiative/OnboardingStatusDTO';
import { InstrumentDTO } from '../../api/generated/initiative/InstrumentDTO';
import { OperationDTO } from '../../api/generated/initiative/OperationDTO';
import InitiativeRefundsDetailsModal from '../initiativeRefundsDetails/initiativeRefundsDetailsModal';
import EmptyList from '../components/EmptyList';
import BreadcrumbsBox from '../components/BreadcrumbsBox';
import UserDetailsSummary from './components/UserDetailsSummary';
import TransactionDetailModal from './TransactionDetailModal';
import SuspensionModal from './SuspensionModal';

// eslint-disable-next-line sonarjs/cognitive-complexity
const InitiativeUserDetails = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [accrued, setAccrued] = useState<number | undefined>(undefined);
  const [refunded, setRefunded] = useState<number | undefined>(undefined);
  const [iban, setIban] = useState<string | undefined>(undefined);
  const [walletStatus, setWalletStatus] = useState<StatusEnum | undefined>(undefined);
  const [lastCounterUpdate, setLastCounterUpdate] = useState<Date | undefined>(undefined);
  const [holderBank, setHolderBank] = useState<string | undefined>(undefined);
  const [checkIbanResponseDate, setCheckIbanResponseDate] = useState<Date | undefined>(undefined);
  const [channel, setChannel] = useState<string | undefined>(undefined);
  const [paymentMethodList, setPaymentMethodList] = useState<Array<InstrumentDTO>>([]);
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
  const [openSnackBarOnBoardingStatus, setOpenSnackBarOnBoardingStatus] = useState(false);
  const [statusOnb, setStatusOnb] = useState<OnboardingStatusEnum | undefined>();
  const [suspensionModalOpen, setSuspensionModalOpen] = useState(false);
  const [buttonType, setButtonType] = useState<string>('');
  // const [openSnackBar, setOpenSnackBar] = useState(false);
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

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof id === 'string' && typeof cf === 'string') {
      getBeneficiaryOnboardingStatus(id, cf)
        .then((res) => {
          // console.log(res);
          setStatusOnb(res.status);
          // setStatusOnb(OnboardingStatusEnum.SUSPENDED);
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

  useEffect(() => {
    if (
      typeof id === 'string' &&
      typeof cf === 'string' &&
      (statusOnb === OnboardingStatusEnum.ONBOARDING_OK ||
        statusOnb === OnboardingStatusEnum.UNSUBSCRIBED ||
        statusOnb === OnboardingStatusEnum.SUSPENDED)
    ) {
      getWalletDetail(id, cf)
        .then((res) => {
          setAmount(res.amount);
          setAccrued(res.accrued);
          setRefunded(res.refunded);
          if (typeof res.lastCounterUpdate === 'object') {
            setLastCounterUpdate(res.lastCounterUpdate);
          }
          setIban(res.iban);
          setWalletStatus(res.status);
        })
        .catch((error) =>
          addError({
            id: 'GET_WALLET_INFO',
            blocking: false,
            error,
            techDescription: 'An error occurred getting wallet info',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          })
        );
    }
    HandleOpenSnackBarOnBoardingStatus();
  }, [id, cf, statusOnb]);

  useEffect(() => {
    if (
      typeof id === 'string' &&
      typeof cf === 'string' &&
      (statusOnb === OnboardingStatusEnum.ONBOARDING_OK ||
        statusOnb === OnboardingStatusEnum.UNSUBSCRIBED ||
        statusOnb === OnboardingStatusEnum.SUSPENDED)
    ) {
      getInstrumentList(id, cf)
        .then((res) => {
          const walletInst = res.instrumentList.filter((r) => r.status === 'ACTIVE');
          setPaymentMethodList([...walletInst]);
        })
        .catch((error) =>
          addError({
            id: 'GET_WALLET_INSTRUMENT',
            blocking: false,
            error,
            techDescription: 'An error occurred getting wallet instrument',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          })
        );
    }
  }, [id, cf, statusOnb]);

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

  const formatDate = (date: Date | undefined) => {
    if (date) {
      return date.toLocaleString('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/Rome',
        hour: 'numeric',
        minute: 'numeric',
      });
    }

    return '';
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
      default:
        return null;
    }
  };

  useEffect(() => {
    if (typeof iban === 'string') {
      getIban(id, cf, iban)
        .then((res) => {
          if (typeof res.iban === 'string') {
            setIban(iban);
          }
          if (typeof res.holderBank === 'string') {
            setHolderBank(res.holderBank);
          }
          if (typeof res.checkIbanResponseDate === 'object') {
            setCheckIbanResponseDate(res.checkIbanResponseDate);
          }
          if (typeof res.channel === 'string') {
            setChannel(res.channel);
          }
        })
        .catch((error) => {
          addError({
            id: 'GET_WALLET_INFO',
            blocking: false,
            error,
            techDescription: 'An error occurred getting wallet info',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
        });
    }
  }, [iban]);

  const HandleOpenSnackBarOnBoardingStatus = () => {
    setOpenSnackBarOnBoardingStatus(true);
  };

  const HandleCloseSnackBarOnBoardingStatus = () => {
    setOpenSnackBarOnBoardingStatus(false);
  };

  const renderUserStatusAlert = (status: OnboardingStatusEnum | undefined) => {
    switch (status) {
      case OnboardingStatusEnum.ONBOARDING_KO:
        return (
          <>
            <Snackbar
              open={openSnackBarOnBoardingStatus}
              onClose={() => HandleCloseSnackBarOnBoardingStatus()}
              autoHideDuration={4000}
              sx={{
                position: 'initial',
                justifyContent: 'center',
                gridColumn: 'span 24',
                zIndex: 0,
                mt: 5,
              }}
              data-testid="onboarding-ko-snackbar-test"
            >
              <Alert
                variant="outlined"
                severity="error"
                sx={{ gridColumn: 'span 24', width: '100%' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t('pages.initiativeUserDetails.onboardingKo')}
                </Typography>
                <Typography variant="body2">
                  {t('pages.initiativeUserDetails.onboardingKoDescription')}
                </Typography>
              </Alert>
            </Snackbar>
          </>
        );
      case OnboardingStatusEnum.ELIGIBLE_KO:
        return (
          <>
            <Snackbar
              open={openSnackBarOnBoardingStatus}
              onClose={() => HandleCloseSnackBarOnBoardingStatus()}
              autoHideDuration={4000}
              sx={{
                position: 'initial',
                justifyContent: 'center',
                gridColumn: 'span 24',
                zIndex: 0,
                mt: 5,
              }}
              data-testid="eligible-ko-snackbar-test"
            >
              <Alert
                variant="outlined"
                severity="warning"
                sx={{ gridColumn: 'span 24', width: '100%' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t('pages.initiativeUserDetails.eligibleKo')}
                </Typography>
                <Typography variant="body2">
                  {t('pages.initiativeUserDetails.eligibleKoDescription')}
                </Typography>
              </Alert>
            </Snackbar>
          </>
        );
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
            gridColumn: 'span 4',
            width: '100%',
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'grid', gridColumn: 'span 9' }}>
            <TitleBox
              title={cf?.toUpperCase()}
              subTitle={''}
              mtTitle={0}
              mbTitle={0}
              variantTitle="h4"
              variantSubTitle="body1"
            />
          </Box>
          <Box sx={{ display: 'grid', gridColumn: 'span 3' }}>
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
          <Box sx={{ display: 'grid', gridColumn: 'span 8', justifyContent: 'end' }}>
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
          <Box sx={{ display: 'flex', gridColumn: 'span 8', justifyContent: 'end', gap: 1 }}>
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
        <Box sx={{ gridColumn: 'span 24' }}>{renderUserStatusAlert(statusOnb)}</Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 5,
        }}
      >
        <Box sx={{ display: 'inline-flex', gridColumn: 'span 6' }}>
          <Typography variant="h6">{t('pages.initiativeUserDetails.initiativeState')}</Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 6', display: 'inline-flex', justifyContent: 'end' }}>
          <Typography variant="body2" color="text.secondary" sx={{ pr: 1 }}>
            {t('pages.initiativeUserDetails.updatedOn')}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatDate(lastCounterUpdate)}
          </Typography>
        </Box>
      </Box>

      <UserDetailsSummary
        amount={amount}
        refunded={refunded}
        accrued={accrued}
        walletStatus={walletStatus}
        paymentMethodList={paymentMethodList}
        iban={iban}
        holderBank={holderBank}
        checkIbanResponseDate={checkIbanResponseDate}
        channel={channel}
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
                buttonType={buttonType}
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
