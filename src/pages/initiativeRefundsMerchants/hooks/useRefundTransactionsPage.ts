import { useLoading } from '@pagopa/selfcare-common-frontend/lib';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useHistory } from 'react-router-dom';
import { ChecksErrorDTO } from '../../../api/generated/merchants/ChecksErrorDTO';
import { MerchantTransactionProcessedDTO } from '../../../api/generated/merchants/MerchantTransactionProcessedDTO';
import { PointOfSaleDTO } from '../../../api/generated/merchants/PointOfSaleDTO';
import { RewardBatchDTO } from '../../../api/generated/merchants/RewardBatchDTO';
import { RewardBatchTrxStatusEnum } from '../../../api/generated/merchants/RewardBatchTrxStatus';
import { TransactionActionRequest } from '../../../api/generated/merchants/TransactionActionRequest';
import { useAlert } from '../../../hooks/useAlert';
import { getBatchTrx, rehydrateBatchTrx, setBatchTrx } from '../../../hooks/useBatchTrx';
import { useInitiative } from '../../../hooks/useInitiative';
import { JWTUser } from '../../../model/JwtUser';
import ROUTES from '../../../routes';
import {
  approveBatch,
  approveTrx,
  getDownloadCsv,
  getDownloadInvoice,
  getMerchantDetail,
  getMerchantTransactionsProcessed,
  getPOS,
  rejectTrx,
  suspendTrx,
  validateBatch,
} from '../../../services/merchantsService';
import { LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS } from '../../../utils/constants';
import { downloadCsv, openInvoiceInNewTab } from '../../../utils/fileViewer-utils';
import { parseJwt } from '../../../utils/jwt-utils';
import { RefundSearchType, SortDirection } from '../model/constants';
import { formatDate, getFileNameFromAzureUrl } from '../model/formatters';
import { buildStatusChipSx, getStatusColor, getStatusLabel, refundRequestDate } from '../model/status';
import { RefundItem, RefundsDrawerData, TrxItem } from '../model/types';

const mapRefundsDrawerData = (
  transactionDto: MerchantTransactionProcessedDTO,
  mappedTransaction: TrxItem
): RefundsDrawerData => ({
  trxChargeDate: (transactionDto as any).trxChargeDate ?? '',
  productName: (transactionDto as any).additionalProperties?.productName,
  productGtin: (transactionDto as any).additionalProperties?.productGtin,
  fiscalCode: transactionDto.fiscalCode,
  trxId: transactionDto.trxId,
  trxCode: (transactionDto as any).trxCode,
  effectiveAmountCents: transactionDto.effectiveAmountCents,
  rewardAmountCents: transactionDto.rewardAmountCents,
  authorizedAmountCents: (transactionDto as any).authorizedAmountCents,
  invoiceDocNumber: transactionDto.invoiceData?.docNumber,
  invoiceFileName: transactionDto.invoiceData?.filename,
  pointOfSaleId: transactionDto.pointOfSaleId,
  transactionId: transactionDto.trxId,
  rewardBatchTrxStatus: transactionDto.rewardBatchTrxStatus,
  checksError: mappedTransaction.checksError,
  statusLabel: mappedTransaction.statusLabel,
  statusColor: mappedTransaction.statusColor,
  rewardBatchRejectionReason:
    transactionDto?.rewardBatchRejectionReason as RefundsDrawerData['rewardBatchRejectionReason'],
});

