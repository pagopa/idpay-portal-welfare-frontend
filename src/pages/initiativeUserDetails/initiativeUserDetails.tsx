import {
  Breadcrumbs,
  // Button,
  Card,
  CardContent,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  // TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Box /* , ThemeProvider  */ } from '@mui/system';
import { ButtonNaked /* , theme */ } from '@pagopa/mui-italia';
import { matchPath, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useEffect, useState } from 'react';
import { Alert } from '@mui/lab';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
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
  MockedOperationList,
} from '../../model/Initiative';

const InitiativeUserDetails = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(true);
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
  const [rows, setRows] = useState<Array<MockedOperationList>>([]);
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
      getTableData(id);
    }
  }, []);

  const getTableData = (
    initiativeId: string
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
          return alertMissingIban;
        case MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT:
          return alertMissingPaymentMetod;
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
              gridTemplateAreas: `"title title title title title icon . . . . . . . . . . update update update date date date date date"`,
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'inline-flex', gridArea: 'title' }}>
              <Typography variant="h6">
                {t('pages.initiativeUserDetails.initiativeState')}
              </Typography>
            </Box>
            <Box sx={{ display: 'inline-flex', gridArea: 'icon' }}>
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setShowDetails(!showDetails)}
                data-testid="view-detail-icon"
              >
                <RemoveRedEyeIcon color="primary" fontSize="inherit" />
              </IconButton>
            </Box>
            <Box sx={{ display: 'inline-flex', gridArea: 'update', justifyContent: 'start' }}>
              <Typography variant="body2" color="text.secondary" textAlign="left">
                {t('pages.initiativeUserDetails.updatedOn')}
              </Typography>
            </Box>
            <Box sx={{ display: 'inline-flex', gridArea: 'date', justifyContent: 'start' }}>
              <Typography variant="body2">{lastCounterUpdate?.toLocaleString('fr-BE')}</Typography>
            </Box>
          </Box>

          <Collapse in={showDetails} sx={{ py: 2 }}>
            <Box
              sx={{
                display: 'grid',
                width: '100%',
                gridTemplateColumns: 'repeat(24, 1fr)',
                alignItems: 'center',
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
          </Collapse>
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
                              component="button"
                              sx={{ color: 'primary.main', fontWeight: 600, fontSize: '1em' }}
                              onClick={() => {
                                console.log('clicked!'); // history.replace(`${BASE_ROUTE}/dettagli-utente/${id}/${r.beneficiary}`)
                              }}
                            >
                              {r.operationType}
                            </ButtonNaked>
                          </TableCell>
                          <TableCell>{r.amount}</TableCell>
                          <TableCell>{'-'}</TableCell>
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
            walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_IBAN) && (
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
            walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT) && (
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
