import {
  Box,
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
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { itIT } from '@mui/material/locale';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { useFormik } from 'formik';
import {
  MerchantTransactionProcessedDTO,
  StatusEnum as TransactionProcessedStatusEnum,
} from '../../api/generated/merchants/MerchantTransactionProcessedDTO';
import { getMerchantTransactionsProcessed } from '../../services/merchantsService';
import { formatedCurrency, formatedDate } from '../../helpers';
import EmptyList from '../components/EmptyList';

type Props = {
  initiativeId: string | undefined;
  merchantId: string | undefined;
};

const MerchantTransactionsProcessed = ({ initiativeId, merchantId }: Props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<Array<MerchantTransactionProcessedDTO>>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [filterByUser, setFilterByUser] = useState<string | undefined>();
  const [filterByStatus, setFilterByStatus] = useState<string | undefined>();
  const theme = createTheme(itIT);
  const setLoading = useLoading('GET_INITIATIVE_MERCHANT_TRANSACTIONS_PROCESSED_LIST');
  const addError = useErrorDispatcher();

  const getTableData = (
    merchantId: string,
    initiativeId: string,
    page: number,
    fiscalCode: string | undefined,
    status: string | undefined
  ) => {
    setLoading(true);
    getMerchantTransactionsProcessed(merchantId, initiativeId, page, fiscalCode, status)
      .then((response) => {
        setPage(response.pageNo);
        setRowsPerPage(response.pageSize);
        setTotalElements(response.totalElements);
        if (response.content.length > 0) {
          setRows([...response.content]);
        } else {
          setRows([]);
        }
      })
      .catch((error) => {
        addError({
          id: 'GET_INITIATIVE_MERCHANT_DISCOUNTS_LIST_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting initiative merchant discounts list',
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
      searchUser: '',
      filterStatus: '',
    },
    onSubmit: (values) => {
      if (typeof merchantId === 'string' && typeof initiativeId === 'string') {
        const fU = values.searchUser.length > 0 ? values.searchUser : undefined;
        const fS = values.filterStatus.length > 0 ? values.filterStatus : undefined;
        setFilterByUser(fU);
        setFilterByStatus(fS);
        getTableData(merchantId, initiativeId, 0, fU, fS);
      }
    },
  });

  const resetForm = () => {
    const initialValues = { searchUser: '', filterStatus: '' };
    formik.resetForm({ values: initialValues });
    setFilterByUser(undefined);
    setFilterByStatus(undefined);
    setRows([]);
    if (typeof merchantId === 'string' && typeof initiativeId === 'string') {
      getTableData(merchantId, initiativeId, 0, undefined, undefined);
    }
  };

  useMemo(() => {
    setPage(0);
    setFilterByUser(undefined);
    setFilterByStatus(undefined);
  }, [merchantId, initiativeId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof merchantId === 'string' && typeof initiativeId === 'string') {
      getTableData(merchantId, initiativeId, page, filterByUser, filterByStatus);
    }
    return () => {
      setRows([]);
    };
  }, [merchantId, initiativeId, page]);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    window.scrollTo(0, 0);
    setPage(newPage);
  };

  const renderTrasactionProcessedStatus = (status: TransactionProcessedStatusEnum) => {
    switch (status) {
      case TransactionProcessedStatusEnum.REWARDED:
        return (
          // eslint-disable-next-line react/jsx-no-undef
          <Chip
            sx={{ fontSize: '14px' }}
            label={t('pages.initiativeMerchantDetail.transactionStatusEnum.rewarded')}
            color="success"
          />
        );
      case TransactionProcessedStatusEnum.CANCELLED:
        return (
          <Chip
            sx={{ fontSize: '14px' }}
            label={t('pages.initiativeMerchantDetail.transactionStatusEnum.cancelled')}
            color="error"
          />
        );
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 2,
          alignItems: 'baseline',
        }}
      >
        <FormControl sx={{ gridColumn: 'span 4' }}>
          <TextField
            label={t('pages.initiativeMerchantDetail.searchByFiscalCode')}
            placeholder={t('pages.initiativeMerchantDetail.searchByFiscalCode')}
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
        <FormControl sx={{ gridColumn: 'span 2' }} size="small">
          <InputLabel>{t('pages.initiativeMerchantDetail.transactionStatus')}</InputLabel>
          <Select
            id="filterStatus"
            inputProps={{
              'data-testid': 'filterStatus-select',
            }}
            name="filterStatus"
            label={t('pages.initiativeMerchantDetail.transactionStatus')}
            placeholder={t('pages.initiativeMerchantDetail.transactionStatus')}
            onChange={(e) => formik.handleChange(e)}
            value={formik.values.filterStatus}
          >
            <MenuItem value={'REWARDED'}>
              {t('pages.initiativeMerchantDetail.transactionStatusEnum.rewarded')}
            </MenuItem>
            <MenuItem value={'CANCELLED'}>
              {t('pages.initiativeMerchantDetail.transactionStatusEnum.cancelled')}
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <Button
            sx={{ height: '44.5px' }}
            variant="outlined"
            size="small"
            onClick={() => formik.handleSubmit()}
            data-testid="apply-filters-test"
          >
            {t('pages.initiativeMerchantDetail.filterBtn')}
          </Button>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <ButtonNaked
            component="button"
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem' }}
            onClick={resetForm}
          >
            {t('pages.initiativeMerchantDetail.removeFiltersBtn')}
          </ButtonNaked>
        </FormControl>
      </Box>
      {rows.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignItems: 'center',
            mt: 3,
          }}
        >
          <Box sx={{ display: 'grid', gridColumn: 'span 12', height: '100%' }}>
            <Box sx={{ width: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="20%">{t('pages.initiativeMerchantDetail.date')}</TableCell>
                    <TableCell width="40%">
                      {t('pages.initiativeMerchantDetail.beneficiary')}
                    </TableCell>
                    <TableCell width="15%">
                      {t('pages.initiativeMerchantDetail.totalSpent')}
                    </TableCell>
                    <TableCell width="15%">
                      {t('pages.initiativeMerchantDetail.authorizedAmount')}
                    </TableCell>
                    <TableCell width="15%">
                      {t('pages.initiativeMerchantDetail.transactionStatus')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{formatedDate(r.updateDate)}</TableCell>
                      <TableCell>{r.fiscalCode}</TableCell>
                      <TableCell>{formatedCurrency(r.effectiveAmount, '-', true)}</TableCell>
                      <TableCell>{formatedCurrency(r.rewardAmount, '-', true)}</TableCell>
                      <TableCell>{renderTrasactionProcessedStatus(r.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ThemeProvider theme={theme}>
                <TablePagination
                  sx={{
                    '.MuiTablePagination-displayedRows': {
                      fontFamily: '"Titillium Web",sans-serif',
                    },
                  }}
                  component="div"
                  onPageChange={handleChangePage}
                  page={page}
                  count={totalElements}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10]}
                />
              </ThemeProvider>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <EmptyList message={t('pages.initiativeMerchantDetail.emptyProcessedList')} />
        </Box>
      )}
    </Box>
  );
};

export default MerchantTransactionsProcessed;