export const useRefundTransactionsPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { setAlert } = useAlert();
  const setLoading = useLoading(LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS);
  const setAlertRef = useRef(setAlert);
  const setLoadingRef = useRef(setLoading);
  useInitiative();

  useEffect(() => {
    setAlertRef.current = setAlert;
  }, [setAlert]);

  useEffect(() => {
    setLoadingRef.current = setLoading;
  }, [setLoading]);

  const [batch, setBatch] = useState<RefundItem | null>(getBatchTrx());
  const user = parseJwt(storageTokenOps.read()) as JWTUser;
  const role = user.org_role;
  const disabled = useMemo(() => batch?.status !== 'EVALUATING', [batch]);

  const [draftStatusFilter, setDraftStatusFilter] = useState<string | ''>('');
  const [statusFilter, setStatusFilter] = useState<string | ''>('');
  const [draftPosFilter, setDraftPosFilter] = useState<string>('');
  const [posFilter, setPosFilter] = useState<string>('');
  const [draftSearchType, setDraftSearchType] = useState<RefundSearchType>('');
  const [searchType, setSearchType] = useState<RefundSearchType>('');
  const [draftSearchValue, setDraftSearchValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rows, setRows] = useState<Array<TrxItem>>([]);
  const [iban, setIban] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [lockedStatus, setLockedStatus] = useState<RewardBatchTrxStatusEnum | null>(null);
  const [dateSort, setDateSort] = useState<SortDirection>('');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<RefundsDrawerData | null>(null);
  const [approveModal, setApproveModal] = useState(false);
  const [restored, setRestored] = useState(false);
  const [posList, setPosList] = useState<Array<PointOfSaleDTO>>([]);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchErrorOpen, setBatchErrorOpen] = useState(false);
  const [reasonModal, setReasonModal] = useState<{ open: boolean; type: 'reject' | 'suspend' | null }>({
    open: false,
    type: null,
  });

  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_REFUNDS_TRANSACTIONS],
    exact: true,
    strict: false,
  });
  const { id } = (match?.params as { id: string }) || {};

  const matchBatch = matchPath(location.pathname, {
    path: ROUTES.INITIATIVE_REFUNDS_TRANSACTIONS,
    exact: true,
  });
  const batchId = (matchBatch?.params as any)?.batchId;

  const isFilterDisabled =
    (draftStatusFilter === '' || draftStatusFilter === statusFilter) &&
    (draftPosFilter === '' || draftPosFilter === posFilter) &&
    (draftSearchValue === '' || draftSearchValue === searchValue);

  const sameStatusRows = useMemo(() => {
    if (!lockedStatus) {
      return [];
    }
    return rows.filter((row) => row.status === lockedStatus);
  }, [rows, lockedStatus]);

  const allSameStatusSelected = useMemo(() => {
    if (sameStatusRows.length === 0) {
      return false;
    }
    return sameStatusRows.every((row) => selectedRows.has(row.id));
  }, [sameStatusRows, selectedRows]);

  const checksPercentage = useMemo(() => {
    if (batch && batch.numberOfTransactions > 0 && batch.numberOfTransactionsElaborated > 0) {
      const percentage = (batch.numberOfTransactionsElaborated / batch.numberOfTransactions) * 100;
      return percentage > 100 ? '100% / 100%' : `${Math.floor(percentage)}% / 100%`;
    }
    return '0% / 100%';
  }, [batch]);

  const formattedPeriod = useMemo(() => {
    if (!batch?.startDate || !batch?.endDate) {
      return '-';
    }
    const startDate = new Date(batch.startDate).toLocaleDateString('it-IT');
    const endDate = new Date(batch.endDate).toLocaleDateString('it-IT');
    return `${startDate} - ${endDate}`;
  }, [batch]);

  useEffect(() => {
    const restore = async () => {
      const saved = getBatchTrx();

      if (!saved && id && batchId) {
        const ok = await rehydrateBatchTrx(id, batchId);
        setBatch(getBatchTrx());
        setRestored(true);
        if (!ok) {
          history.replace(ROUTES.INITIATIVE_REFUNDS.replace(':id', id));
        }
      } else {
        setRestored(true);
      }
    };
    void restore();
  }, [id, batchId, history]);

  useEffect(() => {
    if (!batch?.merchantId) {
      return;
    }
    getPOS(batch.merchantId, 200)
      .then((response) => setPosList([...(response.content ?? [])]))
      .catch(console.error);
  }, [batch?.merchantId]);

  useEffect(() => {
    setPage(0);
  }, [id]);

  useEffect(() => {
    if (!batch && restored && id) {
      history.replace(ROUTES.INITIATIVE_REFUNDS.replace(':id', id));
    }
  }, [batch, restored, id, history]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, page]);

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  useEffect(() => {
    setSelectedRows(new Set());
    setLockedStatus(null);
  }, [page, pageSize, posFilter, statusFilter, dateSort, searchValue, searchType]);

  const mapTransactionStatus = useCallback((status?: RewardBatchTrxStatusEnum) => {
    switch (status) {
      case RewardBatchTrxStatusEnum.TO_CHECK:
        return { label: t('pages.initiativeMerchantsTransactions.table.toCheck'), color: 'indigo' };
      case RewardBatchTrxStatusEnum.CONSULTABLE:
        return { label: t('pages.initiativeMerchantsTransactions.table.consultable'), color: 'default' };
      case RewardBatchTrxStatusEnum.SUSPENDED:
        return { label: t('pages.initiativeMerchantsTransactions.table.suspended'), color: 'warning' };
      case RewardBatchTrxStatusEnum.APPROVED:
        return { label: t('pages.initiativeMerchantsTransactions.table.approved'), color: 'info' };
      case RewardBatchTrxStatusEnum.REJECTED:
        return { label: t('pages.initiativeMerchantsTransactions.table.rejected'), color: 'error' };
      default:
        return { label: '-', color: 'default' };
    }
  }, [t]);

  const mapTransactionToRow = useCallback((transaction: MerchantTransactionProcessedDTO): TrxItem => {
    const uiStatus = mapTransactionStatus(transaction.rewardBatchTrxStatus);
    return {
      raw: transaction,
      id: transaction.trxId,
      date: (transaction as any).trxChargeDate ? formatDate((transaction as any).trxChargeDate) : '-',
      shop: transaction.franchiseName ?? transaction.pointOfSaleId ?? '-',
      amountCents: transaction.rewardAmountCents ?? 0,
      checksError: transaction.checksError,
      statusLabel: uiStatus.label,
      statusColor: uiStatus.color,
      invoiceFileName: transaction.invoiceData?.filename,
      pointOfSaleId: transaction.pointOfSaleId,
      transactionId: transaction.trxId,
      status: transaction.rewardBatchTrxStatus,
    };
  }, [mapTransactionStatus]);

  const fetchTransactionsTableData = useCallback(async (initiativeId: string) => {
    if (!batch?.merchantId) {
      throw new Error('Invalid Merchant ID');
    }

    setLoadingRef.current(true);
    const sort = dateSort === '' ? undefined : `trxChargeDate,${dateSort}`;

    return Promise.all([
      getMerchantTransactionsProcessed(
        batch.merchantId,
        initiativeId,
        page,
        pageSize,
        sort,
        searchType === 'fiscalCode' ? searchValue || undefined : undefined,
        undefined,
        batch.id,
        (statusFilter as RewardBatchTrxStatusEnum) || undefined,
        posFilter || undefined,
        searchType === 'trxCode' ? searchValue || undefined : undefined
      ),
      getMerchantDetail(initiativeId, batch.merchantId),
    ])
      .then(([transactionsResponse, merchantDetailsResponse]) => {
        setTotalElements(transactionsResponse.totalElements);
        setTotalPages(transactionsResponse.totalPages);
        setRows(transactionsResponse.content.map((transaction: any) => mapTransactionToRow(transaction)));
        if (merchantDetailsResponse.iban) {
          setIban(merchantDetailsResponse.iban);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoadingRef.current(false));
  }, [
    batch,
    dateSort,
    page,
    pageSize,
    searchType,
    searchValue,
    statusFilter,
    posFilter,
    mapTransactionToRow,
  ]);

  useEffect(() => {
    if (!batch || !id) {
      return;
    }
    void fetchTransactionsTableData(id);
  }, [batch, id, fetchTransactionsTableData]);

  const showGenericFetchError = () => {
    setAlertRef.current({
      title: t('errors.title'),
      text: t('errors.getDataDescription'),
      isOpen: true,
      severity: 'error',
    });
  };

  const mapRewardBatchToRefund = (rewardBatch: RewardBatchDTO): RefundItem => ({
    id: rewardBatch.id,
    merchantId: rewardBatch.merchantId ?? batch?.merchantId ?? '',
    businessName: rewardBatch.businessName ?? batch?.businessName ?? '',
    month: rewardBatch.month ?? batch?.month ?? '',
    posType: rewardBatch.posType === 'PHYSICAL' ? 'FISICO' : 'ONLINE',
    merchantSendDate: rewardBatch.merchantSendDate?.toDateString() ?? '',
    status: rewardBatch.status ?? '',
    partial: rewardBatch.partial ?? false,
    name: rewardBatch.name,
    startDate: rewardBatch.startDate?.toDateString() ?? '',
    endDate: rewardBatch.endDate?.toDateString() ?? '',
    totalAmountCents: rewardBatch.initialAmountCents ?? batch?.initialAmountCents ?? 0,
    approvedAmountCents: rewardBatch.approvedAmountCents ?? batch?.approvedAmountCents ?? 0,
    suspendedAmountCents:
      (rewardBatch as any)?.suspendedAmountCents ?? batch?.suspendedAmountCents ?? 0,
    initialAmountCents: rewardBatch.initialAmountCents ?? batch?.initialAmountCents ?? 0,
    numberOfTransactions: rewardBatch.numberOfTransactions ?? batch?.numberOfTransactions ?? 0,
    numberOfTransactionsSuspended:
      rewardBatch.numberOfTransactionsSuspended ?? batch?.numberOfTransactionsSuspended ?? 0,
    numberOfTransactionsRejected:
      rewardBatch.numberOfTransactionsRejected ?? batch?.numberOfTransactionsRejected ?? 0,
    numberOfTransactionsElaborated:
      rewardBatch.numberOfTransactionsElaborated ?? batch?.numberOfTransactionsElaborated ?? 0,
    assigneeLevel: rewardBatch.assigneeLevel ?? 'L1',
    refundErrorMessage: (rewardBatch as any).refundErrorMessage ?? batch?.refundErrorMessage,
  });

  const updateBatch = (rewardBatchResponse: RewardBatchDTO) => {
    const refundItem = mapRewardBatchToRefund(rewardBatchResponse);
    setBatchTrx(refundItem);
    setBatch(getBatchTrx());
  };

  const handleApiError = (error: any) => {
    if (error?.status === 400 && error?.body?.code === 'BATCH_NOT_ELABORATED_15_PERCENT') {
      setBatchErrorOpen(true);
    } else if (error?.status === 400 && error?.body?.code === 'REWARD_BATCH_INVALID_REQUEST') {
      setAlert({
        title: t('errors.title'),
        text: t('errors.batchInvalidRequest'),
        isOpen: true,
        severity: 'error',
      });
    } else {
      setAlert({
        title: t('errors.title'),
        text: t('errors.getDataDescription'),
        isOpen: true,
        severity: 'error',
      });
    }
  };

  const handleBatchStatus = () => {
    if (!batch?.id) {
      return;
    }

    setLoadingRef.current(true);
    const action =
      batch.assigneeLevel !== 'L3' ? validateBatch(id, batch.id) : approveBatch(id, batch.id);

    action
      .then((response) => {
        updateBatch(response);
      })
      .catch((error) => {
        handleApiError(error);
      })
      .finally(() => {
        setLoadingRef.current(false);
        setBatchModalOpen(false);
      });
  };

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

  const handleRowCheckbox = (rowId: string, rowStatus?: RewardBatchTrxStatusEnum) => {
    if (!rowStatus) {
      return;
    }
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
        if (newSet.size === 0) {
          setLockedStatus(null);
        }
      } else {
        if (lockedStatus === null) {
          setLockedStatus(rowStatus);
        }
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const handleHeaderCheckbox = () => {
    if (allSameStatusSelected) {
      setSelectedRows(new Set());
      setLockedStatus(null);
    } else {
      setSelectedRows(new Set(sameStatusRows.map((row) => row.id)));
    }
  };

  const handleOpenDrawer = (transactionRow: TrxItem) => {
    setSelectedTransaction(mapRefundsDrawerData(transactionRow.raw, transactionRow));
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedTransaction(null);
  };

  const closeAfter = (fn: Promise<any>) => fn.finally(() => handleCloseDrawer());

  const handleRefundAction = async (
    action: 'approve' | 'suspend' | 'reject',
    trxIds: Array<string>,
    reason?: string,
    checksError?: ChecksErrorDTO
  ) => {
    if (!batch?.id || !id) {
      return Promise.resolve();
    }

    const request: TransactionActionRequest = {
      transactionIds: trxIds,
      reason,
      checksError,
    };

    setLoadingRef.current(true);

    const apiCall =
      action === 'approve'
        ? approveTrx(id, batch.id, request)
        : action === 'suspend'
          ? suspendTrx(id, batch.id, request)
          : rejectTrx(id, batch.id, request);

    return apiCall
      .then((response) => {
        updateBatch(response);
        setSelectedRows(new Set());
        setLockedStatus(null);
        return fetchTransactionsTableData(id);
      })
      .catch((error) => {
        handleApiError(error);
      })
      .finally(() => setLoadingRef.current(false));
  };

  const approve = () => handleRefundAction('approve', [...selectedRows]);

  const getCsv = () => {
    if (!batch?.id || !id) {
      return;
    }
    setLoadingRef.current(true);
    getDownloadCsv(id, batch.id)
      .then((response) => {
        const fileName = getFileNameFromAzureUrl(response.approvedBatchUrl) || 'transactions.csv';
        downloadCsv(response.approvedBatchUrl, fileName);
      })
      .catch(showGenericFetchError)
      .finally(() => setLoadingRef.current(false));
  };

  const downloadInvoice = (
    pointOfSaleId: string | any,
    transactionId: string | any,
    invoiceFileName: string | any,
    isDownload: boolean = false
  ) => {
    if (!pointOfSaleId || !transactionId || !invoiceFileName || !batch?.merchantId) {
      return;
    }

    setLoadingRef.current(true);
    getDownloadInvoice(pointOfSaleId, transactionId, batch.merchantId)
      .then(async (response) => {
        if (response?.invoiceUrl) {
          if (isDownload) {
            downloadCsv(response.invoiceUrl, invoiceFileName);
          } else {
            await openInvoiceInNewTab(response.invoiceUrl, invoiceFileName);
          }
        }
      })
      .catch(showGenericFetchError)
      .finally(() => setLoadingRef.current(false));
  };

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (draftSearchType === 'fiscalCode') {
      setDraftSearchValue(value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16));
    } else if (draftSearchType === 'trxCode') {
      setDraftSearchValue(value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8));
    }
  };

  const renderAddress = (pointOfSaleId: string | undefined): ReactNode => {
    const pointOfSale = posList.find((posItem) => posItem.id === pointOfSaleId);
    if (!pointOfSale) {
      return '-';
    }
    const addressParts = [
      pointOfSale.address,
      pointOfSale.city,
      pointOfSale.province,
      pointOfSale.zipCode,
    ].filter(Boolean);
    return addressParts.join(', ') || '-';
  };

  const handleFilterClick = () => {
    setStatusFilter(draftStatusFilter);
    setPosFilter(draftPosFilter);
    setSearchType(draftSearchType);
    setSearchValue(draftSearchValue);
    setPage(0);
  };

  const handleRemoveFilters = () => {
    setStatusFilter('');
    setPosFilter('');
    setDraftPosFilter('');
    setDraftStatusFilter('');
    setSearchType('');
    setDraftSearchType('');
    setSearchValue('');
    setDraftSearchValue('');
    setPage(0);
  };

  return {
    t,
    id,
    batch,
    role,
    restored,
    disabled,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalElements,
    totalPages,
    start,
    end,
    dateSort,
    toggleDateSort,
    rows,
    iban,
    checksPercentage,
    formattedPeriod,
    posList,
    draftStatusFilter,
    setDraftStatusFilter,
    statusFilter,
    draftPosFilter,
    setDraftPosFilter,
    posFilter,
    draftSearchType,
    setDraftSearchType,
    searchType,
    draftSearchValue,
    setDraftSearchValue,
    searchValue,
    isFilterDisabled,
    selectedRows,
    lockedStatus,
    sameStatusRows,
    allSameStatusSelected,
    openDrawer,
    selectedTransaction,
    approveModal,
    setApproveModal,
    reasonModal,
    setReasonModal,
    batchModalOpen,
    setBatchModalOpen,
    batchErrorOpen,
    setBatchErrorOpen,
    mapTransactionStatus,
    renderAddress,
    handleOpenDrawer,
    handleCloseDrawer,
    closeAfter,
    handleFilterClick,
    handleRemoveFilters,
    handleRowCheckbox,
    handleHeaderCheckbox,
    handleRefundAction,
    approve,
    handleBatchStatus,
    getCsv,
    downloadInvoice,
    handleSearchValueChange,
    buildStatusChipSx,
    getStatusColor,
    getStatusLabel,
    refundRequestDate,
    formatDate,
  };
};

export type RefundTransactionsPageViewModel = ReturnType<typeof useRefundTransactionsPage>;
