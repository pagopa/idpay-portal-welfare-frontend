import type {
  RefundBatchesPageViewModel,
} from '../hooks/useRefundBatchesPage';
import type {
  RefundTransactionsPageViewModel,
} from '../hooks/useRefundTransactionsPage';

type Translate = (key: string) => string;

export const buildRefundBatchesBindings = (
  viewModel: RefundBatchesPageViewModel,
  t: Translate
) => ({
  filtersBarProps: {
    t,
    draftName: viewModel.draftName,
    setDraftName: viewModel.setDraftName,
    draftPeriod: viewModel.draftPeriod,
    setDraftPeriod: viewModel.setDraftPeriod,
    draftStatus: viewModel.draftStatus,
    setDraftStatus: viewModel.setDraftStatus,
    draftAssignee: viewModel.draftAssignee,
    setDraftAssignee: viewModel.setDraftAssignee,
    businessNameList: viewModel.businessNameList,
    isFilterDisabled: viewModel.isFilterDisabled,
    applyFilters: viewModel.applyFilters,
    clearFilters: viewModel.clearFilters,
    hasAppliedFilters: Boolean(
      viewModel.assigneeFilter ||
        viewModel.nameFilter ||
        viewModel.periodFilter ||
        viewModel.statusFilter
    ),
  },
  tableProps: {
    t,
    rows: viewModel.rows,
    totalElements: viewModel.totalElements,
    dateSort: viewModel.dateSort,
    toggleDateSort: viewModel.toggleDateSort,
    openBatchDetails: viewModel.openBatchDetails,
    pageSize: viewModel.pageSize,
    setPageSize: viewModel.setPageSize,
    start: viewModel.start,
    end: viewModel.end,
    page: viewModel.page,
    setPage: viewModel.setPage,
    totalPages: viewModel.totalPages,
  },
});

export const buildRefundTransactionsBindings = (
  viewModel: RefundTransactionsReadyViewModel,
  initiativeName: string
) => ({
  breadcrumbsProps: {
    t: viewModel.t,
    initiativeName,
    initiativeId: viewModel.id,
    businessName: viewModel.batch.businessName,
  },
  headerProps: {
    t: viewModel.t,
    batch: viewModel.batch,
    role: viewModel.role,
    selectedRowsSize: viewModel.selectedRows.size,
    lockedStatus: viewModel.lockedStatus,
    onOpenApproveModal: () => viewModel.setApproveModal(true),
    onOpenSuspendModal: () => viewModel.setReasonModal({ open: true, type: 'suspend' }),
    onOpenRejectModal: () => viewModel.setReasonModal({ open: true, type: 'reject' }),
    onOpenBatchModal: () => viewModel.setBatchModalOpen(true),
    onGetCsv: viewModel.getCsv,
  },
  summaryProps: {
    t: viewModel.t,
    batch: viewModel.batch,
    formattedPeriod: viewModel.formattedPeriod,
    iban: viewModel.iban,
    checksPercentage: viewModel.checksPercentage,
    refundRequestDate: viewModel.refundRequestDate,
    getStatusLabel: viewModel.getStatusLabel,
    getStatusColor: viewModel.getStatusColor,
    buildStatusChipSx: viewModel.buildStatusChipSx,
  },
  filtersBarProps: {
    t: viewModel.t,
    posList: viewModel.posList,
    draftPosFilter: viewModel.draftPosFilter,
    setDraftPosFilter: viewModel.setDraftPosFilter,
    draftStatusFilter: viewModel.draftStatusFilter,
    setDraftStatusFilter: viewModel.setDraftStatusFilter,
    mapTransactionStatus: viewModel.mapTransactionStatus,
    draftSearchType: viewModel.draftSearchType,
    setDraftSearchType: viewModel.setDraftSearchType,
    setDraftSearchValue: viewModel.setDraftSearchValue,
    draftSearchValue: viewModel.draftSearchValue,
    handleSearchValueChange: viewModel.handleSearchValueChange,
    isFilterDisabled: viewModel.isFilterDisabled,
    handleFilterClick: viewModel.handleFilterClick,
    handleRemoveFilters: viewModel.handleRemoveFilters,
    hasAppliedFilters: Boolean(
      viewModel.posFilter ||
        viewModel.statusFilter ||
        viewModel.searchValue ||
        viewModel.searchType ||
        viewModel.draftSearchType
    ),
  },
  tableProps: {
    t: viewModel.t,
    rows: viewModel.rows,
    totalElements: viewModel.totalElements,
    lockedStatus: viewModel.lockedStatus,
    sameStatusRowsLength: viewModel.sameStatusRows.length,
    disabled: viewModel.disabled,
    allSameStatusSelected: viewModel.allSameStatusSelected,
    handleHeaderCheckbox: viewModel.handleHeaderCheckbox,
    dateSort: viewModel.dateSort,
    toggleDateSort: viewModel.toggleDateSort,
    selectedRows: viewModel.selectedRows,
    handleRowCheckbox: viewModel.handleRowCheckbox,
    downloadInvoice: viewModel.downloadInvoice,
    renderAddress: viewModel.renderAddress,
    handleOpenDrawer: viewModel.handleOpenDrawer,
    pageSize: viewModel.pageSize,
    setPageSize: viewModel.setPageSize,
    start: viewModel.start,
    end: viewModel.end,
    page: viewModel.page,
    setPage: viewModel.setPage,
    totalPages: viewModel.totalPages,
  },
  overlaysProps: {
    openDrawer: viewModel.openDrawer,
    handleCloseDrawer: viewModel.handleCloseDrawer,
    selectedTransaction: viewModel.selectedTransaction,
    downloadInvoice: viewModel.downloadInvoice,
    formatDate: viewModel.formatDate,
    closeAfter: viewModel.closeAfter,
    handleRefundAction: viewModel.handleRefundAction,
    disabled: viewModel.disabled,
    reasonModal: viewModel.reasonModal,
    setReasonModal: viewModel.setReasonModal,
    selectedRowsSize: viewModel.selectedRows.size,
    selectedRows: viewModel.selectedRows,
    approveModal: viewModel.approveModal,
    setApproveModal: viewModel.setApproveModal,
    approve: viewModel.approve,
    batchModalOpen: viewModel.batchModalOpen,
    batchAssigneeLevel: viewModel.batch.assigneeLevel,
    setBatchModalOpen: viewModel.setBatchModalOpen,
    handleBatchStatus: viewModel.handleBatchStatus,
    batchErrorOpen: viewModel.batchErrorOpen,
    setBatchErrorOpen: viewModel.setBatchErrorOpen,
  },
});

export type RefundTransactionsReadyViewModel = RefundTransactionsPageViewModel & {
  batch: NonNullable<RefundTransactionsPageViewModel['batch']>;
  restored: true;
};
