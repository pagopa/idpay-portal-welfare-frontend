import { Paper, Box, Typography, Button, Chip, Breadcrumbs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UpdateIcon from '@mui/icons-material/Update';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EuroIcon from '@mui/icons-material/Euro';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { matchPath } from 'react-router';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { useIDPayUser } from '../../hooks/useIDPayUser';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { getGroupOfBeneficiaryStatusAndDetail } from '../../services/groupsService';
import { updateInitiativePublishedStatus } from '../../services/intitativeService';
import ConfirmPublishInitiativeModal from '../components/ConfirmPublishInitiativeModal';
import DeleteInitiativeModal from '../components/DeleteInitiativeModal';
import StatusSnackBar from './components/StatusSnackBar';
import DateReference from './components/DateReference';

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
  const user = useIDPayUser();

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
        initiativeSel.initiativeId === id &&
        initiativeSel.status !== 'DRAFT'
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

  const peopleReached = (totalBudget: string, budgetPerPerson: string) => {
    const totalBudgetInt = parseInt(totalBudget, 10);
    const budgetPerPersonInt = parseInt(budgetPerPerson, 10);
    return Math.floor(totalBudgetInt / budgetPerPersonInt);
  };

  const handleCloseInitiativeOverviewDeleteModal = () =>
    setOpenInitiativeOverviewDeleteModal(false);

  const handleOpenInitiativeOverviewDeleteModal = () => setOpenInitiativeOverviewDeleteModal(true);

  const handleUpdateInitiative = (id: string | undefined) => {
    history.replace(`${BASE_ROUTE}/iniziativa/${id}`);
  };

  const handleViewDetails = (id: string | undefined) => {
    history.replace(`${BASE_ROUTE}/dettagli-iniziativa/${id}`);
  };

  const renderInitiativeStatus = (status: string | undefined) => {
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

  const renderConditionalInfoStatus = (status: string | undefined) => {
    switch (status) {
      case 'IN_REVISION':
        if (user.org_role !== 'ope_base') {
          return (
            <Box sx={{ gridColumn: 'span 3' }}>
              <ButtonNaked
                size="small"
                onClick={() => handleViewDetails(initiativeSel.initiativeId)}
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
        } else {
          return;
        }
      case 'APPROVED':
      case 'PUBLISHED':
        return <DateReference initiative={initiativeSel} handleViewDetails={handleViewDetails} />;
      case 'DRAFT':
      case 'TO_CHECK':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  const conditionalSubtitleRendering = (status: string | undefined) => {
    switch (status) {
      case 'DRAFT':
        return t('pages.initiativeOverview.next.status.subtitleDraft');
      case 'IN_REVISION':
        return t('pages.initiativeOverview.next.status.subtitleReview');
      case 'TO_CHECK':
        return t('pages.initiativeOverview.next.status.subtitleModify');
      case 'APPROVED':
        return t('pages.initiativeOverview.next.status.subtitleApproved');
      case 'PUBLISHED':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  const conditionalStartIconRendering = (status: string | undefined) => {
    switch (status) {
      case 'DRAFT':
        return <EditIcon />;
      case 'IN_REVISION':
        return user.org_role === 'ope_base' ? null : <UpdateIcon color="disabled" />;
      case 'TO_CHECK':
        return <EditIcon />;
      case 'APPROVED':
        return <PublishIcon />;
      case 'PUBLISHED':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  const conditionalOnClickRendering = (status: string | undefined) => {
    switch (status) {
      case 'DRAFT':
        return handleUpdateInitiative(initiativeSel.initiativeId);
      case 'IN_REVISION':
        return handleViewDetails(initiativeSel.initiativeId);
      case 'TO_CHECK':
        return handleUpdateInitiative(initiativeSel.initiativeId);
      case 'APPROVED':
        return setPublishModalOpen(true);
      case 'PUBLISHED':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  const conditionaButtonNameRendering = (status: string | undefined) => {
    switch (status) {
      case 'DRAFT':
        return t('pages.initiativeOverview.next.status.draft');
      case 'IN_REVISION':
        return user.org_role === 'ope_base'
          ? t('pages.initiativeOverview.next.status.checkInitiative')
          : t('pages.initiativeOverview.next.status.review');
      case 'TO_CHECK':
        return t('pages.initiativeOverview.next.status.modify');
      case 'APPROVED':
        return t('pages.initiativeOverview.next.status.approved');
      case 'PUBLISHED':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const renderNextStatus = (status: string) => (
    <>
      <Box sx={{ gridColumn: 'span 8' }}>{conditionalSubtitleRendering(initiativeSel.status)}</Box>
      <Box sx={{ gridColumn: 'span 8' }}>
        <Button
          disabled={status === 'IN_REVISION' ? true : false}
          variant="contained"
          startIcon={conditionalStartIconRendering(initiativeSel.status)}
          onClick={() => conditionalOnClickRendering(initiativeSel.status)}
        >
          {conditionaButtonNameRendering(initiativeSel.status)}
        </Button>
        {status === 'APPROVED' ? (
          <ConfirmPublishInitiativeModal
            publishModalOpen={publishModalOpen}
            setPublishModalOpen={setPublishModalOpen}
            id={initiativeSel.initiativeId}
            handlePusblishInitiative={publishInitiative}
          />
        ) : null}
      </Box>
    </>
  );

  const renderConditionalStatusPublished = (status: string | undefined) =>
    status === 'PUBLISHED' && (
      <>
        <Box sx={{ gridColumn: 'span 24', color: '#5C6F82' }}>
          {t('pages.initiativeOverview.next.lastUpdate', {
            lastUpdate: initiativeSel.updateDate
              ? typeof initiativeSel.updateDate === 'object' &&
                initiativeSel.updateDate.toLocaleString('fr-BE')
              : '-',
          })}
        </Box>
        <Box sx={{ gridColumn: 'span 5', lineHeight: 2 }}>
          {t('pages.initiativeOverview.next.join')}
        </Box>
        <Box
          sx={{
            gridColumn: 'span 3',
            fontWeight: '600',
            fontSize: '24px',
            textAlign: 'start',
          }}
        >
          1000
        </Box>
        <Box sx={{ gridColumn: 'span 14' }}>
          <Typography sx={{ fontWeight: '600', lineHeight: 2 }}>
            /{' '}
            {peopleReached(
              initiativeSel.generalInfo.budget,
              initiativeSel.generalInfo.beneficiaryBudget
            )}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 5', lineHeight: 2 }}>
          {t('pages.initiativeOverview.next.budgetExhausted')}
        </Box>
        <Box
          sx={{
            gridColumn: 'span 5',
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '24px', textAlign: 'start' }}>
            12345678
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 1', alignSelf: 'self-end' }}>
          <EuroIcon fontSize="small" />
        </Box>
        <Box sx={{ gridColumn: 'span 4' }}>
          <Typography sx={{ fontWeight: 600, lineHeight: 2, textAlign: 'start', fontSize: '18px' }}>
            / {initiativeSel.generalInfo.budget}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 1', alignSelf: 'self-end' }}>
          <EuroIcon fontSize="small" />
        </Box>
        <Box sx={{ gridColumn: 'span 24' }}>
          <Button variant="contained" startIcon={<FactCheckIcon />}>
            {t('pages.initiativeOverview.next.ViewUsers')}
          </Button>
        </Box>
      </>
    );

  const renderConditionalActions = (status: string | undefined) => (
    <Box
      sx={{
        gridColumn: 'span 2',
        textAlign: 'end',
        gridTemplateColumns: 'repeat(2, 1fr)',
        display: 'grid',
        alignItems: 'center',
      }}
    >
      {status === 'APPROVED' ? (
        <Box sx={{ gridColumn: 'span 1', textAlign: 'end' }}>
          <ButtonNaked
            size="small"
            startIcon={<EditIcon />}
            sx={{ color: 'primary.main', padding: 0, fontWeight: 700 }}
            weight="default"
            variant="contained"
            data-testid="view-custom-test"
            onClick={() => handleUpdateInitiative(initiativeSel.initiativeId)}
          >
            {t('pages.initiativeList.actions.update')}
          </ButtonNaked>
        </Box>
      ) : null}

      {status !== 'PUBLISHED' ? (
        <Box sx={{ gridColumn: status === 'APPROVED' ? 'span 1' : 'span 2', textAlign: 'end' }}>
          <ButtonNaked
            disabled
            size="small"
            onClick={handleOpenInitiativeOverviewDeleteModal}
            startIcon={<DeleteOutlineIcon color="disabled" />}
            sx={{ padding: 0, color: 'error.main', fontWeight: 700 }}
            weight="default"
            variant="naked"
            data-testid="view-action-button-test"
          >
            {t('pages.initiativeList.actions.delete')}
          </ButtonNaked>
          <DeleteInitiativeModal
            openInitiativeDeleteModal={openInitiativeOverviewDeleteModal}
            handleCloseInitiativeDeleteModal={handleCloseInitiativeOverviewDeleteModal}
          />
        </Box>
      ) : (
        <Box sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
          <ButtonNaked
            disabled
            size="small"
            onClick={null} // TODO IN NEXT SPRINT
            startIcon={<HighlightOffIcon color="disabled" />}
            sx={{ padding: 0, color: 'error.main', fontWeight: 700 }}
            weight="default"
            variant="naked"
            data-testid="view-action-button-test"
          >
            {t('pages.initiativeList.actions.suspend')}
          </ButtonNaked>
        </Box>
      )}
    </Box>
  );

  const renderTypeSnackBarStatus = (status: string) => {
    if (user.org_role === 'ope_base') {
      return (
        <StatusSnackBar
          openSnackBar={openSnackbar}
          setOpenSnackBar={setOpenSnackBar}
          fileStatus={status}
          initiative={initiativeSel}
        />
      );
    } else {
      switch (status) {
        case 'OK':
          return (
            <StatusSnackBar
              openSnackBar={openSnackbar}
              setOpenSnackBar={setOpenSnackBar}
              fileStatus={status}
              initiative={initiativeSel}
            />
          );
        case 'VALIDATE':
        case 'PROCESSING':
        case 'TO_SCHEDULE':
        case 'KO':
        case 'PROC_KO':
        default:
          return null;
      }
    }
  };

  return (
    <Box sx={{ width: '100%', px: 2 }}>
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
        <Box sx={{ gridColumn: 'span 10' }}>
          <TitleBox
            title={
              typeof initiativeSel.initiativeName === 'string' ? initiativeSel.initiativeName : ''
            }
            mbTitle={3}
            mtTitle={3}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
        {renderConditionalActions(initiativeSel.status)}
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
          <Box sx={{ gridColumn: 'span 3' }}>{t('pages.initiativeOverview.info.creationData')}</Box>
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
          <Box sx={{ gridColumn: 'span 5' }}>{renderInitiativeStatus(initiativeSel.status)}</Box>
          <Box sx={{ gridColumn: 'span 8' }}>
            {renderConditionalInfoStatus(initiativeSel.status)}
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
            gridTemplateColumns:
              initiativeSel.status === 'PUBLISHED' ? 'repeat(24, 1fr)' : 'repeat(10, 1fr)',
            alignContent: 'start',
            rowGap: 3,
            opacity: initiativeSel.status === 'PUBLISHED' ? 0.3 : 1,
          }}
        >
          <Box
            sx={{
              pt: 3,
              gridColumn: initiativeSel.status === 'PUBLISHED' ? 'span 24' : 'span 10',
            }}
          >
            {initiativeSel.status === 'PUBLISHED' ? (
              <Typography variant="h6">{t('pages.initiativeOverview.next.stats')}</Typography>
            ) : (
              <Typography variant="h6">{t('pages.initiativeOverview.next.title')}</Typography>
            )}
          </Box>
          {initiativeSel.status === 'DRAFT' ||
          initiativeSel.status === 'IN_REVISION' ||
          initiativeSel.status === 'TO_CHECK' ||
          initiativeSel.status === 'APPROVED'
            ? renderNextStatus(initiativeSel.status)
            : renderConditionalStatusPublished(initiativeSel.status)}
        </Paper>
      </Box>
    </Box>
  );
};

export default InitiativeOverview;
