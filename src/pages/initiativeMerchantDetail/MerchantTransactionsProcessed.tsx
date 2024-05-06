import { Box, Chip, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import TablePaginator from '../components/TablePaginator';
import FiltersForm from './FiltersForm';
import { containerStyle, filterByStatusOptionsListMTP, resetForm, tableHeadData } from './helpers';
import TableHeader from './TableHeader';

type Props = {
  initiativeId: string | undefined;
  merchantId: string | undefined;
};

const MerchantTransactionsProcessed = ({ initiativeId, merchantId }: Props) => {
  const { t } = useTranslation();
  const [pageValue, setPageValue] = useState<number>(0);
  const [rowsData, setRowsData] = useState<Array<MerchantTransactionProcessedDTO>>([]);
  const [rowsPerPageValue, setRowsPerPageValue] = useState<number>(0);
  const [totalElementsValue, setTotalElementsValue] = useState<number>(0);
  const [filterDataByUser, setFilterDataByUser] = useState<string | undefined>();
  const [filterDataByStatus, setFilterDataByStatus] = useState<string | undefined>();
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
        setPageValue(response.pageNo);
        setRowsPerPageValue(response.pageSize);
        setTotalElementsValue(response.totalElements);
        if (response.content.length > 0) {
          setRowsData([...response.content]);
        } else {
          setRowsData([]);
        }
      })
      .catch((error) => {
        addError({
          id: 'GET_INITIATIVE_MERCHANT_PROCESSED_DISCOUNTS_LIST_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting initiative merchant processed discounts list',
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
        setFilterDataByUser(fU);
        setFilterDataByStatus(fS);
        getTableData(merchantId, initiativeId, 0, fU, fS);
      }
    },
  });

  useMemo(() => {
    setPageValue(0);
    setFilterDataByUser(undefined);
    setFilterDataByStatus(undefined);
  }, [merchantId, initiativeId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof merchantId === 'string' && typeof initiativeId === 'string') {
      getTableData(merchantId, initiativeId, pageValue, filterDataByUser, filterDataByStatus);
    }
    return () => {
      setRowsData([]);
    };
  }, [merchantId, initiativeId, pageValue]);

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
      <FiltersForm
        formik={formik}
        resetForm={() =>
          resetForm(
            merchantId,
            initiativeId,
            formik,
            setFilterDataByUser,
            setFilterDataByStatus,
            setRowsData,
            getTableData
          )
        }
        filterByStatusOptionsList={filterByStatusOptionsListMTP}
      />

      {rowsData.length > 0 ? (
        <Box sx={containerStyle}>
          <Box sx={{ display: 'grid', gridColumn: 'span 12', height: '100%' }}>
            <Box sx={{ width: '100%' }}>
              <Table>
                <TableHeader data={tableHeadData} />
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rowsData.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{formatedDate(r.updateDate)}</TableCell>
                      <TableCell>{r.fiscalCode}</TableCell>
                      <TableCell>{formatedCurrency(r.effectiveAmountCents, '-', true)}</TableCell>
                      <TableCell>{formatedCurrency(r.rewardAmountCents, '-', true)}</TableCell>
                      <TableCell>{renderTrasactionProcessedStatus(r.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePaginator
                page={pageValue}
                setPage={setPageValue}
                totalElements={totalElementsValue}
                rowsPerPage={rowsPerPageValue}
              />
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
