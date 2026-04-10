import { useLoading } from '@pagopa/selfcare-common-frontend/lib';
import { useCallback, useEffect, useRef, useState } from 'react';
import { matchPath, useHistory } from 'react-router-dom';
import { AssigneeLevelEnum, RewardBatchStatus } from '../../../api/generated/merchants/apiClient';
import { setBatchTrx } from '../../../hooks/useBatchTrx';
import { useAlert } from '../../../hooks/useAlert';
import {
  getMerchantsFilters,
  resetMerchantsFilters,
  setMerchantsFilters,
} from '../../../hooks/useMerchantsFilters';
import ROUTES from '../../../routes';
import { getMerchantList, getRewardBatches } from '../../../services/merchantsService';
import { LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS } from '../../../utils/constants';
import { SortDirection } from '../model/constants';
import { MerchantItem, RefundItem } from '../model/types';

type UseRefundBatchesPageArgs = {
  t: (key: string) => string;
};

const normalize = (s: string) => (s ?? '').trim();

const mapRefundRow = (refundBatch: any): RefundItem => ({
  id: refundBatch.id,
  merchantId: refundBatch.merchantId,
  businessName: refundBatch.businessName,
  month: refundBatch.month,
  posType: refundBatch.posType,
  merchantSendDate: refundBatch.merchantSendDate,
  status: refundBatch.status,
  partial: refundBatch.partial,
  name: refundBatch.name,
  startDate: refundBatch.startDate,
  endDate: refundBatch.endDate,
  totalAmountCents: refundBatch.totalAmountCents,
  approvedAmountCents: refundBatch.approvedAmountCents,
  initialAmountCents: refundBatch.initialAmountCents,
  suspendedAmountCents: refundBatch.suspendedAmountCents,
  numberOfTransactions: refundBatch.numberOfTransactions,
  numberOfTransactionsSuspended: refundBatch.numberOfTransactionsSuspended,
  numberOfTransactionsRejected: refundBatch.numberOfTransactionsRejected,
  numberOfTransactionsElaborated: refundBatch.numberOfTransactionsElaborated,
  assigneeLevel: refundBatch.assigneeLevel,
  refundErrorMessage: refundBatch.refundErrorMessage,
});

