import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import {
  BATCH_STATUS_FILTER_OPTIONS,
  MERCHANT_ASSIGNEE_OPTIONS,
  MERCHANT_REFUND_PERIOD_OPTIONS,
} from '../model/constants';
import { getStatusChipData } from '../model/status';
import { MerchantItem } from '../model/types';

type Props = {
  t: (key: string) => string;
  draftName: string;
  setDraftName: (value: string) => void;
  draftPeriod: string;
  setDraftPeriod: (value: string) => void;
  draftStatus: string;
  setDraftStatus: (value: string) => void;
  draftAssignee: string;
  setDraftAssignee: (value: string) => void;
  businessNameList: Array<MerchantItem>;
  isFilterDisabled: boolean;
  applyFilters: () => void;
  clearFilters: () => void;
  hasAppliedFilters: boolean;
};

const RefundBatchesFiltersBar = ({
  t,
  draftName,
  setDraftName,
  draftPeriod,
  setDraftPeriod,
  draftStatus,
  setDraftStatus,
  draftAssignee,
  setDraftAssignee,
  businessNameList,
  isFilterDisabled,
  applyFilters,
  clearFilters,
  hasAppliedFilters,
}: Props) => (
  <Box sx={{ display: 'flex', gap: 3, mt: 3, mb: 3, alignItems: 'center' }}>
    <FormControl
      variant="outlined"
      size="small"
      sx={{ minWidth: 150, width: 300,
      flexShrink: 0, '& .MuiInputLabel-root': { fontSize: 14, lineHeight: 'normal' } }}
    >
      <InputLabel id="name-filter-label">{t('pages.initiativeMerchantsRefunds.table.name')}</InputLabel>
      <Select
        labelId="name-filter-label"
        value={draftName}
        label={t('pages.initiativeMerchantsRefunds.table.name')}
        onChange={(event) => setDraftName(event.target.value)}
        sx={{ height: 40, display: 'flex', alignItems: 'center', width: "100%"}}
      >
        {businessNameList.map((merchant) => (
          <MenuItem key={merchant.merchantId} value={merchant.merchantId}>
            <Tooltip title={merchant.businessName} placement="left" arrow>
              <Box
                sx={{
                  maxWidth: 248,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {merchant.businessName}
              </Box>
            </Tooltip>
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl
      variant="outlined"
      size="small"
      sx={{ minWidth: 150, '& .MuiInputLabel-root': { fontSize: 14, lineHeight: 'normal' } }}
    >
      <InputLabel id="period-filter-label">{t('pages.initiativeMerchantsRefunds.table.period')}</InputLabel>
      <Select
        labelId="period-filter-label"
        value={draftPeriod}
        label={t('pages.initiativeMerchantsRefunds.table.period')}
        onChange={(event) => setDraftPeriod(event.target.value)}
        sx={{ height: 40, display: 'flex', alignItems: 'center' }}
      >
        {MERCHANT_REFUND_PERIOD_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {t(option.labelKey)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl
      variant="outlined"
      size="small"
      sx={{ minWidth: 150, '& .MuiInputLabel-root': { fontSize: 14, lineHeight: 'normal' } }}
    >
      <InputLabel id="status-filter-label">{t('pages.initiativeMerchantsRefunds.table.status')}</InputLabel>
      <Select
        labelId="status-filter-label"
        value={draftStatus}
        label={t('pages.initiativeMerchantsRefunds.table.status')}
        onChange={(event) => setDraftStatus(event.target.value)}
        sx={{ height: 40, display: 'flex', alignItems: 'center' }}
      >
        {BATCH_STATUS_FILTER_OPTIONS.map((option) => {
          const chipData = getStatusChipData(option.value, option.role, t);
          return (
            <MenuItem key={option.value} value={option.value}>
              <Chip label={chipData.label} color={chipData.color} size="small" sx={chipData.sx} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>

    <FormControl
      variant="outlined"
      size="small"
      sx={{ minWidth: 150, '& .MuiInputLabel-root': { fontSize: 14, lineHeight: 'normal' } }}
    >
      <InputLabel id="assignee-filter-label">{t('pages.initiativeMerchantsRefunds.table.assignee')}</InputLabel>
      <Select
        labelId="assignee-filter-label"
        value={draftAssignee}
        label={t('pages.initiativeMerchantsRefunds.table.assignee')}
        onChange={(event) => setDraftAssignee(event.target.value)}
        sx={{ height: 40, display: 'flex', alignItems: 'center' }}
      >
        {MERCHANT_ASSIGNEE_OPTIONS.map((assignee) => (
          <MenuItem key={assignee} value={t(`pages.initiativeMerchantsRefunds.${assignee}`)}>
            {t(`pages.initiativeMerchantsRefunds.${assignee}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Button
      variant="outlined"
      color="primary"
      disabled={isFilterDisabled}
      onClick={applyFilters}
      sx={{ height: '40px', paddingX: 3, fontWeight: 600, borderRadius: '4px', textTransform: 'none' }}
    >
      {t('pages.initiativeMerchantDetail.filterBtn')}
    </Button>

    <ButtonNaked
      color="primary"
      disabled={!hasAppliedFilters}
      onClick={clearFilters}
      sx={{
        height: '40px',
        paddingX: 2,
        fontWeight: 600,
        textTransform: 'none',
        opacity: hasAppliedFilters ? 1 : 0.5,
      }}
    >
      {t('pages.initiativeMerchant.form.removeFiltersBtn')}
    </ButtonNaked>
  </Box>
);

export default RefundBatchesFiltersBar;