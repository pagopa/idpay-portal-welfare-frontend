import { Box, Chip, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { getMerchantTransactions } from '../../services/merchantsService';
import {
  MerchantTransactionDTO,
  StatusEnum as TransactionStatusEnum,
} from '../../api/generated/merchants/MerchantTransactionDTO';
import { formatedCurrency, formatedDate } from '../../helpers';
import EmptyList from '../components/EmptyList';
import TablePaginator from '../components/TablePaginator';
import FiltersForm from './FiltersForm';
import { containerStyle, filterByStatusOptionsListMT, resetForm, tableHeadData } from './helpers';
import TableHeader from './TableHeader';

type Props = {
  initiativeId: string | undefined;
  merchantId: string | undefined;
};

const MerchantTransactions = ({ initiativeId, merchantId }: Props) => {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const setLoading = useLoading('GET_INITIATIVE_MERCHANT_TRANSACTIONS_LIST');
  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<Array<MerchantTransactionDTO>>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [filterByUser, setFilterByUser] = useState<string | undefined>();
  const [filterByStatus, setFilterByStatus] = useState<string | undefined>();

  const getTableData = (
    merchantId: string,
    initiativeId: string,
    page: number,
    fiscalCode: string | undefined,
    status: string | undefined
  ) => {
    setLoading(true);
    getMerchantTransactions(merchantId, initiativeId, page, fiscalCode, status)
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
          id: 'GET_INITIATIVE_MERCHANT_TRANSACTIONS_LIST_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting initiative merchant transactions list',
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
      const fU = values.searchUser.length > 0 ? values.searchUser : undefined;
      const fS = values.filterStatus.length > 0 ? values.filterStatus : undefined;
      setFilterByUser(fU);
      setFilterByStatus(fS);
      getTableData(merchantId as string, initiativeId as string, 0, fU, fS);
    },
  });

  useMemo(() => {
    setPage(0);
    setFilterByUser(undefined);
    setFilterByStatus(undefined);
  }, [initiativeId, merchantId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getTableData(merchantId as string, initiativeId as string, page, filterByUser, filterByStatus);
  }, [initiativeId, merchantId, page]);

  const renderTransactionCreatedStatus = (status: TransactionStatusEnum) => {
    switch (status) {
      case TransactionStatusEnum.AUTHORIZED:
        return (
          <Chip
            sx={{ fontSize: '14px' }}
            label={t('pages.initiativeMerchantDetail.transactionStatusEnum.authorized')}
            color="info"
          />
        );
      case TransactionStatusEnum.CREATED:
      case TransactionStatusEnum.IDENTIFIED:
        return (
          <Chip
            sx={{ fontSize: '14px' }}
            label={t('pages.initiativeMerchantDetail.transactionStatusEnum.identified')}
            color="default"
          />
        );
      case TransactionStatusEnum.REJECTED:
        return (
          <Chip
            sx={{ fontSize: '14px' }}
            label={t('pages.initiativeMerchantDetail.transactionStatusEnum.invalidated')}
            color="error"
          />
        );
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <FiltersForm
        formik={formik}
        resetForm={() =>
          resetForm(
            merchantId,
            initiativeId,
            formik,
            setFilterByUser,
            setFilterByStatus,
            setRows,
            getTableData
          )
        }
        filterByStatusOptionsList={filterByStatusOptionsListMT}
      />
      {rows.length > 0 ? (
        <Box sx={containerStyle}>
          <Box sx={{ display: 'grid', gridColumn: 'span 12', height: '100%' }}>
            <Box sx={{ width: '100%' }}>
              <Table>
                <TableHeader data={tableHeadData} />
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{formatedDate(r.updateDate)}</TableCell>
                      <TableCell>
                        {r.status === TransactionStatusEnum.AUTHORIZED ? r.fiscalCode : ''}
                      </TableCell>
                      <TableCell>{formatedCurrency(r.effectiveAmount, '-', true)}</TableCell>
                      <TableCell>{formatedCurrency(r.rewardAmount, '-', true)}</TableCell>
                      <TableCell>{renderTransactionCreatedStatus(r.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePaginator
                page={page}
                setPage={setPage}
                totalElements={totalElements}
                rowsPerPage={rowsPerPage}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <EmptyList message={t('pages.initiativeMerchantDetail.emptyList')} />
        </Box>
      )}
    </Box>
  );
};

export default MerchantTransactions;
