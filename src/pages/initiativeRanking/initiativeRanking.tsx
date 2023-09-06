import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  // SortDirection,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  // TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { itIT } from '@mui/material/locale';
import SyncIcon from '@mui/icons-material/Sync';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';
import { matchPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useEffect, useState, useMemo } from 'react';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { useFormik } from 'formik';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';
import {
  getInitiativeOnboardingRankingStatusPaged,
  // getRankingFileDownload,
  notifyCitizenRankings,
} from '../../services/intitativeService';
import { InitiativeRankingToDisplay } from '../../model/InitiativeRanking';
import {
  initiativePagesBreadcrumbsContainerStyle,
  initiativePagesFiltersFormContainerStyle,
  initiativePagesTableContainerStyle,
  numberWithCommas,
} from '../../helpers';
// import { SasToken } from '../../api/generated/initiative/SasToken';
import { OnboardingRankingsDTO } from '../../api/generated/initiative/OnboardingRankingsDTO';
import EmptyList from '../components/EmptyList';
import BreadcrumbsBox from '../components/BreadcrumbsBox';
import { ENV } from '../../utils/env';
import PublishInitiativeRankingModal from './PublishInitiativeRankingModal';

const InitiativeRanking = () => {
  const { t } = useTranslation();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const [page, setPage] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [rankingStatus, setRankingStatus] = useState<string | undefined>('WAITING_END');
  const [filterByBeneficiary, setFilterByBeneficiary] = useState<string | undefined>();
  const [filterByStatus, setFilterByStatus] = useState<string | undefined>();
  const [rows, setRows] = useState<Array<InitiativeRankingToDisplay>>([]);
  const [openPublishInitiativeRankingModal, setOpenPublishInitiativeRankingModal] =
    useState<boolean>(false);
  const [openPublishedInitiativeRankingAlert, setOpenPublishedInitiativeRankingAlert] =
    useState<boolean>(false);
  const [publishedDate, setPublishedDate] = useState<string>('');
  const [publishedHour, setPublishedHour] = useState<string>('');
  const [fileName, setFileName] = useState<string | undefined>();
  const [totalEligibleOk, setTotalEligibleOk] = useState<number | undefined>(0);
  const [totalEligibleKo, setTotalEligibleKo] = useState<number | undefined>(0);
  const [totalOnboardingKo, setTotalOnboardingKo] = useState<number | undefined>(0);
  const theme = createTheme(itIT);
  const setLoading = useLoading('GET_INITIATIVE_RANKING');
  const addError = useErrorDispatcher();

  const handleOpenPublishInitiativeRankingModal = () => setOpenPublishInitiativeRankingModal(true);
  const handleClosePublishInitiativeRankingModal = () =>
    setOpenPublishInitiativeRankingModal(false);

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
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    setLoading(true);
    const b =
      typeof beneficiary === 'string' && beneficiary !== 'DEFAULT' ? beneficiary : undefined;
    getInitiativeOnboardingRankingStatusPaged(initiativeId, page, b, filterStatus)
      .then((res) => {
        if (typeof res.totalElements === 'number') {
          setTotalElements(res.totalElements);
        }
        if (typeof res.pageNumber === 'number') {
          setPage(res.pageNumber);
        }
        if (typeof res.rankingStatus === 'string') {
          setRankingStatus(res.rankingStatus);
          if (res.rankingStatus === 'COMPLETED') {
            setOpenPublishedInitiativeRankingAlert(true);
            if (typeof res.rankingPublishedTimestamp === 'object') {
              const publishedDateTime = res.rankingPublishedTimestamp
                .toLocaleString('fr-BE')
                .split(' ');
              setPublishedDate(publishedDateTime[0]);
              setPublishedHour(publishedDateTime[1]);
            }
          }
        }
        if (typeof res.rankingFilePath === 'string') {
          setFileName(res.rankingFilePath);
        }
        if (typeof res.totalEligibleOk === 'number') {
          setTotalEligibleOk(res.totalEligibleOk);
        }
        if (typeof res.totalEligibleKo === 'number') {
          setTotalEligibleKo(res.totalEligibleKo);
        }
        if (typeof res.totalOnboardingKo === 'number') {
          setTotalOnboardingKo(res.totalOnboardingKo);
        }
        if (Array.isArray(res.content) && res.content.length > 0) {
          const rowsData = res.content.map((r: OnboardingRankingsDTO) => ({
            beneficiaryRankingStatus: r.beneficiaryRankingStatus,
            beneficiary: r.beneficiary,
            ranking: r.ranking,
            rankingValue: r.rankingValue ? `${numberWithCommas(r.rankingValue / 100)} €` : '-',
            criteriaConsensusTimeStamp:
              typeof r.criteriaConsensusTimestamp === 'object'
                ? r.criteriaConsensusTimestamp.toLocaleString('fr-BE')
                : new Date().toLocaleString('fr-BE'),
          }));
          setRows(rowsData);
        } else {
          setRows([]);
        }
      })
      .catch((error) => {
        addError({
          id: 'GET_INITIATIVE_RANKING_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting initiative ranking',
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

  const publishInitiativeRanking = (initiativeId: string | undefined) => {
    if (typeof initiativeId === 'string') {
      notifyCitizenRankings(initiativeId)
        .then((_res) => {
          if (typeof id === 'string') {
            getTableData(id, 0, undefined, undefined);
          }
          handleClosePublishInitiativeRankingModal();
        })
        .catch((error) => {
          addError({
            id: 'PUBLISH_INITIATIVE_RANKING_ERROR',
            blocking: false,
            error,
            techDescription: 'An error occurred publishing initiative ranking',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
        });
    }
  };

  const downloadURI = (uri: string, filename: string) => {
    const link = document.createElement('a');
    // eslint-disable-next-line functional/immutable-data
    link.download = filename;
    // eslint-disable-next-line functional/immutable-data
    link.href = uri;
    // eslint-disable-next-line functional/immutable-data
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadInitiativeRanking = async (
    initiativeId: string | undefined,
    filename: string | undefined
  ) => {
    if (typeof initiativeId === 'string' && typeof filename === 'string') {
      const token = storageTokenOps.read();
      const res = await fetch(
        `${ENV.URL_API.INITIATIVE}/${initiativeId}/ranking/exports/${filename}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        const reader = res.body?.getReader();
        const stream = new ReadableStream({
          start(controller) {
            return pump();
            function pump(): Promise<any> | undefined {
              return reader?.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                return pump();
              });
            }
          },
        });
        const response = new Response(stream);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        downloadURI(url, filename);
      } else {
        const error = new Error(res.statusText);
        addError({
          id: 'DOWNLOAD_INITIATIVE_RANKING_CSV_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred downloading initiative ranking csv file',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      }
    }
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
      filterStatus: 'DEFAULT',
    },
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (typeof id === 'string') {
        const filterBeneficiary = values.searchUser.length > 0 ? values.searchUser : undefined;
        setFilterByBeneficiary(filterBeneficiary);
        const filterStatus =
          values.filterStatus.length > 0 && values.filterStatus !== 'DEFAULT'
            ? values.filterStatus
            : undefined;
        setFilterByStatus(filterStatus);
        getTableData(id, 0, filterBeneficiary, filterStatus);
      }
    },
  });

  const resetForm = () => {
    const initialValues = { searchUser: '', filterStatus: '' };
    formik.resetForm({ values: initialValues });
    setFilterByBeneficiary(undefined);
    setFilterByStatus(undefined);
    setRows([]);
    if (typeof id === 'string') {
      getTableData(id, 0, undefined, undefined);
    }
  };

  useMemo(() => {
    setPage(0);
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof id === 'string') {
      getTableData(id, page, filterByBeneficiary, filterByStatus);
    }
  }, [id, page]);

  const getBeneficiaryStatus = (status: string | undefined) => {
    switch (status) {
      case 'ELIGIBLE_OK':
        return <CheckIcon color="success" sx={{ mb: -1, mr: 2 }} />;
      case 'ELIGIBLE_KO':
        return <ErrorOutlineIcon color="warning" sx={{ mb: -1, mr: 2 }} />;
      case 'ONBOARDING_KO':
        return <CloseIcon color="error" sx={{ mb: -1, mr: 2 }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={initiativePagesBreadcrumbsContainerStyle}>
        <BreadcrumbsBox
          backUrl={`${BASE_ROUTE}/panoramica-iniziativa/${id}`}
          backLabel={t('breadcrumbs.back')}
          items={[initiativeSel.initiativeName, t('breadcrumbs.initiativeRanking')]}
        />

        {rankingStatus === 'WAITING_END' && rows.length === 0 && (
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
        )}
        {(rankingStatus === 'READY' || rankingStatus === 'PUBLISHING') && (
          <>
            <Box sx={{ display: 'grid', gridColumn: 'span 10', mt: 2 }}>
              <TitleBox
                title={t('pages.initiativeRanking.title')}
                mbTitle={2}
                mtTitle={2}
                mbSubTitle={5}
                variantTitle="h4"
                variantSubTitle="body1"
              />
            </Box>
            <Box sx={{ display: 'grid', gridColumn: 'span 2', justifyContent: 'end' }}>
              <ButtonNaked
                component="button"
                onClick={() => downloadInitiativeRanking(id, fileName)}
                sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
                weight="default"
                size="small"
                startIcon={<FileDownloadIcon />}
              >
                {t('pages.initiativeRanking.publishModal.alertBtn')}
              </ButtonNaked>
            </Box>
          </>
        )}
        {rankingStatus === 'COMPLETED' && (
          <>
            <Box sx={{ display: 'grid', gridColumn: 'span 10', mt: 2 }}>
              <TitleBox
                title={t('pages.initiativeRanking.title')}
                mbTitle={2}
                mtTitle={2}
                mbSubTitle={5}
                variantTitle="h4"
                variantSubTitle="body1"
              />
              <Box sx={{ display: 'flex' }}>
                <CheckCircleIcon color="success" />
                <Typography sx={{ ml: 2 }}>
                  {t('pages.initiativeRanking.publishedSubtitle', {
                    date: publishedDate,
                    hour: publishedHour,
                  })}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridColumn: 'span 2', justifyContent: 'end' }}>
              <ButtonNaked
                component="button"
                onClick={() => downloadInitiativeRanking(id, fileName)}
                sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
                weight="default"
                size="small"
                startIcon={<FileDownloadIcon />}
              >
                {t('pages.initiativeRanking.publishModal.alertBtn')}
              </ButtonNaked>
            </Box>
          </>
        )}
      </Box>

      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'grid', gridColumn: 'span 12', mb: 5 }}>
          {rankingStatus === 'WAITING_END' && rows.length === 0 && (
            <Alert severity="info" variant="outlined" elevation={4} icon={<SyncIcon />}>
              <Typography variant="body2">
                {t('pages.initiativeRanking.rankingStatus.notReady')}
              </Typography>
            </Alert>
          )}
          {rankingStatus === 'READY' && (
            <>
              <Alert
                severity="warning"
                action={
                  <ButtonNaked
                    component="button"
                    onClick={() => handleOpenPublishInitiativeRankingModal()}
                    sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
                    weight="default"
                    size="small"
                  >
                    {t('pages.initiativeRanking.rankingStatus.publishBtn')}
                  </ButtonNaked>
                }
              >
                <AlertTitle>
                  {t('pages.initiativeRanking.rankingStatus.readyToBePublishedTitle')}
                </AlertTitle>
                {t('pages.initiativeRanking.rankingStatus.readyToBePublishedSubtitle')}
              </Alert>
              <PublishInitiativeRankingModal
                openPublishInitiativeRankingModal={openPublishInitiativeRankingModal}
                handleClosePublishInitiativeRankingModal={handleClosePublishInitiativeRankingModal}
                initiativeId={id}
                fileName={fileName}
                publishInitiativeRanking={publishInitiativeRanking}
                downloadInitiativeRanking={downloadInitiativeRanking}
              />
            </>
          )}
          {rankingStatus === 'PUBLISHING' && (
            <Alert severity="warning">
              <AlertTitle>{t('pages.initiativeRanking.rankingStatus.publishingTitle')}</AlertTitle>
              {t('pages.initiativeRanking.rankingStatus.readyToBePublishedSubtitle')}
            </Alert>
          )}
          {rankingStatus === 'COMPLETED' && (
            <Collapse in={openPublishedInitiativeRankingAlert}>
              <Alert
                sx={{ mt: 3 }}
                severity="success"
                action={
                  <ButtonNaked
                    component="button"
                    onClick={() => setOpenPublishedInitiativeRankingAlert(false)}
                    sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
                    weight="default"
                    size="small"
                  >
                    {t('pages.initiativeRanking.rankingStatus.publishedCloseBtn')}
                  </ButtonNaked>
                }
              >
                {t('pages.initiativeRanking.rankingStatus.published')}
              </Alert>
            </Collapse>
          )}
        </Box>
      </Box>

      {rankingStatus !== 'WAITING_END' && (
        <Box sx={initiativePagesFiltersFormContainerStyle}>
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
            <InputLabel>{t('pages.initiativeRanking.form.beneficiaryStatus')}</InputLabel>
            <Select
              id="filterStatus"
              name="filterStatus"
              label={t('pages.initiativeUsers.form.status')}
              placeholder={t('pages.initiativeUsers.form.status')}
              onChange={(e) => formik.handleChange(e)}
              value={formik.values.filterStatus}
              inputProps={{
                'data-testid': 'filterStatus-select',
              }}
            >
              <MenuItem value="DEFAULT" data-testid="filterStatusDefault-test">
                {t('pages.initiativeRanking.beneficiaryStatus.total', {
                  tot: totalElements,
                })}
              </MenuItem>
              <MenuItem value="ELIGIBLE_OK" data-testid="filterStatusEligibleOK-test">
                {t('pages.initiativeRanking.beneficiaryStatus.eligibleOk', {
                  tot: totalEligibleOk,
                })}
              </MenuItem>
              <MenuItem value="ELIGIBLE_KO" data-testid="filterStatusEligibleKO-test">
                {t('pages.initiativeRanking.beneficiaryStatus.eligibleKo', {
                  tot: totalEligibleKo,
                })}
              </MenuItem>
              <MenuItem value="ONBOARDING_KO" data-testid="filterStatusOnboardingKO-test">
                {t('pages.initiativeRanking.beneficiaryStatus.onboardingKo', {
                  tot: totalOnboardingKo,
                })}
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
      )}

      {rankingStatus !== 'WAITING_END' && rows.length > 0 && (
        <Box sx={initiativePagesTableContainerStyle}>
          <Box sx={{ display: 'grid', gridColumn: 'span 12', height: '100%' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="25%">
                      {t('pages.initiativeRanking.table.beneficiary')}
                    </TableCell>
                    <TableCell width="35%">{t('pages.initiativeRanking.table.ranking')}</TableCell>
                    <TableCell width="20%">
                      {t('pages.initiativeRanking.table.rankingValue')}
                    </TableCell>
                    <TableCell width="20%">
                      {t('pages.initiativeRanking.table.criteriaConsensusTimestamp')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {getBeneficiaryStatus(r.beneficiaryRankingStatus)} {r.beneficiary}
                      </TableCell>
                      <TableCell>{r.ranking}</TableCell>
                      <TableCell>{r.rankingValue}</TableCell>
                      <TableCell>{r.criteriaConsensusTimeStamp}</TableCell>
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
            </Box>
          </Box>
        </Box>
      )}
      {rankingStatus === 'WAITING_END' && (
        <EmptyList message={t('pages.initiativeRanking.noData')} />
      )}
    </Box>
  );
};

export default InitiativeRanking;
