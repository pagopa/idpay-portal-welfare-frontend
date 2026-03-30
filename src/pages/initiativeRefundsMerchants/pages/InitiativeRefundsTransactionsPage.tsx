import { Box } from '@mui/material';
import { useAppSelector } from '../../../redux/hooks';
import { initiativeSelector } from '../../../redux/slices/initiativeSlice';
import RefundBatchSummary from '../components/RefundBatchSummary';
import RefundTransactionsBreadcrumbs from '../components/RefundTransactionsBreadcrumbs';
import RefundTransactionsFiltersBar from '../components/RefundTransactionsFiltersBar';
import RefundTransactionsHeader from '../components/RefundTransactionsHeader';
import RefundTransactionsOverlays from '../components/RefundTransactionsOverlays';
import RefundTransactionsTable from '../components/RefundTransactionsTable';
import { useRefundTransactionsPage } from '../hooks/useRefundTransactionsPage';
import {
  buildRefundTransactionsBindings,
  type RefundTransactionsReadyViewModel,
} from '../model/viewModel';

const InitiativeRefundsTransactionsPage = () => {
  const initiativeSelected = useAppSelector(initiativeSelector);
  const refundTransactionsPage = useRefundTransactionsPage();

  if (!refundTransactionsPage.batch || !refundTransactionsPage.restored) {
    return null;
  }

  const readyRefundTransactionsPage = refundTransactionsPage as RefundTransactionsReadyViewModel;

  const {
    breadcrumbsProps,
    headerProps,
    summaryProps,
    filtersBarProps,
    tableProps,
    overlaysProps,
  } = buildRefundTransactionsBindings(
    readyRefundTransactionsPage,
    initiativeSelected.initiativeName ?? ''
  );

  return (
    <Box sx={{ width: '100%', pt: 2, px: 2 }}>
      <RefundTransactionsBreadcrumbs {...breadcrumbsProps} />

      <RefundTransactionsHeader {...headerProps} />

      <RefundBatchSummary {...summaryProps} />

      <RefundTransactionsFiltersBar {...filtersBarProps} />

      <RefundTransactionsTable {...tableProps} />

      <RefundTransactionsOverlays {...overlaysProps} />
    </Box>
  );
};

export default InitiativeRefundsTransactionsPage;
