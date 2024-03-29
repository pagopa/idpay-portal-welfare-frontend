/* eslint-disable functional/immutable-data */
import { ArrowForwardIos } from '@mui/icons-material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { itIT } from '@mui/material/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath } from 'react-router';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { ExportDetailDTO } from '../../api/generated/initiative/ExportDetailDTO';
import { ExportListDTO } from '../../api/generated/initiative/ExportListDTO';
import { ExportSummaryDTO } from '../../api/generated/initiative/ExportSummaryDTO';

import {
  downloadURI,
  fileFromReader,
  formatedCurrency,
  formatIban,
  initiativePagesBreadcrumbsContainerStyle,
  initiativePagesFiltersFormContainerStyle,
  initiativePagesTableContainerStyle,
} from '../../helpers';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { getExportRefundsListPaged, getExportSummary } from '../../services/intitativeService';
import { getRefundStatusChip } from '../../helpers';
import EmptyList from '../components/EmptyList';
import BreadcrumbsBox from '../components/BreadcrumbsBox';
import { ENV } from '../../utils/env';
import InitiativeRefundsDetailsModal from './initiativeRefundsDetailsModal';
import { getRefundStatus } from './helpers';

const InitiativeRefundsDetails = () => {
  const { t } = useTranslation();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const addError = useErrorDispatcher();
  const theme = createTheme(itIT);
  const setLoading = useLoading('GET_INITIATIVE_REFUNDS_DETAILS_SUMMARY');
  const [detailsSummary, setDetailsSummary] = useState<ExportSummaryDTO>();
  const [rows, setRows] = useState<Array<ExportDetailDTO>>([]);
  const [openRefundsDetailModal, setOpenRefundsDetailModal] = useState<boolean>(false);
  const [refundEventId, setRefundEventId] = useState<string | undefined>('');
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [cro, setCRO] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();

  interface MatchParams {
    id: string;
    exportId: string;
    filePath: string;
  }

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_REFUNDS_DETAIL],
    exact: true,
    strict: false,
  });

  const { id, exportId, filePath } = (match?.params as MatchParams) || {};

  useEffect(() => {
    if (typeof id !== undefined && typeof exportId !== undefined) {
      setLoading(true);
      getExportSummary(id, exportId)
        .then((res: any) => {
          setDetailsSummary(res);
        })
        .catch((error) => {
          addError({
            id: 'GET_EXPORTS_PAGED_ERROR',
            blocking: false,
            error,
            techDescription: 'An error occurred getting refund detail summary',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, exportId]);

  useEffect(() => {
    if (typeof id !== undefined && typeof exportId !== undefined) {
      getTableData(id, exportId, page, cro, filterStatus);
    }
  }, [id, exportId, page]);

  const getTableData = (
    initiativeId: string,
    exportId: string,
    page: number,
    cro?: string,
    status?: string
  ) => {
    setLoading(true);
    getExportRefundsListPaged(initiativeId, exportId, page, cro, status)
      .then((res: ExportListDTO) => {
        if (typeof res.totalElements === 'number') {
          setTotalElements(res.totalElements);
        }

        if (typeof res.pageNo === 'number') {
          setPage(res.pageNo);
        }

        if (typeof res != undefined && Array.isArray(res.content) && res.content.length > 0) {
          setRows(res.content);
        } else {
          setRows([]);
        }
      })
      .catch((error) => {
        addError({
          id: 'GET_EXPORTS_PAGED_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting refund export paged data',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDownloadFile = async (data: { id: string; filePath: string | undefined }) => {
    if (typeof data.id === 'string' && typeof data.filePath === 'string') {
      const token = storageTokenOps.read();

      const res = await fetch(
        `${ENV.URL_API.INITIATIVE}/${data.id}/reward/exports/${data.filePath}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        const url = await fileFromReader(res.body?.getReader());
        downloadURI(url, data.filePath);
      } else {
        const error = new Error(res.statusText);
        addError({
          id: 'GET_EXPORTS_FILE_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting export file',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      }
    }
  };

  const handleOpenRefundModal = (e: string | undefined) => {
    setRefundEventId(e);
    setOpenRefundsDetailModal(true);
  };

  const handleCloseRefundModal = () => {
    setOpenRefundsDetailModal(false);
  };

  const formik = useFormik({
    initialValues: {
      searchCRO: '',
      filterStatus: '',
    },
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (typeof id === 'string') {
        const searchCRO = values.searchCRO.length > 0 ? values.searchCRO : undefined;
        setCRO(searchCRO);
        const filterStatus = values.filterStatus.length > 0 ? values.filterStatus : undefined;
        setFilterStatus(filterStatus);
        getTableData(id, exportId, 0, searchCRO, filterStatus);
      }
    },
  });

  const resetForm = () => {
    const initialValues = { searchCRO: '', filterStatus: '' };
    formik.resetForm({ values: initialValues });
    setCRO(undefined);
    setFilterStatus(undefined);
    setRows([]);
    if (typeof id === 'string' && typeof exportId === 'string') {
      getTableData(id, exportId, 0, undefined, undefined);
    }
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box
        sx={{
          ...initiativePagesBreadcrumbsContainerStyle,
          mb: 5,
        }}
      >
        <BreadcrumbsBox
          backUrl={`${BASE_ROUTE}/rimborsi-iniziativa/${id}`}
          backLabel={t('breadcrumbs.back')}
          items={[
            initiativeSel.initiativeName,
            t('breadcrumbs.initiativeRefunds'),
            t('breadcrumbs.initiativeRefundsDetails'),
          ]}
        />
        <Box sx={{ display: 'grid', gridColumn: 'span 10', mt: 2 }}>
          <TitleBox
            title={filePath}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 2', mt: 2, justifyContent: 'right' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={() => handleDownloadFile({ id, filePath })}
            data-testid="download-btn-test"
          >
            {t('pages.initiativeRefundsDetails.downloadBtn')}
          </Button>
        </Box>
        <Paper
          sx={{
            display: 'grid',
            gridColumn: 'span 12',
            gridTemplateColumns: 'repeat(12, 1fr)',
            width: '100%',
            mt: 2,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridColumn: 'span 6',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ gridColumn: 'span 5' }}>
              {t('pages.initiativeRefundsDetails.recap.creationDate')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {detailsSummary?.createDate
                ? detailsSummary.createDate.toLocaleString('fr-BE', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })
                : '-'}
            </Typography>

            <Typography variant="body2" sx={{ gridColumn: 'span 5' }}>
              {t('pages.initiativeRefundsDetails.recap.totalOrders')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {formatedCurrency(detailsSummary?.totalAmount)}
            </Typography>

            <Typography variant="body2" sx={{ gridColumn: 'span 5' }}>
              {t('pages.initiativeRefundsDetails.recap.totalRefunds')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {formatedCurrency(detailsSummary?.totalRefundedAmount)}
            </Typography>

            <Typography variant="body2" sx={{ gridColumn: 'span 5' }}>
              {t('pages.initiativeRefundsDetails.recap.totalWarrant')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {detailsSummary?.totalRefunds ? detailsSummary.totalRefunds : '-'}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridColumn: 'span 6',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridTemplateRows: 'max-content',
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ gridColumn: 'span 5' }}>
              {t('pages.initiativeRefundsDetails.recap.percentageSuccess')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {detailsSummary?.successPercentage ? `${detailsSummary.successPercentage}%` : '-'}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 5' }}>
              {t('pages.initiativeRefundsDetails.recap.status')}
            </Typography>
            <Box sx={{ gridColumn: 'span 7' }}>
              {detailsSummary?.status
                ? getRefundStatusChip({
                    status: detailsSummary.status,
                    percentageResulted: undefined,
                  })
                : '-'}
            </Box>
          </Box>
        </Paper>
      </Box>
      <Box sx={initiativePagesFiltersFormContainerStyle}>
        <FormControl sx={{ gridColumn: 'span 8' }}>
          <TextField
            label={t('pages.initiativeRefundsDetails.form.cro')}
            placeholder={t('pages.initiativeRefundsDetails.form.cro')}
            name="searchCRO"
            aria-label="searchCRO"
            role="input"
            InputLabelProps={{ required: false }}
            value={formik.values.searchCRO}
            onChange={(e) => formik.handleChange(e)}
            size="small"
            data-testid="searchCRO-test"
          />
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 2' }} size="small">
          <InputLabel>{t('pages.initiativeRefundsDetails.form.outcome')}</InputLabel>
          <Select
            id="filterStatus"
            inputProps={{
              'data-testid': 'filterStatus-select',
            }}
            name="filterStatus"
            label={t('pages.initiativeRefundsDetails.form.outcome')}
            placeholder={t('pages.initiativeRefundsDetails.form.outcome')}
            onChange={(e) => formik.handleChange(e)}
            value={formik.values.filterStatus}
          >
            <MenuItem value="EXPORTED" data-testid="filterStatusOnEvaluation-test">
              {t('pages.initiativeRefundsDetails.status.onEvaluation')}
            </MenuItem>
            <MenuItem value="COMPLETED_OK" data-testid="filterStatusOnboardingOk-test">
              {t('pages.initiativeRefundsDetails.status.done')}
            </MenuItem>
            <MenuItem value="COMPLETED_KO" data-testid="filterStatusEligible-test">
              {t('pages.initiativeRefundsDetails.status.failed')}
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <Button
            sx={{ py: 2, height: '44px' }}
            variant="outlined"
            size="small"
            onClick={() => formik.handleSubmit()}
            data-testid="apply-filters-test"
          >
            {t('pages.initiativeRefundsDetails.form.filterBtn')}
          </Button>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <ButtonNaked
            component="button"
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem' }}
            onClick={resetForm}
            data-testid="reset-filters-test"
          >
            {t('pages.initiativeRefundsDetails.form.resetFiltersBtn')}
          </ButtonNaked>
        </FormControl>
      </Box>
      {rows.length > 0 ? (
        <Box
          sx={{
            ...initiativePagesTableContainerStyle,
            mt: 3,
          }}
        >
          <Box sx={{ display: 'grid', gridColumn: 'span 12', height: '100%' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="65%">
                      {t('pages.initiativeRefundsDetails.table.iban')}
                    </TableCell>
                    <TableCell width="15%">
                      {t('pages.initiativeRefundsDetails.table.amount')}
                    </TableCell>
                    <TableCell width="15%">
                      {t('pages.initiativeRefundsDetails.table.outcome')}
                    </TableCell>
                    <TableCell width="5%"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Typography variant="monospaced"> {formatIban(r.iban)}</Typography>
                      </TableCell>
                      <TableCell>{formatedCurrency(r.amount)}</TableCell>
                      <TableCell>{getRefundStatus(r.status)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          data-testid="open-modal-refunds-arrow"
                          onClick={() => handleOpenRefundModal(r.eventId)}
                        >
                          <ArrowForwardIos color="primary" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ThemeProvider theme={theme}>
                <TablePagination
                  sx={{
                    '.MuiTablePagination-displayedRows': {
                      fontFamily: '"Titillium Web",sans-serif',
                    },
                  }}
                  component="div"
                  onPageChange={handleChangePage}
                  page={page}
                  count={totalElements}
                  rowsPerPage={10}
                  rowsPerPageOptions={[10]}
                />
              </ThemeProvider>
              <InitiativeRefundsDetailsModal
                openRefundsDetailModal={openRefundsDetailModal}
                handleCloseRefundModal={handleCloseRefundModal}
                refundEventId={refundEventId}
                initiativeId={id}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <EmptyList message={t('pages.initiativeRefunds.noData')} />
      )}
    </Box>
  );
};

export default InitiativeRefundsDetails;
