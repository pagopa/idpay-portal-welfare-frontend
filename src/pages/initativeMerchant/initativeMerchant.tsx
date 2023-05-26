import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  Button,
  // Chip,
  FormControl,
  // InputLabel,
  // MenuItem,
  // Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { itIT } from '@mui/material/locale';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useFormik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useHistory } from 'react-router-dom';
import {
  MerchantDTO,
  // MerchantStatusEnum,
} from '../../api/generated/merchants/MerchantDTO';
import {
  initiativePagesBreadcrumbsContainerStyle,
  initiativePagesFiltersFormContainerStyle,
  initiativePagesTableContainerStyle,
} from '../../helpers';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { getMerchantList } from '../../services/merchantsService';
import BreadcrumbsBox from '../components/BreadcrumbsBox';
import EmptyList from '../components/EmptyList';

const InitativeMerchant = () => {
  const { t } = useTranslation();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const [filterByMerchant, setFilterByMerchant] = useState<string | undefined>();
  // const [filterByStatus, setFilterByStatus] = useState<string | undefined>();
  const [rows, setRows] = useState<Array<MerchantDTO>>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalElements, setTotalElements] = useState<number>(2);
  const theme = createTheme(itIT);
  const setLoading = useLoading('GET_INITIATIVE_MERCHANTS');
  const addError = useErrorDispatcher();
  const history = useHistory();

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_MERCHANT],
    exact: true,
    strict: false,
  });

  interface MatchParams {
    id: string;
  }

  const { id } = (match?.params as MatchParams) || {};

  const getTableData = (initiativeId: string, page: number, merchant: string | undefined) => {
    setLoading(true);
    getMerchantList(initiativeId, page, merchant)
      .then((res) => {
        if (typeof res.pageNo === 'number') {
          setPage(res.pageNo);
        }

        if (Array.isArray(res.content)) {
          setRows(res.content);
        } else {
          setRows([]);
        }
        if (typeof res.pageSize === 'number') {
          setRowsPerPage(res.pageSize);
        }
        if (typeof res.totalElements === 'number') {
          setTotalElements(res.totalElements);
        }
      })
      .catch((error) => {
        addError({
          id: 'GET_INITIATIVE_MERCHANTS_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting initiative merchants',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      })
      .finally(() => setLoading(false));
  };

  const formik = useFormik({
    initialValues: {
      searchMerchant: '',
      // filterStatus: '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      if (typeof id === 'string') {
        const searchMerchant =
          values.searchMerchant.length > 0 ? values.searchMerchant.toUpperCase() : undefined;
        setFilterByMerchant(searchMerchant);
        /*
        const filterStatus = values.filterStatus.length > 0 ? values.filterStatus : undefined;
        setFilterByStatus(filterStatus);
        */
        getTableData(id, 0, searchMerchant);
      }
    },
  });

  const resetForm = () => {
    const initialValues = {
      searchMerchant: '',
      // , filterStatus: ''
    };
    formik.resetForm({ values: initialValues });
    setFilterByMerchant(undefined);
    // setFilterByStatus(undefined);
    setRows([]);
    if (typeof id === 'string') {
      getTableData(id, 0, undefined);
    }
  };
  /*
  const renderMerchantStatus = (status: MerchantStatusEnum | undefined) => {
    switch (status) {
      case MerchantStatusEnum.WAITING:
        return <Chip label={t('pages.initiativeUsers.status.onEvaluation')} color="default" />;
      case MerchantStatusEnum.ACTIVE:
        return <Chip label={t('pages.initiativeUsers.status.onboardingOk')} color="success" />;
      default:
        return null;
    }
  };
*/
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  useMemo(() => {
    setPage(0);
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof id === 'string') {
      getTableData(id, page, filterByMerchant);
    }
  }, [id, page]);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Box sx={initiativePagesBreadcrumbsContainerStyle}>
        <BreadcrumbsBox
          backUrl={`${BASE_ROUTE}/panoramica-iniziativa/${id}`}
          backLabel={t('breadcrumbs.back')}
          items={[initiativeSel.initiativeName, t('breadcrumbs.initiativeMerchants')]}
        />

        <Box sx={{ display: 'grid', gridColumn: 'span 10', mt: 2 }}>
          <TitleBox
            title={t('pages.initiativeMerchant.title')}
            subTitle={t('pages.initiativeMerchant.subtitle')}
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
            onClick={() => history.replace(`${BASE_ROUTE}/gestione-esercenti-iniziativa/${id}`)}
            data-testid="upload-btn-test"
          >
            {t('pages.initiativeMerchant.uploadBtn')}
          </Button>
        </Box>
      </Box>

      <Box sx={initiativePagesFiltersFormContainerStyle}>
        <FormControl sx={{ gridColumn: 'span 4' }}>
          <TextField
            label={t('pages.initiativeMerchant.form.search')}
            placeholder={t('pages.initiativeMerchant.form.search')}
            name="searchMerchant"
            aria-label="searchMerchant"
            role="input"
            InputLabelProps={{ required: false }}
            value={formik.values.searchMerchant}
            onChange={(e) => formik.handleChange(e)}
            size="small"
            data-testid="searchMerchant-test"
          />
        </FormControl>
        {/*
        <FormControl sx={{ gridColumn: 'span 2' }} size="small">
          <InputLabel>{t('pages.initiativeUsers.form.status')}</InputLabel>
          <Select
            id="filterStatus"
            inputProps={{
              'data-testid': 'filterStatus-select',
            }}
            name="filterStatus"
            label={t('pages.initiativeUsers.form.status')}
            placeholder={t('pages.initiativeUsers.form.status')}
            onChange={(e) => formik.handleChange(e)}
            value={formik.values.filterStatus}
          >
            <MenuItem
              value={MerchantStatusEnum.WAITING}
              data-testid="filterStatusOnEvaluation-test"
            >
              {t('pages.initiativeUsers.status.onEvaluation')}
            </MenuItem>
            <MenuItem value={MerchantStatusEnum.ACTIVE} data-testid="filterStatusOnboardingOk-test">
              {t('pages.initiativeUsers.status.onboardingOk')}
            </MenuItem>
          </Select>
        </FormControl>
        */}
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <Button
            sx={{ py: 2, height: '44px' }}
            variant="outlined"
            size="small"
            onClick={() => formik.handleSubmit()}
            data-testid="apply-filters-test"
          >
            {t('pages.initiativeMerchant.form.filterBtn')}
          </Button>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <ButtonNaked
            component="button"
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem' }}
            onClick={resetForm}
          >
            {t('pages.initiativeMerchant.form.removeFiltersBtn')}
          </ButtonNaked>
        </FormControl>
      </Box>

      {rows?.length > 0 ? (
        <Box sx={initiativePagesTableContainerStyle}>
          <Box sx={{ display: 'grid', gridColumn: 'span 12', height: '100%' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="30%">
                      {t('pages.initiativeMerchant.recap.businessName')}
                    </TableCell>
                    <TableCell width="50%">
                      {t('pages.initiativeMerchant.recap.fiscalCode')}
                    </TableCell>
                    <TableCell width="20%">
                      {
                        // t('pages.initiativeMerchant.recap.status')
                      }
                    </TableCell>
                    {/* <TableCell width="10%"></TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rows.map((r) => (
                    <TableRow key={r.merchantId}>
                      <TableCell>
                        <Typography>{r.businessName}</Typography>
                      </TableCell>
                      <TableCell>{r.fiscalCode}</TableCell>
                      <TableCell>
                        {
                          // renderMerchantStatus(r.merchantStatus)
                        }
                      </TableCell>
                      {/*
                       <TableCell align="right">
                        <IconButton disabled>
                          <ArrowForwardIosIcon color="primary" />
                        </IconButton>
                      </TableCell> */}
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
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[rowsPerPage]}
                />
              </ThemeProvider>
            </Box>
          </Box>
        </Box>
      ) : (
        <EmptyList message={t('pages.initiativeMerchant.noData')} />
      )}
    </Box>
  );
};

export default InitativeMerchant;