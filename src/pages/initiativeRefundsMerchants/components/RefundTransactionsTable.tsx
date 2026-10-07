import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ReactNode } from 'react';
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { PointOfSaleDTO, RewardBatchTrxStatus } from '../../../api/generated/merchants/apiClient';
import { PAGE_SIZE_OPTIONS } from '../model/constants';
import { formatCurrencyFromCents } from '../model/formatters';
import { TrxItem } from '../model/types';

const twoLineCellSx = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  overflowWrap: 'anywhere',
  whiteSpace: 'normal',
  maxWidth: '100%',
  minWidth: 0,
  textAlign: 'left',
} as const;

type Props = {
  t: (key: string) => string;
  rows: Array<TrxItem>;
  totalElements: number;
  lockedStatus: RewardBatchTrxStatus | null;
  sameStatusRowsLength: number;
  disabled: boolean;
  allSameStatusSelected: boolean;
  handleHeaderCheckbox: () => void;
  dateSort: '' | 'asc' | 'desc';
  toggleDateSort: () => void;
  selectedRows: Set<string>;
  handleRowCheckbox: (rowId: string, rowStatus?: RewardBatchTrxStatus) => void;
  downloadInvoice: (pointOfSaleId: string | any, transactionId: string | any, invoiceFileName: string | any) => void;
  posList: Array<PointOfSaleDTO>;
  handleOpenDrawer: (row: TrxItem) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  start: number;
  end: number;
  page: number;
  setPage: (value: number) => void;
  totalPages: number;
};

