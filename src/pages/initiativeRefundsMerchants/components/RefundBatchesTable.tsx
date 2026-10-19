import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { PAGE_SIZE_OPTIONS } from '../model/constants';
import { RefundItem } from '../model/types';
import RefundRow from './RefundRow';

type Props = {
  t: (key: string) => string;
  rows: Array<RefundItem>;
  totalElements: number;
  dateSort: '' | 'asc' | 'desc';
  toggleDateSort: () => void;
  openBatchDetails: (row: RefundItem) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  start: number;
  end: number;
  page: number;
  setPage: (value: number) => void;
  totalPages: number;
};

const RefundBatchesTable = ({
  t,
  rows,
  totalElements,
  dateSort,
  toggleDateSort,
  openBatchDetails,
  pageSize,
  setPageSize,
  start,
  end,
  page,
  setPage,
  totalPages,
}: Props) => {
  if (totalElements === 0) {
    return (
      <Table sx={{ mt: 2, backgroundColor: '#FFFFFF' }}>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={9}
              sx={{
                textAlign: 'center',
                py: 4,
                fontSize: 16,
                fontWeight: 500,
                color: '#5C6F82',
                backgroundColor: '#FFFFFF',
              }}
            >
              {t('pages.initiativeMerchantsRefunds.emptyState')}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <>
      <Table sx={{ mt: 2, width: '100%', tableLayout: 'fixed', '& .MuiTableCell-root': { px: 1, overflow: 'hidden' }, '& .MuiTableCell-root:first-of-type': { pl: 2 }, '& .MuiTableCell-root:last-of-type': { pr: 2 } }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '18%' }}>
              {t('pages.initiativeMerchantsRefunds.table.name')}
            </TableCell>
            <TableCell>
              {t('pages.initiativeMerchantsRefunds.table.period')}
            </TableCell>
            <TableCell sortDirection={dateSort === '' ? false : dateSort}>
              <TableSortLabel
                active={dateSort !== ''}
                direction={dateSort === '' ? 'asc' : dateSort}
                onClick={toggleDateSort}
                sx={{ maxWidth: '100%' }}
              >
                <Box component="span" sx={{ minWidth: 0 }}>
                  {t('pages.initiativeMerchantsRefunds.table.requestRefundDate')}
                </Box>
              </TableSortLabel>
            </TableCell>
            <TableCell>
              {t('pages.initiativeMerchantsRefunds.table.requestedRefund')}
            </TableCell>
            <TableCell>
              {t('pages.initiativeMerchantsRefunds.table.approvedRefund')}
            </TableCell>
            <TableCell>
              {t('pages.initiativeMerchantsRefunds.table.suspendedRefund')}
            </TableCell>
            <TableCell>
              {t('pages.initiativeMerchantsRefunds.table.checksPercentage')}
            </TableCell>
            <TableCell sx={{ width: 112, whiteSpace: 'nowrap' }}>
              {t('pages.initiativeMerchantsRefunds.table.assignee')}
            </TableCell>
            <TableCell sx={{ width: 180 }}>
              {t('pages.initiativeMerchantsRefunds.table.status')}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody sx={{ backgroundColor: '#FFFFFF' }}>
          {rows.map((row) => (
            <RefundRow key={row.id} row={row} t={t} onClick={() => openBatchDetails(row)} />
          ))}
        </TableBody>
      </Table>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 3,
          color: '#33485C',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>{t('pages.initiativeMerchantsRefunds.rowsPerPage')}</span>

          <FormControl size="small">
            <Select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              sx={{ height: 32, '& .MuiSelect-select': { paddingY: '3px' } }}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>{`${start}-${end} di ${totalElements}`}</Box>

        <ChevronLeftIcon
          onClick={() => page > 0 && setPage(page - 1)}
          sx={{ cursor: page > 0 ? 'pointer' : 'default', opacity: page > 0 ? 1 : 0.3, fontSize: 20 }}
        />

        <ChevronRightIcon
          onClick={() => page < totalPages - 1 && setPage(page + 1)}
          sx={{
            cursor: page < totalPages - 1 ? 'pointer' : 'default',
            opacity: page < totalPages - 1 ? 1 : 0.3,
            fontSize: 20,
          }}
        />
      </Box>
    </>
  );
};

export default RefundBatchesTable;
