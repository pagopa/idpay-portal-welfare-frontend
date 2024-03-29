/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useHistory } from 'react-router-dom';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import itLocale from 'date-fns/locale/it';
import { ArrowForwardIos } from '@mui/icons-material';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';
import {
  getRefundStatusChip,
  initiativeUsersAndRefundsValidationSchema,
  initiativePagesFiltersFormContainerStyle,
  numberWithCommas,
  initiativePagesTableContainerStyle,
  initiativePagesBreadcrumbsContainerStyle,
} from '../../helpers';
import { getExportsPaged } from '../../services/intitativeService';
import { RewardExportsDTO } from '../../api/generated/initiative/RewardExportsDTO';
import { InitiativeRefundToDisplay } from '../../model/InitiativeRefunds';
import EmptyList from '../components/EmptyList';
import BreadcrumbsBox from '../components/BreadcrumbsBox';
import TablePaginator from '../components/TablePaginator';

const InitiativeRefunds = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [rows, setRows] = useState<Array<InitiativeRefundToDisplay>>([]);
  const setLoading = useLoading('GET_INITIATIVE_REFUNDS');
  const [filterByNotificationDateFrom, setFilterByNotificationDateFrom] = useState<
    string | undefined
  >();
  const [filterByNotificationDateTo, setFilterByNotificationDateTo] = useState<
    string | undefined
  >();
  const [filterByStatus, setFilterByStatus] = useState<string | undefined>();

  interface MatchParams {
    id: string;
  }

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_REFUNDS],
    exact: true,
    strict: false,
  });

  const { id } = (match?.params as MatchParams) || {};

  const getTableData = (
    initiativeId: string,
    page: number,
    searchFrom: string | undefined,
    searchTo: string | undefined,
    filterStatus: string | undefined
  ) => {
    setLoading(true);
    getExportsPaged(initiativeId, page, searchFrom, searchTo, filterStatus, 'notificationDate,DESC')
      .then((res) => {
        if (typeof res.totalElements === 'number') {
          setTotalElements(res.totalElements);
        }
        if (Array.isArray(res.content) && res.content.length > 0) {
          const rowsData = res.content.map((r: RewardExportsDTO) => ({
            ...r,
            id: r.id,
            notificationDate:
              typeof r.notificationDate === 'object'
                ? r.notificationDate.toLocaleString('fr-BE').split(' ')[0]
                : '',
            rewardsExported: `${numberWithCommas(r.rewardsExported)} €`,
            rewardsResults: `${numberWithCommas(r.rewardsNotified)}`,
            successPercentage: `${r.percentageResultedOk}%`,
            percentageResulted: r.percentageResulted,
            status: { status: r.status, percentageResulted: r.percentageResulted },
            downloadFileInfo: { initiativeId: r.initiativeId, filePath: r.filePath },
          }));
          setRows(rowsData);
        } else {
          setRows([]);
        }
      })
      .catch((error) => {
        addError({
          id: 'GET_EXPORTS_PAGED_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting export paged data',
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

  const parseDateFormat = (d: Date | undefined) => {
    if (d instanceof Date && d.toLocaleDateString('fr-CA').length > 0) {
      return `${d.toLocaleDateString('fr-CA')}`;
    }
    return undefined;
  };

  const formik = useFormik({
    initialValues: {
      searchFrom: null,
      searchTo: null,
      filterStatus: '',
    },
    validationSchema: initiativeUsersAndRefundsValidationSchema,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      let searchFromStr;
      let searchToStr;
      if (typeof id === 'string') {
        if (values.searchFrom) {
          const searchFrom = values.searchFrom as unknown as Date;
          searchFromStr = parseDateFormat(searchFrom);
          setFilterByNotificationDateFrom(searchFromStr);
        }
        if (values.searchTo) {
          const searchTo = values.searchTo as unknown as Date;
          searchToStr = parseDateFormat(searchTo);
          setFilterByNotificationDateTo(searchToStr);
        }
        const filterStatus = values.filterStatus.length > 0 ? values.filterStatus : undefined;
        setFilterByStatus(filterStatus);
        getTableData(id, 0, searchFromStr, searchToStr, filterStatus);
      }
    },
  });

  const resetForm = () => {
    const initialValues = { searchFrom: null, searchTo: null, filterStatus: '' };
    formik.resetForm({ values: initialValues });
    setFilterByNotificationDateFrom(undefined);
    setFilterByNotificationDateTo(undefined);
    setFilterByStatus(undefined);
    setRows([]);
    if (typeof id === 'string') {
      getTableData(id, 0, undefined, undefined, undefined);
    }
  };

  const goToRefundsOutcome = (initiativeId: string | undefined) => {
    if (typeof initiativeId === 'string') {
      history.replace(`${BASE_ROUTE}/esiti-rimborsi-iniziativa/${initiativeId}`);
    }
  };

  useMemo(() => {
    setPage(0);
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof id === 'string') {
      getTableData(
        id,
        page,
        filterByNotificationDateFrom,
        filterByNotificationDateTo,
        filterByStatus
      );
    }
  }, [id, page]);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={initiativePagesBreadcrumbsContainerStyle}>
        <BreadcrumbsBox
          backUrl={`${BASE_ROUTE}/panoramica-iniziativa/${id}`}
          backLabel={t('breadcrumbs.back')}
          items={[initiativeSel.initiativeName, t('breadcrumbs.initiativeRefunds')]}
        />

        <Box sx={{ display: 'grid', gridColumn: 'span 10', mt: 2 }}>
          <TitleBox
            title={t('pages.initiativeRefunds.title')}
            subTitle={t('pages.initiativeRefunds.subtitle')}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 2', mt: 2, justifyContent: 'right' }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<FileUploadIcon />}
            onClick={() => goToRefundsOutcome(id)}
            data-testid="upload-btn-test"
          >
            {t('pages.initiativeRefunds.uploadBtn')}
          </Button>
        </Box>
      </Box>

      <Box sx={initiativePagesFiltersFormContainerStyle}>
        <FormControl sx={{ gridColumn: 'span 2' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={itLocale}>
            <DesktopDatePicker
              label={t('pages.initiativeRefunds.form.from')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.searchFrom}
              onChange={(value) => formik.setFieldValue('searchFrom', value)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="searchFrom"
                  data-testid="searchFrom-test"
                  name="searchFrom"
                  type="date"
                  size="small"
                  error={formik.touched.searchFrom && Boolean(formik.errors.searchFrom)}
                  helperText={formik.touched.searchFrom && formik.errors.searchFrom}
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 2' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={itLocale}>
            <DesktopDatePicker
              label={t('pages.initiativeRefunds.form.to')}
              inputFormat="dd/MM/yyyy"
              value={formik.values.searchTo}
              onChange={(value) => formik.setFieldValue('searchTo', value)}
              renderInput={(props) => (
                <TextField
                  {...props}
                  id="searchTo"
                  data-testid="searchTo-test"
                  name="searchTo"
                  type="date"
                  size="small"
                  error={formik.touched.searchTo && Boolean(formik.errors.searchTo)}
                  helperText={formik.touched.searchTo && formik.errors.searchTo}
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 2' }} size="small">
          <InputLabel>{t('pages.initiativeRefunds.form.status')}</InputLabel>
          <Select
            id="filterStatus"
            inputProps={{
              'data-testid': 'filterStatus-select',
            }}
            name="filterStatus"
            label={t('pages.initiativeRefunds.form.status')}
            placeholder={t('pages.initiativeRefunds.form.status')}
            onChange={(e) => formik.handleChange(e)}
            value={formik.values.filterStatus}
          >
            <MenuItem value="EXPORTED" data-testid="filterStatusRegistered-test">
              {t('pages.initiativeRefunds.form.toLoad')}
            </MenuItem>
            <MenuItem value="PARTIAL" data-testid="filterStatusPartial-test">
              {t('pages.initiativeRefunds.form.partial')}
            </MenuItem>
            <MenuItem value="COMPLETE" data-testid="filterStatusWaiting-test">
              {t('pages.initiativeRefunds.form.completed')}
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
            {t('pages.initiativeRefunds.form.filterBtn')}
          </Button>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <ButtonNaked
            component="button"
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem' }}
            onClick={resetForm}
            data-testid="reset-filters-test"
          >
            {t('pages.initiativeRefunds.form.resetFiltersBtn')}
          </ButtonNaked>
        </FormControl>
      </Box>

      {rows.length > 0 ? (
        <Box sx={initiativePagesTableContainerStyle}>
          <Box sx={{ display: 'grid', gridColumn: 'span 12', height: '100%' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="18%">
                      {t('pages.initiativeRefunds.table.creationDate')}
                    </TableCell>
                    <TableCell width="18%">{t('pages.initiativeRefunds.table.amount')}</TableCell>
                    <TableCell width="18%">{t('pages.initiativeRefunds.table.refunds')}</TableCell>
                    <TableCell width="18%">
                      {t('pages.initiativeRefunds.table.successPercentage')}
                    </TableCell>
                    <TableCell width="23%">{t('pages.initiativeRefunds.table.status')}</TableCell>
                    <TableCell width="5%"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.notificationDate}</TableCell>
                      <TableCell>{r.rewardsExported}</TableCell>
                      <TableCell>{r.rewardsResults}</TableCell>
                      <TableCell>{r.successPercentage}</TableCell>
                      <TableCell>{getRefundStatusChip(r.status)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          data-testid="download-file-refunds"
                          onClick={() =>
                            history.replace(
                              `${BASE_ROUTE}/dettaglio-rimborsi-iniziativa/${r.downloadFileInfo.initiativeId}/${r.id}/${r.downloadFileInfo.filePath}`
                            )
                          }
                        >
                          <ArrowForwardIos color="primary" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePaginator
                page={page}
                setPage={setPage}
                totalElements={totalElements}
                rowsPerPage={10}
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

export default InitiativeRefunds;
