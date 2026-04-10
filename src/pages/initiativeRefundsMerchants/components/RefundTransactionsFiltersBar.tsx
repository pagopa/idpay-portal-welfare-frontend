import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { PointOfSaleDTO, RewardBatchTrxStatus } from '../../../api/generated/merchants/apiClient';
import { TRANSACTION_SEARCH_TYPE_OPTIONS, TRANSACTION_STATUS_FILTER_OPTIONS } from '../model/constants';

type SearchType = 'fiscalCode' | 'trxCode' | '';

type Props = {
  t: (key: string) => string;
  posList: Array<PointOfSaleDTO>;
  draftPosFilter: string;
  setDraftPosFilter: (value: string) => void;
  draftStatusFilter: string;
  setDraftStatusFilter: (value: string) => void;
  mapTransactionStatus: (status?: RewardBatchTrxStatus) => { label: string; color: string };
  draftSearchType: SearchType;
  setDraftSearchType: (value: SearchType) => void;
  setDraftSearchValue: (value: string) => void;
  draftSearchValue: string;
  handleSearchValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFilterDisabled: boolean;
  handleFilterClick: () => void;
  handleRemoveFilters: () => void;
  hasAppliedFilters: boolean;
};

const RefundTransactionsFiltersBar = ({
  t,
  posList,
  draftPosFilter,
  setDraftPosFilter,
  draftStatusFilter,
  setDraftStatusFilter,
  mapTransactionStatus,
  draftSearchType,
  setDraftSearchType,
  setDraftSearchValue,
  draftSearchValue,
  handleSearchValueChange,
  isFilterDisabled,
  handleFilterClick,
  handleRemoveFilters,
  hasAppliedFilters,
}: Props) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'nowrap' }}>
    <FormControl
      size="small"
      sx={{ minWidth: 180, flex: '1 1 auto', maxWidth: 250, '& .MuiInputLabel-root': { fontSize: 14, lineHeight: 'normal' } }}
    >
      <InputLabel>{t('pages.initiativeMerchantsTransactions.table.pos')}</InputLabel>
      <Select
        disabled={posList.length === 0 || posList[0] === undefined}
        value={draftPosFilter}
        onChange={(event) => setDraftPosFilter(event.target.value)}
        label={t('pages.initiativeMerchantsTransactions.table.pos')}
        MenuProps={{ PaperProps: { sx: { maxHeight: 210, overflowY: 'auto' } } }}
        renderValue={(selected) => {
          const selectedPointOfSale = posList.find((pointOfSale) => pointOfSale.id === selected);
          const label = selectedPointOfSale?.franchiseName ?? selected;
          return (
            <Tooltip
              title={
                selectedPointOfSale?.type === 'ONLINE'
                  ? `${label} - ${selectedPointOfSale?.website}`
                  : `${label} - ${selectedPointOfSale?.province} - ${selectedPointOfSale?.address}`
              }
              disableHoverListener={!selected}
            >
              <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {selectedPointOfSale?.type === 'ONLINE'
                  ? `${label} - ${selectedPointOfSale?.website}`
                  : `${label} - ${selectedPointOfSale?.province} - ${selectedPointOfSale?.address}`}
              </Box>
            </Tooltip>
          );
        }}
      >
        {posList.map((pointOfSale) => (
          <MenuItem key={pointOfSale.id} value={pointOfSale.id}>
            <Tooltip
              title={
                pointOfSale.type === 'ONLINE'
                  ? `${pointOfSale.franchiseName} - ${pointOfSale.website}`
                  : `${pointOfSale.franchiseName} - ${pointOfSale.province} - ${pointOfSale.address}`
              }
              placement="left"
              arrow
            >
              <Box sx={{ maxWidth: 248, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {pointOfSale.type === 'ONLINE'
                  ? `${pointOfSale.franchiseName} - ${pointOfSale.website}`
                  : `${pointOfSale.franchiseName} - ${pointOfSale.province} - ${pointOfSale.address}`}
              </Box>
            </Tooltip>
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl size="small" sx={{ minWidth: 140, flex: '0 1 auto', '& .MuiInputLabel-root': { fontSize: 14, lineHeight: 'normal' } }}>
      <InputLabel>{t('pages.initiativeMerchantsTransactions.table.status')}</InputLabel>
      <Select
        value={draftStatusFilter}
        label={t('pages.initiativeMerchantsTransactions.table.status')}
        onChange={(event) => setDraftStatusFilter(event.target.value)}
      >
        {TRANSACTION_STATUS_FILTER_OPTIONS.map((status) => {
          const mapped = mapTransactionStatus(status);
          return (
            <MenuItem key={status} value={status} sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                label={mapped.label}
                color={mapped.color as any}
                size="small"
                sx={{
                  cursor: 'pointer',
                  fontSize: 14,
                  '& .MuiChip-label': { whiteSpace: 'nowrap' },
                  backgroundColor:
                    mapped.label === t('pages.initiativeMerchantsTransactions.table.toCheck') ? '#C4DCF5' : '',
                  color: mapped.label === t('pages.initiativeMerchantsTransactions.table.toCheck') ? '#17324D' : '',
                }}
              />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>

    <FormControl size="small" sx={{ minWidth: 140, flex: '0 1 auto', '& .MuiInputLabel-root': { fontSize: 14, lineHeight: 'normal' } }}>
      <InputLabel>{t('pages.initiativeMerchantsTransactions.table.search')}</InputLabel>
      <Select
        value={draftSearchType}
        label={t('pages.initiativeMerchantsTransactions.table.search')}
        onChange={(event) => {
          setDraftSearchType(event.target.value as SearchType);
          setDraftSearchValue('');
        }}
      >
        {TRANSACTION_SEARCH_TYPE_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {t(option.labelKey)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <TextField
      disabled={!draftSearchType}
      size="small"
      label={t('pages.initiativeMerchantsTransactions.table.insertTrxCode')}
      value={draftSearchValue}
      onChange={handleSearchValueChange}
      sx={{ minWidth: 150, flex: '1 1 auto', maxWidth: 200 }}
    />

    <Button
      variant="outlined"
      color="primary"
      disabled={isFilterDisabled}
      onClick={handleFilterClick}
      sx={{ height: '40px', paddingX: 3, fontWeight: 600, borderRadius: '4px', textTransform: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
    >
      {t('pages.initiativeMerchantDetail.filterBtn')}
    </Button>

    <ButtonNaked
      color="primary"
      disabled={!hasAppliedFilters}
      onClick={handleRemoveFilters}
      sx={{
        height: '40px',
        paddingX: 2,
        fontWeight: 600,
        textTransform: 'none',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        opacity: hasAppliedFilters ? 1 : 0.5,
      }}
    >
      {t('pages.initiativeMerchant.form.removeFiltersBtn')}
    </ButtonNaked>
  </Box>
);

export default RefundTransactionsFiltersBar;