export const useRefundBatchesPage = ({ t }: UseRefundBatchesPageArgs) => {
  const { setAlert } = useAlert();
  const history = useHistory();
  const setLoading = useLoading(LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS);
  const setAlertRef = useRef(setAlert);
  const setLoadingRef = useRef(setLoading);

  useEffect(() => {
    setAlertRef.current = setAlert;
  }, [setAlert]);

  useEffect(() => {
    setLoadingRef.current = setLoading;
  }, [setLoading]);

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_REFUNDS],
    exact: true,
    strict: false,
  });

  const { id } = (match?.params as { id: string }) || {};

  const savedFilters = getMerchantsFilters();
  const [assigneeFilter, setAssigneeFilter] = useState<string>(savedFilters.assigneeFilter ?? '');
  const [draftAssignee, setDraftAssignee] = useState<string>(savedFilters.assigneeFilter ?? '');
  const [nameFilter, setNameFilter] = useState<string>(savedFilters.nameFilter ?? '');
  const [draftName, setDraftName] = useState<string>(savedFilters.nameFilter ?? '');
  const [periodFilter, setPeriodFilter] = useState<string>(savedFilters.periodFilter ?? '');
  const [draftPeriod, setDraftPeriod] = useState<string>(savedFilters.periodFilter ?? '');
  const [statusFilter, setStatusFilter] = useState<string>(savedFilters.statusFilter ?? '');
  const [draftStatus, setDraftStatus] = useState<string>(savedFilters.statusFilter ?? '');
  const [page, setPage] = useState(savedFilters.page ?? 0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(savedFilters.pageSize ?? 10);
  const [dateSort, setDateSort] = useState<SortDirection>(savedFilters.dateSort ?? '');
  const [businessNameList, setBusinessNameList] = useState<Array<MerchantItem>>([]);
  const [rows, setRows] = useState<Array<RefundItem>>([]);

  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);
  const shouldResetPage = !savedFilters.page;

  const isFilterDisabled = !(
    normalize(draftAssignee) !== normalize(assigneeFilter) ||
    normalize(draftName) !== normalize(nameFilter) ||
    normalize(draftPeriod) !== normalize(periodFilter) ||
    normalize(draftStatus) !== normalize(statusFilter)
  );

  const showGenericFetchError = useCallback(() => {
    setAlertRef.current({
      title: t('errors.title'),
      text: t('errors.getDataDescription'),
      isOpen: true,
      severity: 'error',
    });
  }, [t]);

  const toggleDateSort = () => {
    setDateSort((prev) => {
      if (prev === '') {
        return 'asc';
      }
      if (prev === 'asc') {
        return 'desc';
      }
      return '';
    });
  };

  const fetchMerchantsList = useCallback(() => {
    getMerchantList(id, 0)
      .then((response) => {
        if (response?.content?.length) {
          setBusinessNameList(response.content as Array<MerchantItem>);
        }
      })
      .catch(showGenericFetchError);
  }, [id, showGenericFetchError]);

  const fetchBatchesTableData = useCallback((initiativeId: string) => {
    const sort = dateSort === '' ? undefined : `merchantSendDate,${dateSort}`;
    setLoadingRef.current(true);
    getRewardBatches(
      initiativeId,
      page,
      pageSize,
      assigneeFilter as AssigneeLevelEnum || undefined,
      nameFilter || undefined,
      periodFilter || undefined,
      statusFilter as RewardBatchStatus || undefined,
      sort || undefined
    )
      .then((response) => {
        if (typeof response.totalElements === 'number') {
          setTotalElements(response.totalElements);
        }
        if (typeof response.totalPages === 'number') {
          setTotalPages(response.totalPages);
        }
        if (Array.isArray(response.content) && response.content.length > 0) {
          setRows(response.content.map(mapRefundRow));
        } else {
          setRows([]);
        }
      })
      .catch(showGenericFetchError)
      .finally(() => {
        setLoadingRef.current(false);
      });
  }, [
    dateSort,
    page,
    pageSize,
    assigneeFilter,
    nameFilter,
    periodFilter,
    statusFilter,
    showGenericFetchError,
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof id === 'string') {
      fetchMerchantsList();
      fetchBatchesTableData(id);
    }
  }, [id, fetchMerchantsList, fetchBatchesTableData]);

  useEffect(() => {
    if (shouldResetPage) {
      setPage(0);
    }
  }, [id, pageSize, shouldResetPage]);

  useEffect(() => {
    if (savedFilters.page !== null) {
      setPage(savedFilters.page);
    }
    if (savedFilters.assigneeFilter !== null) {
      setDraftAssignee(savedFilters.assigneeFilter);
      setAssigneeFilter(savedFilters.assigneeFilter);
    }
    if (savedFilters.nameFilter !== null) {
      setDraftName(savedFilters.nameFilter);
      setNameFilter(savedFilters.nameFilter);
    }
    if (savedFilters.periodFilter !== null) {
      setDraftPeriod(savedFilters.periodFilter);
      setPeriodFilter(savedFilters.periodFilter);
    }
    if (savedFilters.statusFilter !== null) {
      setDraftStatus(savedFilters.statusFilter);
      setStatusFilter(savedFilters.statusFilter);
    }
    if (savedFilters.pageSize !== null) {
      setPageSize(savedFilters.pageSize);
    }
    if (savedFilters.dateSort !== '') {
      setDateSort(savedFilters.dateSort);
    }

    resetMerchantsFilters();
  }, [savedFilters]);

  const applyFilters = () => {
    setAssigneeFilter(draftAssignee);
    setNameFilter(draftName);
    setPeriodFilter(draftPeriod);
    setStatusFilter(draftStatus);
    setPage(0);
  };

  const clearFilters = () => {
    setAssigneeFilter('');
    setDraftAssignee('');
    setNameFilter('');
    setDraftName('');
    setPeriodFilter('');
    setDraftPeriod('');
    setStatusFilter('');
    setDraftStatus('');
    setPage(0);
  };

  const openBatchDetails = (selectedBatch: RefundItem) => {
    if (typeof id !== 'string') {
      return;
    }

    setBatchTrx(selectedBatch);
    setMerchantsFilters({
      assigneeFilter,
      nameFilter,
      periodFilter,
      statusFilter,
      page,
      pageSize,
      dateSort,
    });
    history.replace(
      ROUTES.INITIATIVE_REFUNDS_TRANSACTIONS.replace(':batchId', selectedBatch.id).replace(':id', id)
    );
  };

  return {
    id,
    assigneeFilter,
    draftAssignee,
    setDraftAssignee,
    nameFilter,
    draftName,
    setDraftName,
    periodFilter,
    draftPeriod,
    setDraftPeriod,
    statusFilter,
    draftStatus,
    setDraftStatus,
    page,
    setPage,
    totalElements,
    totalPages,
    pageSize,
    setPageSize,
    start,
    end,
    dateSort,
    toggleDateSort,
    businessNameList,
    rows,
    isFilterDisabled,
    applyFilters,
    clearFilters,
    openBatchDetails,
  };
};

export type RefundBatchesPageViewModel = ReturnType<typeof useRefundBatchesPage>;
