import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
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
import { ButtonNaked } from '@pagopa/mui-italia';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { itIT } from '@mui/material/locale';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SyncIcon from '@mui/icons-material/Sync';
import { matchPath, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useEffect, useState } from 'react';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { useFormik } from 'formik';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { getInitiativeOnboardingRankingStatusPaged } from '../../services/intitativeService';
import { InitiativeRankingToDisplay } from '../../model/InitiativeRanking';

const InitiativeRanking = () => {
  const { t } = useTranslation();
  const history = useHistory();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filterByBeneficiary, setFilterByBeneficiary] = useState<string | undefined>();
  const [filterByStatus, setFilterByStatus] = useState<string | undefined>();
  const [rows, setRows] = useState<Array<InitiativeRankingToDisplay>>([]);
  const theme = createTheme(itIT);
  const setLoading = useLoading('GET_INITIATIVE_RANKING');
  const addError = useErrorDispatcher();

  interface MatchParams {
    id: string;
  }

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_RANKING],
    exact: true,
    strict: false,
  });

  const { id } = (match?.params as MatchParams) || {};

  const getTableData = (
    initiativeId: string,
    page: number,
    beneficiary: string | undefined,
    filterStatus: string | undefined
  ) => {
    setLoading(true);
    getInitiativeOnboardingRankingStatusPaged(initiativeId, page, beneficiary, filterStatus)
      .then((res) => {
        if (typeof res.totalElements === 'number') {
          setTotalElements(res.totalElements);
        }
        if (Array.isArray(res.content) && res.content.length > 0) {
          const rowsData = res.content.map((r) => ({
            beneficiary: r.beneficiary,
            ranking: r.ranking,
            rankingValue: `${r.rankingValue}€`,
            criteriaConsensusTimeStamp: r.criteriaConsensusTimeStamp.toLocaleString('fr-BE'),
          }));
          setRows(rowsData);
        }
      })
      .catch((error) => {
        addError({
          id: 'GET_INITIATIVE_RANKING_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting export file',
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

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const formik = useFormik({
    initialValues: {
      searchUser: '',
      filterStatus: '',
    },
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (typeof id === 'string') {
        const filterBeneficiary = values.searchUser.length > 0 ? values.searchUser : undefined;
        setFilterByBeneficiary(filterBeneficiary);
        const filterStatus = values.filterStatus.length > 0 ? values.filterStatus : undefined;
        setFilterByStatus(filterStatus);
        getTableData(id, 0, filterBeneficiary, filterStatus);
      }
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof id === 'string') {
      getTableData(id, page, filterByBeneficiary, filterByStatus);
    }
  }, [id, page]);

  const resetForm = () => {
    const initialValues = { searchUser: '', filterStatus: '' };
    formik.resetForm({ values: initialValues });
    setFilterByBeneficiary(undefined);
    setFilterByStatus(undefined);
    if (typeof id === 'string') {
      getTableData(id, 0, undefined, undefined);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'grid', gridColumn: 'span 12' }}>
          <Breadcrumbs aria-label="breadcrumb">
            <ButtonNaked
              component="button"
              onClick={() => history.replace(`${BASE_ROUTE}/panoramica-iniziativa/${id}`)}
              startIcon={<ArrowBackIcon />}
              sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
              weight="default"
            >
              {t('breadcrumbs.back')}
            </ButtonNaked>
            <Typography color="text.primary" variant="body2">
              {initiativeSel.initiativeName}
            </Typography>
            <Typography color="text.primary" variant="body2">
              {t('breadcrumbs.initiativeRanking')}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 12', mt: 2 }}>
          <TitleBox
            title={t('pages.initiativeRanking.title')}
            subTitle={t('pages.initiativeRanking.subtitle')}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'baseline',
          gap: 2,
          mb: 4,
        }}
      >
        <FormControl sx={{ gridColumn: 'span 4' }}>
          <TextField
            label={t('pages.initiativeUsers.form.search')}
            placeholder={t('pages.initiativeRanking.form.search')}
            name="searchUser"
            aria-label="searchUser"
            role="input"
            InputLabelProps={{ required: false }}
            value={formik.values.searchUser}
            onChange={(e) => formik.handleChange(e)}
            size="small"
            data-testid="searchUser-test"
          />
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 2' }} size="small">
          <InputLabel>{t('pages.initiativeUsers.form.status')}</InputLabel>
          <Select
            id="filterStatus"
            data-testid="filterStatus-select"
            name="filterStatus"
            label={t('pages.initiativeUsers.form.status')}
            placeholder={t('pages.initiativeUsers.form.status')}
            onChange={(e) => formik.handleChange(e)}
            value={formik.values.filterStatus}
          >
            <MenuItem value="ACCEPTED_TC" data-testid="filterStatusAcceptedTc-test">
              {t('pages.initiativeUsers.status.acceptedTc')}
            </MenuItem>
            <MenuItem value="INACTIVE" data-testid="filterStatusInactive-test">
              {t('pages.initiativeUsers.status.inactive')}
            </MenuItem>
            <MenuItem value="ON_EVALUATION" data-testid="filterStatusOnEvaluation-test">
              {t('pages.initiativeUsers.status.onEvaluation')}
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
            {t('pages.initiativeRanking.form.filterBtn')}
          </Button>
        </FormControl>
        <FormControl sx={{ gridColumn: 'span 1' }}>
          <ButtonNaked
            component="button"
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem' }}
            onClick={resetForm}
          >
            {t('pages.initiativeRanking.form.resetFiltersBtn')}
          </ButtonNaked>
        </FormControl>
      </Box>

      {rows.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            height: '100%',
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'grid', gridColumn: 'span 12', height: '100%' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('pages.initiativeRanking.table.beneficiary')}</TableCell>
                    <TableCell>{t('pages.initiativeRanking.table.ranking')}</TableCell>
                    <TableCell>{t('pages.initiativeRanking.table.rankingValue')}</TableCell>
                    <TableCell>
                      {t('pages.initiativeRanking.table.criteriaConsensusTimeStamp')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.beneficiary}</TableCell>
                      <TableCell>{r.ranking}</TableCell>
                      <TableCell>{r.rankingValue}</TableCell>
                      <TableCell>{r.criteriaConsensusTimeStamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ThemeProvider theme={theme}>
                <TablePagination
                  component="div"
                  onPageChange={handleChangePage}
                  page={page}
                  count={totalElements}
                  rowsPerPage={10}
                  rowsPerPageOptions={[10]}
                />
              </ThemeProvider>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'grid', gridColumn: 'span 12', mb: 5 }}>
            <Alert severity="info" variant="outlined" elevation={4} icon={<SyncIcon />}>
              <Typography variant="body2">{t('pages.initiativeRanking.alertText')}</Typography>
            </Alert>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridColumn: 'span 12',
              justifyContent: 'center',
              py: 2,
              backgroundColor: 'white',
            }}
          >
            <Typography variant="body2">{t('pages.initiativeRanking.noData')}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InitiativeRanking;
