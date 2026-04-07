import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useInitiative } from '../../../hooks/useInitiative';
import { useAppSelector } from '../../../redux/hooks';
import { initiativeSelector } from '../../../redux/slices/initiativeSlice';
import RefundBatchesFiltersBar from '../components/RefundBatchesFiltersBar';
import RefundBatchesPageHeader from '../components/RefundBatchesPageHeader';
import RefundBatchesTable from '../components/RefundBatchesTable';
import { useRefundBatchesPage } from '../hooks/useRefundBatchesPage';
import { buildRefundBatchesBindings } from '../model/viewModel';

const InitiativeRefundsMerchantsPage = () => {
  const { t } = useTranslation();
  const initiativeSelected = useAppSelector(initiativeSelector);
  useInitiative();

  const refundBatchesPage = useRefundBatchesPage({ t });
  const { filtersBarProps, tableProps } = buildRefundBatchesBindings(refundBatchesPage, t);

  return (
    <Box sx={{ width: '100%', pt: 2, px: 2 }}>
      <RefundBatchesPageHeader t={t} initiativeName={initiativeSelected.initiativeName ?? ''} />

      <RefundBatchesFiltersBar {...filtersBarProps} />

      <RefundBatchesTable {...tableProps} />
    </Box>
  );
};

export default InitiativeRefundsMerchantsPage;
