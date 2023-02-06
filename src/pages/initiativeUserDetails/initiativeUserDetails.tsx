/* eslint-disable functional/no-let */
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Box /* , ThemeProvider  */ } from '@mui/system';
import { ButtonNaked /* , theme */ } from '@pagopa/mui-italia';
import { matchPath, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import itLocale from 'date-fns/locale/it';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { parse } from 'date-fns';
import ROUTES, { BASE_ROUTE } from '../../routes';
import {
  getIban,
  getTimeLine,
  getWalletInfo,
  getWalletInstrumen,
} from '../../services/__mocks__/initiativeService';
import {
  MockedInstrumentDTO,
  MockedStatusWallet,
  MockedOperation,
  MockedOperationType,
} from '../../model/Initiative';
import TransactionDetailModal from './TransactionDetailModal';
import PaymentMethodsModal from './PaymentMethodsModal';

// eslint-disable-next-line sonarjs/cognitive-complexity
const InitiativeUserDetails = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [amount, setAmount] = useState(0);
  const [accrued, setAccrued] = useState(0);
  const [refunded, setRefunded] = useState(0);
  const [iban, setIban] = useState<string | undefined>(undefined);
  const [walletStatus, setWalletStatus] = useState<MockedStatusWallet | undefined>(undefined);
  const [lastCounterUpdate, setLastCounterUpdate] = useState<Date | undefined>(undefined);
  const [holderBank, setHolderBank] = useState('');
  const [checkIbanResponseDate, setCheckIbanResponseDate] = useState<Date | undefined>(undefined);
  const [channel, setChannel] = useState<string | undefined>(undefined);
  const [paymentMethodList, setPaymentMethodList] = useState<Array<MockedInstrumentDTO>>([]);
  const [rows, setRows] = useState<Array<MockedOperation>>([]);
  const [filterByDateFrom, setFilterByDateFrom] = useState<string | undefined>();
  const [filterByDateTo, setFilterByDateTo] = useState<string | undefined>();
  const [filterByEvent, setFilterByEvent] = useState<string | undefined>();
  const [openModal, setOpenModal] = useState(false);
  const [openPaymentMethodModal, setOpenPaymentMethodModal] = useState(false);
  const [selectedOperationId, setSelectedOperationId] = useState('');
  const setLoading = useLoading('GET_INITIATIVE_USERS');
  const addError = useErrorDispatcher();

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof id === 'string' && typeof cf === 'string') {
      getWalletInfo(id, cf)
        .then((res) => {
          if (typeof res.amount === 'number') {
            setAmount(res.amount);
          }
          if (typeof res.accrued === 'number') {
            setAccrued(res.accrued);
          }
          if (typeof res.refunded === 'number') {
            setRefunded(res.refunded);
          }
          if (typeof res.lastCounterUpdate === 'object') {
            setLastCounterUpdate(res.lastCounterUpdate);
          }
          if (typeof res.iban === 'string') {
            setIban(res.iban);
          }
          if (typeof res.status === 'string') {
            setWalletStatus(res.status);
          }
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

      getWalletInstrumen(id, cf)
        .then((res) => {
          const walletInst = res.filter((r) => r.status === 'ACTIVE');
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
      getTableData(id, filterByDateFrom, filterByDateTo, filterByEvent);
    }
  }, []);

  const getTableData = (
    initiativeId: string,
    _searchFrom: string | undefined,
    _searcTo: string | undefined,
    _filterEvent: string | undefined
    // page: number,
    // timestamp: Date | undefined,
    // totExpense: string | undefined,
    // toRefund: string | undefined,
  ) => {
    setLoading(true);
    getTimeLine(initiativeId)
      .then((res) => {
        // if (typeof res.pageNo === 'number') {
        //   setPage(res.pageNo);
        // }
        const rowsData = res.operationList.map((row) => ({
          ...row,
          id: row.operationId,
          timestamp:
            typeof row.operationDate === 'object'
              ? row.operationDate
                  .toLocaleString('fr-BE')
                  .substring(0, row.operationDate.toLocaleString('fr-BE').length - 3)
              : '',
          totExpense: row.amount,
          toRefund: '-',
        }));
        if (Array.isArray(rowsData)) {
          setRows(rowsData);
        }
        // if (typeof res.pageSize === 'number') {
        //   setRowsPerPage(res.pageSize);
        // }
        // if (typeof res.totalElements === 'number') {
        //   setTotalElements(res.totalElements);
        // }
      })
      .catch((error) => {
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
      filterEvent: '',
    },
    validationSchema,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      let searchFromStr;
      let searchToStr;
      if (typeof id === 'string') {
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
                  )}T23:59:59Z`
              : undefined;
          setFilterByDateTo(searchToStr);
        }
        const filterEvent = values.filterEvent.length > 0 ? values.filterEvent : undefined;
        setFilterByEvent(filterEvent);
        getTableData(id, filterByDateFrom, filterByDateTo, filterByEvent);
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
    if (typeof id === 'string') {
      getTableData(id, filterByDateFrom, filterByDateTo, filterByEvent);
    }
  };

  const handleOpenModal = (id: string) => {
    setOpenModal(true);
    setSelectedOperationId(id);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenPaymentMethodModal = () => {
    if (paymentMethodList.length > 0) {
      setOpenPaymentMethodModal(true);
    }
  };

  const handleClosePaymentMethodModal = () => {
    setOpenPaymentMethodModal(false);
  };

  const operationTypeLabel = (opeType: string) => {
    switch (opeType) {
      case MockedOperationType.ADD_IBAN:
        return t('pages.initiativeUserDetails.operationTypes.addIban');
      case MockedOperationType.ADD_INSTRUMENT:
        return t('pages.initiativeUserDetails.operationTypes.addInstrument');
      case MockedOperationType.DELETE_INSTRUMENT:
        return t('pages.initiativeUserDetails.operationTypes.deleteInstrument');
      case MockedOperationType.ONBOARDING:
        return t('pages.initiativeUserDetails.operationTypes.onboarding');
      case MockedOperationType.PAID_REFUND:
        return t('pages.initiativeUserDetails.operationTypes.paidRefund');
      case MockedOperationType.REJECTED_ADD_INSTRUMENT:
        return t('pages.initiativeUserDetails.operationTypes.rejectedAddInstrument');
      case MockedOperationType.REJECTED_DELETE_INSTRUMENT:
        return t('pages.initiativeUserDetails.operationTypes.rejectedDeleteInstrument');
      case MockedOperationType.REJECTED_REFUND:
        return t('pages.initiativeUserDetails.operationTypes.rejectedRefund');
      case MockedOperationType.REVERSAL:
        return t('pages.initiativeUserDetails.operationTypes.reversal');
      case MockedOperationType.TRANSACTION:
        return t('pages.initiativeUserDetails.operationTypes.transaction');
      default:
        return null;
    }
  };

  useEffect(() => {
    if (typeof iban === 'string') {
      getIban(iban)
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
              onClick={() => history.replace(`${BASE_ROUTE}/utenti-iniziativa/${id}`)}
              startIcon={<ArrowBackIcon />}
              sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
              weight="default"
              data-testid="back-btn-test"
            >
              {t('breadcrumbs.back')}
            </ButtonNaked>
            <Typography color="text.primary" variant="body2">
              {t('breadcrumbs.initiativeUsers')}
            </Typography>
            <Typography color="text.primary" variant="body2">
              {t('breadcrumbs.initiativeUserDetails')}
            </Typography>
            <Typography color="text.primary" variant="body2">
              {cf}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'grid', gridColumn: 'span 10' }}>
          <TitleBox
            title={cf}
            subTitle={''}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 2' }}>
          {/* <Button
                variant="contained"
                size="small"
                onClick={() => console.log('download .csv')}
                data-testid="download-csv-test"
              >
                {t('pages.initiativeUserDetails.downloadCsvBtn')}
              </Button> */}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'inline-flex', gridColumn: 'span 6', mt: 5 }}>
          <Typography variant="h6">{t('pages.initiativeUserDetails.initiativeState')}</Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 6', display: 'inline-flex', mt: 5, justifyContent: 'end' }}>
          <Typography variant="body2" color="text.secondary" sx={{ pr: 1 }}>
            {t('pages.initiativeUserDetails.updatedOn')}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {lastCounterUpdate
              ?.toLocaleString('fr-BE')
              .substring(0, lastCounterUpdate?.toLocaleString('fr-BE').length - 3)}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
          mt: 2,
        }}
      >
        <Card sx={{ display: 'grid', gridColumn: 'span 12' }}>
          <CardContent
            sx={{
              px: 3,
              py: 3,
              display: 'grid',
              width: '100%',
              gridTemplateColumns: 'repeat(12, 1fr)',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'grid', gridColumn: 'span 6' }}>
              <Typography
                sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 6' }}
                variant="overline"
                color="text.secondary"
              >
                {t('pages.initiativeUserDetails.summary')}
              </Typography>
              <Typography
                sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1', mt: 1 }}
                variant="body2"
                color="text.primary"
              >
                {t('pages.initiativeUserDetails.availableBalance')}
              </Typography>
              <Typography
                sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5', mt: 1 }}
                variant="body2"
              >
                {`€ ${amount}`}
              </Typography>
              <Typography
                sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1', mt: 1 }}
                variant="body2"
                color="text.primary"
              >
                {t('pages.initiativeUserDetails.refundedBalance')}
              </Typography>
              <Typography
                sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5', mt: 1 }}
                variant="body2"
              >
                {`€ ${refunded}`}
              </Typography>
              <Typography
                sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1', mt: 1 }}
                variant="body2"
                color="text.primary"
              >
                {t('pages.initiativeUserDetails.balanceToBeRefunded')}
              </Typography>
              <Typography
                sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5', mt: 1 }}
                variant="body2"
              >
                {`€ ${accrued}`}
              </Typography>
              <Typography
                sx={{ display: 'grid', gridColumn: 'span 6', mt: 1, justifyContent: 'left', ml: 1 }}
              >
                <ButtonNaked
                  component="button"
                  sx={{
                    color:
                      walletStatus === MockedStatusWallet.NOT_REFUNDABLE ||
                      walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_IBAN
                        ? 'error'
                        : 'primary.main',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                  startIcon={
                    <Badge
                      color={
                        walletStatus === MockedStatusWallet.NOT_REFUNDABLE ||
                        walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_IBAN
                          ? 'error'
                          : 'primary'
                      }
                      badgeContent={paymentMethodList.length}
                      sx={{ mr: 1 }}
                    />
                  }
                  onClick={() => handleOpenPaymentMethodModal()}
                >
                  {t('pages.initiativeUserDetails.paymentMethod')}
                </ButtonNaked>
              </Typography>
              <PaymentMethodsModal
                openPaymentMethodModal={openPaymentMethodModal}
                handleClosePaymentMethodModal={handleClosePaymentMethodModal}
                paymentMethodList={paymentMethodList}
              />
            </Box>
            <Box sx={{ display: 'grid', gridColumn: 'span 6' }}>
              <Typography
                sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 6' }}
                variant="overline"
                color="text.secondary"
              >
                {t('pages.initiativeUserDetails.refundDetail')}
              </Typography>
              <Typography
                sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1', mt: 1 }}
                variant="body2"
                color="text.primary"
              >
                {t('pages.initiativeUserDetails.transactionDetail.iban')}
              </Typography>
              <Typography
                sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5', mt: 1 }}
                variant="body2"
                color={
                  walletStatus === MockedStatusWallet.NOT_REFUNDABLE ||
                  walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT
                    ? 'error'
                    : undefined
                }
              >
                {walletStatus === MockedStatusWallet.NOT_REFUNDABLE ||
                walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT
                  ? t('pages.initiativeUserDetails.missingIban')
                  : iban}
              </Typography>
              <Typography
                sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1', mt: 1 }}
                variant="body2"
                color="text.primary"
              >
                {t('pages.initiativeUserDetails.transactionDetail.bank')}
              </Typography>
              <Typography
                sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5', mt: 1 }}
                variant="body2"
              >
                {walletStatus === MockedStatusWallet.NOT_REFUNDABLE ||
                walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT
                  ? '-'
                  : holderBank}
              </Typography>
              <Typography
                sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1', mt: 1 }}
                variant="body2"
                color="text.primary"
              >
                {t('pages.initiativeUserDetails.updatedOn')}
              </Typography>
              <Typography
                sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5', mt: 1 }}
                variant="body2"
              >
                {walletStatus === MockedStatusWallet.NOT_REFUNDABLE ||
                walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT
                  ? '-'
                  : checkIbanResponseDate
                      ?.toLocaleString('fr-BE')
                      .substring(0, checkIbanResponseDate?.toLocaleString('fr-BE').length - 3)}
              </Typography>
              <Typography
                sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1', mt: 1 }}
                variant="body2"
                color="text.primary"
              >
                {t('pages.initiativeUserDetails.addedBy')}
              </Typography>
              <Typography
                sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5', mt: 1 }}
                variant="body2"
              >
                {walletStatus === MockedStatusWallet.NOT_REFUNDABLE ||
                walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT
                  ? '-'
                  : channel}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'inline-flex', mt: 5, mb: 3 }}>
        <Typography variant="h6">{t('pages.initiativeUserDetails.historyState')}</Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(24, 1fr)',
          alignItems: 'baseline',
          gap: 2,
        }}
      >
        <FormControl sx={{ gridColumn: 'span 8' }} size="small">
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
            <MenuItem value={MockedOperationType.ONBOARDING}>
              {t('pages.initiativeUserDetails.operationTypes.onboarding')}
            </MenuItem>
            <MenuItem value={MockedOperationType.ADD_IBAN}>
              {t('pages.initiativeUserDetails.operationTypes.addIban')}
            </MenuItem>
            <MenuItem value={MockedOperationType.ADD_INSTRUMENT}>
              {t('pages.initiativeUserDetails.operationTypes.addInstrument')}
            </MenuItem>
            <MenuItem value={MockedOperationType.DELETE_INSTRUMENT}>
              {t('pages.initiativeUserDetails.operationTypes.deleteInstrument')}
            </MenuItem>
            <MenuItem value={MockedOperationType.REJECTED_ADD_INSTRUMENT}>
              {t('pages.initiativeUserDetails.operationTypes.rejectedAddInstrument')}
            </MenuItem>
            <MenuItem value={MockedOperationType.REJECTED_DELETE_INSTRUMENT}>
              {t('pages.initiativeUserDetails.operationTypes.rejectedDeleteInstrument')}
            </MenuItem>
            <MenuItem value={MockedOperationType.REJECTED_REFUND}>
              {t('pages.initiativeUserDetails.operationTypes.rejectedRefund')}
            </MenuItem>
            <MenuItem value={MockedOperationType.TRANSACTION}>
              {t('pages.initiativeUserDetails.operationTypes.transaction')}
            </MenuItem>
            <MenuItem value={MockedOperationType.PAID_REFUND}>
              {t('pages.initiativeUserDetails.operationTypes.paidRefund')}
            </MenuItem>
            <MenuItem value={MockedOperationType.REVERSAL}>
              {t('pages.initiativeUserDetails.operationTypes.reversal')}
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 4' }}>
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
        <FormControl sx={{ gridColumn: 'span 4' }}>
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
        <FormControl sx={{ gridColumn: 'span 4' }}>
          <Button
            sx={{ height: '44.5px' }}
            variant="outlined"
            size="small"
            onClick={() => formik.handleSubmit()}
            disabled
            data-testid="apply-filters-test"
          >
            {t('pages.initiativeUsers.form.filterBtn')}
          </Button>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 4' }}>
          <ButtonNaked
            component="button"
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem' }}
            onClick={resetForm}
            disabled
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
                    <TableCell width="25%">
                      {t('pages.initiativeUserDetails.table.dateAndHour')}
                    </TableCell>
                    <TableCell width="40%">
                      {t('pages.initiativeUserDetails.table.event')}
                    </TableCell>
                    <TableCell width="17.5%">
                      {t('pages.initiativeUserDetails.table.totExpense')}
                    </TableCell>
                    <TableCell width="17.5%">
                      {t('pages.initiativeUserDetails.table.toRefund')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rows.map((r) => (
                    <TableRow key={r.operationId}>
                      <TableCell sx={{ textAlign: 'left' }}>
                        {r.operationDate
                          ?.toLocaleString('fr-BE')
                          .substring(0, r.operationDate.toLocaleString('fr-BE').length - 3)}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'left' }}>
                        <ButtonNaked
                          data-testid="operationTypeBtn"
                          component="button"
                          sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            fontSize: '1em',
                          }}
                          onClick={() => {
                            handleOpenModal(r.operationId);
                          }}
                        >
                          {operationTypeLabel(r.operationType)}
                        </ButtonNaked>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'left' }}>{`€ ${r.amount}`}</TableCell>
                      <TableCell sx={{ textAlign: 'left' }}>
                        {r.accrued ? `€ ${r.accrued}` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* <ThemeProvider theme={theme}>
                    <TablePagination
                      component="div"
                      onPageChange={handleChangePage}
                      page={page}
                      count={totalElements}
                      rowsPerPage={rowsPerPage}
                      rowsPerPageOptions={[rowsPerPage]}
                    />
                  </ThemeProvider> */}
              <TransactionDetailModal
                operationId={selectedOperationId}
                openModal={openModal}
                handleCloseModal={handleCloseModal}
                initiativeId={id}
                holderBank={holderBank}
                operationTypeLabel={operationTypeLabel}
              />
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

export default InitiativeUserDetails;
