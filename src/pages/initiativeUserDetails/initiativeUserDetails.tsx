/* eslint-disable functional/no-let */
import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  // Collapse,
  // IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  // TablePagination,
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
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useEffect, useState } from 'react';
import { Alert, DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import CreditCardIcon from '@mui/icons-material/CreditCard';
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

const InitiativeUserDetails = () => {
  const history = useHistory();
  const { t } = useTranslation();
  // const [showDetails, setShowDetails] = useState(true);
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

  const getMaskedPan = (pan: string | undefined) => `**** ${pan?.substring(pan.length - 4)}`;

  const getWalletAlerts = (status: MockedStatusWallet | undefined) => {
    const alertMissingPaymentMetod = (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{t('pages.initiativeUserDetails.missingPaymentMethod')}</Alert>
      </Box>
    );
    const alertMissingIban = (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{t('pages.initiativeUserDetails.missingIban')}</Alert>
      </Box>
    );

    const alertUnsubscribed = (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{t('pages.initiativeUserDetails.unsubscribed')}</Alert>
      </Box>
    );

    if (typeof status !== 'undefined') {
      switch (status) {
        case MockedStatusWallet.NOT_REFUNDABLE:
          return (
            <>
              {alertMissingPaymentMetod} {alertMissingIban}
            </>
          );
        case MockedStatusWallet.NOT_REFUNDABLE_ONLY_IBAN:
          return alertMissingPaymentMetod;
        case MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT:
          return alertMissingIban;
        case MockedStatusWallet.UNSUBSCRIBED:
          return alertUnsubscribed;
        default:
          return null;
      }
    }
    return null;
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
      <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: '10fr minmax(400px, 2fr)' }}>
        <Box sx={{ gridColumn: 'auto' }}>
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
              gridTemplateColumns: 'repeat(24, 1fr)',
              gridTemplateAreas: `"title title title title title title . . . . . . . . . . update update update date date date date date"`,
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'inline-flex', gridArea: 'title' }}>
              <Typography variant="h6">
                {t('pages.initiativeUserDetails.initiativeState')}
              </Typography>
            </Box>
            {/* <Box sx={{ display: 'inline-flex', gridArea: 'icon' }}>
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setShowDetails(!showDetails)}
                data-testid="view-detail-icon"
              >
                <RemoveRedEyeIcon color="primary" fontSize="inherit" />
              </IconButton>
            </Box> */}
            <Box sx={{ display: 'inline-flex', gridArea: 'update', justifyContent: 'start' }}>
              <Typography variant="body2" color="text.secondary" textAlign="left">
                {t('pages.initiativeUserDetails.updatedOn')}
              </Typography>
            </Box>
            <Box sx={{ display: 'inline-flex', gridArea: 'date', justifyContent: 'start' }}>
              <Typography variant="body2">{lastCounterUpdate?.toLocaleString('fr-BE')}</Typography>
            </Box>
          </Box>

          {/* <Collapse in={showDetails} sx={{ py: 2 }}> */}
          <Box
            sx={{
              display: 'grid',
              width: '100%',
              gridTemplateColumns: 'repeat(24, 1fr)',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <Box sx={{ display: 'grid', gridColumn: 'span 8', pr: 1.5 }}>
              <Card>
                <CardContent sx={{ pr: 3, pl: '23px', py: 4 }}>
                  <Typography sx={{ fontWeight: 700 }} variant="body2" color="text.secondary">
                    {t('pages.initiativeUserDetails.availableBalance')}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
                    {amount}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t('pages.initiativeUserDetails.spendableAmount')}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ display: 'grid', gridColumn: 'span 8', px: 1.5 }}>
              <Card>
                <CardContent sx={{ px: 3, py: 4 }}>
                  <Typography sx={{ fontWeight: 700 }} variant="body2" color="text.secondary">
                    {t('pages.initiativeUserDetails.refundedBalance')}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
                    {refunded}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t('pages.initiativeUserDetails.refundedAmount')}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ display: 'grid', gridColumn: 'span 8', pl: 1.5 }}>
              <Card>
                <CardContent sx={{ px: 3, py: 4 }}>
                  <Typography sx={{ fontWeight: 700 }} variant="body2" color="text.secondary">
                    {t('pages.initiativeUserDetails.balanceToBeRefunded')}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
                    {accrued}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t('pages.initiativeUserDetails.importNotRefundedYet')}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
          {/* </Collapse> */}

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
                          <TableCell>
                            {r.operationDate
                              ?.toLocaleString('fr-BE')
                              .substring(0, r.operationDate.toLocaleString('fr-BE').length - 3)}
                          </TableCell>
                          <TableCell>
                            <ButtonNaked
                              data-testid="operationTypeBtn"
                              component="button"
                              sx={{ color: 'primary.main', fontWeight: 600, fontSize: '1em' }}
                              onClick={() => {
                                handleOpenModal(r.operationId);
                              }}
                            >
                              {r.operationType}
                            </ButtonNaked>
                          </TableCell>
                          <TableCell>{`€ ${r.amount}`}</TableCell>
                          <TableCell>{r.accrued ? `€ ${r.accrued}` : '-'}</TableCell>
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
        <Box sx={{ gridColumn: 'auto', px: 3 }}>
          {walletStatus !== MockedStatusWallet.REFUNDABLE && (
            <Box sx={{ px: 3, py: 2, backgroundColor: 'background.paper' }}>
              <Typography variant="overline">{t('pages.initiativeUserDetails.alerts')}</Typography>
              {getWalletAlerts(walletStatus)}
            </Box>
          )}
          {(walletStatus === MockedStatusWallet.REFUNDABLE ||
            walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT) && (
            <Box sx={{ px: 3, py: 2, mt: 3, backgroundColor: 'background.paper' }}>
              <Typography variant="overline">
                {t('pages.initiativeUserDetails.paymentMethod')}
              </Typography>
              <List>
                {paymentMethodList.map((p, i) => (
                  <ListItem key={i}>
                    <ListItemAvatar>
                      {p.brandLog ? <img src={p.brandLog} width="32px" /> : <CreditCardIcon />}
                    </ListItemAvatar>
                    <ListItemText
                      primary={getMaskedPan(p.maskedPan)}
                      secondary={p.activationDate?.toLocaleString('fr-BE')}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {(walletStatus === MockedStatusWallet.REFUNDABLE ||
            walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_IBAN) && (
            <Box sx={{ px: 3, py: 2, mt: 3, backgroundColor: 'background.paper' }}>
              <Typography variant="overline">{t('pages.initiativeUserDetails.iban')}</Typography>
              <Box
                sx={{
                  display: 'grid',
                  width: '100%',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ display: 'grid', gridColumn: 'span 12', fontWeight: 600, mt: 3 }}>
                  {iban}
                </Typography>
                <Typography
                  sx={{ display: 'grid', gridColumn: 'span 12' }}
                  variant="body2"
                  color="text.secondary"
                >
                  {holderBank}
                </Typography>
                <Typography
                  sx={{ display: 'grid', gridColumn: 'span 4', mt: 2 }}
                  variant="body2"
                  color="text.secondary"
                  textAlign="left"
                >
                  {t('pages.initiativeUserDetails.updatedOn')}
                </Typography>
                <Typography
                  sx={{ display: 'grid', gridColumn: 'span 8', fontWeight: 600, mt: 2 }}
                  variant="body2"
                  textAlign="left"
                >
                  {checkIbanResponseDate?.toLocaleString('fr-BE')}
                </Typography>

                <Typography
                  sx={{ display: 'grid', gridColumn: 'span 3', mt: 2 }}
                  variant="body2"
                  color="text.secondary"
                  textAlign="left"
                >
                  {t('pages.initiativeUserDetails.addedBy')}
                </Typography>
                <Typography
                  sx={{ display: 'grid', gridColumn: 'span 9', fontWeight: 600, mt: 2 }}
                  variant="body2"
                  textAlign="left"
                >
                  {channel}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default InitiativeUserDetails;