const RefundTransactionsTable = ({
  t,
  rows,
  totalElements,
  lockedStatus,
  sameStatusRowsLength,
  disabled,
  allSameStatusSelected,
  handleHeaderCheckbox,
  dateSort,
  toggleDateSort,
  selectedRows,
  handleRowCheckbox,
  downloadInvoice,
  posList,
  handleOpenDrawer,
  pageSize,
  setPageSize,
  start,
  end,
  page,
  setPage,
  totalPages,
}: Props) => {
  const renderAddress = (posId: string | undefined): ReactNode => {
    if (!posId) {
      return "-";
    }

    const value = posList.find((e) => e.id === posId);

    if (!value) {
      return "-";
    }

    if (value.type === "ONLINE") {
      if (!value.website) {
        return "-";
      }

      const url = value.website.startsWith("http")
        ? value.website
        : `https://${value.website}`;

      return (
        <Tooltip title={value.website}>
          <Box sx={{ minWidth: 0, width: '100%' }}>
            <ButtonNaked
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              sx={{
                ...twoLineCellSx,
                textDecoration: "underline",
                fontWeight: 600,
                pt: 0.5,
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
              }}
            >
              {value.website}
            </ButtonNaked>
          </Box>
        </Tooltip>
      );
    }

    if (value.address && value.province) {
      const text = `${value.address}, ${value.streetNumber} ${value.province}`;

      return (
        <Tooltip title={text}>
          <Box
            sx={{
              ...twoLineCellSx,
              pt: 0.5,
            }}
          >
            {text}
          </Box>
        </Tooltip>
      );
    }

    return "-";
  };

  if (totalElements === 0 || rows.length === 0) {
    return (
      <Table sx={{ mt: 2, backgroundColor: '#FFFFFF' }}>
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, fontSize: 16, fontWeight: 500, color: '#5C6F82', backgroundColor: '#FFFFFF' }}>
              {t('pages.initiativeMerchantsRefunds.emptyState')}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <>
      <Box sx={{ width: '100%', minWidth: 0 }}>
      <Table sx={{ mt: 2, width: '100%', tableLayout: 'fixed', '& .MuiTableCell-root': { px: 1, overflowWrap: 'anywhere' } }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 64, p: 1 }}>
              {lockedStatus && sameStatusRowsLength > 0 && (
                <Checkbox disabled={disabled} checked={allSameStatusSelected} onChange={handleHeaderCheckbox} />
              )}
            </TableCell>
            <TableCell>{t('pages.initiativeMerchantsTransactions.table.invoice')}</TableCell>
            <TableCell>{t('pages.initiativeMerchantsTransactions.table.pos')}</TableCell>
            <TableCell>{t('pages.initiativeMerchantsTransactions.table.address')}</TableCell>
            <TableCell sortDirection={dateSort === '' ? false : dateSort}>
              <TableSortLabel active={dateSort !== ''} direction={dateSort === '' ? 'asc' : dateSort} onClick={toggleDateSort}>
                {t('pages.initiativeMerchantsTransactions.table.dateTime')}
              </TableSortLabel>
            </TableCell>
            <TableCell>{t('pages.initiativeMerchantsTransactions.table.requestedRefund')}</TableCell>
            <TableCell>{t('pages.initiativeMerchantsTransactions.table.status')}</TableCell>
            <TableCell sx={{ width: 55, maxWidth: 55, minWidth: 44, p: 0, pr: 1, textAlign: 'right' }} />
          </TableRow>
        </TableHead>

        <TableBody sx={{ backgroundColor: '#FFFFFF' }}>
          {rows.map((row) => {
            const isRowSelectionDisabled = lockedStatus !== null && row.status !== lockedStatus;
            const isChecked = selectedRows.has(row.id);

            return (
              <TableRow key={row.id} hover>
                <TableCell sx={{ p: 1 }}>
                  <Checkbox
                    checked={isChecked}
                    disabled={isRowSelectionDisabled || disabled}
                    onChange={() => handleRowCheckbox(row.id, row.status)}
                  />
                </TableCell>

                <TableCell>
                  <Tooltip title={row.invoiceFileName}>
                    <Box sx={{ minWidth: 0, width: '100%' }}>
                      <ButtonNaked
                        color="primary"
                        onClick={() => downloadInvoice(row.pointOfSaleId, row.transactionId, row.invoiceFileName)}
                        sx={twoLineCellSx}
                      >
                        {row.invoiceFileName}
                      </ButtonNaked>
                    </Box>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Tooltip title={row.shop}>
                    <Box sx={{ ...twoLineCellSx, pt: 0.5 }}>
                      {row.shop}
                    </Box>
                  </Tooltip>
                </TableCell>

                <TableCell>{renderAddress(row.pointOfSaleId)}</TableCell>

                <TableCell>
                  <Tooltip title={row.date}>
                    <Box sx={twoLineCellSx}>{row.date}</Box>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Tooltip title={formatCurrencyFromCents(row.amountCents)}>
                    <Box sx={twoLineCellSx}>
                      {formatCurrencyFromCents(row.amountCents)}
                    </Box>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Chip
                    label={row.statusLabel}
                    color={row.statusColor as any}
                    sx={{
                      fontSize: '14px',
                      maxWidth: '100%',
                      height: 'auto',
                      minHeight: 32,
                      py: 0.5,
                      '& .MuiChip-label': { ...twoLineCellSx, textAlign: 'center' },
                      backgroundColor: row.statusLabel === t('pages.initiativeMerchantsTransactions.table.toCheck') ? '#C4DCF5' : '',
                      color: row.statusLabel === t('pages.initiativeMerchantsTransactions.table.toCheck') ? '#17324D' : '',
                    }}
                  />
                </TableCell>

                <TableCell sx={{ textAlign: 'right' }}>
                  <ButtonNaked onClick={() => handleOpenDrawer(row)}>
                    <ChevronRightIcon color="primary" />
                  </ButtonNaked>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3, color: '#33485C', fontSize: '14px', fontWeight: 500 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>{t('pages.initiativeMerchantsRefunds.rowsPerPage')}</span>
          <FormControl size="small">
            <Select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} sx={{ height: 32, '& .MuiSelect-select': { paddingY: '3px' } }}>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>{`${start}-${end} di ${totalElements}`}</Box>

        <ChevronLeftIcon onClick={() => page > 0 && setPage(page - 1)} sx={{ cursor: page > 0 ? 'pointer' : 'default', opacity: page > 0 ? 1 : 0.3, fontSize: 20 }} />
        <ChevronRightIcon
          onClick={() => page < totalPages - 1 && setPage(page + 1)}
          sx={{ cursor: page < totalPages - 1 ? 'pointer' : 'default', opacity: page < totalPages - 1 ? 1 : 0.3, fontSize: 20 }}
        />
      </Box>
    </>
  );
};

export default RefundTransactionsTable;
