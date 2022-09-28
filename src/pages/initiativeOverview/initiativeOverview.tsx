import {
  Paper,
  Box,
  Typography,
  Button,
  Divider,
  Snackbar,
  IconButton,
  Chip,
  Breadcrumbs,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UpdateIcon from '@mui/icons-material/Update';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import SyncIcon from '@mui/icons-material/Sync';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import EuroIcon from '@mui/icons-material/Euro';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MuiAlert from '@mui/material/Alert';
import { matchPath } from 'react-router';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { getGroupOfBeneficiaryStatusAndDetail } from '../../services/groupsService';
import { updateInitiativePublishedStatus } from '../../services/intitativeService';
import ConfirmPublishInitiativeModal from '../components/ConfirmPublishInitiativeModal';
import InitiativeOverviewDeleteModal from '../components/initiativeOverviewDeleteModal';

interface MatchParams {
  id: string;
}

const InitiativeOverview = () => {
  const { t } = useTranslation();

  const initiativeSel = useAppSelector(initiativeSelector);
  const history = useHistory();
  const [openInitiativeOverviewDeleteModal, setOpenInitiativeOverviewDeleteModal] = useState(false);
  const [openSnackbar, setOpenSnackBar] = useState(true);
  const [statusFile, setStatusFile] = useState('');
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const addError = useErrorDispatcher();

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_OVERVIEW],
    exact: true,
    strict: false,
  });

  useInitiative();

  const handleCloseSnackBar = () => setOpenSnackBar(false);

  const handleOpenSnackBar = () => setOpenSnackBar(true);

  useEffect(() => {
    // eslint-disable-next-line no-prototype-builtins
    if (match !== null && match.params.hasOwnProperty('id')) {
      const { id } = match.params as MatchParams;
      if (
        initiativeSel.generalInfo.beneficiaryKnown === 'true' &&
        initiativeSel.initiativeId === id
      ) {
        getGroupOfBeneficiaryStatusAndDetail(initiativeSel.initiativeId)
          .then((res) => {
            const statusFileRes = res.status || '';
            setStatusFile(statusFileRes);
            handleOpenSnackBar();
          })
          .catch((error) => {
            addError({
              id: 'GET_UPLOADED_FILE_DATA_ERROR',
              blocking: false,
              error,
              techDescription: 'An error occurred getting groups file info',
              displayableTitle: t('errors.title'),
              displayableDescription: t('errors.getFileDataDescription'),
              toNotify: true,
              component: 'Toast',
              showCloseIcon: true,
            });
          });
      } else if (initiativeSel.generalInfo.beneficiaryKnown === 'false') {
        handleCloseSnackBar();
      }
    }
  }, [
    JSON.stringify(match),
    initiativeSel.initiativeId,
    JSON.stringify(initiativeSel.generalInfo),
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [initiativeSel.initiativeId]);

  const publishInitiative = (id: string | undefined) => {
    if (initiativeSel.status === 'APPROVED' && typeof id === 'string') {
      updateInitiativePublishedStatus(id)
        .then((_res) => history.replace(ROUTES.HOME))
        .catch((error) => ({
          id: 'UPDATE_INITIATIVE_TO_PUBLISHED_STATUS_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred publishing initiative',
          displayableDescription: t('errors.cantPublishInitiative'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        }));
    }
  };

  const handleCloseInitiativeOverviewDeleteModal = () =>
    setOpenInitiativeOverviewDeleteModal(false);

  const handleOpenInitiativeOverviewDeleteModal = () => setOpenInitiativeOverviewDeleteModal(true);

  const peopleReached = (totalBudget: string, budgetPerPerson: string) => {
    const totalBudgetInt = parseInt(totalBudget, 10);
    const budgetPerPersonInt = parseInt(budgetPerPerson, 10);
    return Math.floor(totalBudgetInt / budgetPerPersonInt);
  };

  const timeRemainingToJoin = () => {
    const expirationDate =
      typeof initiativeSel.generalInfo.rankingEndDate === 'object'
        ? initiativeSel.generalInfo.rankingEndDate.getTime()
        : 0;
    const startDate =
      typeof initiativeSel.generalInfo.rankingStartDate === 'object'
        ? initiativeSel.generalInfo.rankingStartDate.getTime()
        : 0;
    return (expirationDate - startDate) / (1000 * 60 * 60 * 24);
  };

  const handleUpdateInitiative = (id: string) => {
    history.push(`${BASE_ROUTE}/iniziativa/${id}`);
  };

  const handleViewDetails = (id: string) => {
    history.push(`${BASE_ROUTE}/dettagli-iniziativa/${id}`);
  };

  const renderInitiativeStatus = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Chip label={t('pages.initiativeList.status.draft')} color="default" />;
      case 'IN_REVISION':
        return <Chip label={t('pages.initiativeList.status.inRevision')} color="warning" />;
      case 'TO_CHECK':
        return <Chip label={t('pages.initiativeList.status.toCheck')} color="error" />;
      case 'APPROVED':
        return <Chip label={t('pages.initiativeList.status.approved')} color="success" />;
      case 'PUBLISHED':
        return <Chip label={t('pages.initiativeList.status.published')} color="indigo" />;
      case 'CLOSED':
        return <Chip label={t('pages.initiativeList.status.closed')} color="default" />;
      case 'SUSPENDED':
        return <Chip label={t('pages.initiativeList.status.suspended')} color="error" />;
      default:
        return null;
    }
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const renderConditionalInfoStatus = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return;
      case 'IN_REVISION':
        return (
          <Box sx={{ gridColumn: 'span 3' }}>
            <ButtonNaked
              size="small"
              onClick={() =>
                handleViewDetails(
                  typeof initiativeSel.initiativeId === 'string' ? initiativeSel.initiativeId : ''
                )
              }
              target="_blank"
              startIcon={<AssignmentIcon />}
              sx={{ color: 'primary.main', padding: 0 }}
              weight="default"
              variant="contained"
              data-testid="view-datails-test"
            >
              {t('pages.initiativeOverview.info.otherinfo.details')}
            </ButtonNaked>
          </Box>
        );
      case 'TO_CHECK':
        return;
      case 'APPROVED':
        return (
          <Box
            sx={{
              width: '100%',
              gridTemplateRows: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              rowGap: 3,
              alignContent: 'start',
            }}
          >
            <Divider sx={{ gridColumn: 'span 8' }} />
            <Box sx={{ gridColumn: 'span 8' }}>
              <Typography variant="subtitle1">
                {t('pages.initiativeOverview.info.otherinfo.title')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              {t('pages.initiativeOverview.info.otherinfo.adhesion')}
            </Box>
            <Box sx={{ gridColumn: 'span 1', textAlign: 'center' }}>
              <AccessTimeFilledIcon color="action" />
            </Box>
            <Box sx={{ gridColumn: 'span 5', fontWeight: 600 }}>
              {t('pages.initiativeOverview.info.otherinfo.start')}{' '}
              {typeof initiativeSel.generalInfo.rankingStartDate === 'object' &&
                initiativeSel.generalInfo.rankingStartDate.toLocaleDateString('fr-BE')}
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              {t('pages.initiativeOverview.info.otherinfo.spend')}
            </Box>
            <Box sx={{ gridColumn: 'span 1', textAlign: 'center' }}>
              <AccessTimeFilledIcon color="action" />
            </Box>
            <Box sx={{ gridColumn: 'span 5', fontWeight: 600 }}>
              {t('pages.initiativeOverview.info.otherinfo.start')}{' '}
              {typeof initiativeSel.generalInfo.startDate === 'object' &&
                initiativeSel.generalInfo.startDate.toLocaleDateString('fr-BE')}
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              <ButtonNaked
                size="small"
                // eslint-disable-next-line sonarjs/no-identical-functions
                onClick={() =>
                  handleViewDetails(
                    typeof initiativeSel.initiativeId === 'string' ? initiativeSel.initiativeId : ''
                  )
                }
                target="_blank"
                startIcon={<AssignmentIcon />}
                sx={{ color: 'primary.main', padding: 0 }}
                weight="default"
                variant="contained"
                data-testid="view-datails-test"
              >
                {t('pages.initiativeOverview.info.otherinfo.details')}
              </ButtonNaked>
            </Box>
          </Box>
        );
      case 'PUBLISHED':
        return (
          <Box
            sx={{
              width: '100%',
              gridTemplateRows: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              rowGap: 3,
              alignContent: 'start',
            }}
          >
            <Divider sx={{ gridColumn: 'span 8' }} />
            <Box sx={{ gridColumn: 'span 8' }}>
              <Typography variant="subtitle1">
                {t('pages.initiativeOverview.info.otherinfo.title')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              {t('pages.initiativeOverview.info.otherinfo.adhesion')}
            </Box>
            <Box sx={{ gridColumn: 'span 1', textAlign: 'center' }}>
              <HourglassTopIcon color="action" />
            </Box>
            <Box sx={{ gridColumn: 'span 5', fontWeight: 600 }}>
              {initiativeSel.generalInfo.rankingStartDate &&
              initiativeSel.generalInfo.rankingEndDate
                ? // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                  timeRemainingToJoin() +
                  ' ' +
                  t('pages.initiativeOverview.info.otherinfo.expiration')
                : '-'}
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              {t('pages.initiativeOverview.info.otherinfo.spend')}
            </Box>
            <Box sx={{ gridColumn: 'span 1', textAlign: 'center' }}>
              <AccessTimeFilledIcon color="action" />
            </Box>
            <Box sx={{ gridColumn: 'span 5', fontWeight: 600 }}>
              {t('pages.initiativeOverview.info.otherinfo.start')}{' '}
              {typeof initiativeSel.generalInfo.startDate === 'object' &&
                initiativeSel.generalInfo.startDate.toLocaleDateString('fr-BE')}
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              <ButtonNaked
                size="small"
                // eslint-disable-next-line sonarjs/no-identical-functions
                onClick={() =>
                  handleViewDetails(
                    typeof initiativeSel.initiativeId === 'string' ? initiativeSel.initiativeId : ''
                  )
                }
                target="_blank"
                startIcon={<AssignmentIcon />}
                sx={{ color: 'primary.main', padding: 0 }}
                weight="default"
                variant="contained"
                data-testid="view-datails-test"
              >
                {t('pages.initiativeOverview.info.otherinfo.details')}
              </ButtonNaked>
            </Box>
          </Box>
        );
      case 'CLOSED':
      case 'SUSPENDED':
        return;
      default:
        return null;
    }
  };

  const renderConditionalNextStatus = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return (
          <>
            <Box sx={{ gridColumn: 'span 8' }}>
              {t('pages.initiativeOverview.next.status.subtitleDraft')}
            </Box>
            <Box sx={{ gridColumn: 'span 8' }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() =>
                  handleUpdateInitiative(
                    typeof initiativeSel.initiativeId === 'string' ? initiativeSel.initiativeId : ''
                  )
                }
              >
                {t('pages.initiativeOverview.next.status.draft')}
              </Button>
            </Box>
          </>
        );
      case 'IN_REVISION':
        return (
          <>
            <Box sx={{ gridColumn: 'span 8' }}>
              {t('pages.initiativeOverview.next.status.subtitleReview')}
            </Box>
            <Box sx={{ gridColumn: 'span 8' }}>
              <Button disabled variant="contained" startIcon={<UpdateIcon color="disabled" />}>
                {t('pages.initiativeOverview.next.status.review')}
              </Button>
            </Box>
          </>
        );
      case 'TO_CHECK':
        return (
          <>
            <Box sx={{ gridColumn: 'span 8' }}>
              {t('pages.initiativeOverview.next.status.subtitleModify')}
            </Box>
            <Box sx={{ gridColumn: 'span 8' }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                // eslint-disable-next-line sonarjs/no-identical-functions
                onClick={() =>
                  handleUpdateInitiative(
                    typeof initiativeSel.initiativeId === 'string' ? initiativeSel.initiativeId : ''
                  )
                }
              >
                {t('pages.initiativeOverview.next.status.modify')}
              </Button>
            </Box>
          </>
        );
      case 'APPROVED':
        return (
          <>
            <Box sx={{ gridColumn: 'span 8' }}>
              {t('pages.initiativeOverview.next.status.subtitleApproved')}
            </Box>
            <Box sx={{ gridColumn: 'span 8' }}>
              <Button
                variant="contained"
                startIcon={<PublishIcon />}
                onClick={() => setPublishModalOpen(true)}
              >
                {t('pages.initiativeOverview.next.status.approved')}
              </Button>
            </Box>
            <ConfirmPublishInitiativeModal
              publishModalOpen={publishModalOpen}
              setPublishModalOpen={setPublishModalOpen}
              id={initiativeSel.initiativeId}
              handlePusblishInitiative={publishInitiative}
            />
          </>
        );
      case 'PUBLISHED':
        // return (
        //   <>
        //     <Box sx={{ gridColumn: 'span 10', color: '#5C6F82' }}>
        //       {t('pages.initiativeOverview.next.lastUpdate', {
        //         lastUpdate: initiativeSel.updateDate
        //           ? typeof initiativeSel.updateDate === 'object' &&
        //             initiativeSel.updateDate.toLocaleString('fr-BE')
        //           : '-',
        //       })}
        //     </Box>
        //     <Box sx={{ gridColumn: 'span 2', lineHeight: 2 }}>
        //       {t('pages.initiativeOverview.next.join')}
        //     </Box>
        //     <Box
        //       sx={{
        //         gridColumn: 'span 1',
        //         fontWeight: '600',
        //         fontSize: '24px',
        //         textAlign: 'center',
        //       }}
        //     >
        //       /
        //     </Box>
        //     <Box sx={{ gridColumn: 'span 7' }}>
        //       <Typography sx={{ fontWeight: '600', lineHeight: 2 }}>
        //         {peopleReached(
        //           initiativeSel.generalInfo.budget,
        //           initiativeSel.generalInfo.beneficiaryBudget
        //         )}
        //       </Typography>
        //     </Box>
        //     <Box sx={{ gridColumn: 'span 2', lineHeight: 2 }}>
        //       {t('pages.initiativeOverview.next.budgetExhausted')}
        //     </Box>
        //     <Box
        //       sx={{
        //         gridColumn: 'span 2',
        //       }}
        //     >
        //       <Typography sx={{ fontWeight: 600, fontSize: '24px', textAlign: 'center' }}>
        //         123
        //         <EuroIcon fontSize="small" />
        //       </Typography>
        //     </Box>
        //     <Box sx={{ gridColumn: 'span 6' }}>
        //       <Typography sx={{ fontWeight: 600, lineHeight: 2, textAlign: 'start' }}>
        //         / {initiativeSel.generalInfo.budget}
        //         <EuroIcon fontSize="small" />
        //       </Typography>
        //     </Box>
        //   </>
        // );
        return;
      case 'CLOSED':
      case 'SUSPENDED':
        return;
      default:
        return null;
    }
  };

  const renderConditionalActionsStatus = (status: string) => {
    switch (status) {
      case 'TO_CHECK':
        return (
          <>
            <Box sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
              <InitiativeOverviewDeleteModal
                openInitiativeOverviewDeleteModal={openInitiativeOverviewDeleteModal}
                handleCloseInitiativeOverviewDeleteModal={handleCloseInitiativeOverviewDeleteModal}
              />
              <Box sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
                <ButtonNaked
                  size="small"
                  onClick={handleOpenInitiativeOverviewDeleteModal}
                  target="_blank"
                  startIcon={<DeleteOutlineIcon color="error" />}
                  sx={{ padding: 0, color: 'error.main', fontWeight: 700 }}
                  weight="default"
                  variant="contained"
                  data-testid="view-delete-test"
                >
                  {t('pages.initiativeList.actions.delete')}
                </ButtonNaked>
              </Box>
            </Box>
          </>
        );
      case 'APPROVED':
        return;
      // eslint-disable-next-line sonarjs/no-duplicated-branches
      case 'DRAFT':
        return (
          <>
            <Box sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
              <InitiativeOverviewDeleteModal
                openInitiativeOverviewDeleteModal={openInitiativeOverviewDeleteModal}
                handleCloseInitiativeOverviewDeleteModal={handleCloseInitiativeOverviewDeleteModal}
              />
              <Box sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
                <ButtonNaked
                  size="small"
                  onClick={handleOpenInitiativeOverviewDeleteModal}
                  target="_blank"
                  startIcon={<DeleteOutlineIcon color="error" />}
                  sx={{ padding: 0, color: 'error.main', fontWeight: 700 }}
                  weight="default"
                  variant="contained"
                  data-testid="view-delete-test"
                >
                  {t('pages.initiativeList.actions.delete')}
                </ButtonNaked>
              </Box>
            </Box>
          </>
        );
      case 'IN_REVISION':
        return;
      case 'PUBLISHED':
        return (
          <Box sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
            <ButtonNaked
              size="small"
              // onClick={}
              target="_blank"
              startIcon={<HighlightOffIcon color="error" />}
              sx={{ padding: 0, color: 'error.main', fontWeight: 700 }}
              weight="default"
              variant="contained"
              data-testid="view-suspend-test"
            >
              {t('pages.initiativeList.actions.suspend')}
            </ButtonNaked>
          </Box>
        );
      case 'CLOSED':
        return;
      case 'SUSPENDED':
        return;
      default:
        return null;
    }
  };

  const renderTypeSnackBarStatus = (status: string) => {
    switch (status) {
      case 'OK':
        return (
          <Snackbar
            open={openSnackbar}
            sx={{ position: 'initial', gridColumn: 'span 10', zIndex: 0 }}
          >
            <MuiAlert
              sx={{
                gridColumn: 'span 10',
                mb: 3,
                width: '100%',
                gridTemplateColumns: 'repeat(10, 1fr)',
              }}
              severity="info"
              elevation={6}
              variant="outlined"
              action={
                <>
                  <ButtonNaked
                    size="medium"
                    target="_blank"
                    sx={{
                      padding: 0,
                      color: 'primary.main',
                      fontWeight: 700,
                      gridColumn: 'span 1',
                    }}
                    weight="default"
                    variant="contained"
                    data-testid="view-users-test"
                  >
                    {t('pages.initiativeOverview.snackBar.users')}
                  </ButtonNaked>
                  <IconButton aria-label="close" onClick={handleCloseSnackBar} sx={{ mx: 1 }}>
                    <CloseIcon />
                  </IconButton>
                </>
              }
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', width: '100%' }}>
                <Typography sx={{ gridColumn: 'span 5' }}>
                  {t('pages.initiativeOverview.snackBar.approved')}{' '}
                </Typography>
                <Typography sx={{ gridColumn: 'span 1', fontWeight: 600, textAlign: 'center' }}>
                  {peopleReached(
                    initiativeSel.generalInfo.budget,
                    initiativeSel.generalInfo.beneficiaryBudget
                  )}
                </Typography>
                <Typography sx={{ gridColumn: 'span 5' }}>
                  {t('pages.initiativeOverview.snackBar.recipients')}
                </Typography>
              </Box>
            </MuiAlert>
          </Snackbar>
        );
      case 'VALIDATE':
      case 'PROCESSING':
      case 'TO_SCHEDULE':
        return (
          <Snackbar open={openSnackbar} sx={{ position: 'initial', gridColumn: 'span 10' }}>
            <MuiAlert
              sx={{
                gridColumn: 'span 10',
                mb: 3,
                width: '100%',
                gridTemplateColumns: 'repeat(10, 1fr)',
              }}
              severity="info"
              elevation={6}
              variant="outlined"
              icon={<SyncIcon />}
            >
              {t('pages.initiativeOverview.snackBar.pending')}
            </MuiAlert>
          </Snackbar>
        );
      case 'KO':
      case 'PROC_KO':
        return (
          <Snackbar open={openSnackbar} sx={{ position: 'initial', gridColumn: 'span 10' }}>
            <MuiAlert
              sx={{
                gridColumn: 'span 10',
                mb: 3,
                width: '100%',
                gridTemplateColumns: 'repeat(10, 1fr)',
              }}
              severity="error"
              elevation={6}
              variant="outlined"
              action={
                <>
                  <IconButton aria-label="close" onClick={handleCloseSnackBar} sx={{ mx: 1 }}>
                    <CloseIcon />
                  </IconButton>
                </>
              }
            >
              {t('pages.initiativeOverview.snackBar.uploadFailed')}
            </MuiAlert>
          </Snackbar>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Box sx={{ width: '100%', px: 2 }}>
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(10, 1fr)',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'grid', gridColumn: 'span 10' }}>
            <Breadcrumbs aria-label="breadcrumb">
              <ButtonNaked
                component="button"
                onClick={() => history.replace(ROUTES.HOME)}
                startIcon={<ArrowBackIcon />}
                sx={{ color: 'primary.main' }}
                weight="default"
              >
                {t('breadcrumbs.exit')}
              </ButtonNaked>
              <Typography color="text.primary" variant="body2">
                {t('breadcrumbs.initiatives')}
              </Typography>
              <Typography color="text.primary" variant="body2">
                {initiativeSel.initiativeName}
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ gridColumn: 'span 8' }}>
            <TitleBox
              title={
                typeof initiativeSel.initiativeName === 'string' ? initiativeSel.initiativeName : ''
              }
              mbTitle={2}
              mtTitle={2}
              variantTitle="h4"
              variantSubTitle="body1"
            />
          </Box>
          {renderConditionalActionsStatus(
            typeof initiativeSel.status === 'string' ? initiativeSel.status : ''
          )}
          {renderTypeSnackBarStatus(statusFile)}
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            alignItems: 'start',
            columnGap: 2,
          }}
        >
          <Paper
            sx={{
              width: '100%',
              px: 3,
              pb: 3,
              gridTemplateRows: 'auto',
              gridColumn: 'span 1',
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              alignContent: 'start',
              rowGap: 3,
            }}
          >
            <Box sx={{ pt: 3, gridColumn: 'span 8' }}>
              <Typography variant="h6">{t('pages.initiativeOverview.info.title')}</Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>{t('pages.initiativeOverview.info.idCode')}</Box>
            <Box sx={{ gridColumn: 'span 5', fontWeight: 600 }}>{initiativeSel.initiativeId} </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              {t('pages.initiativeOverview.info.creationData')}
            </Box>
            <Box sx={{ gridColumn: 'span 5', fontWeight: 600 }}>
              {typeof initiativeSel.creationDate === 'object' &&
                initiativeSel.creationDate.toLocaleDateString('fr-BE')}
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>{t('pages.initiativeOverview.info.lastModify')}</Box>
            <Box sx={{ gridColumn: 'span 5', fontWeight: 600 }}>
              {initiativeSel.updateDate
                ? typeof initiativeSel.updateDate === 'object' &&
                  initiativeSel.updateDate.toLocaleDateString('fr-BE')
                : '-'}
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              {t('pages.initiativeOverview.info.initiativeState')}
            </Box>
            <Box sx={{ gridColumn: 'span 5' }}>
              {typeof initiativeSel.status === 'string' &&
                renderInitiativeStatus(initiativeSel.status)}
            </Box>
            <Box sx={{ gridColumn: 'span 8' }}>
              {typeof initiativeSel.status === 'string' &&
                renderConditionalInfoStatus(initiativeSel.status)}
            </Box>
          </Paper>
          <Paper
            sx={{
              width: '100%',
              px: 3,
              pb: 3,
              gridTemplateRows: 'auto',
              gridColumn: 'span 1',
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 1fr)',
              alignContent: 'start',
              rowGap: 3,
            }}
          >
            <Box sx={{ pt: 3, gridColumn: 'span 10' }}>
              {initiativeSel.status === 'PUBLISHED' ? (
                <Typography variant="h6">{t('pages.initiativeOverview.next.stats')}</Typography>
              ) : (
                <Typography variant="h6">{t('pages.initiativeOverview.next.title')}</Typography>
              )}
            </Box>
            {typeof initiativeSel.status === 'string' &&
              renderConditionalNextStatus(initiativeSel.status)}
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default InitiativeOverview;
