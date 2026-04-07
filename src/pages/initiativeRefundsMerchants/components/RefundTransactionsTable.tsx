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
import { PointOfSaleDTO } from '../../../api/generated/merchants/PointOfSaleDTO';
import { RewardBatchTrxStatusEnum } from '../../../api/generated/merchants/RewardBatchTrxStatus';
import { PAGE_SIZE_OPTIONS } from '../model/constants';
import { formatCurrencyFromCents } from '../model/formatters';
import { TrxItem } from '../model/types';

type Props = {
  t: (key: string) => string;
  rows: Array<TrxItem>;
  totalElements: number;
  lockedStatus: RewardBatchTrxStatusEnum | null;
  sameStatusRowsLength: number;
  disabled: boolean;
  allSameStatusSelected: boolean;
  handleHeaderCheckbox: () => void;
  dateSort: '' | 'asc' | 'desc';
  toggleDateSort: () => void;
  selectedRows: Set<string>;
  handleRowCheckbox: (rowId: string, rowStatus?: RewardBatchTrxStatusEnum) => void;
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
          <Box style={{ display: "inline-block", maxWidth: 150 }}>
            <ButtonNaked
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              sx={{
                textDecoration: "underline",
                fontWeight: 600,
                display: "inline-block",
                overflow: "hidden",
                textOverflow: "ellipsis",
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
      const text = `${value.address} ${value.province}`;

      return (
        <Tooltip title={text}>
          <Box
            sx={{
              display: "inline-block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 150,
              whiteSpace: "nowrap",
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
      <Table sx={{ mt: 2, width: '100%', tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell width={'4.5%'}>
              {lockedStatus && sameStatusRowsLength > 0 && (
                <Checkbox disabled={disabled} checked={allSameStatusSelected} onChange={handleHeaderCheckbox} />
              )}
            </TableCell>
            <TableCell sx={{ whiteSpace: { lg: 'nowrap', md: 'none' } }}>{t('pages.initiativeMerchantsTransactions.table.invoice')}</TableCell>
            <TableCell sx={{ whiteSpace: { lg: 'nowrap', md: 'none' } }}>{t('pages.initiativeMerchantsTransactions.table.pos')}</TableCell>
            <TableCell sx={{ whiteSpace: { lg: 'nowrap', md: 'none' } }}>{t('pages.initiativeMerchantsTransactions.table.address')}</TableCell>
            <TableCell sortDirection={dateSort === '' ? false : dateSort}>
              <TableSortLabel active={dateSort !== ''} direction={dateSort === '' ? 'asc' : dateSort} onClick={toggleDateSort}>
                {t('pages.initiativeMerchantsTransactions.table.dateTime')}
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ whiteSpace: { lg: 'nowrap', md: 'none' } }}>{t('pages.initiativeMerchantsTransactions.table.requestedRefund')}</TableCell>
            <TableCell sx={{ whiteSpace: { lg: 'nowrap', md: 'none' } }}>{t('pages.initiativeMerchantsTransactions.table.status')}</TableCell>
            <TableCell sx={{ width: 55, maxWidth: 55, minWidth: 44, p: 0, pr: 1, textAlign: 'right' }} />
          </TableRow>
        </TableHead>

        <TableBody sx={{ backgroundColor: '#FFFFFF' }}>
          {rows.map((row) => {
            const isRowSelectionDisabled = lockedStatus !== null && row.status !== lockedStatus;
            const isChecked = selectedRows.has(row.id);

            return (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Checkbox
                    checked={isChecked}
                    disabled={isRowSelectionDisabled || disabled}
                    onChange={() => handleRowCheckbox(row.id, row.status)}
                  />
                </TableCell>

                <TableCell>
                  <Tooltip title={row.invoiceFileName}>
                    <Box sx={{ display: 'inline-flex', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 170 }}>
                      <ButtonNaked
                        color="primary"
                        onClick={() => downloadInvoice(row.pointOfSaleId, row.transactionId, row.invoiceFileName)}
                        sx={{ maxWidth: { lg: 220, md: 150, sm: 130, xs: 110 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', wordBreak: 'break-all' }}
                      >
                        {row.invoiceFileName}
                      </ButtonNaked>
                    </Box>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Tooltip title={row.shop}>
                    <Box sx={{ pt: 0.5, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 175, whiteSpace: 'nowrap' }}>
                      {row.shop}
                    </Box>
                  </Tooltip>
                </TableCell>

                <TableCell>{renderAddress(row.pointOfSaleId)}</TableCell>

                <TableCell>
                  <Tooltip title={row.date}>
                    <Box sx={{ display: 'inline-flex', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 }}>{row.date}</Box>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Tooltip title={formatCurrencyFromCents(row.amountCents)}>
                    <Box sx={{ display: 'inline-flex', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>
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
                      '& .MuiChip-label': { whiteSpace: 'nowrap' },
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